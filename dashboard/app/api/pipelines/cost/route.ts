import { NextResponse } from "next/server";
import { PIPELINES_DIR } from "@/lib/global-config";
import { getAllPipelineCosts } from "@/lib/cost-tracker";

export async function GET() {
  try {
    // Scan both memory/pipelines and logs/pipelines for pipeline-flow.json files
    const memoryResults = await getAllPipelineCosts(PIPELINES_DIR);

    // Also scan the logs/pipelines directory for pipeline-flow.json
    // (some pipelines store their flow data only in logs)
    const logsDir = PIPELINES_DIR.replace("/memory/", "/logs/");
    const logsResults = await getAllPipelineCosts(logsDir);

    // Merge, dedup by pipelineId (memory takes precedence)
    const seen = new Set<string>();
    const merged: typeof memoryResults = [];
    for (const p of memoryResults) {
      seen.add(p.pipelineId);
      merged.push(p);
    }
    for (const p of logsResults) {
      if (!seen.has(p.pipelineId)) {
        seen.add(p.pipelineId);
        merged.push(p);
      }
    }

    // Compute aggregate stats
    const totalCost = merged.reduce((s, p) => s + p.estimatedCost, 0);
    const totalTokens = merged.reduce((s, p) => s + p.estimatedTokens, 0);
    const avgCost = merged.length > 0 ? totalCost / merged.length : 0;

    // Most expensive pipelines (sorted desc)
    const mostExpensive = [...merged]
      .sort((a, b) => b.estimatedCost - a.estimatedCost)
      .slice(0, 10)
      .map((p) => ({
        pipelineId: p.pipelineId,
        estimatedCost: p.estimatedCost,
        estimatedTokens: p.estimatedTokens,
        phaseCount: p.phases.length,
      }));

    return NextResponse.json({
      pipelines: merged,
      summary: {
        totalPipelines: merged.length,
        totalCost,
        totalTokens,
        avgCost,
      },
      mostExpensive,
    });
  } catch (e) {
    return NextResponse.json(
      { error: String(e), pipelines: [], summary: { totalPipelines: 0, totalCost: 0, totalTokens: 0, avgCost: 0 }, mostExpensive: [] },
      { status: 500 }
    );
  }
}
