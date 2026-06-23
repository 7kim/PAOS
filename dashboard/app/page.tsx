"use client";
import { useCallback, useEffect, useState } from "react";
import { 
  AlertTriangle, CheckCircle2, Inbox, ListTodo, ScrollText, 
  ShieldCheck, X, Bot, ArrowUp, ArrowDown, 
  Activity, ExternalLink, FolderKanban 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
};

function agentColor(agent: string) {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

import { formatTime } from "@/lib/settings";
function timeAgo(iso: string) { return formatTime(iso); }

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [unhealthyAgents, setUnhealthyAgents] = useState<UnhealthyAgent[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<{ name: string; pipelineCount: number }[]>([]);

  const load = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 10000);
    return () => clearInterval(id);
  }, [load]);

  // Build alert list from live data
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

  // Severity-ordered stat cards
  const severityColor = (severity: "error" | "warning" | "success" | "info") => {
    const map = { error: "var(--error)", warning: "var(--warning)", success: "var(--success)", info: "var(--info)" };
    return map[severity];
  };

  const statCards = [
    { label: "System", value: stats?.systemStatus ?? "—", icon: Activity, severity: isDegraded ? "warning" : "success" as const },
    { label: "Healthy Agents", value: `${stats?.healthyAgents ?? "?"}/${stats?.agents ?? "?"}`, icon: Bot, severity: hasUnhealthy ? "warning" : "success" as const },
    { label: "Inbox", value: inboxCount, icon: Inbox, severity: inboxCount > 0 ? "warning" : "info" as const },
    { label: "Ledger", value: stats?.ledgerCount ?? 0, icon: ScrollText, severity: "info" as const },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold">Overview</h1>
        <span className="text-xs text-muted-foreground">Auto-refresh 10s</span>
      </div>

      {/* ── Alert banners (severity-ordered) ── */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2 mb-5">
          {visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className="alert-card-error flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{
                background: alert.severity === "error" ? "rgba(246,70,93,0.06)" :
                            alert.severity === "warning" ? "rgba(249,115,22,0.06)" :
                            "rgba(14,203,129,0.04)",
              }}
            >
              {alert.severity === "error" ? (
                <AlertTriangle size={16} style={{ color: "var(--error)", marginTop: 1 }} />
              ) : alert.severity === "warning" ? (
                <AlertTriangle size={16} style={{ color: "var(--warning)", marginTop: 1 }} />
              ) : (
                <CheckCircle2 size={16} style={{ color: "var(--info)", marginTop: 1 }} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: alert.severity === "error" ? "var(--error)" : alert.severity === "warning" ? "var(--warning)" : "var(--info)" }}>
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => setDismissedAlerts(p => [...p, alert.id])}
                className="p-0.5 rounded hover:bg-white/5 shrink-0"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Stat row ── */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {statCards.map(({ label, value, icon: Icon, severity }) => (
          <Card key={label} className="alert-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</CardTitle>
              <Icon size={14} style={{ color: severityColor(severity) }} />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono" style={{ color: severityColor(severity) }}>
                  {value}
                </span>
                {/* Mini trend indicators */}
                {severity === "success" && <ArrowUp size={12} style={{ color: "var(--success)" }} />}
                {severity === "warning" && <ArrowDown size={12} style={{ color: "var(--warning)" }} />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Projects section ── */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <FolderKanban size={14} style={{ color: "var(--primary)" }} />
          <span className="text-xs font-semibold">Projects</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {workspaces.length === 0 ? (
            <span className="text-xs text-muted-foreground">No projects yet</span>
          ) : (
            workspaces.map((w) => (
              <Link
                key={w.name}
                href={`/projects`}
                className="text-xs px-3 py-1.5 rounded-md border transition-colors hover:border-primary/30 flex items-center gap-2"
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
            className="text-xs px-3 py-1.5 rounded-md border border-dashed transition-colors hover:border-primary/30 text-muted-foreground"
            style={{ borderColor: "var(--border)" }}
          >
            + New
          </Link>
        </div>
      </div>

      {/* ── Main split: Alerts + Activity ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">

        {/* Left: Needs Attention */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              {hasUnhealthy ? (
                <AlertTriangle size={15} style={{ color: "var(--error)" }} />
              ) : (
                <CheckCircle2 size={15} style={{ color: "var(--success)" }} />
              )}
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <span className="text-xs text-muted-foreground ml-auto">
                {unhealthyAgents.length} issue{unhealthyAgents.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {unhealthyAgents.length === 0 && !isDegraded ? (
              <div className="text-sm text-center py-4">
                <CheckCircle2 size={24} className="mx-auto mb-2 opacity-30" style={{ color: "var(--success)" }} />
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
                    style={{
                      background: "rgba(246,70,93,0.04)",
                      borderLeft: "3px solid var(--error)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: agentColor(agent.id) }} />
                      <span className="text-sm font-medium">{agent.label}</span>
                      <Badge variant="destructive" className="text-[10px] ml-auto">{agent.status}</Badge>
                    </div>
                    <div className="text-xs mt-1.5 text-muted-foreground">
                      <span className="font-medium text-foreground/70">Failed: </span>
                      {agent.failedChecks.join(", ")}
                    </div>
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

        {/* Right: Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Link href="/ledger" className="text-xs flex items-center gap-1 hover:underline" style={{ color: "var(--primary)" }}>
                View all <ExternalLink size={10} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No activity yet</div>
            ) : (
              <div className="divide-y">
                {recent.slice(0, 8).map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: agentColor(entry.agent) }} />
                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">{entry.action}</Badge>
                    <span className="text-xs font-medium shrink-0" style={{ color: agentColor(entry.agent) }}>{entry.agent}</span>
                    <span className="text-xs text-muted-foreground truncate flex-1">{entry.description}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick stats row ── */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <Card className="alert-card">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tasks</CardTitle></CardHeader>
          <CardContent className="pt-0 flex items-center gap-2">
            <ListTodo size={14} style={{ color: "var(--success)" }} />
            <span className="text-lg font-bold font-mono" style={{ color: "var(--success)" }}>{stats?.tasks ?? 0}</span>
          </CardContent>
        </Card>
        <Card className="alert-card">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plans</CardTitle></CardHeader>
          <CardContent className="pt-0 flex items-center gap-2">
            <ScrollText size={14} style={{ color: "var(--info)" }} />
            <span className="text-lg font-bold font-mono" style={{ color: "var(--info)" }}>{stats?.plans ?? 0}</span>
          </CardContent>
        </Card>
        <Card className="alert-card">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pipelines</CardTitle></CardHeader>
          <CardContent className="pt-0 flex items-center gap-2">
            <Activity size={14} style={{ color: "var(--primary)" }} />
            <span className="text-lg font-bold font-mono" style={{ color: "var(--primary)" }}>3</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
