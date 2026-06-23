import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

const HOME = process.env.HOME || "/home/dev";
const PROJECTS_DIR = join(HOME, "AI_Workflow", "projects");
const MEMORY_DIR = join(HOME, "AI_Workflow", "memory");

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
