import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function GET() {
  try {
    const dirs = await readdir(PIPELINES_DIR).catch(() => []);
    const pipelineDirs = dirs.filter((d) => d.startsWith("PIPE-"));

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
        const completedTasks = tasks ? (tasks.match(/\[x\]/gi) || []).length : 0;
        const totalTasks = tasks ? (tasks.match(/\[ \]/g) || []).length + completedTasks : 0;

        return {
          id: dir,
          status: meta.status ?? "unknown",
          planner: String(meta.planner ?? meta.planner_agent ?? "—"),
          executor: String(meta.executor ?? meta.executor_agent ?? "—"),
          prompt: String(meta.prompt ?? ""),
          created_at: String(meta.submitted_at ?? meta.created_at ?? ""),
          completed_at: String(meta.completed_at ?? ""),
          completedTasks,
          totalTasks,
          hasWalkthrough: !!walkthrough,
          phases: extractPhases(tasks),
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
