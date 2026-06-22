"use client";
import { useCallback, useEffect, useState } from "react";
import { Bot, CheckCircle2, Inbox, ListTodo, ScrollText, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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
  file?: string;
  task?: string;
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

import { formatTime } from "@/lib/settings";

function timeAgo(iso: string) {
  return formatTime(iso);
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [unhealthyAgents, setUnhealthyAgents] = useState<UnhealthyAgent[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<RecentEntry | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/overview");
    const data = await res.json();
    setStats(data.stats);
    setRecent(data.recent);
    setUnhealthyAgents(data.unhealthyAgents ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [load]);

  const cards = [
    { label: "System", value: stats?.systemStatus ?? "loading", icon: ShieldCheck, color: stats?.systemStatus === "healthy" ? "var(--green)" : "var(--accent)" },
    { label: "Healthy Agents", value: `${stats?.healthyAgents ?? 0}/${stats?.agents ?? 0}`, icon: Bot, color: "var(--green)" },
    { label: "Ledger Entries", value: stats?.ledgerCount ?? 0, icon: ScrollText, color: "var(--accent)" },
    { label: "Inbox Messages", value: stats?.inboxTotal ?? 0, icon: Inbox, color: "var(--orange)" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Overview</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Live AI orchestration status — refreshes every 5s
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon size={14} style={{ color }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono capitalize" style={{ color }}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            {unhealthyAgents.length === 0 ? (
              <CheckCircle2 size={15} style={{ color: "var(--green)" }} />
            ) : (
              <TriangleAlert size={15} style={{ color: "var(--accent)" }} />
            )}
            <CardTitle className="text-sm font-medium">Agent Health</CardTitle>
            <span className="text-xs text-muted-foreground ml-auto">
              {stats?.degradedAgents ?? 0} degraded
            </span>
          </CardHeader>
          <CardContent>
            {unhealthyAgents.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                All registered agents pass binary, config, MCP, identity, inbox, and log checks.
              </div>
            ) : (
              <div className="space-y-3">
                {unhealthyAgents.map((agent) => (
                  <div key={agent.id} className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{agent.label}</span>
                      <span className="text-xs font-mono ml-auto" style={{ color: "var(--accent)" }}>{agent.status}</span>
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground">
                      Failed checks: {agent.failedChecks.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <span className="text-xs text-muted-foreground">click to expand</span>
          </CardHeader>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No activity yet
              </div>
            ) : (
              <div className="divide-y">
                {recent.map((entry, i) => {
                  const isSelected = selectedEntry?.timestamp === entry.timestamp && selectedEntry?.description === entry.description;
                  return (
                    <div key={i}>
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(isSelected ? null : entry)}
                        className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors"
                        style={{ background: isSelected ? "rgba(252,213,53,0.05)" : undefined }}
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: agentColor(entry.agent) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium" style={{ color: agentColor(entry.agent) }}>
                              {entry.agent}
                            </span>
                            <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {timeAgo(entry.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-0.5 truncate text-foreground/80">
                            {entry.description}
                          </p>
                        </div>
                      </button>
                      {isSelected && (
                        <div
                          className="px-4 pb-4 pt-2 border-t"
                          style={{ background: "rgba(252,213,53,0.03)" }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Detail</span>
                            <button
                              type="button"
                              title="Close"
                              onClick={() => setSelectedEntry(null)}
                              className="p-0.5 rounded text-muted-foreground"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-muted-foreground">Timestamp </span>
                              <span className="font-mono">{entry.timestamp}</span>
                            </div>
                            {entry.task && (
                              <div>
                                <span className="text-muted-foreground">Task </span>
                                <span className="font-mono">{entry.task}</span>
                              </div>
                            )}
                          </div>
                          {entry.file && (
                            <div className="text-xs mb-2">
                              <span className="text-muted-foreground">File </span>
                              <span className="font-mono break-all">{entry.file}</span>
                            </div>
                          )}
                          <div className="text-sm leading-relaxed break-words">{entry.description}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
        {[
          { label: "Tasks", value: stats?.tasks ?? 0, icon: ListTodo, color: "var(--green)" },
          { label: "Plans", value: stats?.plans ?? 0, icon: ScrollText, color: "var(--purple)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon size={14} style={{ color }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono" style={{ color }}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
