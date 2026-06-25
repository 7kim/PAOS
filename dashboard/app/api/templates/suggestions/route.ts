import { NextResponse } from "next/server";

const AGENT_SUGGESTIONS: Record<string, { role: string; label: string; prompt: string }[]> = {
  "hermes-nous": [
    { role: "Proposer", label: "Proposal", prompt: "Analyze the request and create a detailed proposal with scope, approach, and expected outcomes. Consider edge cases and alternatives." },
    { role: "Architect", label: "Architecture", prompt: "Design the technical architecture: components, data flow, APIs, and module structure. Document key decisions and trade-offs." },
    { role: "Enhancer", label: "Enhancement", prompt: "Review the current proposal/plan and enhance it. Strengthen weak points, add edge cases, suggest improvements." },
    { role: "Planner", label: "Planning", prompt: "Create a detailed implementation plan with tasks, dependencies, and estimated effort. Break work into logical phases." },
    { role: "Researcher", label: "Research", prompt: "Research the topic thoroughly. Explore multiple approaches, existing solutions, and best practices. Provide findings with sources." },
  ],
  "opencode-developer": [
    { role: "Implementer", label: "Implementation", prompt: "Implement the solution following the plan. Write clean, well-tested code. Update progress as you go." },
    { role: "Tester", label: "Testing", prompt: "Write and run tests. Ensure adequate coverage for happy path, edge cases, and error conditions." },
    { role: "Fixer", label: "Bug Fix", prompt: "Diagnose and fix the issue. Identify root cause, implement the fix, verify no regressions." },
    { role: "Deployer", label: "Deployment", prompt: "Handle build, deploy, and release. Ensure rollback plan and monitoring are in place." },
  ],
  "opencode-plan": [
    { role: "Planner", label: "Planning", prompt: "Break down the requirements into actionable tasks with clear dependencies and acceptance criteria." },
  ],
  "antigravity": [
    { role: "Code Reviewer", label: "Code Review", prompt: "Review the implementation for bugs, code quality, edge cases, and security issues. Provide actionable feedback." },
    { role: "Plan Reviewer", label: "Plan Review", prompt: "Review the plan for completeness, gaps, risks, and feasibility. Suggest improvements." },
    { role: "Quality Checker", label: "Quality Check", prompt: "Perform a quality audit: check code style, test coverage, documentation, and best practices." },
  ],
  "claude": [
    { role: "Implementer", label: "Implementation", prompt: "Implement using Claude Code's capabilities. Focus on code quality and thorough testing." },
    { role: "Code Reviewer", label: "Code Review", prompt: "Review code quality, suggest improvements, identify potential issues and optimization opportunities." },
    { role: "Documenter", label: "Documentation", prompt: "Write comprehensive documentation: README, API docs, usage examples, and architecture overview." },
  ],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = AGENT_SUGGESTIONS[agentId] || [];
  return NextResponse.json({ agentId, suggestions });
}
