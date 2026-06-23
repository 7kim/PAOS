import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const HOME = process.env.HOME || "/home/dev";
const PIPELINES_DIR = join(HOME, "AI_Workflow", "memory", "pipelines");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project") || "";

  if (!project) {
    return NextResponse.json({ error: "project parameter is required" }, { status: 400 });
  }

  const eventsPath = join(PIPELINES_DIR, project, "events.md");
  try {
    const content = await readFile(eventsPath, "utf-8");
    return NextResponse.json({ project, content });
  } catch {
    // Auto-create if missing
    const defaultContent = [
      `# Events — ${project}`,
      ``,
      `| Timestamp | Agent | Action | Description |`,
      `|-----------|-------|--------|-------------|`,
      `| ${new Date().toISOString()} | system | INIT | Project "${project}" created |`,
      ``,
    ].join("\n");

    await mkdir(join(PIPELINES_DIR, project), { recursive: true }).catch(() => {});
    await writeFile(eventsPath, defaultContent, "utf-8");

    return NextResponse.json({ project, content: defaultContent, created: true });
  }
}

export async function POST(req: Request) {
  try {
    const { project, entry } = await req.json();
    if (!project || !entry) {
      return NextResponse.json({ error: "project and entry are required" }, { status: 400 });
    }

    const eventsPath = join(PIPELINES_DIR, project, "events.md");

    // Ensure file exists
    let content = "";
    try {
      content = await readFile(eventsPath, "utf-8");
    } catch {
      content = [
        `# Events — ${project}`,
        ``,
        `| Timestamp | Agent | Action | Description |`,
        `|-----------|-------|--------|-------------|`,
      ].join("\n") + "\n";
      await mkdir(join(PIPELINES_DIR, project), { recursive: true }).catch(() => {});
    }

    // Append entry
    const line = `| ${entry.timestamp || new Date().toISOString()} | ${entry.agent} | ${entry.action} | ${entry.description} |`;
    await writeFile(eventsPath, content.trimEnd() + "\n" + line + "\n", "utf-8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
