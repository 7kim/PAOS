import { NextResponse } from "next/server";
import { readdir, rm, writeFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");
const QUEUE_DIR = join(MEMORY_DIR, "queue");

/**
 * POST /api/settings/reset
 *
 * Resets all pipeline data: clears pipeline directories, queue, and task files.
 * Settings, docs, knowledge, and agent configs are preserved.
 */
export async function POST() {
  try {
    let cleared = 0;

    // Clear pipeline directories
    const projects = await readdir(PIPELINES_DIR).catch(() => []);
    for (const project of projects) {
      if (project.startsWith(".")) continue;
      const projectDir = join(PIPELINES_DIR, project);
      const pipelines = await readdir(projectDir).catch(() => []);
      for (const pipe of pipelines) {
        if (pipe.startsWith("PIPE-") || pipe.startsWith("TEST-PIPE-")) {
          await rm(join(projectDir, pipe), { recursive: true, force: true });
          cleared++;
        }
      }
    }

    // Clear queue
    try {
      await writeFile(join(QUEUE_DIR, "queue.json"), JSON.stringify({
        pending: [],
        running: null,
        done: [],
      }));
    } catch { /* queue dir may not exist */ }

    return NextResponse.json({
      ok: true,
      message: `Cleared ${cleared} pipelines. Queue reset.`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
