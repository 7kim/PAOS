import { NextResponse } from "next/server";
import { readFile, readdir, writeFile } from "fs/promises";
import { join } from "path";

const BENCHMARKS_DIR = process.env.BENCHMARKS_DIR || "/home/dev/AI_Workflow/benchmarks";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; n: string }> }
) {
  const { id, n } = await params;
  const body = await req.json().catch(() => ({}));
  const project = body.project || "PAOS";

  const padN = String(parseInt(n)).padStart(2, "0");
  const gapsDir = join(BENCHMARKS_DIR, id, "gaps");

  // Find the gap file
  const gapFiles = await readdir(gapsDir).catch(() => []);
  const gapFile = gapFiles.find(f => f.startsWith(`gap-${padN}-`) || f.startsWith(`gap-${parseInt(n)}-`));
  if (!gapFile) {
    return NextResponse.json({ error: `Gap ${n} not found in benchmark ${id}` }, { status: 404 });
  }

  const content = await readFile(join(gapsDir, gapFile), "utf-8");

  // Parse gap metadata
  const titleMatch = content.match(/^# Gap \d+: (.+)$/m);
  const severityMatch = content.match(/\*\*Severity:\*\*\s*(.+)/);
  const fixMatch = content.match(/## The Fix\n([\s\S]*?)(?=\n## |$)/);
  const gapTitle = titleMatch ? titleMatch[1].trim() : `Gap ${n}`;
  const severity = severityMatch ? severityMatch[1].trim() : "Medium";
  const fixSnippet = fixMatch ? fixMatch[1].trim() : "Implement the fix described in the gap file.";

  // Error message for small gaps
  const isSmallGap = content.includes("5 minutes") || content.includes("10 minutes");
  if (isSmallGap) {
    return NextResponse.json({
      ok: true,
      message: `Gap ${n} (${gapTitle}) is a small gap (under 10 min). The gap file already has the exact fix code. Direct implementation recommended.`,
      gapTitle,
      severity,
      small: true,
      fixSnippet,
      gapFile: gapFile,
      estimatedEffort: "5-10 minutes",
    });
  }

  // Generate a pipeline layout for medium/large gaps
  const rootDir = process.env.PAOS_ROOT || "/home/dev/AI_Workflow";

  const nodes = [
    {
      id: "n1",
      type: "agentNode",
      position: { x: 250, y: 50 },
      data: {
        label: `Analyze: ${gapTitle}`,
        agentId: "hermes-nous",
        prompt: `You are implementing a fix for a benchmark gap.\n\nBenchmark: ${id}\nGap ${n}: ${gapTitle}\nSeverity: ${severity}\n\nRead the following files and analyze the codebase to understand what needs to change:\n- gaps.md (all gaps)\n- SRS-to-be.md (target requirements)\n- implementation.md (full implementation spec)\n\nThe gap file contains: ${fixSnippet.slice(0, 500)}`,
        selectedSkills: ["codebase-inspection"],
        selectedMcps: [],
        fileRefs: [
          { path: `benchmarks/${id}/gaps.md`, type: "file", name: "gaps.md" },
          { path: `benchmarks/${id}/SRS-to-be.md`, type: "file", name: "SRS-to-be.md" },
          { path: `benchmarks/${id}/implementation.md`, type: "file", name: "implementation.md" },
          { path: `benchmarks/${id}/gaps/${gapFile}`, type: "file", name: gapFile },
        ],
        nodeColor: "#8b5cf6",
      },
    },
    {
      id: "n2",
      type: "agentNode",
      position: { x: 250, y: 250 },
      data: {
        label: `Implement: ${gapTitle}`,
        agentId: "opencode-developer",
        prompt: `Implement the fix for Gap ${n}: ${gapTitle}\n\nRead the analysis from the previous phase, then implement the fix described in:\n- ${gapFile}\n- SRS-to-be.md (target state requirements)\n\nAfter implementing, update the gap status file to mark it as "In Progress" or "Fixed".`,
        selectedSkills: [],
        selectedMcps: [],
        fileRefs: [
          { path: `benchmarks/${id}/gaps/${gapFile}`, type: "file", name: gapFile },
          { path: `benchmarks/${id}/SRS-to-be.md`, type: "file", name: "SRS-to-be.md" },
        ],
        nodeColor: "#3b82f6",
      },
    },
    ...(severity === "Critical" || severity === "High" ? [{
      id: "n3",
      type: "agentNode",
      position: { x: 250, y: 450 },
      data: {
        label: `Review: ${gapTitle}`,
        agentId: "hermes-nous",
        prompt: `Review the implementation for Gap ${n}: ${gapTitle}\n\nVerify that the fix meets the acceptance criteria in the gap file. Update the gap status to "Fixed" if all criteria are met, or document what still needs work.`,
        selectedSkills: [],
        selectedMcps: [],
        fileRefs: [{ path: `benchmarks/${id}/gaps/${gapFile}`, type: "file", name: gapFile }],
        nodeColor: "#22c55e",
      },
    }] : []),
  ];

  const edges = [
    { id: "e1-2", source: "n1", target: "n2", type: "smoothstep", animated: true },
    ...(severity === "Critical" || severity === "High"
      ? [{ id: "e2-3", source: "n2", target: "n3", type: "smoothstep", animated: true }]
      : []),
  ];

  const layout = { nodes, edges };
  const layoutJson = JSON.stringify(layout, null, 2);

  // Save as a temporary layout that the builder can load
  const tmpLayoutPath = join("/tmp", `benchmark-gap-${id}-${n}.json`);
  await writeFile(tmpLayoutPath, layoutJson, "utf-8");

  return NextResponse.json({
    ok: true,
    message: `Pipeline created for Gap ${n}: ${gapTitle}`,
    gapTitle,
    severity,
    nodes: nodes.length,
    layout,
    builderUrl: `/pipelines/builder?load-gap=${encodeURIComponent(id)}&gap=${n}`,
  });
}
