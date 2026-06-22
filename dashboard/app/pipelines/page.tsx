"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Clock, GitBranch, Play, XCircle, Eye, Loader2 } from "lucide-react";

interface Phase {
  name: string;
  completed: number;
  total: number;
}

interface Pipeline {
  id: string;
  status: string;
  planner: string;
  executor: string;
  prompt: string;
  created_at: string;
  completed_at: string;
  completedTasks: number;
  totalTasks: number;
  hasWalkthrough: boolean;
  phases: Phase[];
}

const statusColors: Record<string, string> = {
  completed: "var(--green)",
  pending: "var(--accent)",
  running: "#3b82f6",
  failed: "var(--red)",
  submitted: "var(--orange)",
};

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
  } catch { return iso; }
}

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/pipelines");
    const data = await res.json();
    setPipelines(data.pipelines ?? []);
  }, []);

  const executePipeline = useCallback(async (id: string) => {
    setExecutingId(id);
    try {
      await fetch(`/api/pipelines/${id}/execute`, { method: "POST" });
      setTimeout(() => { load(); setExecutingId(null); }, 2000);
    } catch {
      setExecutingId(null);
    }
  }, [load]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 30000);
    return () => clearInterval(id);
  }, [load]);

  function toggle(id: string) {
    setExpanded((prev) => prev === id ? null : id);
  }

  // ── Render pipeline as a simplified gitgraph node ──────────────────────────
  function PipelineNode({ p, index }: { p: Pipeline; index: number }) {
    const isLast = index === pipelines.length - 1;
    const isExpanded = expanded === p.id;
    const statusColor = statusColors[p.status] ?? "var(--muted)";
    const progress = p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0;

    return (
      <div className="relative">
        {/* Git-like branch line */}
        <div className="flex">
          {/* Left column: git graph line */}
          <div className="flex flex-col items-center w-10 shrink-0">
            {/* Vertical line connecting to previous */}
            <div
              className="w-0.5 h-6"
              style={{ background: index === 0 ? "transparent" : "var(--border)" }}
            />
            {/* Node circle */}
            <div
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10"
              style={{
                background: `${statusColor}18`,
                borderColor: statusColor,
              }}
            >
              {p.status === "completed" ? (
                <CheckCircle2 size={16} style={{ color: statusColor }} />
              ) : p.status === "failed" ? (
                <XCircle size={16} style={{ color: statusColor }} />
              ) : executingId === p.id ? (
                <Loader2 size={14} className="animate-spin" style={{ color: statusColor }} />
              ) : (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); executePipeline(p.id); }}
                  className="flex items-center justify-center w-full h-full rounded-full transition-colors hover:opacity-80"
                  title="Execute pipeline"
                >
                  <Play size={14} style={{ color: statusColor }} />
                </button>
              )}
            </div>
            {/* Vertical line to next */}
            {!isLast && (
              <div className="w-0.5 flex-1 min-h-[2rem]" style={{ background: "var(--border)" }} />
            )}
          </div>

          {/* Right column: pipeline card */}
          <div className="flex-1 pb-6 pl-3">
            <button
              onClick={() => toggle(p.id)}
              className="w-full text-left rounded-lg border transition-colors"
              style={{
                background: isExpanded ? "rgba(252,213,53,0.05)" : "var(--card-bg)",
                borderColor: isExpanded ? "var(--accent)" : "var(--border)",
              }}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 px-4 py-3">
                {isExpanded ? (
                  <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                ) : (
                  <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                )}
                <span
                  className="text-xs font-mono"
                  style={{ color: statusColor }}
                >
                  {p.id}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                  style={{
                    background: `${statusColor}18`,
                    color: statusColor,
                  }}
                >
                  {p.status}
                </span>
                <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>
                  {timeAgo(p.created_at)}
                </span>
                <Link
                  href={`/pipelines/${p.id}/visualize`}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border transition-colors hover:opacity-70 shrink-0"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  <Eye size={11} />
                  Visualize
                </Link>
              </div>

              {/* Prompt */}
              <div className="px-4 pb-2">
                <p className="text-sm leading-snug line-clamp-2" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  {p.prompt || "No prompt"}
                </p>
              </div>

              {/* Progress bar */}
              {p.totalTasks > 0 && (
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {p.completedTasks}/{p.totalTasks} tasks
                    </span>
                    <span className="text-xs ml-auto font-mono" style={{ color: progress === 100 ? "var(--green)" : "var(--accent)" }}>
                      {progress}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: progress === 100
                          ? "var(--green)"
                          : "linear-gradient(90deg, var(--accent), #f59e0b)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Planner + Executor badges */}
              <div className="px-4 pb-3 flex items-center gap-2 text-xs">
                <span style={{ color: "var(--muted)" }}>Planner:</span>
                <span className="font-mono" style={{ color: "var(--orange)" }}>{p.planner}</span>
                <span style={{ color: "var(--muted)", marginLeft: 8 }}>Executor:</span>
                <span className="font-mono" style={{ color: "#3b82f6" }}>{p.executor}</span>
              </div>
            </button>

            {/* Expanded section: phases */}
            {isExpanded && p.phases.length > 0 && (
              <div className="mt-2 ml-4 rounded-lg border p-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
                  <GitBranch size={12} className="inline mr-1" />
                  Pipeline Phases
                </h3>
                <div className="space-y-2">
                  {p.phases.map((phase, i) => {
                    const pct = phase.total > 0 ? Math.round((phase.completed / phase.total) * 100) : 0;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        {/* Phase node */}
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            background: pct === 100 ? "var(--green)" : pct > 0 ? "var(--accent)" : "var(--border)",
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium truncate">{phase.name}</span>
                            <span className="text-xs font-mono shrink-0 ml-2" style={{ color: "var(--muted)" }}>
                              {phase.completed}/{phase.total}
                            </span>
                          </div>
                          <div
                            className="h-1 rounded-full mt-1 overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: pct === 100 ? "var(--green)" : "var(--accent)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Walkthrough link */}
                {p.hasWalkthrough && (
                  <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--green)" }}>
                    <CheckCircle2 size={12} className="inline mr-1" />
                    Walkthrough available
                  </div>
                )}
              </div>
            )}

            {/* Expanded: metadata */}
            {isExpanded && (
              <div className="ml-4 mt-2 grid grid-cols-2 gap-2 text-xs px-4 py-3 rounded-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                <div>
                  <span style={{ color: "var(--muted)" }}>Pipeline ID </span>
                  <span className="font-mono">{p.id}</span>
                </div>
                <div>
                  <span style={{ color: "var(--muted)" }}>Created </span>
                  <span>{p.created_at || "—"}</span>
                </div>
                <div>
                  <span style={{ color: "var(--muted)" }}>Completed </span>
                  <span>{p.completed_at || "—"}</span>
                </div>
                <div>
                  <span style={{ color: "var(--muted)" }}>Executor </span>
                  <span className="font-mono">{p.executor}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <GitBranch size={18} style={{ color: "var(--accent)" }} />
        <h1 className="text-xl font-semibold">Pipeline GitGraph</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Visual DAG of all PAOS pipelines — click to expand phases and details
      </p>

      <div className="max-w-3xl">
        {pipelines.length === 0 ? (
          <div className="text-sm py-12 text-center" style={{ color: "var(--muted)" }}>
            <GitBranch size={24} className="mx-auto mb-3 opacity-30" />
            No pipelines yet
          </div>
        ) : (
          pipelines.map((p, i) => (
            <PipelineNode key={p.id} p={p} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
