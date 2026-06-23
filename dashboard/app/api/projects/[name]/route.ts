import { NextResponse } from "next/server";
import { rm, readdir, readFile, writeFile, mkdir, stat } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!name || name.startsWith(".")) {
    return NextResponse.json({ error: "Invalid project name" }, { status: 400 });
  }
  const projectDir = join(PIPELINES_DIR, name);
  try {
    await stat(projectDir);
  } catch {
    return NextResponse.json({ error: `Project "${name}" not found` }, { status: 404 });
  }
  await rm(projectDir, { recursive: true, force: true });
  return NextResponse.json({ ok: true, deleted: name });
}
