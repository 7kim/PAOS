import { NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { exec } from "child_process";
import { join, basename } from "path";

import { MEMORY_DIR, PIPELINES_DIR } from "@/lib/global-config";
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

  // Queue management: ensure pipeline is in running queue
  try {
    const queueRes = await fetch(`http://localhost:3333/api/queue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "enqueue", id, project: basename(join(dir, "..")) }),
    });
    const queueData = await queueRes.json();
    const q = queueData.queue;
    // If not currently running, dequeue it
    if (!q?.running || q.running.id !== id) {
      await fetch(`http://localhost:3333/api/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dequeue" }),
      }).catch(() => {});
    }
  } catch { /* queue not available */ }

  try {
    // Verify pipeline exists
    const metaRaw = await readFile(join(dir, "META.json"), "utf-8").catch(() => null);
    if (!metaRaw) {
      return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
    }

    const meta = JSON.parse(metaRaw) as Record<string, unknown>;

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

    const body = await _req.json().catch(() => ({}));
    const customPrompt = body?.prompt || "";

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
    const pipePath = dir;
    const prompt = customPrompt || `You have been assigned pipeline ${id}. Read ${pipePath}/META.json, PLAN.md, and TASKS.md. Execute ALL tasks in order. Update TASKS.md task markers ([ ] → [~] → [x]) as you complete each one. Update ${pipePath}/pipeline.json with your progress (status, currentTask, progress e.g. "3/8"). When ALL tasks are done, write ${pipePath}/WALKTHROUGH.md with a full summary of what was built, files modified, commands run, and verification steps. Then update ${pipePath}/META.json status to "completed" with the completed_at timestamp.`;

    exec(
      `export PATH="$HOME/.local/bin:$HOME/.opencode/bin:$PATH" && cd $HOME/AI_Workflow && echo ${JSON.stringify(prompt)} | ${OPENCODE_BIN} run`,
      {
        env: { ...process.env, HOME: "/home/dev", PATH: "/home/dev/.local/bin:/home/dev/.opencode/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" },
        timeout: 30 * 60 * 1000, // 30 minute max
        maxBuffer: 10 * 1024 * 1024, // 10MB output
      },
      (error, stdout, stderr) => {
        // Move to done queue via API on completion
        if (!error) {
          fetch(`http://localhost:3333/api/queue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "done", status: "completed" }),
          }).catch(() => {});
        } else {
          fetch(`http://localhost:3333/api/queue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "done", status: "failed" }),
          }).catch(() => {});
          readFile(join(dir, "pipeline.json"), "utf-8").then((raw) => {
            const pj = JSON.parse(raw) as Record<string, unknown>;
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
