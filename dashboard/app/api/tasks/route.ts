import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";

interface Task {
  id: string;
  title: string;
  status: string;
  agent: string;
  project: string;
  raw: string;
}

function parseTaskCard(raw: string, filename: string): Task {
  const lines = raw.split("\n");
  const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim() ?? filename;
  const statusLine = lines.find((l) => l.toLowerCase().startsWith("status:"));
  const agentLine = lines.find((l) => l.toLowerCase().startsWith("agent:"));
  const projectLine = lines.find((l) => l.toLowerCase().startsWith("project:"));

  return {
    id: filename.replace(".md", ""),
    title,
    status: statusLine?.split(":")[1]?.trim() ?? "unknown",
    agent: agentLine?.split(":")[1]?.trim() ?? "",
    project: projectLine?.split(":")[1]?.trim() ?? "",
    raw,
  };
}

export async function GET() {
  try {
    const tasksDir = join(MEMORY_DIR, "tasks");
    const files = await readdir(tasksDir).catch(() => []);
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    const tasks: Task[] = await Promise.all(
      mdFiles.map(async (f) => {
        const raw = await readFile(join(tasksDir, f), "utf-8");
        return parseTaskCard(raw, f);
      })
    );

    return NextResponse.json({ tasks: tasks.reverse() });
  } catch {
    return NextResponse.json({ tasks: [] });
  }
}
