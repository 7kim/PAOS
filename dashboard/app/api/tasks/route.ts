import { NextResponse } from "next/server";
import { readdir, readFile, stat, unlink, appendFile } from "fs/promises";
import { join } from "path";

import { PROJECTS_DIR, MEMORY_DIR } from "@/lib/global-config";

interface Task {
  id: string;
  title: string;
  status: string;
  agent: string;
  project: string;
  raw: string;
}

function parseTaskCard(raw: string, filename: string, project?: string): Task {
  const lines = raw.split("\n");
  const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim() ?? filename;
  const statusLine = lines.find((l) => l.toLowerCase().startsWith("status:"));
  const agentLine = lines.find((l) => l.toLowerCase().startsWith("agent:"));

  return {
    id: filename.replace(".md", ""),
    title,
    status: statusLine?.split(":")[1]?.trim() ?? "unknown",
    agent: agentLine?.split(":")[1]?.trim() ?? "",
    project: project || "",
    raw,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filterProject = searchParams.get("project") || "";

  try {
    let tasksDir: string;

    if (filterProject) {
      // Read from projects/{name}/tasks/
      tasksDir = join(PROJECTS_DIR, filterProject, "tasks");
      const dirExists = await stat(tasksDir).then(() => true).catch(() => false);
      if (!dirExists) {
        return NextResponse.json({ tasks: [] });
      }
    } else {
      // Read from global memory/tasks/ + all projects/{name}/tasks/
      const globalTasks = await readFromDir(join(MEMORY_DIR, "tasks"), "");
      const projectTasks: Task[] = [];
      const projects = await readdir(PROJECTS_DIR).catch(() => []);
      for (const project of projects) {
        if (project.startsWith(".")) continue;
        const projTasks = await readFromDir(join(PROJECTS_DIR, project, "tasks"), project);
        projectTasks.push(...projTasks);
      }
      return NextResponse.json({ tasks: [...globalTasks, ...projectTasks].reverse() });
    }

    return NextResponse.json({ tasks: await readFromDir(tasksDir, filterProject) });
  } catch {
    return NextResponse.json({ tasks: [] });
  }
}

async function readFromDir(dir: string, project: string): Promise<Task[]> {
  try {
    const files = await readdir(dir).catch(() => []);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    return Promise.all(
      mdFiles.map(async (f) => {
        const raw = await readFile(join(dir, f), "utf-8");
        return parseTaskCard(raw, f, project);
      })
    );
  } catch {
    return [];
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id") || "";
    let project = searchParams.get("project") || "";
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id || "";
      project = body.project || project;
    }
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (id.includes("..") || id.includes("/")) id = id.split("/").pop() || id;
    if (!id.endsWith(".md")) id += ".md";
    const candidates = [
      join(MEMORY_DIR, "tasks", id),
      join(PROJECTS_DIR, project || "__none__", "tasks", id),
    ];
    // if project not given, also scan all projects
    let target = "";
    for (const c of candidates) {
      try { await stat(c); target = c; break; } catch { /* miss */ }
    }
    if (!target && !project) {
      const projects = await readdir(PROJECTS_DIR).catch(() => [] as string[]);
      for (const proj of projects) {
        const p = join(PROJECTS_DIR, proj, "tasks", id);
        try { await stat(p); target = p; break; } catch { /* continue */ }
      }
    }
    if (!target) return NextResponse.json({ error: `task ${id} not found` }, { status: 404 });
    await unlink(target);
    try {
      const ts = new Date().toISOString();
      await appendFile(join(MEMORY_DIR, "global_ledger.md"), `\n| ${ts} | dashboard | DELETE | ${target.replace(process.env.HOME || "/home/dev", "~")} | Task deleted via dashboard | - | - |\n`, "utf-8");
    } catch { /* ignore */ }
    return NextResponse.json({ ok: true, id: id.replace(".md", "") });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
