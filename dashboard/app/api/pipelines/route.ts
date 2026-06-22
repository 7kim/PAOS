import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function GET() {
  try {
    const dirs = await readdir(PIPELINES_DIR).catch(() => []);
    const pipelineDirs = dirs.filter((d) => d.startsWith("PIPE-") || d.startsWith("AI_Workflow-PIPE"));

    const pipelines = await Promise.all(
      pipelineDirs.map(async (dir) => {
        const metaPath = join(PIPELINES_DIR, dir, "META.json");
        const planPath = join(PIPELINES_DIR, dir, "PLAN.md");
        const tasksPath = join(PIPELINES_DIR, dir, "TASKS.md");
        const walkthroughPath = join(PIPELINES_DIR, dir, "WALKTHROUGH.md");

        let meta: Record<string, unknown> = {};
        try {
          meta = JSON.parse(await readFile(metaPath, "utf-8"));
        } catch { /* no meta */ }

        let plan = "";
        try {
          plan = await readFile(planPath, "utf-8");
        } catch { /* no plan */ }

        let tasks = "";
        try {
          tasks = await readFile(tasksPath, "utf-8");
        } catch { /* no tasks */ }

        let walkthrough = "";
        try {
          walkthrough = await readFile(walkthroughPath, "utf-8");
        } catch { /* no walkthrough */ }

        // Count completed tasks from TASKS.md
        let completedTasks = tasks ? (tasks.match(/\[x\]/gi) || []).length : 0;
        let totalTasks = tasks ? (tasks.match(/\[ \]/g) || []).length + completedTasks : 0;

        // Override with pipeline.json live progress if available
        const pipelineJsonPath = join(PIPELINES_DIR, dir, "pipeline.json");
        try {
          const pjRaw = await readFile(pipelineJsonPath, "utf-8");
          const pj = JSON.parse(pjRaw) as Record<string, unknown>;
          const progress = pj.progress as string | undefined;
          if (progress && progress !== "0/...") {
            const parts = progress.split("/");
            const liveCompleted = parseInt(parts[0], 10) || 0;
            const liveTotal = parseInt(parts[1], 10) || 0;
            if (liveTotal > 0) {
              completedTasks = liveCompleted;
              totalTasks = liveTotal;
            }
          }
        } catch { /* no pipeline.json */ }

        return {
          id: dir,
          status: meta.status ?? "unknown",
          queue: (await stat(join(PIPELINES_DIR.replace("pipelines", "queue"), "running", dir)).then(() => "running").catch(() =>
            stat(join(PIPELINES_DIR.replace("pipelines", "queue"), "pending", dir)).then(() => "pending").catch(() =>
              stat(join(PIPELINES_DIR.replace("pipelines", "queue"), "done", dir)).then(() => "done").catch(() => "none")
            )
          )),
          phases: Array.isArray(meta.phases) ? meta.phases.map((p: Record<string, unknown>) => ({
            agent: p.agent, role: p.role, label: p.label, status: p.status,
          })) : [],
          planner: String(meta.planner ?? meta.phases?.[0]?.agent ?? "—"),
          executor: String(meta.executor ?? meta.phases?.[meta.phases.length - 1]?.agent ?? "—"),
          prompt: String(meta.prompt ?? ""),
          created_at: String(meta.submitted_at ?? meta.created_at ?? ""),
          completed_at: String(meta.completed_at ?? ""),
          completedTasks,
          totalTasks,
          hasWalkthrough: !!walkthrough,
        };
      })
    );

    // Sort by created_at desc
    pipelines.sort((a, b) => {
      const da = new Date(a.created_at).getTime() || 0;
      const db = new Date(b.created_at).getTime() || 0;
      return db - da;
    });

    return NextResponse.json({ pipelines });
  } catch (e) {
    return NextResponse.json({ pipelines: [], error: String(e) });
  }
}

function extractPhases(tasksMd: string): { name: string; completed: number; total: number }[] {
  if (!tasksMd) return [];
  const lines = tasksMd.split("\n");
  const phases: { name: string; completed: number; total: number }[] = [];
  let currentPhase: string | null = null;

  for (const line of lines) {
    // Match ## Phase headers
    const phaseMatch = line.match(/^##\s+(Phase\s+\d|Phase\s+\d+.*)/i);
    if (phaseMatch) {
      currentPhase = phaseMatch[1].trim();
      phases.push({ name: currentPhase, completed: 0, total: 0 });
      continue;
    }
    // Count tasks under current phase
    if (currentPhase !== null && phases.length > 0) {
      const taskMatch = line.match(/\[([ x])\]/i);
      if (taskMatch) {
        const idx = phases.length - 1;
        phases[idx].total++;
        if (taskMatch[1].toLowerCase() === "x") {
          phases[idx].completed++;
        }
      }
    }
  }

  return phases;
}
