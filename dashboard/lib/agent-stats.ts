import { readFile, readdir } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const LEDGER_PATH = join(MEMORY_DIR, "global_ledger.md");

export interface AgentStats {
  totalActions: number;
  pipelinesRun: number;
  tasksCompleted: number;
  successRate: string;
  lastActive: string | null;
  dailyActivity: { date: string; actions: number }[];
  actionsByType: Record<string, number>;
}

export interface StatsResult {
  agents: Record<string, AgentStats>;
  totalActions: number;
  period: { from: string; to: string };
}

/** Parse a ledger row. */
function parseRow(line: string): { timestamp: string; agent: string; action: string; task: string; file: string; description: string } | null {
  if (!line.startsWith("|") || line.includes("---") || line.includes("Timestamp")) return null;
  const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
  if (cells.length < 3) return null;
  return {
    timestamp: cells[0] || "",
    agent: cells[1] || "",
    action: cells[2] || "",
    file: cells[3] || "",
    description: cells[4] || "",
    task: cells[5] || "",
  };
}

/** Compute agent stats from the global ledger. */
export async function getAgentStats(): Promise<StatsResult> {
  const raw = await readFile(LEDGER_PATH, "utf-8").catch(() => "");
  const rows = raw.split("\n").map(parseRow).filter((r): r is NonNullable<typeof r> => r !== null);

  const agentMap = new Map<string, { actions: typeof rows; }>();
  for (const row of rows) {
    if (!agentMap.has(row.agent)) agentMap.set(row.agent, { actions: [] });
    agentMap.get(row.agent)!.actions.push(row);
  }

  const result: StatsResult = {
    agents: {},
    totalActions: rows.length,
    period: { from: rows.length > 0 ? rows[rows.length - 1].timestamp : "", to: rows.length > 0 ? rows[0].timestamp : "" },
  };

  for (const [agentId, data] of agentMap) {
    const actions = data.actions;
    const total = actions.length;
    const pipelinesRun = actions.filter((a) => a.task.startsWith("PIPE-") || a.description.toLowerCase().includes("pipeline")).length;
    const tasksCompleted = actions.filter((a) => a.action === "COMMIT" || a.action === "UPDATE").length;
    const failed = actions.filter((a) => a.description.toLowerCase().includes("fail") || a.description.toLowerCase().includes("error")).length;
    const successRate = total > 0 ? Math.round(((total - failed) / total) * 100) + "%" : "N/A";

    // Daily activity
    const dailyMap = new Map<string, number>();
    for (const a of actions) {
      const day = a.timestamp.slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
    }
    const dailyActivity = Array.from(dailyMap.entries())
      .map(([date, actions]) => ({ date, actions }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Actions by type
    const actionsByType: Record<string, number> = {};
    for (const a of actions) {
      actionsByType[a.action] = (actionsByType[a.action] || 0) + 1;
    }

    result.agents[agentId] = {
      totalActions: total,
      pipelinesRun,
      tasksCompleted,
      successRate,
      lastActive: actions[0]?.timestamp || null,
      dailyActivity,
      actionsByType,
    };
  }

  return result;
}
