import { NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function POST(
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

    // Check if builder-layout already exists
    try {
      await readFile(join(dir, "builder-layout.json"), "utf-8");
      return NextResponse.json({ ok: true, message: "already has layout" });
    } catch { /* generate one */ }

    // Read META.json phases and generate a linear layout
    const metaRaw = await readFile(join(dir, "META.json"), "utf-8");
    const meta = JSON.parse(metaRaw);
    const phases = meta.phases || [];

    if (phases.length === 0) {
      return NextResponse.json({ error: "No phases to convert" }, { status: 400 });
    }

    const nodes = phases.map((p: any, i: number) => ({
      id: `phase-${i}`,
      type: "agentNode",
      position: { x: 250, y: i * 200 },
      data: {
        label: p.label || p.role || `Phase ${i + 1}`,
        agentId: p.agent || "",
        prompt: p.prompt || "",
        selectedSkills: p.selectedSkills || [],
        selectedMcps: p.selectedMcps || [],
        fileRefs: p.fileRefs || [],
        nodeColor: i === 0 ? "#f0b90b" : i === phases.length - 1 ? "#3b82f6" : "#8b5cf6",
      },
    }));

    const edges = nodes.slice(0, -1).map((n: any, i: number) => ({
      id: `e-${i}`,
      source: n.id,
      target: nodes[i + 1].id,
      type: "smoothstep",
      animated: true,
      style: { stroke: "var(--border)", strokeWidth: 2 },
    }));

    const layout = { nodes, edges };
    await writeFile(join(dir, "builder-layout.json"), JSON.stringify(layout, null, 2));

    // Also update META.json to mark as builder
    meta.builder = true;
    await writeFile(join(dir, "META.json"), JSON.stringify(meta, null, 2));

    return NextResponse.json({ ok: true, message: "Layout generated", phases: phases.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
