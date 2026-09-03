import { NextResponse } from "next/server";
import { execSync } from "child_process";

// GET /api/node-processes — list all Node.js processes with details
export async function GET() {
  try {
    const out = execSync(
      "ps aux | grep -E 'node|npm|next' | grep -v grep 2>/dev/null",
      { timeout: 5000, encoding: "utf-8" }
    );
    const processes: any[] = [];
    for (const line of out.split("\n").filter(Boolean)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 11) continue;
      const pid = parseInt(parts[1]);
      const cpu = parts[2];
      const mem = parts[3];
      const vsz = parseInt(parts[4]); // virtual memory in KB
      const rss = parseInt(parts[5]); // resident set size in KB
      const tty = parts[6];
      const stat = parts[7];
      const start = parts[8];
      const time = parts[9];
      const cmd = parts.slice(10).join(" ");

      // Get additional process info
      let cwd = "";
      let ppid: number | null = null;
      try {
        const procInfo = execSync(`cat /proc/${pid}/status 2>/dev/null | grep -E 'PPid|Name'`, { timeout: 1000, encoding: "utf-8" });
        const ppidMatch = procInfo.match(/PPid:\s+(\d+)/);
        if (ppidMatch) ppid = parseInt(ppidMatch[1]);
      } catch { /* ignore */ }

      try {
        cwd = execSync(`readlink /proc/${pid}/cwd 2>/dev/null`, { timeout: 1000, encoding: "utf-8" }).trim();
      } catch { /* ignore */ }

      // Determine process type
      let type = "node";
      if (cmd.includes("next") || cmd.includes("next-server")) type = "next";
      else if (cmd.includes("npm")) type = "npm";
      else if (cmd.includes("npx")) type = "npx";
      else if (cmd.includes("ts-node")) type = "ts-node";
      else if (cmd.includes("nodemon")) type = "nodemon";
      else if (cmd.includes("pm2")) type = "pm2";
      else if (cmd.includes("webpack")) type = "webpack";
      else if (cmd.includes("vite")) type = "vite";
      else if (cmd.includes("esbuild")) type = "esbuild";
      else if (cmd.includes("tsc")) type = "tsc";

      processes.push({
        pid,
        ppid,
        cpu,
        mem,
        vszKB: vsz,
        rssKB: rss,
        rssMB: Math.round(rss / 1024),
        vszMB: Math.round(vsz / 1024),
        tty,
        stat,
        start,
        time,
        cmd: cmd.slice(0, 300),
        cwd,
        type,
        user: parts[0],
      });
    }

    // Sort by CPU descending
    processes.sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu));

    return NextResponse.json({ processes });
  } catch (e: any) {
    return NextResponse.json({ processes: [], error: String(e.message || e).slice(0, 200) });
  }
}

// POST /api/node-processes — kill a process
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pid, action } = body;
    if (!pid || !action) {
      return NextResponse.json({ error: "pid and action required" }, { status: 400 });
    }
    if (action === "kill") {
      execSync(`kill -9 ${pid} 2>&1`, { timeout: 5000, encoding: "utf-8" });
      return NextResponse.json({ ok: true, pid, action: "kill" });
    }
    if (action === "term") {
      execSync(`kill -15 ${pid} 2>&1`, { timeout: 5000, encoding: "utf-8" });
      return NextResponse.json({ ok: true, pid, action: "term" });
    }
    return NextResponse.json({ error: "action must be kill or term" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e.message || e).slice(0, 500) }, { status: 500 });
  }
}
