import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { agentHealth, readRegistry, repoPath } from "@/lib/paos";

import { MEMORY_DIR } from "@/lib/global-config";

async function recentLog(logPath: string) {
  const raw = await readFile(repoPath(logPath), "utf-8").catch(() => "");
  const lines = raw.split("\n").filter(Boolean);
  return lines[lines.length - 1] ?? "";
}

// Parse global ledger and return the most recent timestamp for each agent
async function ledgerLastActivity(): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  try {
    const raw = await readFile(join(MEMORY_DIR, "global_ledger.md"), "utf-8");
    for (const line of raw.split("\n")) {
      if (!line.startsWith("|")) continue;
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length < 2) continue;
      const ts = cells[0];
      const agent = cells[1];
      if (!ts || !agent || ts.toLowerCase().includes("timestamp") || ts.includes("---")) continue;
      // Normalise timestamp to ISO
      const parsed = new Date(ts.replace(" ", "T").replace(/(\d{2}:\d{2}:\d{2})$/, "$1Z"));
      if (isNaN(parsed.getTime())) continue;
      const iso = parsed.toISOString();
      const existing = result.get(agent);
      if (!existing || iso > existing) result.set(agent, iso);
    }
  } catch { /* no ledger */ }
  return result;
}

export async function GET() {
  const [registry, ledgerActivity] = await Promise.all([readRegistry(), ledgerLastActivity()]);
  const agents = await Promise.all(
    registry.agents.map(async (agent) => ({
      ...agent,
      ...(await agentHealth(agent, registry)),
      inbox: await readdir(repoPath(agent.inbox)).then((files) => files.filter((file) => file.endsWith(".md")).length).catch(() => 0),
      lastActivity: ledgerActivity.get(agent.id) ?? null,
      recentLog: await recentLog(agent.log),
    }))
  );
  return NextResponse.json({ agents });
}
