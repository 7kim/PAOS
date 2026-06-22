"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Brain,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowDown,
  FileText,
  ListTodo,
  Loader2,
  GitBranch,
  ChevronDown,
  ChevronRight,
  FileCode,
  ExternalLink,
  Eye,
  EyeOff,
  HandMetal,
} from "lucide-react";

interface PhaseArtifact {
  filename: string;
  content: string;
  lines: number;
}

interface Phase {
  agent: string;
  role: string;
  label: string;
  status: string;
  artifacts: PhaseArtifact[];
}

interface PipelineData {
  id: string;
  meta: Record<string, unknown>;
  pipeline: Record<string, unknown>;
  phases: Phase[];
  versionedArtifacts: Record<string, { filename: string; content: string; lines: number; version: number }[]>;
  taskList: { status: string; label: string; complexity: string; file?: string; details: string[] }[];
  stats: {
    completedTasks: number;
    totalTasks: number;
    completedPhases: number;
    totalPhases: number;
    progress: number;
    hasWalkthrough: boolean;
    hasPipelineJson: boolean;
  };
}

const agentColors: Record<string, string> = {
  "hermes-nous": "#eab308",
  "hermes": "#eab308",
  "opencode-developer": "#3b82f6",
  "opencode": "#3b82f6",
  "claude": "#f97316",
  "codex": "#10b981",
  "antigravity": "#ec4899",
  "gemini": "#4285f4",
  "openclaw": "#8b5cf6",
};

const roleColors: Record<string, string> = {
  planner: "#eab308",
  enhancer: "#8b5cf6",
  reviewer: "#f97316",
  executor: "#3b82f6",
};

function agentColor(agent: string): string {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

function statusBadge(s: string) {
  const cfg: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    completed: { color: "#22c55e", icon: <CheckCircle2 size={10} />, label: "Done" },
    executing: { color: "#3b82f6", icon: <Loader2 size={10} className="animate-spin" />, label: "Running" },
    pending: { color: "#64748b", icon: <Clock size={10} />, label: "Pending" },
    failed: { color: "#ef4444", icon: <AlertCircle size={10} />, label: "Failed" },
  };
  const c = cfg[s] ?? { color: "#64748b", icon: <Clock size={10} />, label: s };
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${c.color}18`, color: c.color }}>
      {c.icon}
      {c.label}
    </span>
  );
}

function Toggle({ open, onToggle, icon, label, badge, color }: {
  open: boolean; onToggle: () => void; icon: React.ReactNode; label: string; badge?: string; color: string;
}) {
  return (
    <button type="button" onClick={onToggle}
      className="w-full flex items-center gap-2 text-xs rounded-lg px-3 py-2.5 transition-colors hover:opacity-80 text-left"
      style={{ background: open ? `${color}0a` : "rgba(255,255,255,0.02)" }}
    >
      {open ? <ChevronDown size={12} style={{ color }} /> : <ChevronRight size={12} style={{ color }} />}
      {icon}
      <span className="font-medium" style={{ color: "var(--foreground)" }}>{label}</span>
      {badge && <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--muted)" }}>{badge}</span>}
    </button>
  );
}

function DiffView({ v1, v2 }: { v1: string; v2: string }) {
  const lines1 = v1.split("\n");
  const lines2 = v2.split("\n");
  const maxLen = Math.max(lines1.length, lines2.length);
  const diffLines: { type: "same" | "removed" | "added"; text: string }[] = [];
  for (let i = 0; i < maxLen; i++) {
    if (i >= lines1.length) {
      diffLines.push({ type: "added", text: lines2[i] });
    } else if (i >= lines2.length) {
      diffLines.push({ type: "removed", text: lines1[i] });
    } else if (lines1[i] !== lines2[i]) {
      diffLines.push({ type: "removed", text: lines1[i] });
      diffLines.push({ type: "added", text: lines2[i] });
    } else {
      diffLines.push({ type: "same", text: lines1[i] });
    }
  }
  return (
    <pre className="text-[11px] p-3 overflow-auto max-h-96 leading-relaxed font-mono" style={{ background: "rgba(0,0,0,0.15)" }}>
      {diffLines.map((l, i) => (
        <div key={i} style={{
          background: l.type === "removed" ? "rgba(239,68,68,0.15)" : l.type === "added" ? "rgba(34,197,94,0.12)" : "transparent",
          color: l.type === "removed" ? "#ef4444" : l.type === "added" ? "#22c55e" : "var(--foreground)",
          padding: "0 8px",
        }}>
          {l.type === "removed" ? "− " : l.type === "added" ? "+ " : "  "}{l.text}
        </div>
      ))}
    </pre>
  );
}

export default function PipelineVisualizePage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openArtifacts, setOpenArtifacts] = useState<Set<string>>(new Set());
  const [showDiff, setShowDiff] = useState<Set<string>>(new Set());
  const [isIntervening, setIsIntervening] = useState(false);

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
    const id = setInterval(() => void load(), 5000);
    return () => clearInterval(id);
  }, [load]);

  function toggleArtifact(key: string) {
    setOpenArtifacts((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function toggleDiff(key: string) {
    setShowDiff((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function phaseHasDiff(idx: number): boolean {
    const phase = data?.phases[idx];
    if (!phase) return false;
    return phase.artifacts.some((art) => {
      const baseName = art.filename.replace(/\.md$/, "").replace(/-[a-zA-Z0-9_-]+$/, "");
      return (data?.versionedArtifacts[baseName]?.filter((v) => v.filename !== art.filename).length ?? 0) > 0;
    });
  }

  async function handleIntervene(phaseNum: number, phaseLabel: string) {
    if (!data?.id) return;
    setIsIntervening(true);
    try {
      // Create an INTERVENE.md file in the pipeline directory via the API
      await fetch(`/api/pipelines/${data.id}/intervene`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ phase: phaseNum, label: phaseLabel }),
      });
      // Reload to show the new artifact
      window.location.reload();
    } catch {
      setIsIntervening(false);
    }
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <GitBranch size={18} style={{ color: "var(--accent)" }} />
        <h1 className="text-xl font-semibold">{id}</h1>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${data.stats.progress === 100 ? "#22c55e" : "#3b82f6"}18`, color: data.stats.progress === 100 ? "#22c55e" : "#3b82f6" }}
        >
          {data.stats.progress}%
        </span>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        {String(data.meta.prompt ?? "")}
      </p>

      <div className="relative mb-8">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 z-0"
          style={{ background: `linear-gradient(180deg, var(--accent) 0%, #3b82f6 100%)` }}
        />

        {data.phases.map((phase, idx) => {
          const isLast = idx === data.phases.length - 1;
          const color = roleColors[phase.role] ?? agentColor(phase.agent);
          const agentIcon = phase.role === "planner" || phase.role === "enhancer" ? <Brain size={20} /> : <Zap size={20} />;

          return (
            <div key={idx}>
              <div className="relative z-10 flex justify-center" style={{ marginBottom: isLast ? 0 : -1 }}>
                <div className="w-full max-w-4xl rounded-xl border-2 p-5"
                  style={{ background: "var(--card-bg)", borderColor: color }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: `${color}18` }}
                    >
                      {agentIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                          {phase.label || phase.role}
                        </span>
                        {statusBadge(phase.status)}
                        {phase.role === "enhancer" && phaseHasDiff(idx) && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleDiff(String(idx)); }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
                            style={{
                              background: showDiff.has(String(idx)) ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.1)",
                              color: showDiff.has(String(idx)) ? "#a78bfa" : "#8b5cf6",
                            }}
                          >
                            {showDiff.has(String(idx)) ? <EyeOff size={10} /> : <Eye size={10} />}
                            {showDiff.has(String(idx)) ? "Hide diff" : "Show diff"}
                          </button>
                        )}
                      </div>
                      <div className="text-xs font-mono" style={{ color }}>
                        {phase.agent}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        Phase {idx + 1}/{data.phases.length}
                      </span>
                      {data.stats.progress < 100 && !isIntervening && (
                        <button
                          type="button"
                          onClick={() => handleIntervene(idx + 1, phase.label)}
                          className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border transition-colors hover:opacity-70"
                          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                          title="Intervene — add intervene note to this phase"
                        >
                          <HandMetal size={10} />
                          Intervene
                        </button>
                      )}
                      {isIntervening && (
                        <span className="text-[10px] flex items-center gap-1" style={{ color: "#8b5cf6" }}>
                          <Loader2 size={10} className="animate-spin" />
                          Adding intervene note...
                        </span>
                      )}
                    </div>
                  </div>

                  {phase.artifacts.length === 0 && phase.status === "pending" && (
                    <div className="text-xs text-center py-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", color: "var(--muted)" }}>
                      Waiting for agent...
                    </div>
                  )}

                  {phase.artifacts.length > 0 && (
                    <div className="space-y-1.5">
                      {phase.artifacts.map((art) => {
                        const key = `${idx}:${art.filename}`;
                        const isOpen = openArtifacts.has(key);
                        const baseName = art.filename.replace(/\.md$/, "").replace(/-[a-zA-Z0-9_-]+$/, "");
                        const versions = data.versionedArtifacts[baseName]?.filter((v) => v.filename !== art.filename) ?? [];
                        const hasV2 = versions.length > 0;
                        const showingDiff = showDiff.has(String(idx)) && hasV2;

                        return (
                          <div key={key} className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                            <Toggle
                              open={isOpen}
                              onToggle={() => toggleArtifact(key)}
                              icon={art.filename.toLowerCase().includes("plan") ? <FileText size={13} style={{ color }} /> : <ListTodo size={13} style={{ color }} />}
                              label={art.filename}
                              badge={`${art.lines} lines`}
                              color={color}
                            />
                            {isOpen && (
                              <div style={{ borderTop: "1px solid var(--border)" }}>
                                {showingDiff && hasV2 ? (
                                  <DiffView v1={versions[0].content} v2={art.content} />
                                ) : (
                                  <pre className="text-[11px] p-3 overflow-auto leading-relaxed font-mono"
                                    style={{ background: "rgba(0,0,0,0.12)", color: "var(--foreground)" }}
                                  >
                                    {(art.content as string) || "(empty)"}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {!isLast && (
                <button
                  type="button"
                  disabled={phase.status === "completed"}
                  onClick={() => {
                    if (phase.status === "completed") return;
                    const confirmed = confirm(`Advance pipeline to the next phase?\n\nCurrent: ${phase.label} (${phase.status})`);
                    if (confirmed) {
                      fetch(`/api/pipelines/${data.id}/execute`, { method: "POST" })
                        .then(() => window.location.reload())
                        .catch(() => {});
                    }
                  }}
                  className="relative z-10 flex justify-center py-2 w-full transition-opacity"
                  style={{ opacity: phase.status === "completed" ? 0.4 : 1, cursor: phase.status === "completed" ? "default" : "pointer" }}
                  title={phase.status === "completed" ? `${phase.label} already completed — click next undone phase's arrow` : "Click to advance to next phase"}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{ background: "var(--card-bg)", borderColor: color }}
                  >
                    <ArrowDown size={16} style={{ color }} />
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Task summary */}
      {data.taskList.length > 0 && (
        <div className="max-w-4xl mx-auto rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <ListTodo size={14} style={{ color: "#3b82f6" }} />
            <span className="text-sm font-medium">Task Summary</span>
            <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>
              {data.stats.completedTasks}/{data.stats.totalTasks}
            </span>
          </div>
          <div className="p-3 space-y-1">
            {data.taskList.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs px-3 py-2 rounded"
                style={{
                  background: t.status === "doing" ? "rgba(59,130,246,0.08)" : "transparent",
                  borderLeft: t.status === "doing" ? "3px solid #3b82f6" : t.status === "done" ? "3px solid #22c55e" : "3px solid transparent",
                  opacity: t.status === "done" ? 0.6 : 1,
                }}
              >
                {t.status === "done" ? <CheckCircle2 size={11} style={{ color: "#22c55e" }} /> : t.status === "doing" ? <Loader2 size={11} className="animate-spin" style={{ color: "#3b82f6" }} /> : <Clock size={11} style={{ color: "#64748b" }} />}
                <span className="flex-1" style={{ color: "var(--foreground)" }}>{t.label}</span>
                <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>[{t.complexity}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* pipeline.json live */}
      {data.stats.hasPipelineJson && (
        <div className="max-w-4xl mx-auto mt-4 rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ color: data.stats.progress === 100 ? "#22c55e" : "#3b82f6" }}>
            {data.stats.progress === 100 ? (
              <CheckCircle2 size={14} />
            ) : (
              <Loader2 size={14} className="animate-spin" />
            )}
            <span className="text-sm font-medium">pipeline.json</span>
            <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--muted)" }}>
              {data.stats.progress === 100 ? "completed" : "auto-refresh 5s"}
            </span>
          </div>
          <pre className="text-xs p-4 overflow-auto max-h-48 leading-relaxed font-mono" style={{ background: "rgba(0,0,0,0.12)", color: "var(--foreground)", borderTop: "1px solid var(--border)" }}>
            {JSON.stringify(data.pipeline, null, 2)}
          </pre>
        </div>
      )}

      {/* Walkthrough */}
      {data.stats.hasWalkthrough && (
        <div className="max-w-4xl mx-auto mt-4 rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ color: "#22c55e" }}>
            <ExternalLink size={14} />
            <span className="text-sm font-medium">WALKTHROUGH.md</span>
            <span className="ml-auto text-[10px]" style={{ color: "var(--muted)" }}>completed</span>
          </div>
        </div>
      )}
    </div>
  );
}
