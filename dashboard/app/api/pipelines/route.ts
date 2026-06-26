import { NextResponse } from "next/server";
import { readdir, readFile, stat, mkdir, writeFile } from "fs/promises";
import { join } from "path";

import { MEMORY_DIR, PIPELINES_DIR } from "@/lib/global-config";
import { fileCache } from "@/lib/cache";

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
    const builderLayoutPath = join(pipelineDir, "builder-layout.json");

      let meta: Record<string, unknown> = {};
      try {
        const metaRaw = await fileCache.readFile(metaPath);
        meta = JSON.parse(metaRaw) as Record<string, unknown>;
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
        const pjRaw = await fileCache.readFile(pipelineJsonPath);
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

      let hasBuilderLayout = false;
      try {
        await readFile(builderLayoutPath, "utf-8");
        hasBuilderLayout = true;
      } catch { /* no builder layout */ }

      return {
        id: dir,
        project: projectName,
        status: meta.status ?? "unknown",
        queue: (meta.status === "completed" || meta.status === "failed") ? "none" : (queueMap[dir] ?? "none"),
        builder: hasBuilderLayout,
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
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));

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

    const total = allPipelines.length;
    const start = (page - 1) * limit;
    const paged = allPipelines.slice(start, start + limit);

    return NextResponse.json({ pipelines: paged, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
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
    const builderLayout = body.builderLayout || null;

    // Generate pipeline ID: PIPE-N-DD-MM-YYYY---HH-MM
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const id = `PIPE-${dateStr}---${timeStr}`;

    const dir = join(PIPELINES_DIR, project, id);
    await mkdir(dir, { recursive: true });

    // Auto-scale: call resource planner for parallelism recommendation
    let parallelism = 1;
    try {
      const { planResources } = await import("@/lib/resource-planner");
      const plan = planResources(prompt, []);
      parallelism = Math.max(1, plan.recommendedParallelism);
    } catch { /* fall back to sequential */ }

    // Build phases — base Plan + scaled executors
    const phases: any[] = [];
    let idx = 0;
    // Plan phase
    phases.push({
      id: `n${idx}`,
      agent: body.plannerAgent || "",
      role: "planner",
      label: "Plan",
      status: "submitted",
      artifacts: planMd ? ["PLAN.md"] : [],
    });
    idx++;
    // Executor phases (auto-scaled)
    for (let i = 0; i < parallelism; i++) {
      phases.push({
        id: `n${idx}`,
        agent: body.executorAgent || "",
        role: "executor",
        label: parallelism > 1 ? `Execute #${i + 1}` : "Execute",
        status: "pending",
        artifacts: [],
      });
      idx++;
    }

    // Build a minimal builder layout from phases
    const nodes = phases.map((p: any) => ({
      id: p.id,
      type: "agentNode",
      position: { x: 250, y: 100 + phases.indexOf(p) * 150 },
      data: { label: p.label, agentId: p.agent, role: p.role },
    }));
    const edges = phases.slice(1).map((p: any) => ({
      id: `e-${phases[0].id}-${p.id}`,
      source: phases[0].id,
      target: p.id,
    }));

    // META.json
    const meta: Record<string, any> = {
      pipeline_id: id,
      prompt,
      status: "submitted",
      created_at: now.toISOString(),
      phases,
      parallelism,
      builder: true,
      builderLayout: { nodes, edges },
    };
    await writeFile(join(dir, "META.json"), JSON.stringify(meta, null, 2));

    // Write builder-layout.json so the visualize page renders the DAG
    await writeFile(join(dir, "builder-layout.json"), JSON.stringify({ nodes, edges }, null, 2));

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

    // builder-layout.json (from Flow Builder)
    if (builderLayout) {
      // Topological sort for phases
      const nodes = builderLayout.nodes || [];
      const edges = builderLayout.edges || [];
      const nodeIds = new Set(nodes.map((n: any) => n.id));

      // DAG validation — every edge source/target must reference an existing node
      for (const e of edges) {
        if (!nodeIds.has(e.source)) {
          return NextResponse.json(
            { error: `Edge source "${e.source}" references non-existent node` },
            { status: 400 }
          );
        }
        if (!nodeIds.has(e.target)) {
          return NextResponse.json(
            { error: `Edge target "${e.target}" references non-existent node` },
            { status: 400 }
          );
        }
      }

      const nodeMap = new Map<string, { id: string; data: any }>();
      const inDegree = new Map<string, number>();
      const adj = new Map<string, string[]>();

      for (const n of nodes) {
        nodeMap.set(n.id, n);
        inDegree.set(n.id, 0);
        adj.set(n.id, []);
      }
      for (const e of edges) {
        adj.get(e.source)?.push(e.target);
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
      }

      const queue: string[] = [];
      for (const [id, deg] of inDegree) {
        if (deg === 0) queue.push(id);
      }
      const topoOrder: string[] = [];
      while (queue.length > 0) {
        const id = queue.shift()!;
        topoOrder.push(id);
        for (const next of adj.get(id) || []) {
          const newDeg = (inDegree.get(next) || 0) - 1;
          inDegree.set(next, newDeg);
          if (newDeg === 0) queue.push(next);
        }
      }

      // Cycle detection — if topo sort didn't process all nodes, a cycle exists
      if (topoOrder.length < nodes.length) {
        const sortedSet = new Set(topoOrder);
        const cycledNodes = nodes.filter((n: any) => !sortedSet.has(n.id)).map((n: any) => n.id);
        return NextResponse.json(
          { error: `DAG contains cycle(s): nodes [${cycledNodes.join(", ")}]` },
          { status: 400 }
        );
      }

      const phases = topoOrder.map((nodeId) => {
        const node = nodeMap.get(nodeId);
        const nd = (node as any)?.data || {};
        return {
          id: nodeId,
          agent: nd.agentId || "",
          role: nd.label || "Agent",
          label: nd.label || nd.agentId || "Agent",
          status: "pending",
          prompt: nd.prompt || "",
          selectedSkills: nd.selectedSkills || [],
          selectedMcps: nd.selectedMcps || [],
          fileRefs: nd.fileRefs || [],
        };
      });

      // Update META.json phases with builder data
      const updatedMeta = { ...meta, phases, builder: true };
      await writeFile(join(dir, "META.json"), JSON.stringify(updatedMeta, null, 2));

      // Save layout for rendering
      await writeFile(join(dir, "builder-layout.json"), JSON.stringify(builderLayout, null, 2));

      // Generate initial phase files so enrichment has data immediately
      const phasesDir = join(dir, "phases");
      await mkdir(phasesDir, { recursive: true });
      for (const phase of phases) {
        if (!phase.id) continue;
        const phaseDir = join(phasesDir, phase.id);
        await mkdir(phaseDir, { recursive: true });

        // IMPLEMENTATION.md
        const skillsStr = phase.selectedSkills?.length > 0 ? `\n\n## Skills\n${phase.selectedSkills.map((s: string) => `- ${s}`).join("\n")}` : "";
        const mcpsStr = phase.selectedMcps?.length > 0 ? `\n\n## MCPs\n${phase.selectedMcps.map((m: string) => `- ${m}`).join("\n")}` : "";
        const filesStr = phase.fileRefs?.length > 0 ? `\n\n## Reference Files\n${phase.fileRefs.map((f: any) => `- ${f.type === "folder" ? "📁" : "📄"} ${f.name}${f.path ? " (" + f.path + ")" : ""}`).join("\n")}` : "";
        await writeFile(join(phaseDir, "IMPLEMENTATION.md"),
          `# ${phase.label}\n\n## Agent\n${phase.agent}\n\n## Implementation Instructions\n${phase.prompt || "Follow the plan and implement accordingly."}${skillsStr}${mcpsStr}${filesStr}`
        );

        // TASKS.md
        await writeFile(join(phaseDir, "TASKS.md"), `# ${phase.label} — Tasks\n\n- [ ] Implement ${phase.label}\n- [ ] Verify implementation\n- [ ] Document changes\n`);

        // REASONING.md
        await writeFile(join(phaseDir, "REASONING.md"), `# ${phase.label} — Reasoning\n\n## What I understand\n\n## Key decisions\n\n## Trade-offs considered\n\n## Why this approach\n`);
      }
    }

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
