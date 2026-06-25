import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
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
    if (!dir) return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });

    // Try reading pipeline-flow.json
    const flowRaw = await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}");
    const flowData = JSON.parse(flowRaw);

    // If no pipeline-flow.json, synthesize from META.json phases
    if (!flowData.phases) {
      const metaRaw = await readFile(join(dir, "META.json"), "utf-8").catch(() => "{}");
      const meta = JSON.parse(metaRaw);
      const metaPhases = meta.phases || [];

      if (metaPhases.length > 0) {
        const syntheticPhases: Record<string, any> = {};
        const order = metaPhases.map((p: any) => p.id || p.role || "phase-0");
        for (const phase of metaPhases) {
          const pid = phase.id || phase.role || "phase-0";
          syntheticPhases[pid] = {
            status: phase.status || "pending",
            prompt: phase.prompt || "",
            pid: null,
            order: 0,
          };
          // Also read per-phase files if they exist
          const phaseDir = join(dir, "phases", pid);
          const reasoning = await readFile(join(phaseDir, "REASONING.md"), "utf-8").catch(() => "");
          const tasksMd = await readFile(join(phaseDir, "TASKS.md"), "utf-8").catch(() => "");
          const walkthrough = await readFile(join(phaseDir, "WALKTHROUGH.md"), "utf-8").catch(() => "");
          const output = await readFile(join(phaseDir, "output.log"), "utf-8").catch(() => "");
          if (reasoning) syntheticPhases[pid].reasoning = reasoning;
          if (tasksMd) syntheticPhases[pid].tasksMd = tasksMd;
          if (walkthrough) syntheticPhases[pid].walkthroughMd = walkthrough;
          if (output) syntheticPhases[pid].outputPreview = output.slice(0, 1000);
        }

        return NextResponse.json({
          pipelineId: id,
          status: meta.status || "completed",
          phases: syntheticPhases,
          order,
        });
      }
    }

    return NextResponse.json(flowData);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
