import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

async function scanPipelines(baseDir: string, projectName: string) {
  const dirs = await readdir(baseDir).catch(() => []);
  const pipelineDirs = dirs.filter((d) => d.startsWith("PIPE-") || d.startsWith("AI_Workflow-PIPE"));

  return Promise.all(
    pipelineDirs.map(async (dir) => {
      const pipelineDir = join(baseDir, dir);
      const metaPath = join(pipelineDir, "META.json");
      const planPath = join(pipelineDir, "PLAN.md");
      const tasksPath = join(pipelineDir, "TASKS.md");
      const walkthroughPath = join(pipelineDir, "WALKTHROUGH.md");

      let meta: Record<string, unknown> = {};
      try {
        meta = JSON.parse(await readFile(metaPath, "utf-8"));
      } catch { /* no meta */ }

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
      const pipelineJsonPath = join(pipelineDir, "pipeline.json");
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
        project: projectName,
        status: meta.status ?? "unknown",
        queue: (await stat(join(PIPELINES_DIR.replace("pipelines", "queue"), "running", dir)).then(() => "running").catch(() =>
          stat(join(PIPELINES_DIR.replace("pipelines", "queue"), "pending", dir)).then(() => "pending").catch(() =>
            stat(join(PIPELINES_DIR.replace("pipelines", "queue"), "done", dir)).then(() => "done").catch(() => "none")
          )
        )),
        phases: Array.isArray(meta.phases) ? meta.phases.map((p: Record<string, unknown>) => ({
          name: String(p.label || p.role || "Phase"),
          completed: p.status === "completed" ? 1 : 0,
          total: 1,
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
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filterProject = searchParams.get("project") || "";

  try {
    const projects = await readdir(PIPELINES_DIR).catch(() => []);
    const allPipelines: Awaited<ReturnType<typeof scanPipelines>> = [];

    for (const entry of projects) {
      if (entry.startsWith(".")) continue;

      // Apply project filter
      if (filterProject && entry !== filterProject) continue;

      const entryPath = join(PIPELINES_DIR, entry);
      const entryStat = await stat(entryPath).catch(() => null);
      if (!entryStat?.isDirectory()) continue;

      // If entry looks like a pipeline (starts with PIPE-), treat as flat root-level pipeline
      if (entry.startsWith("PIPE-") || entry.startsWith("AI_Workflow-PIPE")) {
        const pipelines = await scanPipelines(PIPELINES_DIR, "_root");
        allPipelines.push(...pipelines);
        break; // already scanned all
      }

      // Otherwise it's a project folder — scan inside
      const pipelines = await scanPipelines(entryPath, entry);
      allPipelines.push(...pipelines);
    }

    // Sort by created_at desc
    allPipelines.sort((a, b) => {
      const da = new Date(a.created_at).getTime() || 0;
      const db = new Date(b.created_at).getTime() || 0;
      return db - da;
    });

    return NextResponse.json({ pipelines: allPipelines });
  } catch (e) {
    return NextResponse.json({ pipelines: [], error: String(e) });
  }
}
