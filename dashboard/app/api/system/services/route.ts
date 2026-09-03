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

const KNOWN_SERVICES = [
  { name: "paos-dashboard", description: "PAOS Dashboard — Next.js dev server" },
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
    return {
      name,
      description: KNOWN_SERVICES.find((s) => s.name === name)?.description || get("Description") || name,
      status: activeState || "unknown",
      subStatus: subState || "",
      uptime: uptimeStr || "",
      pid,
      memory: mem,
      enabled,
      version: "",
    };
  } catch {
    return null;
  }
}

// Discover all systemd user services
function discoverServices(): string[] {
  const names = new Set<string>();
  try {
    const out = execSync(`systemctl --user list-units --type=service --all --no-legend 2>/dev/null`, { timeout: 5000, encoding: "utf-8" });
    for (const line of out.split("\n")) {
      const match = line.match(/^(\S+\.service)/);
      if (match) names.add(match[1]);
    }
  } catch { /* ignore */ }
  // Add known services even if not currently loaded
  for (const s of KNOWN_SERVICES) names.add(s.name);
  return Array.from(names).sort();
}

export async function GET() {
  const names = discoverServices();
  const services = names
    .map((n) => parseSystemctl(n))
    .filter(Boolean) as ServiceInfo[];
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  try {
    const { name, action } = await req.json();
    if (!name || !action) return NextResponse.json({ error: "name and action required" }, { status: 400 });
    if (!["start", "stop", "restart", "enable", "disable"].includes(action)) {
      return NextResponse.json({ error: "action must be start, stop, restart, enable, or disable" }, { status: 400 });
    }
    let output = "";
    // Enable/Disable should also start/stop immediately for visible effect
    if (action === "enable") {
      output = execSync(`systemctl --user enable "${name}" 2>&1 && systemctl --user start "${name}" 2>&1`, { timeout: 15000, encoding: "utf-8" });
    } else if (action === "disable") {
      output = execSync(`systemctl --user stop "${name}" 2>&1 && systemctl --user disable "${name}" 2>&1`, { timeout: 15000, encoding: "utf-8" });
    } else {
      output = execSync(`systemctl --user ${action} "${name}" 2>&1`, { timeout: 15000, encoding: "utf-8" });
    }
    return NextResponse.json({ ok: true, name, action, output: output.trim() });
  } catch (e: any) {
    return NextResponse.json({ error: String(e.message || e).slice(0, 500) }, { status: 500 });
  }
}
