"use client";
import { useEffect, useState } from "react";
import { ScrollText, ListTodo, FileText, Inbox } from "lucide-react";

interface Stats {
  tasks: number;
  plans: number;
  inboxTotal: number;
  ledgerCount: number;
}

interface RecentEntry {
  timestamp: string;
  agent: string;
  action: string;
  description: string;
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

  async function load() {
    const res = await fetch("/api/overview");
    const data = await res.json();
    setStats(data.stats);
    setRecent(data.recent);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const cards = [
    { label: "Ledger Entries", value: stats?.ledgerCount ?? 0, icon: ScrollText, color: "#3b82f6" },
    { label: "Tasks", value: stats?.tasks ?? 0, icon: ListTodo, color: "#22c55e" },
    { label: "Plans", value: stats?.plans ?? 0, icon: FileText, color: "#a855f7" },
    { label: "Inbox Messages", value: stats?.inboxTotal ?? 0, icon: Inbox, color: "#f97316" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Overview</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Live AI orchestration status — refreshes every 5s
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
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
            <div className="text-3xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
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
  );
}
