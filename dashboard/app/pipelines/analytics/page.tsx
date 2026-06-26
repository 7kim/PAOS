"use client";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, RefreshCw, Loader2, TrendingUp, Activity, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Analytics {
  totalPipelines: number; completed: number; failed: number; running: number; pending: number;
  successRate: string; avgDuration: string | null;
  dailyVolume: { date: string; created: number; completed: number }[];
  byAgent: { agent: string; count: number; successRate: string }[];
  byStatus: { status: string; count: number }[];
  recentPipelines: { id: string; status: string; duration: string | null; agent: string }[];
}

interface PhaseCost {
  label: string;
  tokens: number;
  cost: number;
}

interface PipelineCost {
  pipelineId: string;
  estimatedTokens: number;
  estimatedCost: number;
  phases: PhaseCost[];
}

interface CostData {
  pipelines: PipelineCost[];
  summary: {
    totalPipelines: number;
    totalCost: number;
    totalTokens: number;
    avgCost: number;
  };
  mostExpensive: {
    pipelineId: string;
    estimatedCost: number;
    estimatedTokens: number;
    phaseCount: number;
  }[];
}

export default function PipelineAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [costData, setCostData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, costRes] = await Promise.all([
        fetch("/api/pipelines/analytics"),
        fetch("/api/pipelines/cost"),
      ]);
      setData(await analyticsRes.json());
      setCostData(await costRes.json());
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Pipeline Analytics</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            {data ? `${data.totalPipelines} total · ${data.successRate} success rate` : ""}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={20} className="animate-spin opacity-50" /></div>
      ) : !data ? (
        <div className="text-center py-16 opacity-50 text-xs">Could not load analytics</div>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card><CardContent className="p-4"><div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Total</div><div className="text-xl font-bold">{data.totalPipelines}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Success</div><div className="text-xl font-bold" style={{ color: "#22c55e" }}>{data.successRate}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Avg Duration</div><div className="text-xl font-bold">{data.avgDuration || "—"}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Running</div><div className="text-xl font-bold" style={{ color: "#3b82f6" }}>{data.running}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Pending</div><div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{data.pending}</div></CardContent></Card>
          </div>

          {/* Cost summary card */}
          {costData && costData.summary.totalPipelines > 0 && (
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                    <DollarSign size={14} /> Pipeline Cost Estimates
                  </CardTitle>
                  <CardDescription className="text-[10px]">
                    Based on prompt token estimation (~4 chars/token)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Total Estimated Cost</div>
                    <div className="text-lg font-bold">${costData.summary.totalCost.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Avg Cost / Pipeline</div>
                    <div className="text-lg font-bold">${costData.summary.avgCost.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Total Prompt Tokens</div>
                    <div className="text-lg font-bold">{costData.summary.totalTokens.toLocaleString()}</div>
                  </div>
                </div>

                {costData.mostExpensive.length > 0 && (
                  <div>
                    <div className="text-[10px] font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
                      Most Expensive Pipelines
                    </div>
                    <div className="space-y-1">
                      {costData.mostExpensive.slice(0, 5).map((p) => (
                        <div key={p.pipelineId} className="flex items-center gap-2 py-1 text-xs border-b" style={{ borderColor: "var(--border)" }}>
                          <span className="text-[9px] font-mono truncate flex-1">{p.pipelineId}</span>
                          <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{p.phaseCount} phases</span>
                          <span className="text-[9px] font-mono">${p.estimatedCost.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status distribution + Agent breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium">By Status</CardTitle></CardHeader>
              <CardContent>
                {data.byStatus.map((s) => {
                  const pct = data.totalPipelines > 0 ? Math.round((s.count / data.totalPipelines) * 100) : 0;
                  return (
                    <div key={s.status} className="flex items-center gap-2 py-1 text-xs">
                      <span className="w-20 capitalize">{s.status}</span>
                      <div className="flex-1 h-3 rounded-full" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--primary)" }} />
                      </div>
                      <span className="w-8 text-right font-mono">{s.count}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium">By Agent</CardTitle></CardHeader>
              <CardContent>
                {data.byAgent.map((a) => (
                  <div key={a.agent} className="flex items-center gap-2 py-1 text-xs">
                    <span className="flex-1 truncate">{a.agent}</span>
                    <Badge variant="secondary" className="text-[9px]">{a.count} pipelines</Badge>
                    <span style={{ color: a.successRate === "100%" ? "#22c55e" : "var(--primary)" }}>{a.successRate}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Daily volume */}
          {data.dailyVolume.length > 0 && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium">Daily Pipeline Volume</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-20">
                  {data.dailyVolume.map((d, i) => {
                    const maxV = Math.max(...data.dailyVolume.map((x) => x.created), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full rounded-t" style={{
                          height: `${(d.created / maxV) * 100}%`,
                          background: "var(--primary)",
                          opacity: 0.3 + (d.created / maxV) * 0.7,
                          minHeight: d.created > 0 ? "3px" : "1px",
                        }} />
                        <span className="text-[8px]" style={{ color: "var(--muted-foreground)" }}>{d.date.slice(0, 5)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent pipelines */}
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium">Recent Pipelines</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
                {data.recentPipelines.slice(0, 10).map((p) => (
                  <div key={p.id} className="flex items-center gap-2 py-1 text-xs border-b" style={{ borderColor: "var(--border)" }}>
                    <span className="text-[9px] font-mono truncate flex-1">{p.id}</span>
                    <Badge className="text-[9px]" style={{
                      background: p.status === "completed" ? "rgba(34,197,94,0.15)" : p.status === "failed" ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.15)",
                      color: p.status === "completed" ? "#22c55e" : p.status === "failed" ? "#ef4444" : "var(--muted-foreground)",
                    }}>{p.status}</Badge>
                    {p.duration && <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{p.duration}</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
