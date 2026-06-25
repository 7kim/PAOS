"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, BarChart3, GitBranch, ChevronRight, FileText } from "lucide-react";

interface BenchmarkSummary {
  id: string;
  grade: string;
  score: number;
  date: string;
  gapCount: number;
  gapsByStatus: Record<string, number>;
}

interface BenchmarkBrowserProps {
  onSelect: (benchmarkId: string, gapNumber?: number) => void;
}

export function BenchmarkBrowser({ onSelect }: BenchmarkBrowserProps) {
  const [benchmarks, setBenchmarks] = useState<BenchmarkSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [gaps, setGaps] = useState<any[]>([]);
  const [gapsLoading, setGapsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/benchmarks")
      .then((r) => r.json())
      .then((data) => setBenchmarks(data.benchmarks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadGaps = useCallback(async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setGapsLoading(true);
    try {
      const res = await fetch(`/api/benchmarks/${encodeURIComponent(id)}`);
      const data = await res.json();
      setGaps(data.gaps || []);
    } catch {}
    setGapsLoading(false);
  }, [expandedId]);

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
      <div className="flex items-center justify-center py-8">
        <Loader2 size={14} className="animate-spin opacity-50" />
      </div>
    );
  }

  if (benchmarks.length === 0) {
    return (
      <div className="text-center py-8 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <BarChart3 size={24} className="mx-auto mb-2 opacity-40" />
        No benchmarks found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--foreground)" }}>
        <BarChart3 size={12} /> Benchmarks
      </h4>
      {benchmarks.map((b) => (
        <div key={b.id} className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => loadGaps(b.id)}
            className="w-full flex items-center gap-2 p-2 text-left transition-colors hover:bg-white/5"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
              style={{
                background: `${gradeColor(b.grade)}18`,
                color: gradeColor(b.grade),
                border: `2px solid ${gradeColor(b.grade)}`,
              }}
            >
              {b.grade}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium truncate" style={{ color: "var(--foreground)" }}>
                {b.date || b.id}
              </div>
              <div className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                {b.score}/100 · {b.gapCount} gaps
              </div>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          {/* Expanded gaps */}
          {expandedId === b.id && (
            <div className="border-t px-2 py-1.5 space-y-1" style={{ borderColor: "var(--border)" }}>
              {gapsLoading ? (
                <Loader2 size={10} className="animate-spin mx-auto py-2" />
              ) : (
                gaps.map((g) => (
                  <button
                    key={g.number}
                    onClick={() => onSelect(b.id, g.number)}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-left transition-colors hover:bg-white/5"
                    style={{ color: "var(--foreground)" }}
                  >
                    <FileText size={9} className="shrink-0 opacity-50" />
                    <span className="truncate flex-1">
                      Gap {g.number}: {g.title?.slice(0, 35)}
                    </span>
                    <span
                      className="shrink-0 text-[8px] px-1 rounded"
                      style={{
                        background: g.severity === "Critical" ? "rgba(239,68,68,0.15)" : g.severity === "High" ? "rgba(249,115,22,0.15)" : "rgba(59,130,246,0.15)",
                        color: g.severity === "Critical" ? "#ef4444" : g.severity === "High" ? "#f97316" : "#3b82f6",
                      }}
                    >
                      {g.severity === "Critical" ? "CRIT" : g.severity === "High" ? "HIGH" : "MED"}
                    </span>
                    <GitBranch size={9} className="shrink-0 opacity-50" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
