import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");
const PM_LOGS_DIR = join(MEMORY_DIR, "pm-logs");

export async function GET() {
  const plans: {
    id: string;
    title: string;
    preview: string;
    plan: string;
    tasks: string;
    walkthrough: string;
    hasWalkthrough: boolean;
    source: string;
  }[] = [];

  // ── Source 1: memory/pipelines/ (primary) ────────────────────────────────
  try {
    const dirs = await readdir(PIPELINES_DIR).catch(() => []);
    const pipelineDirs = dirs.filter((d) => d.startsWith("PIPE-") || d.startsWith("AI_Workflow-PIPE"));

    for (const dir of pipelineDirs) {
      const pipelineDir = join(PIPELINES_DIR, dir);

      // Read META for title and prompt
      let meta: Record<string, unknown> = {};
      try {
        meta = JSON.parse(await readFile(join(pipelineDir, "META.json"), "utf-8"));
      } catch { /* no meta */ }

      // Read PLAN.md
      let plan = "";
      try {
        plan = await readFile(join(pipelineDir, "PLAN.md"), "utf-8");
      } catch { /* no plan */ }

      // Read TASKS.md
      let tasks = "";
      try {
        tasks = await readFile(join(pipelineDir, "TASKS.md"), "utf-8");
      } catch { /* no tasks */ }

      // Read WALKTHROUGH.md
      let walkthrough = "";
      try {
        walkthrough = await readFile(join(pipelineDir, "WALKTHROUGH.md"), "utf-8");
      } catch { /* no walkthrough */ }

      if (plan || tasks) {
        const lines = plan.split("\n");
        const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim()
          || (meta.prompt as string)?.slice(0, 80)
          || dir;
        const preview = lines.slice(1, 8).join("\n").trim();

        plans.push({
          id: dir,
          title,
          preview,
          plan,
          tasks,
          walkthrough,
          hasWalkthrough: !!walkthrough,
          source: "pipeline",
        });
      }
    }
  } catch { /* no pipelines dir */ }

  // ── Source 2: memory/pm-logs/ (legacy) ────────────────────────────────────
  try {
    const files = await readdir(PM_LOGS_DIR).catch(() => []);
    const planFiles = files.filter((f) => f.endsWith("IMPLEMENTATION_PLAN.md"));

    for (const f of planFiles) {
      const raw = await readFile(join(PM_LOGS_DIR, f), "utf-8");
      const lines = raw.split("\n");
      const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim() ?? f;
      const taskId = f.replace("-IMPLEMENTATION_PLAN.md", "");
      const preview = lines.slice(1, 8).join("\n").trim();

      // Find matching TASKS.md
      let tasksRaw = "";
      try {
        tasksRaw = await readFile(join(PM_LOGS_DIR, `${taskId}-TASKS.md`), "utf-8");
      } catch { /* no tasks file */ }

      // Find matching WALKTHROUGH.md
      let walkthroughRaw = "";
      try {
        walkthroughRaw = await readFile(join(PM_LOGS_DIR, `${taskId}-WALKTHROUGH.md`), "utf-8");
      } catch { /* no walkthrough yet */ }

      // Avoid duplicates (if same ID already added from pipelines/)
      if (!plans.some((p) => p.id === taskId)) {
        plans.push({
          id: taskId,
          title,
          preview,
          plan: raw,
          tasks: tasksRaw,
          walkthrough: walkthroughRaw,
          hasWalkthrough: !!walkthroughRaw,
          source: "pm-logs",
        });
      }
    }
  } catch { /* no pm-logs dir */ }

  // Sort: pipeline sources first (newest), then legacy
  plans.sort((a, b) => {
    if (a.source !== b.source) return a.source === "pipeline" ? -1 : 1;
    return 0;
  });

  return NextResponse.json({ plans });
}
