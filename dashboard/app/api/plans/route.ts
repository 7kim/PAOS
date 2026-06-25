import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

import { MEMORY_DIR, PROJECTS_DIR, PIPELINES_DIR, LOGS_DIR, PM_LOGS_DIR } from "@/lib/global-config";

interface PlanData {
  id: string;
  title: string;
  preview: string;
  plan: string;
  tasks: string;
  walkthrough: string;
  hasWalkthrough: boolean;
  source: string;
  path: string;
  project?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filterProject = searchParams.get("project") || "";

  const plans: PlanData[] = [];

  // ── Source 1: memory/pipelines/ (project-scoped) ──────────────────────
  try {
    const projects = await readdir(PIPELINES_DIR).catch(() => []);
    for (const project of projects) {
      if (project.startsWith(".")) continue;

      // Apply project filter if specified
      if (filterProject && project !== filterProject) continue;

      // Determine base dir: prefer projects/{project}/pipelines/, fall back to memory/pipelines/{project}/
      let baseDir = join(PROJECTS_DIR, project, "pipelines");
      let baseExists = await stat(baseDir).then(() => true).catch(() => false);
      if (!baseExists) {
        baseDir = join(PIPELINES_DIR, project);
        baseExists = await stat(baseDir).then(() => true).catch(() => false);
      }
      if (!baseExists) continue;

      const dirs = await readdir(baseDir).catch(() => []);
      const pipelineDirs = dirs.filter((d) => d.startsWith("PIPE-") || d.startsWith("AI_Workflow-PIPE") || d.startsWith("TEST-PIPE"));

      for (const dir of pipelineDirs) {
        const pipelineDir = join(baseDir, dir);

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

        // Read TASKS.md — prefer enhanced version if exists
        let tasks = "";
        const tasksFiles = ["TASKS-hermes-nous.md", "TASKS.md"];
        for (const tf of tasksFiles) {
          try {
            tasks = await readFile(join(pipelineDir, tf), "utf-8");
            if (tasks) break;
          } catch { /* try next */ }
        }

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
            project,
            path: `memory/pipelines/${project}/${dir}`,
          });
        }
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

      let tasksRaw = "";
      try {
        tasksRaw = await readFile(join(PM_LOGS_DIR, `${taskId}-TASKS.md`), "utf-8");
      } catch { /* no tasks file */ }

      let walkthroughRaw = "";
      try {
        walkthroughRaw = await readFile(join(PM_LOGS_DIR, `${taskId}-WALKTHROUGH.md`), "utf-8");
      } catch { /* no walkthrough yet */ }

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
          path: `memory/pm-logs/${f}`,
        });
      }
    }
  } catch { /* no pm-logs dir */ }

  plans.sort((a, b) => {
    if (a.source !== b.source) return a.source === "pipeline" ? -1 : 1;
    return 0;
  });

  return NextResponse.json({ plans });
}
