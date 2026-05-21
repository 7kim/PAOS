"use client";
import { useCallback, useEffect, useState } from "react";
import { Bot, CheckCircle2, Inbox, ListTodo, ScrollText, ShieldCheck, TriangleAlert } from "lucide-react";

interface Stats {
  tasks: number;
  plans: number;
  inboxTotal: number;
  ledgerCount: number;
  agents: number;
  healthyAgents: number;
  degradedAgents: number;
  systemStatus: string;
}

interface RecentEntry {
  timestamp: string;
  agent: string;
  action: string;
  description: string;
}

interface UnhealthyAgent {
  id: string;
  label: string;
  status: string;
  failedChecks: string[];
}

const agentColors: Record<string, string> = {
  claude: "#f97316",
  "opencode-developer": "#3b82f6",
  "opencode-plan": "#60a5fa",
  openclaw: "#8b5cf6",
  ollama: "#22c55e",
  antigravity: "#ec4899",
  dashboard: "#64748b",
};

function agentColor(agent: string) {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

function timeAgo(iso: string) {
  if (!iso) return "";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch {
    return iso;
  }
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [unhealthyAgents, setUnhealthyAgents] = useState<UnhealthyAgent[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/overview");
    const data = await res.json();
    setStats(data.stats);
    setRecent(data.recent);
    setUnhealthyAgents(data.unhealthyAgents ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 5000);
    return () => clearInterval(id);
  }, [load]);

  const cards = [
    { label: "System", value: stats?.systemStatus ?? "loading", icon: ShieldCheck, color: stats?.systemStatus === "healthy" ? "#22c55e" : "#eab308" },
    { label: "Healthy Agents", value: `${stats?.healthyAgents ?? 0}/${stats?.agents ?? 0}`, icon: Bot, color: "#10b981" },
    { label: "Ledger Entries", value: stats?.ledgerCount ?? 0, icon: ScrollText, color: "#3b82f6" },
    { label: "Inbox Messages", value: stats?.inboxTotal ?? 0, icon: Inbox, color: "#f97316" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Overview</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Live AI orchestration status — refreshes every 5s
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg p-4 border"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
              <Icon size={14} style={{ color }} />
            </div>
            <div className="text-2xl font-bold capitalize" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        <div
          className="rounded-lg border overflow-hidden"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            {unhealthyAgents.length === 0 ? (
              <CheckCircle2 size={15} style={{ color: "#22c55e" }} />
            ) : (
              <TriangleAlert size={15} style={{ color: "#eab308" }} />
            )}
            <span className="text-sm font-medium">Agent Health</span>
            <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>
              {stats?.degradedAgents ?? 0} degraded
            </span>
          </div>
          <div className="p-4">
            {unhealthyAgents.length === 0 ? (
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                All registered agents pass binary, config, MCP, identity, inbox, and log checks.
              </div>
            ) : (
              <div className="space-y-3">
                {unhealthyAgents.map((agent) => (
                  <div key={agent.id} className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{agent.label}</span>
                      <span className="text-xs font-mono ml-auto" style={{ color: "#eab308" }}>{agent.status}</span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      Failed checks: {agent.failedChecks.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className="rounded-lg border overflow-hidden"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm font-medium">Recent Activity</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recent.length === 0 && (
              <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>
                No activity yet
              </div>
            )}
            {recent.map((entry, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: agentColor(entry.agent) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium" style={{ color: agentColor(entry.agent) }}>
                      {entry.agent}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}
                    >
                      {entry.action}
                    </span>
                    <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>
                      {timeAgo(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5 truncate" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
        {[
          { label: "Tasks", value: stats?.tasks ?? 0, icon: ListTodo, color: "#22c55e" },
          { label: "Plans", value: stats?.plans ?? 0, icon: ScrollText, color: "#a855f7" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg p-4 border"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
              <Icon size={14} style={{ color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
