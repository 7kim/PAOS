import { NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";
import { spawn } from "child_process";
import { MEMORY_DIR } from "@/lib/global-config";
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

    const phasesDir = join(dir, "phases", nodeId);
    const implPath = join(phasesDir, "IMPLEMENTATION.md");

    // Verify the phase exists
    try {
      await readFile(implPath, "utf-8");
    } catch {
      return NextResponse.json({ error: "Phase not found" }, { status: 404 });
    }

    // Update flow status: reset to running
    const flowRaw = await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}");
    const flow = JSON.parse(flowRaw);
    if (flow.phases?.[nodeId]) {
      flow.phases[nodeId].status = "running";
      flow.phases[nodeId].pid = null;
      flow.phases[nodeId].startedAt = new Date().toISOString();
      flow.phases[nodeId].completedAt = null;
      flow.phases[nodeId].retryCount = (flow.phases[nodeId].retryCount || 0) + 1;
      await writeFile(join(dir, "pipeline-flow.json"), JSON.stringify(flow, null, 2));
    }

    // Spawn the agent
    const cmd = `cd ${phasesDir} && cat IMPLEMENTATION.md | opencode run 2>&1 & echo $!`;
    const proc = spawn("bash", ["-c", cmd], {
      cwd: phasesDir,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    const pid = proc.pid || 0;

    // Update PID
    const flowNow = JSON.parse(await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}"));
    if (flowNow.phases?.[nodeId]) {
      flowNow.phases[nodeId].pid = pid;
      await writeFile(join(dir, "pipeline-flow.json"), JSON.stringify(flowNow, null, 2));
    }

    // Capture output
    let output = "";
    proc.stdout?.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    proc.stderr?.on("data", (chunk: Buffer) => { output += chunk.toString(); });

    proc.on("close", async (code) => {
      await writeFile(join(phasesDir, "output.log"), output);
      const flowEnd = JSON.parse(await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}"));
      if (flowEnd.phases?.[nodeId]) {
        flowEnd.phases[nodeId].status = code === 0 ? "completed" : "failed";
        flowEnd.phases[nodeId].completedAt = new Date().toISOString();
        flowEnd.phases[nodeId].pid = null;
        await writeFile(join(dir, "pipeline-flow.json"), JSON.stringify(flowEnd, null, 2));
      }
    });

    return NextResponse.json({ ok: true, pid, message: `Retry started for ${nodeId} (PID ${pid})` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
