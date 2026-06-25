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
    if (!dir) {
      return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
    }

    // Read flow status
    const flowRaw = await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "");
    if (!flowRaw) {
      return NextResponse.json({ flowStatus: null, message: "No flow execution in progress" });
    }

    const flowStatus = JSON.parse(flowRaw);

    // Read builder layout for prompt/file refs per node
    const layoutRaw = await readFile(join(dir, "builder-layout.json"), "utf-8").catch(() => "{}");
    const layout = JSON.parse(layoutRaw);
    const layoutNodes = (layout.nodes || []).reduce((map: any, n: any) => {
      map[n.id] = n.data || {};
      return map;
    }, {});

    // Enrich with phase artifacts and content
    const phasesDir = join(dir, "phases");
    const phaseDirs = await readdir(phasesDir).catch(() => [] as string[]);

    for (const phaseId of phaseDirs) {
      if (phaseId.startsWith(".")) continue;
      const phaseDir = join(phasesDir, phaseId);
      const files = await readdir(phaseDir).catch(() => [] as string[]);

      if (flowStatus.phases?.[phaseId]) {
        const phase = flowStatus.phases[phaseId] as any;
        phase.artifacts = files;

        // Merge layout data (prompt, fileRefs, skills, MCPs)
        const layoutData = layoutNodes[phaseId] || {};
        phase.prompt = layoutData.prompt || "";
        phase.fileRefs = layoutData.fileRefs || [];
        phase.selectedSkills = layoutData.selectedSkills || [];
        phase.selectedMcps = layoutData.selectedMcps || [];

        // Read IMPLEMENTATION.md
        if (files.includes("IMPLEMENTATION.md")) {
          try {
            phase.implementation = await readFile(join(phaseDir, "IMPLEMENTATION.md"), "utf-8");
          } catch { phase.implementation = ""; }
        }

        // Read REASONING.md
        if (files.includes("REASONING.md")) {
          try {
            phase.reasoning = await readFile(join(phaseDir, "REASONING.md"), "utf-8");
          } catch { phase.reasoning = ""; }
        }

        // Read output.log (last 2000 chars)
        if (files.includes("output.log")) {
          try {
            const log = await readFile(join(phaseDir, "output.log"), "utf-8");
            phase.outputPreview = log.length > 2000 ? log.slice(-2000) : log;
          } catch { phase.outputPreview = ""; }
        }

        // Check for walkthrough
        if (files.some((f: string) => f.toLowerCase().includes("walkthrough"))) {
          phase.hasWalkthrough = true;
        }
      }
    }

    return NextResponse.json({ flowStatus });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
