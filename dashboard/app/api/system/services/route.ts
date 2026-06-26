import { NextResponse } from "next/server";
import { execSync } from "child_process";

interface ServiceInfo {
  name: string;
  description: string;
  status: string;
  subStatus: string;
  uptime: string;
  pid: number | null;
  memory: string;
  enabled: boolean;
  version: string;
}

const SERVICES = [
  { name: "paos-pipeline", description: "PAOS Pipeline Watcher" },
  { name: "paos-pipeline-handler", description: "PAOS Pipeline Handler" },
  { name: "paos-telegram-bot", description: "PAOS Telegram Bot" },
];

function parseSystemctl(name: string): ServiceInfo | null {
  try {
    const out = execSync(`systemctl --user show "${name}" 2>/dev/null`, {
      timeout: 5000, encoding: "utf-8",
    });
    const get = (key: string) => out.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1] || "";
    const activeState = get("ActiveState");
    const subState = get("SubState");
    const pid = parseInt(get("MainPID")) || null;
    const enabled = get("UnitFileState") === "enabled";
    const uptimeStr = pid ? execSync(`ps -o etime= -p ${pid} 2>/dev/null`, { timeout: 3000, encoding: "utf-8" }).trim() : "";
    const memStr = pid ? execSync(`ps -o rss= -p ${pid} 2>/dev/null`, { timeout: 3000, encoding: "utf-8" }).trim() : "";
    const mem = memStr ? `${Math.round(parseInt(memStr) / 1024)}M` : "";
    let version = "";
    if (name === "paos-telegram-bot") {
      try {
        version = execSync("head -1 /home/dev/AI_Workflow/bin/paos-telegram-bot.py 2>/dev/null", { timeout: 3000, encoding: "utf-8" }).trim();
      } catch { /* ignore */ }
    }
    return {
      name,
      description: SERVICES.find((s) => s.name === name)?.description || "",
      status: activeState || "unknown",
      subStatus: subState || "",
      uptime: uptimeStr || "",
      pid,
      memory: mem,
      enabled,
      version,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const services = SERVICES.map((s) => parseSystemctl(s.name)).filter(Boolean) as ServiceInfo[];
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  try {
    const { name, action } = await req.json();
    if (!name || !action) {
      return NextResponse.json({ error: "Provide name and action (start/stop/restart)" }, { status: 400 });
    }
    if (!["start", "stop", "restart"].includes(action)) {
      return NextResponse.json({ error: "Action must be start, stop, or restart" }, { status: 400 });
    }
    execSync(`systemctl --user ${action} "${name}" 2>&1`, { timeout: 15000, encoding: "utf-8" });
    return NextResponse.json({ ok: true, name, action });
  } catch (e: any) {
    return NextResponse.json({ error: String(e.message || e).slice(0, 200) }, { status: 500 });
  }
}
