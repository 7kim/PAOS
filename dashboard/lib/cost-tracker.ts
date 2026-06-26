import { readFile, readdir } from "fs/promises";
import { join } from "path";

export interface PhaseCost {
  label: string;
  tokens: number;
  cost: number;
}

export interface PipelineCost {
  pipelineId: string;
  estimatedTokens: number;
  estimatedCost: number;
  phases: PhaseCost[];
}

/**
 * Rough token estimate: ~4 characters per token.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Estimate cost for a given number of prompt tokens and model.
 * - Claude: $2/M input tokens
 * - GPT-4o mini: $0.15/M input tokens
 * Defaults to GPT-4o mini pricing for unknown models.
 */
export function estimateCost(promptTokens: number, model: string): number {
  const ratePerMillion = model.toLowerCase().includes("claude") ? 2.0 : 0.15;
  return (promptTokens / 1_000_000) * ratePerMillion;
}

/**
 * Infer model from agentId. Heuristic: claude-labeled agents → Claude,
 * everything else → GPT-4o mini.
 */
function inferModel(agentId: string): string {
  const lower = agentId.toLowerCase();
  if (lower.includes("claude") || lower.includes("anthropic")) return "claude";
  return "gpt-4o-mini";
}

/**
 * Read a single pipeline-flow.json and compute its cost breakdown.
 */
export async function getPipelineCost(pipelineDir: string): Promise<PipelineCost | null> {
  const flowPath = join(pipelineDir, "pipeline-flow.json");
  try {
    const raw = await readFile(flowPath, "utf-8");
    const flow = JSON.parse(raw) as {
      pipelineId?: string;
      phases?: Record<string, { label?: string; prompt?: string; agentId?: string }>;
      order?: string[];
    };

    const pipelineId = flow.pipelineId || pipelineDir.split("/").pop() || "unknown";
    const phasesMap = flow.phases || {};
    const order = flow.order || Object.keys(phasesMap);
    const phases: PhaseCost[] = [];

    for (const id of order) {
      const phase = phasesMap[id];
      if (!phase) continue;

      const label = phase.label || id;
      const prompt = phase.prompt || "";
      const agentId = phase.agentId || "";
      const tokens = estimateTokens(prompt);
      const model = inferModel(agentId);
      const cost = estimateCost(tokens, model);

      phases.push({ label, tokens, cost });
    }

    const estimatedTokens = phases.reduce((s, p) => s + p.tokens, 0);
    const estimatedCost = phases.reduce((s, p) => s + p.cost, 0);

    return { pipelineId, estimatedTokens, estimatedCost, phases };
  } catch {
    return null;
  }
}

/**
 * Scan all pipeline directories under a given base directory
 * (e.g. `~/AI_Workflow/memory/pipelines/<project>/<pipeline>/`)
 * and collect cost estimates for every pipeline that has a pipeline-flow.json.
 */
export async function getAllPipelineCosts(baseDir: string): Promise<PipelineCost[]> {
  const results: PipelineCost[] = [];
  const projects = await readdir(baseDir).catch(() => []);

  for (const project of projects) {
    if (project.startsWith(".")) continue;
    const projectDir = join(baseDir, project);
    const entries = await readdir(projectDir).catch(() => []);

    for (const entry of entries) {
      if (!entry.startsWith("PIPE-")) continue;
      const pipelineDir = join(projectDir, entry);
      const cost = await getPipelineCost(pipelineDir);
      if (cost) results.push(cost);
    }
  }

  return results;
}
