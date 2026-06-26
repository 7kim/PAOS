"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2, CheckCircle2, XCircle, ExternalLink, RefreshCw,
  Copy, Terminal, Power, PowerOff, Download, BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AgentInfo {
  id: string;
  label: string;
  available: boolean;
  version: string;
  error: string;
}

interface RegistryAgent {
  id: string;
  label: string;
  role: string;
  enabled: boolean;
  riskLevel: string;
  binary: string;
}

interface InstallableAgent {
  id: string;
  label: string;
  role: string;
  installType: string;
  binary: string;
}

interface AgentStats {
  totalActions: number;
  pipelinesRun: number;
  successRate: string;
  lastActive: string | null;
  actionsByType: Record<string, number>;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [registry, setRegistry] = useState<RegistryAgent[]>([]);
  const [installable, setInstallable] = useState<InstallableAgent[]>([]);
  const [stats, setStats] = useState<Record<string, AgentStats>>({});
  const [loading, setLoading] = useState(true);
  const [installError, setInstallError] = useState("");
  const [installing, setInstalling] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [agentsRes, registryRes, installableRes, statsRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/agents/scoped"),
        fetch("/api/agents/installable"),
        fetch("/api/agents/stats"),
      ]);
      const agentsData = await agentsRes.json();
      const registryData = await registryRes.json();
      const installableData = await installableRes.json();
      const statsData = await statsRes.json();

      setAgents(agentsData.agents || []);
      setRegistry(registryData.scopedProjects?.flatMap((p: any) => p.agents?.map((a: string) => ({ id: a, label: a, enabled: true, role: "", riskLevel: "medium", binary: a })) || []) || []);
      setInstallable(installableData.agents || []);
      setStats(statsData.agents || {});
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggleAgent = async (id: string) => {
    try {
      const res = await fetch(`/api/agents/${id}/toggle`, { method: "PATCH" });
      if (res.ok) {
        setRegistry((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a));
      }
    } catch { /* ignore */ }
  };

  const installAgent = async (id: string) => {
    setInstalling(id);
    setInstallError("");
    try {
      const res = await fetch(`/api/agents/${id}/install`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setInstallable((prev) => prev.filter((a) => a.id !== id));
        setRegistry((prev) => [...prev, { id, label: id, enabled: true, role: "", riskLevel: "medium", binary: id }]);
      } else {
        setInstallError(data.error || "Install failed");
      }
    } catch (e) {
      setInstallError(String(e));
    }
    setInstalling(null);
  };

  // Merge registry with live health check info
  const mergedAgents = registry.map((r) => {
    const live = agents.find((a) => a.id === r.id || a.id === r.id.replace(/-/g, "-"));
    return { ...r, available: live?.available ?? false, version: live?.version || "" };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Agents</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            Manage PAOS agent lifecycle — {mergedAgents.filter((a) => a.enabled).length} active · {installable.length} available to install
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowStats(!showStats)} className="text-[10px] gap-1">
            <BarChart3 size={12} />
            {showStats ? "Hide Stats" : "Stats"}
          </Button>
          <Button variant="ghost" size="sm" onClick={loadAll} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin opacity-50" />
        </div>
      ) : (
        <>
          {/* ── Active Agents ── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Terminal size={14} />
                Active Agents ({mergedAgents.filter((a) => a.enabled).length})
              </CardTitle>
              <CardDescription className="text-[10px]">
                Agents registered in PAOS. Toggle to enable/disable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mergedAgents.length === 0 ? (
                <div className="text-[10px] text-center py-4 opacity-50">No agents registered</div>
              ) : (
                mergedAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 rounded-lg border transition-all"
                    style={{
                      borderColor: "var(--border)",
                      background: agent.enabled ? "var(--card-bg)" : "transparent",
                      opacity: agent.enabled ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {agent.enabled ? (
                        <CheckCircle2 size={14} style={{ color: agent.available ? "var(--success, #22c55e)" : "var(--muted-foreground)" }} />
                      ) : (
                        <XCircle size={14} style={{ color: "var(--muted-foreground)" }} />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate flex items-center gap-2">
                          {agent.label || agent.id}
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">
                            {agent.riskLevel || "—"}
                          </Badge>
                          {agent.available && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0" style={{ color: "var(--success, #22c55e)" }}>
                              {agent.version?.slice(0, 30) || "Online"}
                            </Badge>
                          )}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          {agent.id}{agent.available ? "" : " · Binary not found on PATH"}
                        </div>
                        {/* Stats for this agent */}
                        {showStats && stats[agent.id] && (
                          <div className="flex flex-wrap gap-2 mt-1.5 text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                            <span>{stats[agent.id].totalActions} actions</span>
                            <span>{stats[agent.id].pipelinesRun} pipelines</span>
                            <span>Success: {stats[agent.id].successRate}</span>
                            {stats[agent.id].lastActive && (
                              <span>Last: {stats[agent.id].lastActive?.slice(0, 10)}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {agent.available && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => toggleAgent(agent.id)}
                          title={agent.enabled ? "Disable" : "Enable"}
                        >
                          {agent.enabled ? <PowerOff size={12} /> : <Power size={12} />}
                        </Button>
                      )}
                      <Badge className="text-[9px]" style={{
                        background: agent.enabled ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)",
                        color: agent.enabled ? "#22c55e" : "var(--muted-foreground)",
                      }}>
                        {agent.enabled ? "ON" : "OFF"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* ── Installable Agents ── */}
          {installable.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Download size={14} />
                  Available to Install ({installable.length})
                </CardTitle>
                <CardDescription className="text-[10px]">
                  Self-contained installation inside ~/AI_Workflow/agents/ with auto-configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {installError && (
                  <div className="text-[10px] p-2 rounded" style={{ color: "var(--destructive)", background: "rgba(255,0,0,0.05)" }}>
                    {installError}
                  </div>
                )}
                {installable.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Download size={14} style={{ color: "var(--primary)" }} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium">{agent.label}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          {agent.role} · install via {agent.installType}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[10px] gap-1 h-7"
                      disabled={installing === agent.id}
                      onClick={() => installAgent(agent.id)}
                    >
                      {installing === agent.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Download size={10} />
                      )}
                      {installing === agent.id ? "Installing..." : "Install"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Global Stats Summary ── */}
          {showStats && Object.keys(stats).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 size={14} />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(stats).slice(0, 8).map(([agentId, s]) => (
                    <div key={agentId} className="p-2 rounded-lg border text-center" style={{ borderColor: "var(--border)" }}>
                      <div className="text-[9px] font-medium truncate" style={{ color: "var(--muted-foreground)" }}>
                        {agentId}
                      </div>
                      <div className="text-sm font-semibold mt-1">{s.totalActions}</div>
                      <div className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>actions</div>
                      <div className="text-[9px] font-medium" style={{ color: s.successRate === "100%" ? "#22c55e" : "var(--primary)" }}>
                        {s.successRate} success
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
