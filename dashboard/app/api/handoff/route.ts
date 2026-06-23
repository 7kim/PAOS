import { NextResponse } from "next/server";
import { readFile, writeFile, stat } from "fs/promises";
import { join } from "path";

const HOME = process.env.HOME || "/home/dev";
const PROJECTS_DIR = join(HOME, "AI_Workflow", "projects");
const PIPELINES_DIR = join(HOME, "AI_Workflow", "memory", "pipelines");
const MEMORY_DIR = join(HOME, "AI_Workflow", "memory");

function projectHandoffPath(project: string): string {
  // Try projects/{name}/handoff.md first, fall back to memory/pipelines/{name}/handoff.md
  const projectsPath = join(PROJECTS_DIR, project, "handoff.md");
  // We can't use async here in a sync function, so we return projects path
  // and the caller will handle fallback via try/catch
  return projectsPath;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project") || "";

  if (!project) {
    // Global handoff
    try {
      const content = await readFile(join(MEMORY_DIR, "shared", "HANDOFF.md"), "utf-8");
      return NextResponse.json({ content, updatedAt: new Date().toISOString(), project: "global" });
    } catch {
      return NextResponse.json({ content: "HANDOFF.md not found.", updatedAt: null, project: "global" });
    }
  }

  // Try projects/ first
  const projectsPath = join(PROJECTS_DIR, project, "handoff.md");
  try {
    await stat(projectsPath);
    const content = await readFile(projectsPath, "utf-8");
    return NextResponse.json({ content, updatedAt: new Date().toISOString(), project });
  } catch {
    // Fall back to memory/pipelines/
    try {
      const content = await readFile(join(PIPELINES_DIR, project, "handoff.md"), "utf-8");
      return NextResponse.json({ content, updatedAt: new Date().toISOString(), project });
    } catch {
      return NextResponse.json({ content: `No handoff for project "${project}".`, updatedAt: null, project });
    }
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project") || "";

  const handoffPath = project
    ? join(PROJECTS_DIR, project, "handoff.md")
    : join(MEMORY_DIR, "shared", "HANDOFF.md");

  try {
    const body = await req.json();
    const content = body?.content ?? "";
    await writeFile(handoffPath, content, "utf-8");
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString(), project: project || "global" });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
