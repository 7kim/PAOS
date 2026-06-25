import { NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  const { id, nodeId } = await params;

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

    // Read layout for dependency resolution
    const layoutRaw = await readFile(join(dir, "builder-layout.json"), "utf-8").catch(() => "{}");
    const layout = JSON.parse(layoutRaw);
    const edges = layout.edges || [];
    const nodes = layout.nodes || [];

    // Update flow status: mark as skipped
    const flowRaw = await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}");
    const flow = JSON.parse(flowRaw);
    if (!flow.phases?.[nodeId]) {
      return NextResponse.json({ error: "Phase not found" }, { status: 404 });
    }

    flow.phases[nodeId].status = "skipped";
    flow.phases[nodeId].completedAt = new Date().toISOString();
    flow.phases[nodeId].pid = null;
    await writeFile(join(dir, "pipeline-flow.json"), JSON.stringify(flow, null, 2));

    // Cascade: find next ready nodes
    const order = Object.keys(flow.phases);
    const nextReady = order.filter((nid: string) => {
      const phase = flow.phases[nid];
      if (!phase || phase.status !== "pending") return false;
      const incoming = edges.filter((e: any) => e.target === nid);
      return incoming.every((e: any) => {
        const srcPhase = flow.phases?.[e.source];
        return srcPhase?.status === "completed" || srcPhase?.status === "skipped";
      });
    });

    return NextResponse.json({
      ok: true,
      message: `${nodeId} skipped`,
      nextReady: nextReady.length > 0 ? nextReady : null,
      allDone: order.every((nid: string) =>
        flow.phases[nid].status === "completed" || flow.phases[nid].status === "failed" || flow.phases[nid].status === "skipped"
      ),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
