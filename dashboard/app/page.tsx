"use client";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle, CheckCircle2, Inbox, ListTodo, ScrollText,
  Bot, Activity, FolderKanban, ExternalLink,
  TrendingUp, TrendingDown, Minus, RefreshCw, ShieldCheck, X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Stats {
  tasks: number; plans: number; inboxTotal: number; ledgerCount: number;
  agents: number; healthyAgents: number; degradedAgents: number; systemStatus: string;
}

interface RecentEntry {
  timestamp: string; agent: string; action: string; description: string;
  file?: string; task?: string;
}

interface UnhealthyAgent {
  id: string; label: string; status: string; failedChecks: string[];
}

const agentColors: Record<string, string> = {
  claude: "#f97316", "opencode-developer": "#3b82f6", "opencode-plan": "#60a5fa",
  openclaw: "#8b5cf6", ollama: "#22c55e", antigravity: "#ec4899", dashboard: "#64748b",
  hermes: "#f0b90b",
};

function agentColor(agent: string) {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

import { formatTime } from "@/lib/settings";
function timeAgo(iso: string) { return formatTime(iso); }

// ── KPI Card (from 21st.dev inspiration, adapted for PAOS theme) ──
type Tone = "default" | "primary" | "success" | "warning" | "danger";
type Trend = "up" | "down" | "flat";

function KpiCard({
  label, value, delta, trend = "flat", caption, icon, tone = "default",
  className,
}: {
  label: string; value: string | number; delta?: string; trend?: Trend;
  caption?: string; icon?: React.ReactNode; tone?: Tone; className?: string;
}) {
  const toneStyles: Record<Tone, { bg: string; value: string; iconBg: string }> = {
    default:   { bg: "", value: "text-foreground", iconBg: "bg-muted" },
    primary:   { bg: "ring-1 ring-primary/20", value: "text-primary", iconBg: "bg-primary/10" },
    success:   { bg: "ring-1 ring-green-500/20", value: "text-green-500", iconBg: "bg-green-500/10" },
    warning:   { bg: "ring-1 ring-orange-500/20", value: "text-orange-500", iconBg: "bg-orange-500/10" },
    danger:    { bg: "ring-1 ring-red-500/20", value: "text-red-500", iconBg: "bg-red-500/10" },
  };
  const t = toneStyles[tone];
  const DeltaIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <Card className={`relative overflow-hidden ${t.bg} ${className || ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
            <p className={`text-2xl font-bold font-mono tracking-tight ${t.value}`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {caption && (
              <p className="text-[11px] text-muted-foreground">{caption}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {icon && (
              <div className={`rounded-lg p-1.5 ${t.iconBg}`}>{icon}</div>
            )}
            {delta && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                <DeltaIcon className="h-3 w-3" />
                {delta}
              </span>
            )}
          </div>
        </div>
        {/* Subtle baseline */}
        <div className="mt-3 h-px w-12 rounded-full bg-current opacity-10" />
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [unhealthyAgents, setUnhealthyAgents] = useState<UnhealthyAgent[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<{ name: string; pipelineCount: number }[]>([]);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [agentStats, setAgentStats] = useState({ totalActions: 0, pipelinesRun: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [overviewRes, wsRes] = await Promise.all([
      fetch("/api/overview"),
      fetch("/api/workspaces"),
    ]);
    const data = await overviewRes.json();
    const wsData = await wsRes.json();
    setStats(data.stats);
    setRecent(data.recent ?? []);
    setUnhealthyAgents(data.unhealthyAgents ?? []);
    setWorkspaces(wsData.workspaces ?? []);

    // Fetch agent stats separately (can fail gracefully)
    try {
      const statsRes = await fetch("/api/agents/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const ags = statsData.agents || {};
        setAgentStats({
          totalActions: Object.values(ags).reduce((s: number, a: any) => s + (a.totalActions || 0), 0),
          pipelinesRun: Object.values(ags).reduce((s: number, a: any) => s + (a.pipelinesRun || 0), 0),
        });
      }
    } catch { /* ignore */ }

    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 10000);
    return () => clearInterval(id);
  }, [load]);

  const isDegraded = stats?.systemStatus === "degraded";
  const hasUnhealthy = unhealthyAgents.length > 0;
  const inboxCount = stats?.inboxTotal ?? 0;

  const alerts: { severity: "error" | "warning" | "info"; title: string; detail: string; id: string }[] = [];
  if (isDegraded || hasUnhealthy) {
    alerts.push({
      severity: "error",
      title: `${unhealthyAgents.length} agent${unhealthyAgents.length !== 1 ? "s" : ""} need attention`,
      detail: unhealthyAgents.map(a => `${a.label}: ${a.failedChecks.join(", ")}`).join(" · "),
      id: "unhealthy-agents",
    });
  }
  if (inboxCount > 0) {
    alerts.push({
      severity: "info",
      title: `${inboxCount} unread message${inboxCount !== 1 ? "s" : ""} in inbox`,
      detail: "Check your inbox for pending tasks and messages.",
      id: "inbox-messages",
    });
  }
  const visibleAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stats ? `${stats.healthyAgents}/${stats.agents} agents healthy` : "Loading..."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-1.5 text-xs">
          <RefreshCw size={12} />
          Refresh
        </Button>
      </div>

      {/* ── Alert Banners ── */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2">
          {visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{
                background: alert.severity === "error" ? "rgba(246,70,93,0.06)" :
                            alert.severity === "warning" ? "rgba(249,115,22,0.06)" : "rgba(14,203,129,0.04)",
                borderLeft: `3px solid ${alert.severity === "error" ? "var(--error)" : alert.severity === "warning" ? "var(--warning)" : "var(--info)"}`,
              }}
            >
              {alert.severity === "error" ? (
                <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "var(--error)" }} />
              ) : (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--info)" }} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{
                  color: alert.severity === "error" ? "var(--error)" : "var(--info)"
                }}>
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => setDismissedAlerts(p => [...p, alert.id])}
                className="p-0.5 rounded hover:bg-white/5 shrink-0 text-muted-foreground"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── KPI Cards Row ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-4 space-y-3"><Skeleton className="h-3 w-16" /><Skeleton className="h-7 w-20" /><Skeleton className="h-2 w-12" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard
            label="System"
            value={stats?.systemStatus === "healthy" ? "Operational" : stats?.systemStatus ?? "—"}
            icon={<ShieldCheck size={14} />}
            tone={isDegraded ? "warning" : "success"}
            delta={isDegraded ? "Degraded" : "Healthy"}
            trend={isDegraded ? "down" : "up"}
          />
          <KpiCard
            label="Agents"
            value={`${stats?.healthyAgents ?? "?"}/${stats?.agents ?? "?"}`}
            icon={<Bot size={14} />}
            tone={hasUnhealthy ? "warning" : "success"}
            delta={hasUnhealthy ? `${unhealthyAgents.length} unhealthy` : "All healthy"}
            trend={hasUnhealthy ? "down" : "up"}
          />
          <KpiCard
            label="Inbox"
            value={inboxCount}
            icon={<Inbox size={14} />}
            tone={inboxCount > 0 ? "primary" : "default"}
            caption={inboxCount > 0 ? "Unread messages" : "All clear"}
            trend={inboxCount > 0 ? "up" : "flat"}
            delta={inboxCount > 0 ? "Action needed" : undefined}
          />
          <KpiCard
            label="Ledger"
            value={stats?.ledgerCount ?? 0}
            icon={<ScrollText size={14} />}
            tone="default"
            caption="Total entries"
          />
        </div>
      )}

      {/* ── Projects ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FolderKanban size={14} style={{ color: "var(--primary)" }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projects</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <Skeleton className="h-7 w-24 rounded-md" />
          ) : workspaces.length === 0 ? (
            <span className="text-xs text-muted-foreground">No projects yet</span>
          ) : (
            workspaces.map((w) => (
              <Link
                key={w.name}
                href="/projects"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors hover:border-primary/30"
                style={{ borderColor: "var(--border)" }}
              >
                <FolderKanban size={11} style={{ color: "var(--primary)" }} />
                {w.name}
                <span className="text-[10px] text-muted-foreground font-mono">{w.pipelineCount}</span>
              </Link>
            ))
          )}
          <Link
            href="/projects"
            className="inline-flex items-center text-xs px-3 py-1.5 rounded-md border border-dashed transition-colors hover:border-primary/30 text-muted-foreground"
            style={{ borderColor: "var(--border)" }}
          >
            + New
          </Link>
        </div>
      </div>

      {/* ── Main Split: Needs Attention + Recent Activity ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        {/* Needs Attention */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              {hasUnhealthy ? (
                <AlertTriangle size={15} style={{ color: "var(--error)" }} />
              ) : (
                <CheckCircle2 size={15} style={{ color: "var(--success)" }} />
              )}
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <div className="flex items-center gap-2 ml-auto">
                <Link href="/system/doctor">
                  <Button variant="ghost" size="sm" className="text-[10px] gap-1 h-6">
                    <Activity size={11} />
                    Health
                  </Button>
                </Link>
                <span className="text-xs text-muted-foreground">
                {unhealthyAgents.length} issue{unhealthyAgents.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3"><Skeleton className="h-16 w-full rounded-lg" /><Skeleton className="h-16 w-full rounded-lg" /></div>
            ) : unhealthyAgents.length === 0 && !isDegraded ? (
              <div className="text-sm text-center py-6">
                <CheckCircle2 size={28} className="mx-auto mb-2 opacity-30" style={{ color: "var(--success)" }} />
                <p className="text-muted-foreground">All systems operational</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.healthyAgents ?? 0}/{stats?.agents ?? 0} agents healthy
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {unhealthyAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="rounded-lg p-3"
                    style={{ background: "rgba(246,70,93,0.04)", borderLeft: "3px solid var(--error)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: agentColor(agent.id) }} />
                      <span className="text-sm font-medium">{agent.label}</span>
                      <Badge variant="destructive" className="text-[10px] ml-auto">{agent.status}</Badge>
                    </div>
                    <p className="text-xs mt-1.5 text-muted-foreground">
                      <span className="font-medium text-foreground/70">Failed: </span>
                      {agent.failedChecks.join(", ")}
                    </p>
                  </div>
                ))}
                {isDegraded && unhealthyAgents.length === 0 && (
                  <div className="rounded-lg p-3" style={{ background: "rgba(249,115,22,0.06)", borderLeft: "3px solid var(--warning)" }}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} style={{ color: "var(--warning)" }} />
                      <span className="text-sm font-medium">System Degraded</span>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">Some checks are failing but no agents are marked unhealthy.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Link href="/ledger" className="text-xs inline-flex items-center gap-1 hover:underline" style={{ color: "var(--primary)" }}>
                View all <ExternalLink size={10} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="px-4 py-4 space-y-3"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
            ) : recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No activity yet</div>
            ) : (
              <div className="divide-y divide-border/50">
                {recent.slice(0, 8).map((entry, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: agentColor(entry.agent) }} />
                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">{entry.action}</Badge>
                    <span className="text-xs font-medium shrink-0" style={{ color: agentColor(entry.agent) }}>{entry.agent}</span>
                    <span className="text-xs text-muted-foreground truncate flex-1">{entry.description}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">{timeAgo(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick stats row ── */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <Card key={i}><CardContent className="p-4"><Skeleton className="h-4 w-12" /><Skeleton className="h-6 w-8 mt-2" /></CardContent></Card>)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <ListTodo size={16} style={{ color: "var(--success)" }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tasks</p>
                <p className="text-lg font-bold font-mono" style={{ color: "var(--success)" }}>{stats?.tasks ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <ScrollText size={16} style={{ color: "var(--info)" }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plans</p>
                <p className="text-lg font-bold font-mono" style={{ color: "var(--info)" }}>{stats?.plans ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Activity size={16} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pipelines</p>
                <p className="text-lg font-bold font-mono" style={{ color: "var(--primary)" }}>3</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
