import { NextResponse } from "next/server";
import { readFile, readdir, stat } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pid: string }> }
) {
  const { pid } = await params;
  const pidNum = parseInt(pid);

  if (isNaN(pidNum)) {
    return NextResponse.json({ error: "Invalid PID" }, { status: 400 });
  }

  // Check if process is alive
  try {
    process.kill(pidNum, 0); // signal 0 just checks existence
  } catch {
    return NextResponse.json({ error: `Process ${pidNum} not found` }, { status: 404 });
  }

  // Try to read output from phase directories
  // Search memory/pipelines/*/phases/*/output.log for this PID
  const { readdir } = await import("fs/promises");
  const pipelinesDir = join(MEMORY_DIR, "pipelines");
  const projectDirs = await readdir(pipelinesDir).catch(() => []);

  let output = "";
  for (const projectDir of projectDirs) {
    const projectPath = join(pipelinesDir, projectDir);
    const pipelineDirs = await readdir(projectPath).catch(() => []);
    for (const pipelineDir of pipelineDirs) {
      const pipelinePath = join(projectPath, pipelineDir);
      const phasesDir = join(pipelinePath, "phases");
      const phaseDirs = await readdir(phasesDir).catch(() => []);
      for (const phaseDir of phaseDirs) {
        const metaPath = join(phasesDir, phaseDir, "META.json");
        try {
          const meta = JSON.parse(await readFile(metaPath, "utf-8"));
          if (meta.pid === pidNum) {
            // Found it — read the output.log
            try {
              output = await readFile(join(phasesDir, phaseDir, "output.log"), "utf-8");
            } catch {
              output = "# No output captured yet\n";
            }
            return NextResponse.json({
              pid: pidNum,
              agent: meta.agent || "unknown",
              label: meta.label || meta.role || "",
              status: meta.status || "running",
              output: output.slice(-50000),
              pipelineId: pipelineDir,
              nodeId: phaseDir,
              phase: meta,
            });
          }
        } catch { /* skip */ }
      }
    }
  }

  // Fallback: process exists but no output log found
  return NextResponse.json({
    pid: pidNum,
    agent: "unknown",
    label: "",
    status: "running",
    output: "# Process is running but no output log was found\n# This may be a system process not tracked by PAOS\n",
    pipelineId: "",
    nodeId: "",
  });
}
