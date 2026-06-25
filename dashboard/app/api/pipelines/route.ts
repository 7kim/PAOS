import { NextResponse } from "next/server";
import { readdir, readFile, stat, mkdir, writeFile } from "fs/promises";
import { join } from "path";

import { MEMORY_DIR, PIPELINES_DIR } from "@/lib/global-config";

async function scanPipelines(baseDir: string, projectName: string) {
  const dirs = await readdir(baseDir).catch(() => [] as string[]);
  const pipelineDirs = dirs.filter((d) => d.startsWith("PIPE-") || d.startsWith("AI_Workflow-PIPE") || d.startsWith("TEST-PIPE"));

  // Load queue state from queue.json
  let queueMap: Record<string, string> = {};
  try {
    const qRaw = await readFile(join(MEMORY_DIR, "queue", "queue.json"), "utf-8");
    const q = JSON.parse(qRaw) as { pending?: { id: string }[]; running?: { id: string } | null; done?: { id: string }[] };
    for (const item of q.pending ?? []) queueMap[item.id] = "pending";
    if (q.running) queueMap[q.running.id] = "running";
    for (const item of q.done ?? []) queueMap[item.id] = "done";
  } catch { /* no queue file */ }

  return Promise.all(
    pipelineDirs.map(async (dir) => {
      const pipelineDir = join(baseDir, dir);
      const metaPath = join(pipelineDir, "META.json");
      const planPath = join(pipelineDir, "PLAN.md");
      const tasksPath = join(pipelineDir, "TASKS.md");
      const walkthroughPath = join(pipelineDir, "WALKTHROUGH.md");

      let meta: Record<string, unknown> = {};
      try {
        meta = JSON.parse(await readFile(metaPath, "utf-8")) as Record<string, unknown>;
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
        queue: queueMap[dir] ?? "none",
        phases: Array.isArray(meta.phases) ? meta.phases.map((p: Record<string, unknown>) => ({
          name: String(p.label || p.role || "Phase"),
          completed: p.status === "completed" ? 1 : 0,
          total: 1,
        })) : [],
        planner: String(meta.planner ?? (Array.isArray(meta.phases) ? String((meta.phases as any[])[0]?.agent ?? "—") : "—")),
        executor: String(meta.executor ?? (Array.isArray(meta.phases) ? String((meta.phases as any[])[(meta.phases as any[]).length - 1]?.agent ?? "—") : "—")),
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
      if (entry.startsWith("PIPE-") || entry.startsWith("AI_Workflow-PIPE") || entry.startsWith("TEST-PIPE")) {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project = body.project || "PAOS";
    const prompt = body.prompt || "New pipeline";
    const planMd = body.planMd || "";
    const tasksMd = body.tasksMd || "";

    // Generate pipeline ID: PIPE-N-DD-MM-YYYY---HH-MM
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const id = `PIPE-${dateStr}---${timeStr}`;

    const dir = join(PIPELINES_DIR, project, id);
    await mkdir(dir, { recursive: true });

    // META.json
    const meta = {
      pipeline_id: id,
      prompt,
      status: "submitted",
      created_at: now.toISOString(),
      phases: [
        {
          agent: "",
          role: "planner",
          label: "Plan",
          status: "submitted",
          artifacts: planMd ? ["PLAN.md"] : [],
        },
        {
          agent: "",
          role: "executor",
          label: "Execute",
          status: "pending",
          artifacts: [],
        },
      ],
    };
    await writeFile(join(dir, "META.json"), JSON.stringify(meta, null, 2));

    // PLAN.md
    if (planMd) {
      await writeFile(join(dir, "PLAN.md"), planMd);
    }

    // TASKS.md
    if (tasksMd) {
      await writeFile(join(dir, "TASKS.md"), tasksMd);
    } else {
      await writeFile(join(dir, "TASKS.md"), "[ ] Task 1\n");
    }

    // pipeline.json
    const pj = { status: "submitted", currentTask: "", progress: "0/...", startedAt: null };
    await writeFile(join(dir, "pipeline.json"), JSON.stringify(pj, null, 2));

    // Enqueue automatically
    try {
      await import("fs/promises").then(m =>
        m.writeFile(join(PIPELINES_DIR.replace("pipelines", "queue"), "queue.json"), "", { flag: "a" }).catch(() => {})
      );
      await fetch(`http://localhost:3333/api/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enqueue", id, project }),
      });
    } catch { /* queue not critical */ }

    return NextResponse.json({ ok: true, id, project, dir });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
