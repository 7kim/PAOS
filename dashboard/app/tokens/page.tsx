"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign, BarChart3, Coins, TrendingUp, Calendar,
  Loader2, RefreshCw, ChevronDown,
} from "lucide-react";

interface TokenSummary {
  totalTokens: number;
  totalInput: number;
  totalOutput: number;
  totalContext: number;
  totalCalls: number;
  actualCost: number;
  compareCost: number;
  compareModel: string;
  availableModels: string[];
  daily: Array<{ date: string; input: number; output: number; cost: number; count: number }>;
  byAgent: Record<string, { input: number; output: number; cost: number; calls: number }>;
  actualCostBreakdown?: Record<string, { input: number; output: number; cost: number }>;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatCost(n: number): string {
  if (n < 0.01) return `$${(n * 100).toFixed(2)}¢`;
  return `$${n.toFixed(2)}`;
}

export default function TokensPage() {
  const [data, setData] = useState<TokenSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [compareModel, setCompareModel] = useState("claude-sonnet-4");
  const [view, setView] = useState<"overview" | "daily" | "agents">("overview");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tokens?compareModel=${encodeURIComponent(compareModel)}`);
      const d = await res.json();
      if (d.error) {
        setError(d.error);
        setData(null);
      } else {
        setData(d);
        setError("");
      }
    } catch {
      setError("Failed to load token data");
    }
    setLoading(false);
  }, [compareModel]);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Coins size={16} /> Token Usage
          </h1>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {data?.totalCalls || 0} total calls · {data ? formatTokens(data.totalTokens) : "0"} tokens
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={compareModel}
            onChange={(e) => setCompareModel(e.target.value)}
            className="text-[10px] rounded px-2 py-1 border"
            style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            {data?.availableModels?.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button
            onClick={load}
            className="text-xs px-2 py-1 rounded border flex items-center gap-1"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <RefreshCw size={10} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {data && (
        <>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
              <div className="text-[9px] font-medium flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <BarChart3 size={9} /> Total Tokens
              </div>
              <div className="text-lg font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
                {formatTokens(data.totalTokens)}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {formatTokens(data.totalInput)} in · {formatTokens(data.totalOutput)} out
              </div>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
              <div className="text-[9px] font-medium flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <DollarSign size={9} /> Actual Cost
              </div>
              <div className="text-lg font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
                {formatCost(data.actualCost)}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {data.totalCalls} calls
              </div>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
              <div className="text-[9px] font-medium flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <TrendingUp size={9} /> Comparable Cost
              </div>
              <div className="text-lg font-bold mt-0.5" style={{ color: "#8b5cf6" }}>
                {formatCost(data.compareCost)}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                via {compareModel}
              </div>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
              <div className="text-[9px] font-medium flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <Coins size={9} /> Context This Month
              </div>
              <div className="text-lg font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
                {formatTokens(data.totalContext)}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                total context tokens
              </div>
            </div>
          </div>

          {/* View tabs */}
          <div className="flex gap-1 border-b pb-2" style={{ borderColor: "var(--border)" }}>
            {(["overview", "daily", "agents"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className="text-[10px] px-3 py-1 rounded font-medium transition-colors capitalize"
                style={{
                  background: view === tab ? "rgba(240,185,11,0.1)" : "transparent",
                  color: view === tab ? "var(--primary)" : "var(--muted-foreground)",
                }}
              >
                {tab === "daily" && <Calendar size={10} className="inline mr-1" />}
                {tab === "agents" && <BarChart3 size={10} className="inline mr-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Daily histogram */}
          {view === "daily" && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Per Day — Calendar View</h3>
              {data.daily.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>No data yet</p>
              ) : (
                <>
                  {/* Calendar chart */}
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[9px] font-medium flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                        <BarChart3 size={9} /> Daily Token Usage
                      </div>
                      <div className="flex items-center gap-2 text-[8px]" style={{ color: "var(--muted-foreground)" }}>
                        <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded" style={{ background: "var(--gold)" }} /> Input</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded" style={{ background: "#8b5cf6" }} /> Output</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {data.daily.slice(-14).map((day) => {
                        const maxTokens = Math.max(...data.daily.map(d => d.input + d.output), 1);
                        const inPct = (day.input / maxTokens) * 100;
                        const outPct = (day.output / maxTokens) * 100;
                        return (
                          <div key={day.date} className="flex items-center gap-3">
                            <span className="text-[9px] w-16 shrink-0 text-right font-mono" style={{ color: "var(--muted-foreground)" }}>
                              {day.date.slice(5)}
                            </span>
                            <div className="flex-1 h-5 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                              <div className="flex h-full">
                                <div
                                  className="h-full transition-all rounded-l"
                                  style={{ width: `${inPct}%`, background: "var(--gold)", opacity: 0.7 }}
                                />
                                <div
                                  className="h-full transition-all rounded-r"
                                  style={{ width: `${outPct}%`, background: "#8b5cf6", opacity: 0.7 }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-3 shrink-0">
                              <span className="text-[9px] w-12 font-mono text-right" style={{ color: "var(--muted-foreground)" }}>
                                {formatTokens(day.input + day.output)}
                              </span>
                              <span className="text-[9px] w-10 font-mono text-right" style={{ color: "var(--muted-foreground)" }}>
                                {formatCost(day.cost)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compact list */}
                  <div className="grid grid-cols-2 gap-2">
                    {data.daily.slice(-30).reverse().map((day) => (
                      <div
                        key={day.date}
                        className="rounded-lg border p-2 flex items-center justify-between"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div>
                          <div className="text-[9px] font-mono" style={{ color: "var(--muted-foreground)" }}>{day.date.slice(5)}</div>
                          <div className="text-[8px]" style={{ color: "var(--muted-foreground)" }}>
                            {formatTokens(day.input + day.output)} · {day.count} calls
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-right" style={{ color: "var(--foreground)" }}>
                          {formatCost(day.cost)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* By Agent */}
          {view === "agents" && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Per Agent</h3>
              {Object.keys(data.byAgent).length === 0 ? (
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>No data yet</p>
              ) : (
                <div className="space-y-1">
                  {Object.entries(data.byAgent).map(([agent, stats]) => (
                    <div key={agent} className="flex items-center gap-2 p-2 rounded border" style={{ borderColor: "var(--border)" }}>
                      <div className="flex-1">
                        <div className="text-[10px] font-medium" style={{ color: "var(--foreground)" }}>{agent}</div>
                        <div className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                          {formatTokens(stats.input)} in · {formatTokens(stats.output)} out · {stats.calls} calls
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono" style={{ color: "var(--foreground)" }}>{formatCost(stats.cost)}</div>
                        <div className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>cost</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Overview */}
          {view === "overview" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="text-[9px] font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Input vs Output</div>
                <div className="flex h-6 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div
                    className="flex items-center justify-center text-[9px] font-medium transition-all"
                    style={{
                      width: `${(data.totalInput / Math.max(data.totalTokens, 1)) * 100}%`,
                      background: "var(--gold)",
                    }}
                  >
                    {data.totalInput > 0 && `${Math.round((data.totalInput / data.totalTokens) * 100)}%`}
                  </div>
                  <div
                    className="flex items-center justify-center text-[9px] font-medium transition-all"
                    style={{
                      width: `${(data.totalOutput / Math.max(data.totalTokens, 1)) * 100}%`,
                      background: "#8b5cf6",
                    }}
                  >
                    {data.totalOutput > 0 && `${Math.round((data.totalOutput / data.totalTokens) * 100)}%`}
                  </div>
                </div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="text-[9px] font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Cost Breakdown by Model</div>
                <div className="space-y-1">
                  {Object.entries(data.actualCostBreakdown || {}).map(([model, stats]) => (
                    <div key={model} className="flex items-center justify-between text-[10px]">
                      <span style={{ color: "var(--foreground)" }}>{model}</span>
                      <span style={{ color: "var(--muted-foreground)" }}>{formatCost(stats.cost)}</span>
                    </div>
                  ))}
                  {Object.keys(data.actualCostBreakdown || {}).length === 0 && (
                    <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>No cost data (free models)</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
