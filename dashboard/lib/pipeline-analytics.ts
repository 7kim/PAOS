import { readFile, readdir } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const LEDGER_PATH = join(MEMORY_DIR, "global_ledger.md");
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export interface PipelineAnalytics {
  totalPipelines: number;
  completed: number;
  failed: number;
  running: number;
  pending: number;
  successRate: string;
  avgDuration: string | null;
  dailyVolume: { date: string; created: number; completed: number }[];
  byAgent: { agent: string; count: number; successRate: string }[];
  byStatus: { status: string; count: number }[];
  recentPipelines: { id: string; status: string; duration: string | null; agent: string }[];
}

async function countPipelines(): Promise<{ byStatus: Record<string, number>; byProject: Record<string, number>; recent: any[] }> {
  const result = { byStatus: {} as Record<string, number>, byProject: {} as Record<string, number>, recent: [] as any[] };
  const projects = await readdir(PIPELINES_DIR).catch(() => []);
  for (const project of projects) {
    if (project.startsWith(".")) continue;
    const dir = join(PIPELINES_DIR, project);
    const entries = await readdir(dir).catch(() => []);
    for (const entry of entries) {
      if (!entry.startsWith("PIPE-") && !entry.startsWith("TEST-")) continue;
      if (entry.endsWith(".schedule")) continue;
      try {
        const meta = JSON.parse(await readFile(join(dir, entry, "META.json"), "utf-8"));
        const status: string = meta.status || "unknown";
        result.byStatus[status] = (result.byStatus[status] || 0) + 1;
        const started = meta.submitted_at || meta.created_at;
        const completed = meta.completed_at;
        let duration: string | null = null;
        if (started && completed) {
          const diff = new Date(completed).getTime() - new Date(started).getTime();
          duration = diff < 60000 ? `${Math.round(diff / 1000)}s` : `${Math.round(diff / 60000)}m`;
        }
        result.recent.push({ id: entry, status, duration, agent: String(meta.executor || meta.planner || "?") });
      } catch { /* skip */ }
    }
  }
  result.recent.sort((a, b) => b.id.localeCompare(a.id));
  result.recent = result.recent.slice(0, 20);
  return result;
}

export async function getPipelineAnalytics(): Promise<PipelineAnalytics> {
  const pipeData = await countPipelines();
  const byStatus = pipeData.byStatus;

  const total = Object.values(byStatus).reduce((s, c) => s + c, 0);
  const completed = byStatus["completed"] || 0;
  const failed = byStatus["failed"] || 0;
  const running = byStatus["running"] || 0;
  const pending = (byStatus["pending"] || 0) + (byStatus["submitted"] || 0);
  const successRate = total > 0 ? Math.round((completed / (completed + failed || 1)) * 100) + "%" : "N/A";

  // Daily volume from recent timestamps
  const dailyMap = new Map<string, { created: number; completed: number }>();
  for (const p of pipeData.recent) {
    const day = p.id.slice(5, 15); // PIPE-DD-MM-YYYY
    if (!dailyMap.has(day)) dailyMap.set(day, { created: 0, completed: 0 });
    const d = dailyMap.get(day)!;
    d.created++;
    if (p.status === "completed") d.completed++;
  }
  const dailyVolume = Array.from(dailyMap.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // By agent
  const agentMap = new Map<string, { count: number; success: number }>();
  for (const p of pipeData.recent) {
    if (!agentMap.has(p.agent)) agentMap.set(p.agent, { count: 0, success: 0 });
    const a = agentMap.get(p.agent)!;
    a.count++;
    if (p.status === "completed") a.success++;
  }
  const byAgent = Array.from(agentMap.entries()).map(([agent, stats]) => ({
    agent,
    count: stats.count,
    successRate: stats.count > 0 ? Math.round((stats.success / stats.count) * 100) + "%" : "N/A",
  }));

  // Avg duration of completed pipelines
  const durations = pipeData.recent.filter((p) => p.duration !== null);
  const avgDuration = durations.length > 0 ? durations[Math.floor(durations.length / 2)]?.duration || null : null;

  return {
    totalPipelines: total,
    completed, failed, running, pending,
    successRate,
    avgDuration,
    dailyVolume,
    byAgent,
    byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    recentPipelines: pipeData.recent,
  };
}
