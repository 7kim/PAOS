import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { registry } from "@/lib/process-registry";

// GET /api/terminals — list all tracked terminal sessions
export async function GET() {
  const procs: any[] = registry.getAll();
  
  // Also scan /proc for all running processes
  try {
    const ps = execSync("ps aux --sort=-%cpu 2>/dev/null | head -50", { timeout: 3000, encoding: "utf-8" });
    const lines = ps.split("\n").slice(1);
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 11) continue;
      const pid = parseInt(parts[1]);
      const cpu = parts[2];
      const mem = parts[3];
      const cmd = parts.slice(10).join(" ");
      if (!pid || isNaN(pid)) continue;
      if (procs.find(p => p.pid === pid)) continue;
      procs.push({
        id: `ps_${pid}`,
        pid,
        agent: "system",
        label: cmd.slice(0, 60),
        startTime: "",
        pipelineId: "",
        nodeId: "",
        output: [],
        status: "running",
        cmd: cmd.slice(0, 200),
        cpu,
        mem,
      });
    }
  } catch { /* ps failed */ }

  return NextResponse.json({ terminals: procs });
}

// POST /api/terminals — send input to a process
export async function POST(req: Request) {
  const body = await req.json();
  const { pid, action } = body;

  if (action === "kill") {
    try {
      process.kill(pid, "SIGTERM");
      setTimeout(() => {
        try { process.kill(pid, "SIGKILL"); } catch { /* already dead */ }
      }, 5000);
      return NextResponse.json({ ok: true, message: `Sent SIGTERM to PID ${pid}` });
    } catch (e: any) {
      return NextResponse.json({ error: `Failed to kill PID ${pid}: ${e.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
