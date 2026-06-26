"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, BarChart3, Activity, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AgentStats {
  totalActions: number;
  pipelinesRun: number;
  tasksCompleted: number;
  successRate: string;
  lastActive: string | null;
  dailyActivity: { date: string; actions: number }[];
  actionsByType: Record<string, number>;
}

export default function AgentStatsPage() {
  const [agents, setAgents] = useState<Record<string, AgentStats>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/stats");
      const data = await res.json();
      setAgents(data.agents || {});
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const sortedAgents = Object.entries(agents).sort((a, b) => b[1].totalActions - a[1].totalActions);
  const totalActions = sortedAgents.reduce((s, [, v]) => s + v.totalActions, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Agent Activity</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            {sortedAgents.length} agents · {totalActions} total actions
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin opacity-50" />
        </div>
      ) : sortedAgents.length === 0 ? (
        <div className="text-center py-16 opacity-50 text-xs">No agent activity data yet</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sortedAgents.slice(0, 8).map(([id, s]) => (
              <Card key={id}>
                <CardContent className="p-4">
                  <div className="text-[10px] font-medium truncate" style={{ color: "var(--muted-foreground)" }}>{id}</div>
                  <div className="text-xl font-bold mt-1">{s.totalActions}</div>
                  <div className="flex items-center gap-2 mt-1 text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                    <Activity size={9} />
                    <span style={{ color: s.successRate === "100%" ? "#22c55e" : "var(--primary)" }}>{s.successRate}</span>
                    <span>· {s.pipelinesRun} pipelines</span>
                  </div>
                  {s.lastActive && (
                    <div className="text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      Last: {s.lastActive.slice(0, 10)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 size={14} />
                Per-Agent Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ color: "var(--muted-foreground)" }}>
                      <th className="text-left pb-2 font-medium">Agent</th>
                      <th className="text-right pb-2 font-medium">Actions</th>
                      <th className="text-right pb-2 font-medium">Pipelines</th>
                      <th className="text-right pb-2 font-medium">Tasks</th>
                      <th className="text-right pb-2 font-medium">Success</th>
                      <th className="text-right pb-2 font-medium">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAgents.map(([id, s]) => (
                      <tr key={id} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="py-2 pr-4 font-medium">{id}</td>
                        <td className="py-2 pr-4 text-right">{s.totalActions}</td>
                        <td className="py-2 pr-4 text-right">{s.pipelinesRun}</td>
                        <td className="py-2 pr-4 text-right">{s.tasksCompleted}</td>
                        <td className="py-2 pr-4 text-right">
                          <span style={{ color: s.successRate === "100%" ? "#22c55e" : "var(--primary)" }}>
                            {s.successRate}
                          </span>
                        </td>
                        <td className="py-2 text-right text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                          {s.lastActive ? s.lastActive.slice(0, 10) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Daily activity sparklines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp size={14} />
                Daily Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sortedAgents.slice(0, 8).map(([id, s]) => {
                  const days = s.dailyActivity;
                  if (days.length === 0) return null;
                  const maxVal = Math.max(...days.map((d) => d.actions), 1);
                  return (
                    <div key={id} className="p-2 rounded-lg border" style={{ borderColor: "var(--border)" }}>
                      <div className="text-[9px] font-medium mb-1 truncate">{id}</div>
                      <div className="flex items-end gap-[2px] h-8">
                        {days.slice(-14).map((d, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                              height: `${(d.actions / maxVal) * 100}%`,
                              background: "var(--primary)",
                              opacity: 0.3 + (d.actions / maxVal) * 0.7,
                              minHeight: d.actions > 0 ? "3px" : "1px",
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-[8px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {days.length} day{days.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
