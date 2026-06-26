"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3, TrendingUp, ChevronDown, ChevronRight,
  Loader2, CheckCircle2, Clock, AlertCircle, RefreshCw,
  LayoutList, ArrowUp, ArrowDown, FileText, GitBranch, Trash2,
} from "lucide-react";

interface Benchmark {
  id: string;
  grade: string;
  score: number;
  raw: number;
  max: number;
  date: string;
  gapCount: number;
  gapsByStatus: Record<string, number>;
}

interface Trend {
  direction: string;
  scores: number[];
  grades: string[];
  dates: string[];
  gapCounts: number[];
  totalRuns: number;
}

const BENCHMARKS_DIR = "/home/dev/AI_Workflow/benchmarks";

export default function BenchmarksPage() {
  const router = useRouter();
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [trend, setTrend] = useState<Trend | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [expandedGap, setExpandedGap] = useState<number | null>(null);
  const [kanbanColumn, setKanbanColumn] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/benchmarks");
      const data = await res.json();
      setBenchmarks(data.benchmarks || []);
      setTrend(data.trend);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadDetail = useCallback(async (id: string) => {
    setSelectedBenchmark(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/benchmarks/${encodeURIComponent(id)}`);
      const data = await res.json();
      setDetail(data);
    } catch { /* ignore */ }
    setDetailLoading(false);
  }, []);

  const updateGapStatus = useCallback(async (gapNum: number, newStatus: string) => {
    if (!selectedBenchmark) return;
    try {
      await fetch(`/api/benchmarks/${encodeURIComponent(selectedBenchmark)}/gaps/${gapNum}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // Refresh detail
      loadDetail(selectedBenchmark);
      load(); // Also refresh list
    } catch { /* ignore */ }
  }, [selectedBenchmark, loadDetail, load]);

  function gradeColor(grade: string): string {
    switch (grade) {
      case "A": return "#22c55e";
      case "B": return "#3b82f6";
      case "C": return "#f0b90b";
      case "D": return "#f97316";
      case "F": return "#ef4444";
      default: return "var(--muted-foreground)";
    }
  }

  if (loading) {
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
          <h1 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Benchmarks</h1>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {trend?.totalRuns || 0} runs · {benchmarks.filter(b => b.grade === "A" || b.grade === "B").length} passing
            {trend && trend.totalRuns >= 2 && (
              <span className="ml-2">
                {trend.direction === "improving" ? (
                  <span style={{ color: "#22c55e" }}><ArrowUp size={10} className="inline" /> Improving</span>
                ) : (
                  <span style={{ color: "#ef4444" }}><ArrowDown size={10} className="inline" /> Declining</span>
                )}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              setRunning(true);
              try {
                await fetch("/api/benchmarks", { method: "POST" });
                setTimeout(() => load(), 2000);
              } catch { /* ignore */ }
              setTimeout(() => setRunning(false), 10000);
            }}
            disabled={running}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 flex items-center gap-1"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            {running ? <Loader2 size={12} className="animate-spin" /> : <BarChart3 size={12} />}
            {running ? "Running..." : "Run Benchmark"}
          </button>
          <button
            onClick={() => load()}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 flex items-center gap-1"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {benchmarks.length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
          <BarChart3 size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No benchmarks found</p>
          <p className="text-xs mt-1">Run a benchmark first: <code className="font-mono">hermes benchmark rules:Coding-Principles-Benchmark.md</code></p>
        </div>
      )}

      {/* Timeline */}
      {benchmarks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}><TrendingUp size={14} /> Timeline</h2>
          <div className="grid gap-2">
            {benchmarks.map((b) => (
              <button
                key={b.id}
                onClick={() => loadDetail(b.id)}
                className="flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:opacity-80"
                style={{
                  borderColor: selectedBenchmark === b.id ? "var(--primary)" : "var(--border)",
                  background: selectedBenchmark === b.id ? "rgba(240,185,11,0.04)" : "transparent",
                }}
              >
                {/* Grade badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: `${gradeColor(b.grade)}18`,
                    color: gradeColor(b.grade),
                    border: `2px solid ${gradeColor(b.grade)}`,
                  }}
                >
                  {b.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{b.date || b.id}</div>
                  <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    {b.score}/100 · {b.gapCount} gaps
                    {b.gapsByStatus?.Fixed > 0 && <span style={{ color: "#22c55e" }}> · {b.gapsByStatus.Fixed} fixed</span>}
                  </div>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5 h-8 items-end">
                    {trend?.scores.slice(-5).map((s, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-t"
                        style={{
                          height: `${(s / 100) * 100}%`,
                          background: s >= 80 ? "#22c55e" : s >= 60 ? "var(--gold)" : "#ef4444",
                          minHeight: 4,
                        }}
                      />
                    ))}
                  </div>
                </div>
                {selectedBenchmark === b.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selectedBenchmark && (
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          {detailLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={16} className="animate-spin opacity-50" />
            </div>
          ) : detail ? (
            <div className="space-y-4">
              {/* Score bars */}
              <div>
                <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>Category Performance</h3>
                <div className="space-y-1.5">
                  {detail.categories?.map((cat: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] w-40 truncate shrink-0" style={{ color: "var(--muted-foreground)" }}>{cat.name}</span>
                      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${cat.pct}%`,
                            background: cat.pct >= 80 ? "#22c55e" : cat.pct >= 60 ? "var(--gold)" : "#ef4444",
                          }}
                        />
                      </div>
                      <span className="text-[10px] w-10 text-right font-mono" style={{ color: "var(--muted-foreground)" }}>{cat.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmark Files */}
              <div>
                <h3 className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                  <FileText size={12} /> Benchmark Files
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {detail.srsAsIs && (
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === "srs-as-is" ? null : "srs-as-is")}
                      className="text-[10px] px-2 py-1 rounded border transition-colors"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    >
                      SRS-as-is.md
                    </button>
                  )}
                  {detail.srsToBe && (
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === "srs-to-be" ? null : "srs-to-be")}
                      className="text-[10px] px-2 py-1 rounded border transition-colors"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    >
                      SRS-to-be.md
                    </button>
                  )}
                  {detail.gapsCombined && (
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === "gaps" ? null : "gaps")}
                      className="text-[10px] px-2 py-1 rounded border transition-colors"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    >
                      gaps.md
                    </button>
                  )}
                  {detail.implementationDoc && (
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === "impl" ? null : "impl")}
                      className="text-[10px] px-2 py-1 rounded border transition-colors"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    >
                      implementation.md
                    </button>
                  )}
                  {detail.gaps?.map((g: any) => (
                    <button
                      key={g.number}
                      onClick={() => setExpandedGap(expandedGap === g.number ? null : g.number)}
                      className="text-[10px] px-2 py-1 rounded border transition-colors"
                      style={{
                        borderColor: expandedGap === g.number ? "var(--primary)" : "var(--border)",
                        color: expandedGap === g.number ? "var(--primary)" : "var(--muted-foreground)",
                      }}
                    >
                      gap-{String(g.number).padStart(2,"0")}.md
                    </button>
                  ))}
                </div>
              </div>

              {/* Expanded document content (Toggle-style) */}
              {expandedDoc && (
                <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                  <div className="text-[9px] font-semibold mb-1.5 flex items-center gap-1" style={{ color: "var(--primary)" }}>
                    <FileText size={9} /> {expandedDoc === "srs-as-is" ? "SRS-as-is.md" : expandedDoc === "srs-to-be" ? "SRS-to-be.md" : expandedDoc === "gaps" ? "gaps.md" : "implementation.md"}
                  </div>
                  <pre className="text-[10px] whitespace-pre-wrap max-h-48 overflow-y-auto font-mono leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {expandedDoc === "srs-as-is" ? detail.srsAsIs : expandedDoc === "srs-to-be" ? detail.srsToBe : expandedDoc === "gaps" ? detail.gapsCombined : detail.implementationDoc}
                  </pre>
                </div>
              )}

              {/* Expanded gap content (Toggle-style, phase-card like) */}
              {expandedGap !== null && detail.gaps?.filter((g: any) => g.number === expandedGap).map((gap: any) => (
                <div key={gap.number} className="rounded-lg border p-3 space-y-2" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div className="text-[9px] font-semibold flex items-center gap-1" style={{ color: "var(--primary)" }}>
                      <FileText size={9} /> Gap {gap.number}: {gap.title}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/benchmarks/${encodeURIComponent(selectedBenchmark)}/gaps/${gap.number}/create-pipeline`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ project: "PAOS" }),
                            });
                            const data = await res.json();
                            if (data.builderUrl) {
                              router.push(data.builderUrl);
                            } else if (data.small) {
                              alert(`Small gap: ${data.message}`);
                            }
                          } catch {}
                        }}
                        className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1"
                        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                      >
                        <GitBranch size={8} /> Create Pipeline
                      </button>
                    </div>
                  </div>
                  <pre className="text-[10px] whitespace-pre-wrap max-h-48 overflow-y-auto font-mono leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {gap.content}
                  </pre>
                </div>
              ))}

              {/* Kanban — Gaps by Status */}
              <div>
                <h3 className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                  <LayoutList size={12} /> Gaps Kanban
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {["Pending", "In Progress", "Fixed", "Won't Fix"].map((column) => (
                    <div
                      key={column}
                      className="rounded-lg p-2 min-h-[120px]"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
                    >
                      <div className="text-[9px] font-semibold mb-1.5 flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                        {column === "Pending" && <Clock size={9} />}
                        {column === "In Progress" && <Loader2 size={9} />}
                        {column === "Fixed" && <CheckCircle2 size={9} style={{ color: "#22c55e" }} />}
                        {column === "Won't Fix" && <AlertCircle size={9} style={{ color: "#64748b" }} />}
                        {column}
                        <span className="ml-auto opacity-60">{detail.gaps?.filter((g: any) => g.status === column).length || 0}</span>
                      </div>
                      <div className="space-y-1">
                        {detail.gaps?.filter((g: any) => g.status === column).map((gap: any) => {
                          const canToggle = column === "Pending" || column === "Won't Fix";
                          const nextStatus = column === "Pending" ? "Won't Fix" : "Pending";
                          return (
                            <div
                              key={gap.number}
                              className="text-[9px] p-1.5 rounded transition-colors"
                              style={{
                                background: gap.severity === "Critical" ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
                                borderLeft: `2px solid ${
                                  gap.severity === "Critical" ? "#ef4444" :
                                  gap.severity === "High" ? "#f97316" : "#3b82f6"
                                }`,
                                cursor: canToggle ? "pointer" : "default",
                              }}
                              onClick={() => {
                                if (canToggle) updateGapStatus(gap.number, nextStatus);
                              }}
                            >
                              <div className="font-medium truncate" style={{ color: "var(--foreground)" }}>Gap {gap.number}</div>
                              <div className="truncate opacity-60" style={{ color: "var(--muted-foreground)" }}>
                                {gap.title?.slice(0, 40)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="text-[10px] flex gap-2" style={{ color: "var(--muted-foreground)" }}>
                <span>Pending ↔ Won't Fix: click to toggle. In Progress + Fixed set by execution only.</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs" style={{ color: "var(--muted-foreground)" }}>
              Failed to load benchmark details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
