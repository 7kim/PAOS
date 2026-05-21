import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { systemDoctor } from "@/lib/paos";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";

async function countFiles(dir: string, ext = ".md"): Promise<number> {
  const files = await readdir(dir).catch(() => []);
  return files.filter((f) => f.endsWith(ext)).length;
}

async function countInbox(): Promise<number> {
  const inboxDir = join(MEMORY_DIR, "inbox");
  const agentDirs = await readdir(inboxDir).catch(() => []);
  let total = 0;
  for (const d of agentDirs) {
    const files = await readdir(join(inboxDir, d)).catch(() => []);
    total += files.filter((f) => f.endsWith(".md")).length;
  }
  return total;
}

async function getLedgerEntryCount(): Promise<number> {
  try {
    const raw = await readFile(join(MEMORY_DIR, "global_ledger.md"), "utf-8");
    return raw.split("\n").filter((l) => l.startsWith("|") && !l.includes("---") && !l.includes("Timestamp")).length;
  } catch {
    return 0;
  }
}

async function getRecentLedgerEntries(n = 5) {
  try {
    const raw = await readFile(join(MEMORY_DIR, "global_ledger.md"), "utf-8");
    const rows = raw.split("\n")
      .filter((l) => l.startsWith("|") && !l.includes("---") && !l.includes("Timestamp"))
      .slice(-n)
      .reverse()
      .map((line) => {
        const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
        return {
          timestamp: cells[0] ?? "",
          agent: cells[1] ?? "",
          action: cells[2] ?? "",
          description: cells[4] ?? "",
        };
      });
    return rows;
  } catch {
    return [];
  }
}

export async function GET() {
  const [tasks, plans, inboxTotal, ledgerCount, recent, doctor] = await Promise.all([
    countFiles(join(MEMORY_DIR, "tasks")),
    countFiles(join(MEMORY_DIR, "pm-logs")),
    countInbox(),
    getLedgerEntryCount(),
    getRecentLedgerEntries(5),
    systemDoctor(),
  ]);

  const unhealthy = doctor.agents.filter((agent) => agent.status !== "healthy");

  return NextResponse.json({
    stats: {
      tasks,
      plans,
      inboxTotal,
      ledgerCount,
      agents: doctor.agents.length,
      healthyAgents: doctor.agents.length - unhealthy.length,
      degradedAgents: unhealthy.length,
      systemStatus: doctor.status,
    },
    recent,
    unhealthyAgents: unhealthy.map((agent) => ({
      id: agent.id,
      label: agent.label,
      status: agent.status,
      failedChecks: agent.checks.filter((check) => !check.ok).map((check) => check.name),
    })),
  });
}
