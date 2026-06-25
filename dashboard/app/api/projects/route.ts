import { NextResponse } from "next/server";
import { mkdir, readdir, rm, stat, readFile, writeFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function GET() {
  try {
    const entries = await readdir(PIPELINES_DIR).catch(() => []);
    const projects: { name: string; pipelineCount: number; created_at: string }[] = [];

    for (const entry of entries) {
      if (entry.startsWith(".") || entry === ".gitkeep") continue;
      const entryPath = join(PIPELINES_DIR, entry);
      const entryStat = await stat(entryPath).catch(() => null);
      if (!entryStat?.isDirectory()) continue;
      if (entry.startsWith("PIPE-") || entry.startsWith("AI_Workflow-PIPE") || entry.startsWith("TEST-PIPE")) continue; // skip loose pipelines

      // It's a project directory — count pipelines inside
      const pipelineDirs = await readdir(entryPath).catch(() => []);
      const pipelineCount = pipelineDirs.filter(
        (d) => d.startsWith("PIPE-") || d.startsWith("AI_Workflow-PIPE") || d.startsWith("TEST-PIPE")
      ).length;

      // Try to read project meta
      let createdAt = "";
      try {
        const meta = JSON.parse(await readFile(join(entryPath, ".project-meta.json"), "utf-8"));
        createdAt = String(meta.created_at ?? "");
      } catch { /* no meta */ }

      projects.push({ name: entry, pipelineCount, created_at: createdAt });
    }

    projects.sort((a, b) => b.pipelineCount - a.pipelineCount);
    return NextResponse.json({ projects });
  } catch (e) {
    return NextResponse.json({ projects: [], error: String(e) });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string" || !/^[a-zA-Z0-9_-]+$/.test(name)) {
      return NextResponse.json({ error: "Invalid project name. Use letters, numbers, hyphens, underscores." }, { status: 400 });
    }

    const projectDir = join(PIPELINES_DIR, name);
    await mkdir(projectDir, { recursive: true });

    // Write project meta
    const meta = { name, created_at: new Date().toISOString() };
    await writeFile(join(projectDir, ".project-meta.json"), JSON.stringify(meta, null, 2));

    return NextResponse.json({ ok: true, name });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
