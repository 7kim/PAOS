import { NextResponse } from "next/server";
import { execSync } from "child_process";

// GET /api/docker — list running Docker containers
export async function GET() {
  try {
    const out = execSync(
      "docker ps -a --format '{{json .}}' 2>/dev/null",
      { timeout: 5000, encoding: "utf-8" }
    );
    const containers: any[] = [];
    for (const line of out.split("\n").filter(Boolean)) {
      try {
        const c = JSON.parse(line);
        containers.push({
          id: c.ID || c.Id || "",
          name: c.Names || c.Name || "",
          image: c.Image || "",
          status: c.Status || c.State || "",
          state: c.State || "",
          ports: c.Ports || "",
          created: c.CreatedAt || c.Created || "",
          cpu: c.CPUPerc || "",
          mem: c.MemUsage || "",
          memPerc: c.MemPerc || "",
          netIO: c.NetIO || "",
          blockIO: c.BlockIO || "",
          command: c.Command || "",
          mounts: c.Mounts || "",
          size: c.Size || "",
        });
      } catch { /* skip malformed line */ }
    }
    return NextResponse.json({ containers });
  } catch (e: any) {
    return NextResponse.json({ containers: [], error: String(e.message || e).slice(0, 200) });
  }
}

// POST /api/docker — container actions (start/stop/restart/logs/rm/kill)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, action, tail } = body;
    if (!id || !action) {
      return NextResponse.json({ error: "id and action required" }, { status: 400 });
    }

    // logs action — return logs string
    if (action === "logs") {
      const n = tail || 100;
      try {
        const out = execSync(`docker logs --tail ${n} "${id}" 2>&1`, { timeout: 5000, encoding: "utf-8" });
        return NextResponse.json({ ok: true, id, logs: out });
      } catch (e: any) {
        return NextResponse.json({ error: String(e.message || e).slice(0, 500) }, { status: 500 });
      }
    }

    const validActions = ["start", "stop", "restart", "pause", "unpause", "kill", "rm"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `action must be one of: ${validActions.join(", ")}` }, { status: 400 });
    }
    const out = execSync(`docker ${action} "${id}" 2>&1`, { timeout: 15000, encoding: "utf-8" });
    return NextResponse.json({ ok: true, id, action, output: out.trim() });
  } catch (e: any) {
    return NextResponse.json({ error: String(e.message || e).slice(0, 500) }, { status: 500 });
  }
}
