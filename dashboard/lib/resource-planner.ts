/**
 * Resource Planner — recommends optimal agent allocation for pipelines.
 *
 * Considers:
 *   - Pipeline complexity (prompt length × phase count)
 *   - Available agents with capability scores and cost tiers
 *   - Optimal parallelism (sequential vs concurrent phases)
 *   - Estimated token usage
 *
 * This is a heuristic model, not a solver. Results are advisory.
 */

// ── Agent profiles ──────────────────────────────────────────────────────

export interface AgentProfile {
  id: string;
  label: string;
  /** Relative capability score (0-100). Higher = better reasoning. */
  capability: number;
  /** Relative cost per 1K tokens. 1.0 = baseline (opencode-developer). */
  costPer1K: number;
  /** Preferred task types this agent handles well. */
  strengths: string[];
}

export const AGENT_PROFILES: AgentProfile[] = [
  { id: "hermes-nous",       label: "Hermes (Nous)",  capability: 85, costPer1K: 1.5, strengths: ["planning", "research", "analysis", "orchestration"] },
  { id: "opencode-developer", label: "OpenCode Dev",  capability: 75, costPer1K: 1.0, strengths: ["implementation", "testing", "fixing", "deployment"] },
  { id: "opencode-plan",     label: "OpenCode Plan",  capability: 70, costPer1K: 0.8, strengths: ["planning", "scheduling"] },
  { id: "antigravity",       label: "Antigravity",    capability: 80, costPer1K: 1.2, strengths: ["review", "quality", "research"] },
  { id: "claude",            label: "Claude Code",    capability: 90, costPer1K: 2.0, strengths: ["implementation", "review", "documentation"] },
  { id: "openclaw",          label: "OpenClaw",       capability: 65, costPer1K: 0.6, strengths: ["communication", "delegation"] },
  { id: "ollama",            label: "Ollama",         capability: 50, costPer1K: 0.1, strengths: ["simple tasks", "local inference"] },
];

// ── Planning result ─────────────────────────────────────────────────────

export interface ResourcePlan {
  /** Recommended parallelism level (1 = sequential, >1 = concurrent phases). */
  recommendedParallelism: number;
  /** Estimated total tokens for the pipeline. */
  estimatedTokens: number;
  /** Estimated cost in relative units. */
  estimatedCost: number;
  /** Suggested agents for each phase. */
  suggestedAgents: { phaseId: string; agent: AgentProfile; reason: string }[];
  /** Summary of the analysis. */
  summary: string;
}

// ── Analysis ────────────────────────────────────────────────────────────

/** Estimate token usage from prompt text. ~4 chars per token for English. */
function estimateTokens(text: string): number {
  // Count tokens roughly: words / 0.75 (avg tokens per word) + punctuation
  return Math.ceil(text.length / 4);
}

/**
 * Score an agent for a given task description based on capability match
 * and strength relevance.
 */
function agentRelevance(agent: AgentProfile, taskDescription: string, tokenCount: number): number {
  const desc = taskDescription.toLowerCase();
  let score = 0;

  // Strength match: if the task description contains any of the agent's strengths
  for (const strength of agent.strengths) {
    if (desc.includes(strength.toLowerCase())) {
      score += 20;
    }
  }

  // Capability: higher is better for complex tasks
  const complexityFactor = Math.min(tokenCount / 500, 1); // 0 to 1 based on prompt size
  score += agent.capability * complexityFactor * 0.5;

  // Cost efficiency: prefer cheaper agents for simple tasks
  if (complexityFactor < 0.3) {
    score += (1 - agent.costPer1K / 3) * 10; // bonus for cheap agents on simple tasks
  }

  return score;
}

/**
 * Generate a resource plan for a pipeline.
 *
 * @param prompt        The full pipeline prompt.
 * @param phaseLabels   Labels/descriptions for each phase/node.
 * @param agents        List of available agents (defaults to all).
 */
export function planResources(
  prompt: string,
  phaseLabels: string[],
  agents: AgentProfile[] = AGENT_PROFILES,
): ResourcePlan {
  const promptTokens = estimateTokens(prompt);
  const phaseCount = phaseLabels.length;

  // Determine complexity
  const totalTokens = promptTokens + phaseLabels.reduce((sum, l) => sum + estimateTokens(l), 0);
  const complexity = Math.min(totalTokens / 2000, 1); // 0-1 scale

  // Recommended parallelism
  let recommendedParallelism = 1;
  if (phaseCount >= 4 && complexity > 0.5) {
    recommendedParallelism = Math.min(3, Math.ceil(phaseCount / 3));
  } else if (phaseCount >= 2 && complexity > 0.3) {
    recommendedParallelism = 2;
  }

  // Estimate cost
  const avgCost = agents.reduce((s, a) => s + a.costPer1K, 0) / agents.length;
  const estimatedTokens = totalTokens;
  const estimatedCost = Math.round((estimatedTokens / 1000) * avgCost * 100) / 100;

  // Suggest agents
  const suggestedAgents = phaseLabels.map((label, i) => {
    const scored = agents
      .map((a) => ({ agent: a, score: agentRelevance(a, label, promptTokens) }))
      .sort((a, b) => b.score - a.score);
    const best = scored[0];
    return {
      phaseId: `phase-${i + 1}`,
      agent: best.agent,
      reason: best.score > 50
        ? `${best.agent.label} scored ${Math.round(best.score)} — strong match for "${label}"`
        : `${best.agent.label} scored ${Math.round(best.score)} — best available for "${label}"`,
    };
  });

  // Summary
  const parallelAdvice = recommendedParallelism > 1
    ? `Run up to ${recommendedParallelism} phases in parallel`
    : "Run phases sequentially (simple pipeline)";

  const summary = [
    `Pipeline has ${phaseCount} phase(s) with ~${estimatedTokens} estimated tokens.`,
    `Complexity: ${complexity < 0.3 ? "low" : complexity < 0.7 ? "medium" : "high"}.`,
    parallelAdvice,
    `Estimated cost: ${estimatedCost} units.`,
    `Best agent: ${suggestedAgents[0]?.agent.label} — ${suggestedAgents[0]?.reason || "best match"}.`,
  ].join(" ");

  return {
    recommendedParallelism,
    estimatedTokens,
    estimatedCost,
    suggestedAgents,
    summary,
  };
}
