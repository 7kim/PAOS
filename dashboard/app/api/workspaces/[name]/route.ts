import { NextResponse } from "next/server";
import { rm, stat, readFile } from "fs/promises";
import { join } from "path";

const WORKSPACES_DIR = join(process.env.HOME || "/home/dev", "AI_Workflow", "workspaces");
const PROJECTS_DIR = join(process.env.HOME || "/home/dev", "AI_Workflow", "projects");
const PIPELINES_DIR = join(process.env.HOME || "/home/dev", "AI_Workflow", "memory", "pipelines");

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!name || name.startsWith(".")) {
    return NextResponse.json({ error: "Invalid workspace name" }, { status: 400 });
  }

  const filePath = join(WORKSPACES_DIR, `${name}.code-workspace`);
  const fileExists = await stat(filePath).then(() => true).catch(() => false);
  if (!fileExists) {
    return NextResponse.json({ error: `Workspace "${name}" not found` }, { status: 404 });
  }

  // Delete workspace file
  await rm(filePath, { force: true });

  // Delete associated pipelines directory
  const pipelinesDir = join(PIPELINES_DIR, name);
  await rm(pipelinesDir, { recursive: true, force: true }).catch(() => {});

  // Delete associated projects directory
  const projectsDir = join(PROJECTS_DIR, name);
  await rm(projectsDir, { recursive: true, force: true }).catch(() => {});

  return NextResponse.json({ ok: true, deleted: name });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const filePath = join(WORKSPACES_DIR, `${name}.code-workspace`);
  try {
    const raw = await readFile(filePath, "utf-8");
    const workspace = JSON.parse(raw);
    return NextResponse.json({ workspace });
  } catch {
    return NextResponse.json({ error: `Workspace "${name}" not found` }, { status: 404 });
  }
}
