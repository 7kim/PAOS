import { NextResponse } from "next/server";
import { execSync, execFileSync } from "child_process";
import { readFileSync, readlinkSync } from "fs";
import { registry } from "@/lib/process-registry";

// ponytail: heuristic category, per-pid net via eBPF/Nethogs when profiling demands; global lock not needed (single-read /proc)

function enrichPid(pid: number, base: any) {
  let app = base.app || "";
  let cwd = "";
  let memMB: number | null = null;
  let ioReadMB: number | null = null;
  let ioWriteMB: number | null = null;
  let gpuMB: number | null = null;

  // app name via /proc/pid/comm
  if (!app) {
    try { app = readFileSync(`/proc/${pid}/comm`, "utf-8").trim(); } catch {
      try { app = execSync(`ps -p ${pid} -o comm= 2>/dev/null`, { timeout: 1000, encoding: "utf-8" }).trim(); } catch { /* ignore */ }
    }
  }
  // cwd
  try { cwd = readlinkSync(`/proc/${pid}/cwd`); } catch { /* ignore */ }

  // mem via VmRSS
  try {
    const status = readFileSync(`/proc/${pid}/status`, "utf-8");
    const m = status.match(/VmRSS:\s+(\d+)\s+kB/);
    if (m) memMB = Math.round(parseInt(m[1]) / 1024);
  } catch { /* ignore */ }

  // io
  try {
    const io = readFileSync(`/proc/${pid}/io`, "utf-8");
    const r = io.match(/read_bytes:\s+(\d+)/);
    const w = io.match(/write_bytes:\s+(\d+)/);
    if (r) ioReadMB = Math.round(parseInt(r[1]) / (1024 * 1024));
    if (w) ioWriteMB = Math.round(parseInt(w[1]) / (1024 * 1024));
  } catch { /* ignore */ }

  // category heuristic
  const cpuNum = parseFloat(base.cpu || "0");
  const memNum = parseFloat(base.mem || "0");
  let category: string = "idle";
  if (cpuNum > 50) category = "cpu";
  else if (memMB !== null && memMB > 500) category = "memory";
  else if (ioReadMB !== null && (ioReadMB + (ioWriteMB || 0)) > 100) category = "io";
  else if (memNum > 2) category = "memory";
  // network: check if has tcp sockets via /proc/net/tcp count (global not per-pid) — skip, show n/a unless ss shows pid has connection
  // gpu: filled in batch below

  return { ...base, app: app || base.agent || "unknown", cwd, memMB, ioReadMB, ioWriteMB, category, gpuMB };
}

// GET /api/terminals — list all tracked terminal sessions with enrichment
export async function GET() {
  const procs: any[] = registry.getAll();

  // Also scan /proc for all running processes
  try {
    const ps = execSync("ps aux --sort=-%cpu 2>/dev/null | head -80", { timeout: 3000, encoding: "utf-8" });
    const lines = ps.split("\n").slice(1);
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 11) continue;
      const pid = parseInt(parts[1]);
      const cpu = parts[2];
      const mem = parts[3];
      const cmd = parts.slice(10).join(" ");
      if (!pid || isNaN(pid)) continue;
      if (procs.find((p) => p.pid === pid)) continue;
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
        cmd: cmd.slice(0, 300),
        cpu,
        mem,
      });
    }
  } catch { /* ps failed */ }

  // Batch GPU map via nvidia-smi (optional)
  const gpuMap = new Map<number, number>();
  try {
    const out = execSync("nvidia-smi --query-compute-apps=pid,used_memory --format=csv,noheader,nounits 2>/dev/null", { timeout: 2000, encoding: "utf-8" });
    for (const line of out.split("\n")) {
      const [pidStr, memStr] = line.split(",").map((s) => s.trim());
      const pid = parseInt(pidStr); const mem = parseInt(memStr);
      if (!isNaN(pid) && !isNaN(mem)) gpuMap.set(pid, mem);
    }
  } catch { /* no gpu */ }

  // Enrich each
  const enriched = procs.map((p) => {
    const e = enrichPid(p.pid, p);
    if (gpuMap.has(p.pid)) e.gpuMB = gpuMap.get(p.pid)!;
    // network hint: if cmd contains network-y terms, tag network, else keep category
    // lightweight ss check for this pid (only if not idle and we have time)
    // skip heavy ss per-pid — ponytail: skip live per-pid net bytes
    return e;
  });

  // Sort: running first, then cpu desc
  enriched.sort((a, b) => parseFloat(b.cpu || "0") - parseFloat(a.cpu || "0"));

  return NextResponse.json({ terminals: enriched });
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
