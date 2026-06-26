import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join, extname } from "path";
import { fileCache } from "@/lib/cache";
import { MEMORY_DIR } from "@/lib/global-config";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");
interface PhaseArtifact {
  filename: string;
  content: string;
  lines?: number;
}

interface Phase {
  agent: string;
  role: string;
  label: string;
  status: string;
  artifacts: PhaseArtifact[];
  id?: string;
  prompt?: string;
  reasoning?: string;
  tasksMd?: string;
  walkthroughMd?: string;
  outputPreview?: string;
  pid?: number | null;
  extraFiles?: PhaseArtifact[];
}

export async function GET(
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

  try {
    const [metaRaw, pipelineJsonRaw, allFiles, builderLayoutRaw] = await Promise.all([
      readFile(join(dir, "META.json"), "utf-8").catch(() => "{}"),
      readFile(join(dir, "pipeline.json"), "utf-8").catch(() => "{}"),
      readdir(dir).catch(() => [] as string[]),
      readFile(join(dir, "builder-layout.json"), "utf-8").catch(() => ""),
    ]);

    const meta = JSON.parse(metaRaw);
    const pipelineJson = JSON.parse(pipelineJsonRaw);
    const builderLayout = builderLayoutRaw ? JSON.parse(builderLayoutRaw) : null;

    // --- Live progress from pipeline.json ---
    let liveProgress = 0;
    let liveCompleted = 0;
    let liveTotal = 0;
    if (pipelineJson?.progress && pipelineJson.progress !== "0/...") {
      const parts = String(pipelineJson.progress).split("/");
      liveCompleted = parseInt(parts[0], 10) || 0;
      liveTotal = parseInt(parts[1], 10) || 0;
      liveProgress = liveTotal > 0 ? Math.round((liveCompleted / liveTotal) * 100) : 0;
    }

    // --- Build phases from META.json ---
    const phases: Phase[] = (meta.phases ?? []).map((p: Record<string, unknown>) => ({
      id: String(p.id ?? ""),
      agent: String(p.agent ?? ""),
      role: String(p.role ?? ""),
      label: String(p.label ?? ""),
      status: String(p.status ?? "pending"),
      prompt: String(p.prompt ?? ""),
      artifacts: [],
    }));

    // If no phases array, fall back to legacy planner/executor
    if (phases.length === 0) {
      if (meta.planner) phases.push({ agent: meta.planner, role: "planner", label: "Plan", status: "completed", artifacts: [] });
      if (meta.executor) phases.push({ agent: meta.executor, role: "executor", label: "Execute", status: meta.status ?? "pending", artifacts: [] });
    }

    // --- Scan directory for artifact files and assign to phases by META.json spec ---
    const artifactFiles = allFiles.filter(
      (f) => f.endsWith(".md") && f !== "META.json" && f !== "README.md" && !f.startsWith(".")
    );

    // Read all artifact content once
    const fileContents: Record<string, string> = {};
    for (const file of artifactFiles) {
      fileContents[file] = await readFile(join(dir, file), "utf-8").catch(() => "");
    }

    // Also scan phase subdirectories for agent-created files
    const phasesDir = join(dir, "phases");
    try {
      const phaseSubDirs = await readdir(phasesDir);
      for (const subDir of phaseSubDirs) {
        const subDirPath = join(phasesDir, subDir);
        try {
          const subFiles = await readdir(subDirPath);
          for (const sf of subFiles) {
            if (sf.endsWith(".md") || sf.endsWith(".log")) {
              const fullPath = join(subDirPath, sf);
              const relPath = `phases/${subDir}/${sf}`;
              if (!fileContents[relPath]) {
                fileContents[relPath] = await readFile(fullPath, "utf-8").catch(() => "");
                artifactFiles.push(relPath);
              }
            }
          }
        } catch { /* skip unreadable subdirs */ }
      }
    } catch { /* no phases dir */ }

    // Convert META.json phase agent/role to front-end Phase objects
    for (const phase of phases) {
      const metaPhases = (meta.phases as Array<Record<string, unknown>> | undefined) ?? [];
      const phaseMeta = metaPhases.find(
        (p: Record<string, unknown>) => p.id === phase.id || (p.agent === phase.agent && p.role === phase.role)
      );
      const rawArtifacts = phaseMeta?.artifacts;
      const expectedFiles: string[] = Array.isArray(rawArtifacts) ? rawArtifacts : [];
      for (const filename of expectedFiles) {
        if (fileContents[filename] !== undefined) {
          phase.artifacts.push({
            filename,
            content: fileContents[filename],
            lines: fileContents[filename].split("\n").length,
          });
        }
      }
    }

    // Fallback: assign any .md files on disk not listed in any phase's artifacts
    // Match phase subdirectory files to the correct phase by directory name
    const allAssigned = new Set(phases.flatMap(p => p.artifacts.map(a => a.filename)));
    for (const filename of artifactFiles) {
      if (!allAssigned.has(filename) && !filename.endsWith(".json")) {
        // Try to match by phase subdirectory (e.g. phases/n1/REASONING.md → phase with id=n1)
        let targetPhase = null;
        const phaseMatch = filename.match(/^phases\/([^/]+)\//);
        if (phaseMatch) {
          const phaseId = phaseMatch[1];
          targetPhase = phases.find(p => p.id === phaseId);
        }
        if (!targetPhase) {
          targetPhase = phases.find(p => p.status === "pending" || p.status === "submitted")
            ?? phases[phases.length - 1];
        }
        if (targetPhase && !targetPhase.artifacts.some(a => a.filename === filename)) {
          targetPhase.artifacts.push({
            filename,
            content: fileContents[filename],
            lines: fileContents[filename].split("\n").length,
          });
        }
      }
    }

    // --- Compute diff between versions ---
    // If a phase has multiple artifacts of the same base name (e.g. PLAN.md & PLAN-hermes.md),
    // mark them as versions so the frontend can show a diff
    interface VersionedArtifact {
      filename: string;
      content: string;
      lines: number;
      version: number;
    }

    const versionedArtifacts: Record<string, VersionedArtifact[]> = {};
    for (const phase of phases) {
      for (const art of phase.artifacts) {
        // Extract base name without agent suffix
        const base = art.filename.replace(/-[a-zA-Z0-9_-]+\.md$/, ".md").replace(/\.md$/, "");
        if (!versionedArtifacts[base]) versionedArtifacts[base] = [];
        const isV2 = art.filename !== `${base}.md`;
        versionedArtifacts[base].push({
          filename: art.filename,
          content: art.content,
          lines: art.lines ?? 0,
          version: isV2 ? 2 : 1,
        });
      }
    }

    // Parse tasks from the LAST phase's TASKS.md (latest version, not first)
    const allTaskArtifacts = phases
      .flatMap((p) => p.artifacts)
      .filter((a) => a.filename.toLowerCase().includes("tasks"));
    const tasksMd = allTaskArtifacts[allTaskArtifacts.length - 1]?.content ?? "";
    const taskList: { status: string; label: string; complexity: string; file?: string; details: string[] }[] = [];
    if (tasksMd) {
      let current: (typeof taskList)[0] | null = null;
      for (const line of tasksMd.split("\n")) {
        const taskMatch = line.match(/^[\s-]*(\[[ x~]\])\s*(.+)/i);
        if (taskMatch) {
          if (current) taskList.push(current);
          const marker = taskMatch[1];
          const status = marker.includes("[x]") ? "done" : marker.includes("[~]") ? "doing" : "pending";
          const raw = taskMatch[2].trim();
          const complexityMatch = raw.match(/\[([SML])\]\s*/);
          const complexity = complexityMatch ? complexityMatch[1] : "M";
          const label = raw.replace(/\[[SML]\]\s*/, "").trim();
          current = { status, label, complexity, details: [], file: undefined };
        } else if (current) {
          const fileMatch = line.match(/File:\s*`([^`]+)`/);
          if (fileMatch) current.file = fileMatch[1];
          else if (line.trim().startsWith("- ") || line.trim().startsWith("* "))
            current.details.push(line.replace(/^[\s\-*]*/, "").trim());
        }
      }
      if (current) taskList.push(current);

      // Enrich task status from pipeline.json — only if TASKS.md isn't already fully marked
      const pipelineDone = meta?.status === "completed" || meta?.status === "completed_with_errors";
      if (pipelineDone) {
        taskList.forEach((t) => { t.status = "done"; });
      } else {
        const allDone = taskList.every((t) => t.status === "done");
        if (!allDone && liveTotal > 0) {
          const maxCompleted = Math.min(liveCompleted, taskList.length);
          taskList.forEach((t, i) => {
            if (i < maxCompleted) t.status = "done";
            else if (i === maxCompleted && t.status !== "done") t.status = "doing";
          });
          if (maxCompleted < taskList.length && !taskList.some((t) => t.status === "doing")) {
            taskList[maxCompleted].status = "doing";
          }
        }
      }
    }

    // Enrich phases with flow-status data (prompts, reasoning, tasks, walkthrough)
    const flowRaw = await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}");
    let flowData = JSON.parse(flowRaw);

    // If no pipeline-flow.json exists, synthesize from META.json phases
    if (!flowData.phases && phases.length > 0) {
      flowData = {
        pipelineId: id,
        status: "completed",
        phases: {} as Record<string, any>,
        order: phases.map((p) => p.id || p.role || `phase-${phases.indexOf(p)}`),
      };
      for (const [i, phase] of phases.entries()) {
        const pid = phase.id || phase.role || `phase-${i}`;
        flowData.phases[pid] = {
          status: phase.status || "completed",
          prompt: phase.prompt || "",
          pid: null,
          order: i,
        };
        // Read per-phase files by position as fallback
        const phasesDir = join(dir, "phases");
        // Try matching by node ID first, then by label/role
        const possibleDirs = [pid, `phase-${i}`, phase.label, phase.role].filter(Boolean);
        for (const subDir of possibleDirs) {
          try {
            const phaseDir = join(phasesDir, subDir);
            const reasoning = await readFile(join(phaseDir, "REASONING.md"), "utf-8").catch(() => "");
            const tasksMd = await readFile(join(phaseDir, "TASKS.md"), "utf-8").catch(() => "");
            const walkthrough = await readFile(join(phaseDir, "WALKTHROUGH.md"), "utf-8").catch(() => "");
            const output = await readFile(join(phaseDir, "output.log"), "utf-8").catch(() => "");
            if (reasoning) flowData.phases[pid].reasoning = reasoning;
            if (tasksMd) flowData.phases[pid].tasksMd = tasksMd;
            if (walkthrough) flowData.phases[pid].walkthroughMd = walkthrough;
            if (output) flowData.phases[pid].outputPreview = output.slice(0, 1000);
            break; // Found something, stop looking
          } catch { /* try next */ }
        }
      }
    }

    // Enrich phases, trying multiple key strategies
    if (flowData.phases) {
      for (const [i, phase] of phases.entries()) {
        // Try: id, role, label, phase-N index, then position in order array
        const keys = [phase.id, phase.role, phase.label, `phase-${i}`];
        // Also add the order-mapped key if order exists
        if (flowData.order?.[i]) keys.push(flowData.order[i]);
        let fp = null;
        for (const key of keys) {
          if (key && flowData.phases[key]) {
            fp = flowData.phases[key];
            break;
          }
        }
        fp = fp || {};
        phase.prompt = phase.prompt || fp.prompt || "";
        phase.reasoning = fp.reasoning || "";
        phase.tasksMd = fp.tasksMd || "";
        phase.walkthroughMd = fp.walkthroughMd || "";
        phase.outputPreview = fp.outputPreview || "";
        phase.pid = fp.pid || null;

        // Fallback: read phase files directly from disk (try multiple subdir names)
        if (!phase.reasoning || !phase.tasksMd || !phase.walkthroughMd || !phase.extraFiles || (phase.extraFiles && phase.extraFiles.length === 0)) {
          for (const tryKey of keys) {
            if (!tryKey) continue;
            const phaseDir = join(dir, "phases", tryKey);
            try {
              await readFile(join(phaseDir, "REASONING.md"), "utf-8");
              // This dir exists, read all files
              if (!phase.reasoning) {
                phase.reasoning = await readFile(join(phaseDir, "REASONING.md"), "utf-8").catch(() => "");
              }
              if (!phase.tasksMd) {
                phase.tasksMd = await readFile(join(phaseDir, "TASKS.md"), "utf-8").catch(() => "");
              }
              if (!phase.walkthroughMd) {
                phase.walkthroughMd = await readFile(join(phaseDir, "WALKTHROUGH.md"), "utf-8").catch(() => "");
              }
              // Scan for any extra .md files the agent created
              const allFiles = await readdir(phaseDir).catch(() => [] as string[]);
              const extra = allFiles.filter((f) =>
                f.endsWith(".md") &&
                f !== "IMPLEMENTATION.md" &&
                f !== "REASONING.md" &&
                f !== "TASKS.md" &&
                f !== "WALKTHROUGH.md"
              );
              if (extra.length > 0) {
                phase.extraFiles = await Promise.all(extra.map(async (f) => ({
                  filename: f,
                  content: await readFile(join(phaseDir, f), "utf-8").catch(() => ""),
                  lines: 0,
                })));
              }
              break; // Found the matching dir
            } catch { /* try next */ }
          }
        }
      }
    }

    // Overall progress
    const completedPhases = phases.filter((p) => p.status === "completed").length;
    const totalPhases = phases.length;
    const phaseProgress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;
    const progress = liveTotal > 0 ? liveProgress : phaseProgress;

    // ── Velocity: compute tasks/sec from phase timestamps ──
    let velocity: number | null = null;
    if (flowData.phases) {
      const completed = Object.values(flowData.phases as Record<string, { startedAt?: string; completedAt?: string }>)
        .filter((p) => p.startedAt && p.completedAt);
      if (completed.length > 1) {
        const starts = completed.map((p) => new Date(p.startedAt!).getTime());
        const ends = completed.map((p) => new Date(p.completedAt!).getTime());
        const minStart = Math.min(...starts);
        const maxEnd = Math.max(...ends);
        const elapsed = (maxEnd - minStart) / 1000; // seconds
        if (elapsed > 0) {
          velocity = Math.round((completed.length / elapsed) * 100) / 100;
        }
      }
    }

    return NextResponse.json({
      id,
      meta,
      pipeline: pipelineJson,
      phases,
      versionedArtifacts,
      taskList,
      builderLayout,
      stats: {
        completedTasks: meta?.status === "completed" || meta?.status === "completed_with_errors"
          ? taskList.length : completedPhases,
        totalTasks: taskList.length > 0 ? taskList.length : totalPhases,
        completedPhases,
        totalPhases,
        progress,
        velocity,
        hasWalkthrough: allFiles.some((f) => f.toLowerCase().includes("walkthrough")),
        hasPipelineJson: Object.keys(pipelineJson).length > 1,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: `Pipeline ${id} not found: ${String(e)}` }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Search across all project directories
  const { readdir, rm } = await import("fs/promises");
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

  try {
    await rm(dir, { recursive: true, force: true });
    return NextResponse.json({ ok: true, message: `Pipeline ${id} deleted` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
