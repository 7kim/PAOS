import { NextResponse } from "next/server";
import { readFile, writeFile, stat, readdir } from "fs/promises";
import { join } from "path";

import { WORKSPACES_DIR } from "@/lib/global-config";
import { PROJECTS_DIR } from "@/lib/global-config";
const PROJ_DIR = PROJECTS_DIR;

const ROLE_PRESETS = [
  { role: "architect", label: "Architect", defaultPrompt: "Analyze the project structure and requirements. Identify key components, dependencies, and architectural patterns. Document your findings and recommendations for the next phase." },
  { role: "planner", label: "Plan", defaultPrompt: "Break down the task into actionable steps with clear dependencies. Estimate effort per step and identify potential risks. Your output is a structured plan for implementation." },
  { role: "developer", label: "Implement", defaultPrompt: "Implement the planned tasks. Write clean, well-documented code. Follow the project's coding principles and conventions. Update progress as you complete each item." },
  { role: "reviewer", label: "Review", defaultPrompt: "Review the implementation for correctness, security, and adherence to coding principles. Check for edge cases, error handling, and performance issues. Provide actionable feedback." },
  { role: "documenter", label: "Document", defaultPrompt: "Write clear documentation for the implemented changes. Include usage examples, API references, and architecture notes. Ensure the documentation is accessible to both technical and non-technical readers." },
  { role: "analyst", label: "Analyze", defaultPrompt: "Analyze the codebase for the specified task. Identify relevant files, patterns, and potential issues. Your analysis should be thorough and actionable." },
  { role: "integrator", label: "Integrate", defaultPrompt: "Integrate the changes into the existing codebase. Resolve conflicts, update dependencies, and ensure backward compatibility." },
  { role: "tester", label: "Test", defaultPrompt: "Write and run tests for the implemented changes. Cover unit tests, integration tests, and edge cases. Report coverage and any failures." },
  { role: "debugger", label: "Debug", defaultPrompt: "Investigate the reported issue. Reproduce the bug, identify the root cause, and propose a fix. Document your debugging process." },
  { role: "optimizer", label: "Optimize", defaultPrompt: "Profile the code and identify performance bottlenecks. Propose and implement optimizations. Measure and report improvements." },
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const wsPath = join(WORKSPACES_DIR, `${name}.code-workspace`);

  try {
    const raw = await readFile(wsPath, "utf-8");
    const ws = JSON.parse(raw);
    const paos = ws.paos || {};

    // Count pipelines
    let pipelineCount = 0;
    try {
      const pipesDir = join(PROJ_DIR.replace("/projects", ""), "memory", "pipelines", name);
      const dirs = await readdir(pipesDir).catch(() => []);
      pipelineCount = dirs.filter(d => d.startsWith("PIPE-")).length;
    } catch { /* ignore */ }

    return NextResponse.json({
      name,
      displayName: ws.displayName || ws.name || name,
      paos,
      folders: ws.folders || [],
      settings: ws.settings || {},
      extensions: ws.extensions || {},
      pipelineCount,
      rolePresets: ROLE_PRESETS,
    });
  } catch {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const body = await req.json();
  const wsPath = join(WORKSPACES_DIR, `${name}.code-workspace`);

  let workspace: Record<string, any> = {};
  try {
    const raw = await readFile(wsPath, "utf-8");
    workspace = JSON.parse(raw);
  } catch { /* new workspace */ }

  // Merge paos metadata
  const paos = workspace.paos || {};
  if (body.sourcePath) paos.sourcePath = body.sourcePath;
  if (body.agents) paos.agents = body.agents;
  if (body.defaultSkills) paos.defaultSkills = body.defaultSkills;
  if (body.envRefs) paos.envRefs = body.envRefs;
  if (body.pipelineTemplates) paos.pipelineTemplates = body.pipelineTemplates;
  if (body.description) paos.description = body.description;
  if (!paos.createdAt) paos.createdAt = new Date().toISOString();
  paos.updatedAt = new Date().toISOString();
  workspace.paos = paos;

  // Folders
  if (body.folders) {
    workspace.folders = body.folders.map((f: string) => ({
      path: f,
      name: f.split("/").pop(),
    }));
  } else if (!workspace.folders) {
    const sourcePath = paos.sourcePath || join(PROJ_DIR, name);
    workspace.folders = [{ path: sourcePath, name }];
  }

  await writeFile(wsPath, JSON.stringify(workspace, null, 2), "utf-8");
  return NextResponse.json({ ok: true, name, paos });
}
