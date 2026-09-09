import { NextResponse } from "next/server";
import { readdir, readFile, stat, unlink, appendFile, writeFile } from "fs/promises";
import { join } from "path";

import { PROJECTS_DIR, MEMORY_DIR } from "@/lib/global-config";

export interface Task {
  id: string;
  title: string;
  status: string;
  agent: string;
  project: string;
  author: string;
  executor: string;
  priority: string;
  due: string;
  created: string;
  progress: string;
  raw: string;
}

const VALID_STATUSES = ["draft", "approved", "in_progress", "done", "failed", "pending", "in_progress", "ready_for_execution", "planning", "needs_planning"];

function parseTaskCard(raw: string, filename: string, project?: string, birthtime?: string): Task {
  const lines = raw.split("\n");
  const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim() ?? filename;
  const statusLine = lines.find((l) => l.toLowerCase().startsWith("status:"));
  const agentLine = lines.find((l) => l.toLowerCase().startsWith("agent:"));
  const authorLine = lines.find((l) => l.toLowerCase().startsWith("author:"));
  const executorLine = lines.find((l) => l.toLowerCase().startsWith("executor:"));
  const priorityLine = lines.find((l) => l.toLowerCase().startsWith("priority:"));
  const dueLine = lines.find((l) => l.toLowerCase().startsWith("due:"));
  const createdLine = lines.find((l) => l.toLowerCase().startsWith("created:"));
  
  // Helper: get full value after "Key: " (handles ISO timestamps with colons)
  const getVal = (line: string | undefined) => {
    if (!line) return "";
    const idx = line.indexOf(":");
    return line.substring(idx + 1).trim();
  };
  const progressLine = lines.find((l) => l.toLowerCase().startsWith("progress:"));

  return {
    id: filename.replace(".md", ""),
    title,
    status: statusLine?.split(":")[1]?.trim() ?? "draft",
    agent: agentLine?.split(":")[1]?.trim() ?? "",
    project: project || "",
    author: authorLine?.split(":")[1]?.trim() ?? "hermes-nous",
    executor: executorLine?.split(":")[1]?.trim() ?? "",
    priority: priorityLine?.split(":")[1]?.trim() ?? "normal",
    due: getVal(dueLine),
    created: getVal(createdLine) || birthtime || "",
    progress: progressLine?.split(":")[1]?.trim() ?? "",
    raw,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filterProject = searchParams.get("project") || "";
  const sortBy = searchParams.get("sort") || "";

  try {
    let tasksDir: string;
    if (filterProject && filterProject !== "__none__") {
      tasksDir = join(PROJECTS_DIR, filterProject, "tasks");
      const dirExists = await stat(tasksDir).then(() => true).catch(() => false);
      if (!dirExists) return NextResponse.json({ tasks: [] });
    } else {
      const globalTasks = await readFromDir(join(MEMORY_DIR, "tasks"), "");
      const projectTasks: Task[] = [];
      const projects = await readdir(PROJECTS_DIR).catch(() => []);
      for (const project of projects) {
        if (project.startsWith(".")) continue;
        const projTasks = await readFromDir(join(PROJECTS_DIR, project, "tasks"), project);
        projectTasks.push(...projTasks);
      }
      const allTasks = [...globalTasks, ...projectTasks].reverse();
      if (sortBy) return NextResponse.json({ tasks: sortTasks(allTasks, sortBy) });
      return NextResponse.json({ tasks: allTasks });
    }

    const tasks = await readFromDir(tasksDir, filterProject);
    if (sortBy) return NextResponse.json({ tasks: sortTasks(tasks, sortBy) });
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ tasks: [] });
  }
}

function sortTasks(tasks: Task[], sortBy: string): Task {
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };
  
  const sorted = [...tasks];
  switch (sortBy) {
    case "priority":
      sorted.sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));
      break;
    case "due":
      sorted.sort((a, b) => {
        const aTime = a.due ? new Date(a.due).getTime() : Infinity;
        const bTime = b.due ? new Date(b.due).getTime() : Infinity;
        return aTime - bTime;
      });
      break;
    case "created":
      sorted.sort((a, b) => {
        const aTime = a.created ? new Date(a.created).getTime() : 0;
        const bTime = b.created ? new Date(b.created).getTime() : 0;
        return bTime - aTime;
      });
      break;
  }
  return sorted;
}

async function readFromDir(dir: string, project: string): Promise<Task[]> {
  try {
    const files = await readdir(dir).catch(() => []);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    return Promise.all(
      mdFiles.map(async (f) => {
        const raw = await readFile(join(dir, f), "utf-8");
        let birthtime = "";
        try {
          const st = await stat(join(dir, f));
          birthtime = st.birthtime.toISOString();
        } catch { /* ignore */ }
        return parseTaskCard(raw, f, project, birthtime);
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

// PATCH /api/tasks — update task status, progress, due, created
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id") || "";
    let project = searchParams.get("project") || "";
    let newStatus = searchParams.get("status") || "";
    let newProgress = searchParams.get("progress") || "";
    let newDue = searchParams.get("due") || "";
    let newCreated = searchParams.get("created") || "";

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id || "";
      project = body.project || "";
      newStatus = body.status || "";
      newProgress = body.progress || "";
      newDue = body.due || "";
      newCreated = body.created || "";
    }

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!newStatus && !newProgress && !newDue && !newCreated) return NextResponse.json({ error: "at least one field required" }, { status: 400 });
    if (id.includes("..") || id.includes("/")) id = id.split("/").pop() || id;
    if (!id.endsWith(".md")) id += ".md";

    if (newStatus) {
      const validTransitions = ["draft", "approved", "in_progress", "done", "failed", "pending", "ready_for_execution", "planning", "needs_planning"];
      if (!validTransitions.includes(newStatus)) {
        return NextResponse.json({ error: `invalid status: ${newStatus}` }, { status: 400 });
      }
    }

    const candidates = [
      join(MEMORY_DIR, "tasks", id),
      join(PROJECTS_DIR, project || "__none__", "tasks", id),
    ];

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

    let content = await readFile(target, "utf-8");
    const lines = content.split("\n");

    if (newStatus) {
      const statusIdx = lines.findIndex((l) => l.toLowerCase().startsWith("status:"));
      if (statusIdx >= 0) {
        lines[statusIdx] = `Status: ${newStatus}`;
      } else {
        const titleIdx = lines.findIndex((l) => l.startsWith("# "));
        lines.splice(titleIdx + 1, 0, `Status: ${newStatus}`);
      }
      if (newStatus === "approved") {
        const ts = new Date().toISOString();
        lines.push(`\n<!-- approved: ${ts} -->`);
      }
    }

    if (newProgress) {
      const progressIdx = lines.findIndex((l) => l.toLowerCase().startsWith("progress:"));
      if (progressIdx >= 0) {
        lines[progressIdx] = `Progress: ${newProgress}`;
      } else {
        lines.push(`Progress: ${newProgress}`);
      }
    }

    if (newDue) {
      const dueIdx = lines.findIndex((l) => l.toLowerCase().startsWith("due:"));
      if (dueIdx >= 0) {
        lines[dueIdx] = `Due: ${newDue}`;
      } else {
        lines.push(`Due: ${newDue}`);
      }
    }

    if (newCreated) {
      const createdIdx = lines.findIndex((l) => l.toLowerCase().startsWith("created:"));
      if (createdIdx >= 0) {
        lines[createdIdx] = `Created: ${newCreated}`;
      } else {
        lines.push(`Created: ${newCreated}`);
      }
    }

    await writeFile(target, lines.join("\n"), "utf-8");

    try {
      const ts = new Date().toISOString();
      const action = newStatus ? `Status → ${newStatus}` : "";
      const progress = newProgress ? `Progress: ${newProgress}` : "";
      const due = newDue ? `Due: ${newDue}` : "";
      await appendFile(join(MEMORY_DIR, "global_ledger.md"), `\n| ${ts} | dashboard | STATUS | ${target.replace(process.env.HOME || "/home/dev", "~")} | ${action} ${progress} ${due} | - | - |\n`, "utf-8");
    } catch { /* ignore */ }

    return NextResponse.json({ ok: true, id: id.replace(".md", ""), status: newStatus, progress: newProgress, due: newDue, created: newCreated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
