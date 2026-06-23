import { NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { exec } from "child_process";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");
const OPENCODE_BIN = "/home/dev/.opencode/bin/opencode";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Search for pipeline across all project directories
  const projects = await readdir(PIPELINES_DIR).catch(() => [] as string[]);
  let dir = "";
  for (const project of projects) {
    if (project.startsWith(".")) continue;
    const candidate = join(PIPELINES_DIR, project, id);
    try {
      await readFile(join(candidate, "META.json"), "utf-8");
      dir = candidate;
      break;
    } catch { /* not this project */ }
  }
  if (!dir) {
    return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
  }

  // Queue management: move pending → running
  const queueDir = join(MEMORY_DIR, "queue");
  if (await readFile(join(queueDir, "pending", id), "utf-8").then(() => true).catch(() => false)) {
    await writeFile(join(queueDir, "running", id), "").catch(() => {});
    await writeFile(join(queueDir, "pending", id), "").catch(() => {});
  }

  try {
    // Verify pipeline exists
    const metaRaw = await readFile(join(dir, "META.json"), "utf-8").catch(() => null);
    if (!metaRaw) {
      return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
    }

    const meta = JSON.parse(metaRaw);

    // Check if already running or completed
    if (meta.status === "executing") {
      return NextResponse.json({ error: "Pipeline is already executing" }, { status: 409 });
    }
    if (meta.status === "completed") {
      return NextResponse.json({ error: "Pipeline is already completed" }, { status: 409 });
    }

    // Update pipeline.json to mark as executing
    const pipelineJson = {
      status: "executing",
      currentTask: "Starting pipeline execution...",
      progress: "0/...",
      startedAt: new Date().toISOString(),
    };
    await writeFile(join(dir, "pipeline.json"), JSON.stringify(pipelineJson, null, 2));

    // Update META.json status
    meta.status = "executing";
    // Also mark the first pending/executor phase as executing
    if (Array.isArray(meta.phases)) {
      for (const phase of meta.phases) {
        if (phase.status === "submitted" || phase.status === "pending" || phase.status === "paused") {
          phase.status = "executing";
          break; // only mark the first eligible phase
        }
      }
    }
    await writeFile(join(dir, "META.json"), JSON.stringify(meta, null, 2));

    // Spawn opencode run in background to execute the pipeline
    const prompt = `You have been assigned pipeline ${id}. Read memory/pipelines/${id}/META.json, PLAN.md, and TASKS.md. Execute ALL tasks in order. Update TASKS.md task markers ([ ] → [~] → [x]) as you complete each one. Update memory/pipelines/${id}/pipeline.json with your progress (status, currentTask, progress e.g. "3/8"). When ALL tasks are done, write memory/pipelines/${id}/WALKTHROUGH.md with a full summary of what was built, files modified, commands run, and verification steps. Then update memory/pipelines/${id}/META.json status to "completed" with the completed_at timestamp.`;

    exec(
      `export PATH="$HOME/.local/bin:$HOME/.opencode/bin:$PATH" && cd $HOME/AI_Workflow && ${OPENCODE_BIN} run ${JSON.stringify(prompt)}`,
      {
        env: { ...process.env, HOME: "/home/dev", PATH: "/home/dev/.local/bin:/home/dev/.opencode/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" },
        timeout: 30 * 60 * 1000, // 30 minute max
        maxBuffer: 10 * 1024 * 1024, // 10MB output
      },
      (error, stdout, stderr) => {
        // Log completion/errors asynchronously
        if (error) {
          readFile(join(dir, "pipeline.json"), "utf-8").then((raw) => {
            const pj = JSON.parse(raw);
            pj.status = "failed";
            pj.error = error.message?.substring(0, 500);
            writeFile(join(dir, "pipeline.json"), JSON.stringify(pj, null, 2)).catch(() => {});
          }).catch(() => {});
        }
      }
    );

    return NextResponse.json({
      ok: true,
      pipeline: id,
      status: "executing",
      message: `Pipeline ${id} execution launched`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
