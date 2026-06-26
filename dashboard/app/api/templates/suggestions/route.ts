import { NextResponse } from "next/server";

// Hidden default prompts per role (not editable by user during normal use)
const DEFAULT_PROMPTS: Record<string, string> = {
  "Proposer": "Analyze the request and create a detailed proposal with scope, approach, and expected outcomes. Consider edge cases and alternatives.",
  "Architect": "Design the technical architecture: components, data flow, APIs, and module structure. Document key decisions and trade-offs.",
  "Enhancer": "Review the current proposal/plan and enhance it. Strengthen weak points, add edge cases, suggest improvements.",
  "Planner": "Create a detailed implementation plan with tasks, dependencies, and estimated effort. Break work into logical phases.",
  "Researcher": "Research the topic thoroughly. Explore multiple approaches, existing solutions, and best practices. Provide findings with sources.",
  "Implementer": "Implement the solution following the plan. Write clean, well-tested code. Update progress as you go.",
  "Tester": "Write and run tests. Ensure adequate coverage for happy path, edge cases, and error conditions.",
  "Fixer": "Diagnose and fix the issue. Identify root cause, implement the fix, verify no regressions.",
  "Deployer": "Handle build, deploy, and release. Ensure rollback plan and monitoring are in place.",
  "Code Reviewer": "Review the implementation for bugs, code quality, edge cases, and security issues. Provide actionable feedback.",
  "Plan Reviewer": "Review the plan for completeness, gaps, risks, and feasibility. Suggest improvements.",
  "Quality Checker": "Perform a quality audit: check code style, test coverage, documentation, and best practices.",
  "Documenter": "Write comprehensive documentation: README, API docs, usage examples, and architecture overview.",
};

const AGENT_SUGGESTIONS: Record<string, { role: string; label: string; prompt: string; defaultPrompt?: string }[]> = {
  "hermes-nous": [
    { role: "Proposer", label: "Proposal", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Proposer"] },
    { role: "Architect", label: "Architecture", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Architect"] },
    { role: "Enhancer", label: "Enhancement", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Enhancer"] },
    { role: "Planner", label: "Planning", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Planner"] },
    { role: "Researcher", label: "Research", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Researcher"] },
  ],
  "opencode-developer": [
    { role: "Implementer", label: "Implementation", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Implementer"] },
    { role: "Tester", label: "Testing", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Tester"] },
    { role: "Fixer", label: "Bug Fix", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Fixer"] },
    { role: "Deployer", label: "Deployment", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Deployer"] },
  ],
  "opencode-plan": [
    { role: "Planner", label: "Planning", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Planner"] },
  ],
  "antigravity": [
    { role: "Code Reviewer", label: "Code Review", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Code Reviewer"] },
    { role: "Plan Reviewer", label: "Plan Review", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Plan Reviewer"] },
    { role: "Quality Checker", label: "Quality Check", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Quality Checker"] },
  ],
  "claude": [
    { role: "Implementer", label: "Implementation", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Implementer"] },
    { role: "Code Reviewer", label: "Code Review", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Code Reviewer"] },
    { role: "Documenter", label: "Documentation", prompt: "", defaultPrompt: DEFAULT_PROMPTS["Documenter"] },
  ],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");
  const prompt = searchParams.get("prompt") || "";

  const suggestions = agentId ? (AGENT_SUGGESTIONS[agentId] || []) : [];

  // If a prompt is provided, rank suggestions by similarity
  if (prompt && suggestions.length > 0) {
    const { rankBySimilarity } = await import("@/lib/similarity");
    const ranked = rankBySimilarity(
      prompt,
      suggestions,
      (s) => `${s.role} ${s.label} ${s.prompt || s.defaultPrompt || ""}`,
      suggestions.length,
    );
    return NextResponse.json({
      agentId: agentId || null,
      suggestions: ranked.map((r) => ({ ...r.item, similarity: Math.round(r.score * 100) })),
    });
  }

  return NextResponse.json({ agentId: agentId || null, suggestions });
}
