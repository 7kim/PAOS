import { NextResponse } from "next/server";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import type { PipelineTemplate } from "@/components/pipeline-builder/types";

import { TEMPLATES_DIR } from "@/lib/global-config";

// Ensure templates directory exists
if (!existsSync(TEMPLATES_DIR)) {
  mkdirSync(TEMPLATES_DIR, { recursive: true });
}

// Preset templates
const PRESETS: PipelineTemplate[] = [
  {
    id: "quick-dev",
    name: "Quick Dev",
    description: "Simple Plan → Implement flow for quick one-shot tasks",
    category: "feature",
    tags: ["quick", "dev"],
    nodes: [
      { id: "node-1", type: "agentNode", position: { x: 250, y: 50 }, data: { label: "Plan", agentId: "opencode-plan", prompt: "Plan the implementation. Break down the requirements into tasks with dependencies.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "node-2", type: "agentNode", position: { x: 250, y: 250 }, data: { label: "Implement", agentId: "opencode-developer", prompt: "Implement the planned tasks. Follow the plan and update progress.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e-1-2", source: "node-1", target: "node-2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "full-delivery",
    name: "Full Delivery",
    description: "Complete proposal-to-execution flow with review gates",
    category: "feature",
    tags: ["full", "production"],
    nodes: [
      { id: "n1", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Propose", agentId: "hermes-nous", prompt: "Create a detailed proposal with scope, approach, and expected outcomes.", selectedSkills: [], selectedMcps: ["context7", "shadcn"], fileRefs: [] } },
      { id: "n2", type: "agentNode", position: { x: 250, y: 150 }, data: { label: "Enhance", agentId: "hermes-nous", prompt: "Review the proposal and strengthen it. Consider edge cases, risks, and alternatives.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n3", type: "agentNode", position: { x: 250, y: 300 }, data: { label: "Plan", agentId: "opencode-plan", prompt: "Break the enhanced proposal into actionable tasks with dependencies.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n4", type: "agentNode", position: { x: 250, y: 450 }, data: { label: "Review Plan", agentId: "antigravity", prompt: "Review the plan for completeness, gaps, and risks.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n5", type: "agentNode", position: { x: 250, y: 600 }, data: { label: "Implement", agentId: "opencode-developer", prompt: "Execute the approved plan. Build everything according to spec.", selectedSkills: ["ponytail"], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e2-3", source: "n2", target: "n3", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e3-4", source: "n3", target: "n4", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e4-5", source: "n4", target: "n5", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "quality-flow",
    name: "Quality Flow",
    description: "Implement, review, fix, and test for production-quality code",
    category: "bug-fix",
    tags: ["quality", "review"],
    nodes: [
      { id: "n1", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Implement", agentId: "opencode-developer", prompt: "Implement the feature or fix.", selectedSkills: ["ponytail", "test-driven-development"], selectedMcps: [], fileRefs: [] } },
      { id: "n2", type: "agentNode", position: { x: 250, y: 200 }, data: { label: "Code Review", agentId: "antigravity", prompt: "Review the implementation. Check for bugs, edge cases, and code quality.", selectedSkills: ["systematic-debugging"], selectedMcps: [], fileRefs: [] } },
      { id: "n3", type: "agentNode", position: { x: 250, y: 400 }, data: { label: "Fix", agentId: "opencode-developer", prompt: "Address the review feedback and fix any issues found.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n4", type: "agentNode", position: { x: 250, y: 600 }, data: { label: "Test", agentId: "opencode-developer", prompt: "Write and run tests. Ensure adequate coverage.", selectedSkills: ["test-driven-development"], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e2-3", source: "n2", target: "n3", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e3-4", source: "n3", target: "n4", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "design-first",
    name: "Design First",
    description: "Research, architect, plan, then implement complex features",
    category: "feature",
    tags: ["design", "architecture"],
    nodes: [
      { id: "n1", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Research", agentId: "hermes-nous", prompt: "Research the problem space, existing solutions, and best practices.", selectedSkills: [], selectedMcps: ["context7", "21st-dev"], fileRefs: [] } },
      { id: "n2", type: "agentNode", position: { x: 250, y: 180 }, data: { label: "Architect", agentId: "hermes-nous", prompt: "Design the technical architecture: components, data flow, APIs.", selectedSkills: [], selectedMcps: ["context7"], fileRefs: [] } },
      { id: "n3", type: "agentNode", position: { x: 250, y: 360 }, data: { label: "Plan", agentId: "opencode-plan", prompt: "Create implementation plan from the architecture.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n4", type: "agentNode", position: { x: 250, y: 540 }, data: { label: "Implement", agentId: "opencode-developer", prompt: "Build everything according to the architecture and plan.", selectedSkills: ["ponytail"], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e2-3", source: "n2", target: "n3", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e3-4", source: "n3", target: "n4", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "review-pipeline",
    name: "Review Pipeline",
    description: "Quick implement → review → deploy for hotfixes",
    category: "hotfix",
    tags: ["review", "deploy"],
    nodes: [
      { id: "n1", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Implement", agentId: "opencode-developer", prompt: "Implement the hotfix quickly and cleanly.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n2", type: "agentNode", position: { x: 250, y: 200 }, data: { label: "Code Review", agentId: "antigravity", prompt: "Quick review of the hotfix. Check for regressions.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n3", type: "agentNode", position: { x: 250, y: 400 }, data: { label: "Deploy", agentId: "opencode-developer", prompt: "Deploy the approved changes. Ensure rollback plan.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e2-3", source: "n2", target: "n3", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "Analyze code and generate comprehensive documentation",
    category: "documentation",
    tags: ["docs", "quick"],
    nodes: [
      { id: "n1", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Analyze", agentId: "hermes-nous", prompt: "Analyze the codebase and identify what needs documentation.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n2", type: "agentNode", position: { x: 250, y: 200 }, data: { label: "Document", agentId: "opencode-developer", prompt: "Write comprehensive documentation including README, API docs, and examples.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "research-spike",
    name: "Research Spike",
    description: "Explore unknowns and produce a research report",
    category: "research",
    tags: ["research", "quick"],
    nodes: [
      { id: "n1", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Research", agentId: "hermes-nous", prompt: "Research the topic thoroughly. Explore multiple angles.", selectedSkills: [], selectedMcps: ["context7", "web"], fileRefs: [] } },
      { id: "n2", type: "agentNode", position: { x: 250, y: 200 }, data: { label: "Report", agentId: "opencode-developer", prompt: "Write a comprehensive research report with findings, analysis, and recommendations.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bug-fix",
    name: "Bug Fix",
    description: "Diagnose the issue, implement the fix, and verify with tests",
    category: "bug-fix",
    tags: ["bug", "fix", "quick"],
    nodes: [
      { id: "n1", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Diagnose", agentId: "opencode-developer", prompt: "Diagnose the bug. Identify root cause and reproduction steps.", selectedSkills: ["systematic-debugging"], selectedMcps: [], fileRefs: [] } },
      { id: "n2", type: "agentNode", position: { x: 250, y: 200 }, data: { label: "Fix", agentId: "opencode-developer", prompt: "Implement the fix. Ensure no regressions.", selectedSkills: [], selectedMcps: [], fileRefs: [] } },
      { id: "n3", type: "agentNode", position: { x: 250, y: 400 }, data: { label: "Test", agentId: "opencode-developer", prompt: "Write regression tests and verify the fix works.", selectedSkills: ["test-driven-development"], selectedMcps: [], fileRefs: [] } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
      { id: "e2-3", source: "n2", target: "n3", type: "smoothstep", animated: true, style: { stroke: "var(--border)", strokeWidth: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const files = await readdir(TEMPLATES_DIR).catch(() => [] as string[]);
    const templates: PipelineTemplate[] = [];

    // If no templates yet, seed with presets
    if (files.length === 0) {
      for (const preset of PRESETS) {
        await writeFile(join(TEMPLATES_DIR, `${preset.id}.json`), JSON.stringify(preset, null, 2));
      }
      return NextResponse.json({ templates: PRESETS });
    }

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const content = await readFile(join(TEMPLATES_DIR, file), "utf-8");
        templates.push(JSON.parse(content));
      } catch { /* skip corrupt files */ }
    }

    templates.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ templates });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, category, tags, nodes, edges } = body;

    if (!name || !nodes) {
      return NextResponse.json({ error: "Name and nodes are required" }, { status: 400 });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const template: PipelineTemplate = {
      id,
      name,
      description: description || "",
      category: category || "custom",
      tags: tags || [],
      nodes,
      edges: edges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await writeFile(join(TEMPLATES_DIR, `${id}.json`), JSON.stringify(template, null, 2));
    return NextResponse.json({ ok: true, template });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
