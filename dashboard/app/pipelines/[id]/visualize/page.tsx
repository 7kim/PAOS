"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Brain,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  FileText,
  ListTodo,
  Loader2,
  GitBranch,
  ChevronDown,
  ChevronRight,
  FileCode,
  ExternalLink,
  Code2,
} from "lucide-react";

interface TaskDetail {
  status: string;
  label: string;
  complexity: string;
  file?: string;
  details: string[];
}

interface PipelineData {
  id: string;
  meta: Record<string, unknown>;
  pipeline: Record<string, unknown>;
  plan: string;
  tasks: string;
  taskList: TaskDetail[];
  walkthrough: string;
  stats: {
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    totalTasks: number;
    progress: number;
    hasWalkthrough: boolean;
    hasPipelineJson: boolean;
  };
}

const statusConfig: Record<string, { label: string; color: string; pulse: boolean }> = {
  submitted: { label: "Submitted", color: "#f59e0b", pulse: false },
  thinking: { label: "Thinking", color: "#8b5cf6", pulse: true },
  executing: { label: "Executing", color: "#3b82f6", pulse: true },
  completed: { label: "Completed", color: "#22c55e", pulse: false },
  failed: { label: "Failed", color: "#ef4444", pulse: false },
};

function getStatus(s: string) {
  return statusConfig[s] ?? { label: s, color: "#64748b", pulse: false };
}

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

// ── Accordion: clickable toggle line ──────────────────────────────────────
function AccordionLine({
  open,
  onToggle,
  icon,
  label,
  badge,
  color,
}: {
  open: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-2 text-xs rounded-lg px-3 py-2.5 transition-colors hover:opacity-80 text-left"
      style={{ background: open ? `${color}0a` : "rgba(255,255,255,0.02)" }}
    >
      {open ? <ChevronDown size={12} style={{ color }} /> : <ChevronRight size={12} style={{ color }} />}
      {icon}
      <span className="font-medium" style={{ color: "var(--foreground)" }}>{label}</span>
      {badge && (
        <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--muted)" }}>{badge}</span>
      )}
    </button>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────
function TaskBadge({ status }: { status: string }) {
  const color = status === "done" ? "#22c55e" : status === "doing" ? "#3b82f6" : "#64748b";
  const bg = status === "done" ? "rgba(34,197,94,0.12)" : status === "doing" ? "rgba(59,130,246,0.12)" : "rgba(100,116,139,0.12)";
  const icon = status === "done" ? <CheckCircle2 size={10} /> : status === "doing" ? <Loader2 size={10} className="animate-spin" /> : <Clock size={10} />;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0" style={{ background: bg, color }}>
      {icon}
      {status}
    </span>
  );
}

// ── Live status dot ───────────────────────────────────────────────────────
function StatusDot({ color, pulse }: { color: string; pulse: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{
        background: color,
        animation: pulse ? "pulse 1.5s ease-in-out infinite" : "none",
        boxShadow: pulse ? `0 0 6px ${color}` : "none",
      }}
    />
  );
}

export default function PipelineVisualizePage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Accordion state: which items are expanded
  const [openPlan, setOpenPlan] = useState(false);
  const [openTasksDoc, setOpenTasksDoc] = useState(false);
  const [openWalkthrough, setOpenWalkthrough] = useState(false);
  const [openPipelineJson, setOpenPipelineJson] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/pipelines/${id}`);
      if (!res.ok) { setError(`HTTP ${res.status}`); setLoading(false); return; }
      setData(await res.json());
      setLoading(false);
    } catch (e) {
      setError(String(e));
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const interval = setInterval(() => void load(), 5000);
    return () => clearInterval(interval);
  }, [load]);

  function toggleTask(i: number) {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={24} className="mx-auto mb-3" style={{ color: "#ef4444" }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>{error || "Pipeline not found"}</p>
      </div>
    );
  }

  const status = getStatus(String(data.meta.status ?? "unknown"));
  const sc = status.color;

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-1">
        <GitBranch size={18} style={{ color: "var(--accent)" }} />
        <h1 className="text-xl font-semibold">{id}</h1>
        <span
          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{
            background: `${sc}18`,
            color: sc,
            animation: status.pulse ? "pulse 2s infinite" : "none",
          }}
        >
          {status.label}
        </span>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        {String(data.meta.prompt ?? "")}
      </p>

      {/* ── Pipeline Flow ───────────────────────────────────────────────── */}
      <div className="relative mb-8">
        {/* Vertical connector line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 z-0"
          style={{ background: `linear-gradient(180deg, var(--accent) 0%, #3b82f6 100%)` }}
        />

        {/* ── PLANNER NODE ──────────────────────────────────────────── */}
        <div className="relative z-10 flex justify-center mb-[-1px]">
          <div
            className="w-full max-w-4xl rounded-xl border-2 p-5"
            style={{ background: "var(--card-bg)", borderColor: "var(--accent)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(252,213,53,0.15)" }}>
                <Brain size={20} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="text-sm font-semibold">Planner</div>
                <div className="text-xs font-mono" style={{ color: "var(--accent)" }}>
                  {String(data.meta.planner ?? "—")}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <StatusDot color="#22c55e" pulse={false} />
                <span className="text-[11px]" style={{ color: "#22c55e" }}>Done</span>
              </div>
            </div>

            {/* Created timestamp */}
            <div className="text-[10px] font-mono mb-3" style={{ color: "var(--muted)" }}>
              Created {timeAgo(String(data.meta.created_at ?? ""))}
            </div>

            {/* Plan.md — clickable accordion */}
            <div className="rounded-lg border mb-2 overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <AccordionLine
                open={openPlan}
                onToggle={() => setOpenPlan(!openPlan)}
                icon={<FileText size={13} style={{ color: "var(--accent)" }} />}
                label="IMPLEMENTATION_PLAN.md"
                badge={`${(data.plan || "").split("\n").length} lines`}
                color="var(--accent)"
              />
              {openPlan && (
                <pre
                  className="text-[11px] p-3 overflow-auto leading-relaxed font-mono"
                  style={{ background: "rgba(0,0,0,0.12)", color: "var(--foreground)", borderTop: "1px solid var(--border)" }}
                >
                  {data.plan || "(empty)"}
                </pre>
              )}
            </div>

            {/* TASKS.md — clickable accordion */}
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <AccordionLine
                open={openTasksDoc}
                onToggle={() => setOpenTasksDoc(!openTasksDoc)}
                icon={<ListTodo size={13} style={{ color: "var(--accent)" }} />}
                label="TASKS.md"
                badge={`${data.stats.totalTasks} tasks`}
                color="var(--accent)"
              />
              {openTasksDoc && (
                <pre
                  className="text-[11px] p-3 overflow-auto leading-relaxed font-mono"
                  style={{ background: "rgba(0,0,0,0.12)", color: "var(--foreground)", borderTop: "1px solid var(--border)" }}
                >
                  {data.tasks || "(empty)"}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* ── ARROW CONNECTOR ───────────────────────────────────────── */}
        <div className="relative z-10 flex justify-center py-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2"
            style={{
              background: "var(--card-bg)",
              borderColor: sc,
              boxShadow: status.pulse ? `0 0 14px ${sc}55` : "none",
            }}
          >
            <ArrowRight size={18} style={{ color: sc }} />
          </div>
        </div>

        {/* ── EXECUTOR NODE ─────────────────────────────────────────── */}
        <div className="relative z-10 flex justify-center">
          <div
            className="w-full max-w-4xl rounded-xl border-2 p-5"
            style={{ background: "var(--card-bg)", borderColor: "#3b82f6" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}>
                <Zap size={20} style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <div className="text-sm font-semibold">Executor</div>
                <div className="text-xs font-mono" style={{ color: "#3b82f6" }}>
                  {String(data.meta.executor ?? "—")}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <StatusDot color={sc} pulse={status.pulse} />
                <span className="text-[11px]" style={{ color: sc }}>{status.label}</span>
              </div>
            </div>

            {/* Progress bar */}
            {data.stats.totalTasks > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: "var(--muted)" }}>
                    {data.stats.completedTasks}/{data.stats.totalTasks} tasks
                  </span>
                  <span className="font-mono" style={{ color: data.stats.progress === 100 ? "#22c55e" : sc }}>
                    {data.stats.progress}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${data.stats.progress}%`,
                      background: data.stats.progress === 100
                        ? "linear-gradient(90deg, #22c55e, #16a34a)"
                        : "linear-gradient(90deg, #3b82f6, #60a5fa)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Live status line from pipeline.json */}
            {data.pipeline && (data.pipeline as Record<string, unknown>).currentTask && (
              <div className="flex items-center gap-1.5 text-[11px] mb-2 px-2 py-1 rounded" style={{ background: "rgba(59,130,246,0.08)", color: "#60a5fa" }}>
                <Loader2 size={11} className="animate-spin" />
                <span className="font-medium">{(data.pipeline as Record<string, unknown>).currentTask as string}</span>
              </div>
            )}

            {/* pipeline.json raw live viewer */}
            {data.pipeline && Object.keys(data.pipeline).length > 1 && (
              <div
                className="mb-3 rounded-lg border overflow-hidden"
                style={{ borderColor: "var(--border)" }}
              >
                <AccordionLine
                  open={openPipelineJson}
                  onToggle={() => setOpenPipelineJson(!openPipelineJson)}
                  icon={<Code2 size={13} style={{ color: "#3b82f6" }} />}
                  label="pipeline.json (live)"
                  badge="auto-refresh"
                  color="#3b82f6"
                />
                {openPipelineJson && (
                  <pre
                    className="text-[11px] p-3 overflow-auto font-mono"
                    style={{ background: "rgba(0,0,0,0.12)", color: "var(--foreground)", borderTop: "1px solid var(--border)" }}
                  >
                    {JSON.stringify(data.pipeline, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Task list */}
            <div className="space-y-1.5">
              {data.taskList.length === 0 && (
                <div className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>No tasks parsed</div>
              )}
              {data.taskList.map((task, i) => {
                const isOpen = expandedTasks.has(i);
                const isDoing = task.status === "doing";
                const isDone = task.status === "done";

                return (
                  <div key={i} className="rounded-lg overflow-hidden border" style={{ borderColor: isDoing ? "#3b82f6" : "var(--border)" }}>
                    {/* Clickable task header */}
                    <button
                      type="button"
                      onClick={() => toggleTask(i)}
                      className="w-full flex items-center gap-2 text-xs px-3 py-2.5 text-left transition-colors"
                      style={{
                        background: isDoing ? "rgba(59,130,246,0.06)" : isDone ? "rgba(34,197,94,0.04)" : "transparent",
                      }}
                    >
                      {isOpen
                        ? <ChevronDown size={11} style={{ color: "var(--muted)" }} />
                        : <ChevronRight size={11} style={{ color: "var(--muted)" }} />
                      }
                      <TaskBadge status={task.status} />
                      <span className="flex-1 truncate" style={{ color: "var(--foreground)" }}>
                        {task.label}
                      </span>
                      <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--muted)" }}>
                        [{task.complexity}]
                      </span>
                    </button>

                    {/* Expandable task details */}
                    {isOpen && (
                      <div
                        className="px-3 pb-3 pt-1 text-xs space-y-1.5"
                        style={{ background: "rgba(0,0,0,0.08)", borderTop: "1px solid var(--border)" }}
                      >
                        {task.file && (
                          <div className="flex items-center gap-1.5 font-mono" style={{ color: "var(--accent)" }}>
                            <FileCode size={11} />
                            {task.file}
                          </div>
                        )}
                        {task.details.length > 0 && (
                          <ul className="space-y-0.5">
                            {task.details.map((d, j) => (
                              <li key={j} className="flex items-start gap-1.5" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                                <span className="shrink-0 mt-0.5">•</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {!task.file && task.details.length === 0 && (
                          <span style={{ color: "var(--muted)" }}>No details</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── WALKTHROUGH (bottom, only if exists) ────────────────────── */}
      {data.stats.hasWalkthrough && (
        <div className="max-w-md mx-auto rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
          <AccordionLine
            open={openWalkthrough}
            onToggle={() => setOpenWalkthrough(!openWalkthrough)}
            icon={<ExternalLink size={13} style={{ color: "#22c55e" }} />}
            label="WALKTHROUGH.md"
            badge="completed"
            color="#22c55e"
          />
          {openWalkthrough && (
            <pre
              className="text-[11px] p-3 overflow-auto max-h-64 leading-relaxed font-mono"
              style={{ background: "rgba(0,0,0,0.12)", color: "var(--foreground)", borderTop: "1px solid var(--border)" }}
            >
              {data.walkthrough || "(empty)"}
            </pre>
          )}
        </div>
      )}

      {/* ── pipeline.json (hidden but shown as live status in executor) ── */}
    </div>
  );
}
