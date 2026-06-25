"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronRight, Clock, FolderKanban, GitBranch, Play, XCircle, Eye, Loader2, Trash2, Plus, Workflow, Brain, Zap, AlertCircle, ArrowDown, FileText, ListTodo, FileCode, ExternalLink, EyeOff, HandMetal } from "lucide-react";
import MiniDagView from "@/components/pipeline-builder/MiniDagView";
import { VisualToolbar } from "@/components/pipeline-builder/VisualToolbar";
import { loadVisualSettings, saveVisualSettings, type VisualSettings } from "@/components/pipeline-builder/VisualSettings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  id?: string;
  prompt?: string;
  reasoning?: string;
  tasksMd?: string;
  walkthroughMd?: string;
  outputPreview?: string;
  pid?: number | null;
}

interface PipelineData {
  id: string;
  meta: Record<string, unknown>;
  pipeline: Record<string, unknown>;
  phases: Phase[];
  versionedArtifacts: Record<string, { filename: string; content: string; lines: number; version: number }[]>;
  taskList: { status: string; label: string; complexity: string; file?: string; details: string[] }[];
  builderLayout: { nodes: any[]; edges: any[] } | null;
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
      {badge && <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>{badge}</span>}
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
  const router = useRouter();
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openArtifacts, setOpenArtifacts] = useState<Set<string>>(new Set());
  const [showDiff, setShowDiff] = useState<Set<string>>(new Set());
  const [isIntervening, setIsIntervening] = useState(false);
  const [editingIntervene, setEditingIntervene] = useState(false);
  const [interveneContent, setInterveneContent] = useState("");
  const [interveneSaving, setInterveneSaving] = useState(false);
  const [flowStatus, setFlowStatus] = useState<Record<string, any> | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [showVisual, setShowVisual] = useState(false);
  const [visualSettings, setVisualSettings] = useState<VisualSettings>(loadVisualSettings);

  // Execute modal state
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [executePrompt, setExecutePrompt] = useState("");
  const [executingPhase, setExecutingPhase] = useState(0);
  const [executingLabel, setExecutingLabel] = useState("");

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

  // Poll flow status for builder pipelines
  useEffect(() => {
    if (!id) return;
    // Check if this is a builder pipeline by looking at the initial load
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pipelines/${id}/flow-status`);
        const data = await res.json();
        if (data.flowStatus) {
          setFlowStatus(data.flowStatus);
        }
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

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

  function buildExecutePrompt(phaseNum: number, phaseLabel: string): string {
    const pipeDir = `${id}`;
    return `You have been assigned pipeline ${id} in PAOS project. Read ~/AI_Workflow/memory/pipelines/PAOS/${pipeDir}/META.json, PLAN.md, and TASKS.md. Execute ALL tasks in order. Update TASKS.md task markers ([ ] → [~] → [x]) as you complete each one. Update ~/AI_Workflow/memory/pipelines/PAOS/${pipeDir}/pipeline.json with your progress (status, currentTask, progress e.g. "3/8"). When ALL tasks are done, write ~/AI_Workflow/memory/pipelines/PAOS/${pipeDir}/WALKTHROUGH.md with a full summary of what was built, files modified, commands run, and verification steps. Then update ~/AI_Workflow/memory/pipelines/PAOS/${pipeDir}/META.json status to "completed" with the completed_at timestamp.`;
  }

  function openExecuteModal(phaseNum: number, phaseLabel: string) {
    setExecutingPhase(phaseNum);
    setExecutingLabel(phaseLabel);
    setExecutePrompt(buildExecutePrompt(phaseNum, phaseLabel));
    setShowExecuteModal(true);
  }

  async function handleExecute() {
    if (!data?.id) return;
    setShowExecuteModal(false);
    try {
      await fetch(`/api/pipelines/${data.id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: executePrompt }),
      });
      window.location.reload();
    } catch {}
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
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{error || "Pipeline not found"}</p>
      </div>
    );
  }

  // Compute project context
  const projectName = String((data.meta as any).project || String((data.meta as any).pipeline_id || "").split("-")[0] || "PAOS");
  const filesystemPath = `~/AI_Workflow/memory/pipelines/${projectName}/${encodeURIComponent(id)}/`;
  const projectPath = `${projectName} / ${id}`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <GitBranch size={18} style={{ color: "var(--accent)" }} />
        <h1 className="text-xl font-semibold" title={filesystemPath}>
          {projectPath}
        </h1>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${data.stats.progress === 100 ? "#22c55e" : "#3b82f6"}18`, color: data.stats.progress === 100 ? "#22c55e" : "#3b82f6" }}
        >
          {data.stats.progress}%
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: "var(--primary)" }}>
          <FolderKanban size={10} />
          {projectName}
        </span>
        <span className="text-[8px]" style={{ color: "var(--muted-foreground)" }}>/</span>
        <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
          {id}
        </span>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
        {String(data.meta.prompt ?? "")}
      </p>

      {/* Execute / Open buttons */}
      <div className="flex items-center gap-2 mb-6">
        {data.meta.status !== "completed" && (
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch(`/api/pipelines/${encodeURIComponent(id)}/execute-flow`, { method: "POST" });
                load();
              } catch {}
            }}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 flex items-center gap-1.5 font-medium"
            style={{ borderColor: "#22c55e", color: "#22c55e", background: "#22c55e10" }}
          >
            <Play size={12} /> Execute Flow
          </button>
        )}
        {data.builderLayout && (
          <button
            type="button"
            onClick={() => router.push(`/pipelines/builder?load=${encodeURIComponent(id)}`)}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 flex items-center gap-1.5"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <GitBranch size={12} /> Open in Builder
          </button>
        )}
      </div>

      {/* Builder DAG — React Flow */}
      {data.builderLayout && data.builderLayout.nodes && data.builderLayout.nodes.length > 0 && (
        <div className="mb-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <GitBranch size={14} style={{ color: "var(--primary)" }} />
            <span className="text-sm font-medium">Pipeline DAG</span>
            <span className="ml-auto text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {data.builderLayout.nodes.length} nodes · {data.builderLayout.edges?.length ?? 0} connections
            </span>
          </div>
          <div style={{ height: visualSettings.dagHeight || 300 }}>
            <MiniDagView
              nodes={data.builderLayout.nodes}
              edges={data.builderLayout.edges || []}
              flowStatus={flowStatus}
              onNodeClick={(nodeId: string) => setExpandedNode(expandedNode === nodeId ? null : nodeId)}
              expandedNode={expandedNode}
              id={id}
              visualSettings={visualSettings}
            />
          </div>
        </div>
      )}

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
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        Phase {idx + 1}/{data.phases.length}
                      </span>
                      {data.stats.progress < 100 && !isIntervening && (
                        <button
                          type="button"
                          onClick={() => handleIntervene(idx + 1, phase.label)}
                          className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border transition-colors hover:opacity-70"
                          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
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
                    <div className="text-xs text-center py-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", color: "var(--muted-foreground)" }}>
                      Waiting for agent...
                    </div>
                  )}

                  {/* Phase enrichment: prompt, reasoning, tasks, walkthrough */}
                  {(phase.prompt || phase.reasoning || phase.tasksMd || phase.walkthroughMd || phase.outputPreview) && (
                    <div className="space-y-2 mb-3">
                      {phase.prompt && (
                        <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                          <div className="text-[9px] font-semibold mb-1" style={{ color: "var(--primary)" }}>Prompt</div>
                          <pre className="text-[10px] whitespace-pre-wrap max-h-24 overflow-y-auto" style={{ color: "var(--foreground)" }}>{phase.prompt}</pre>
                        </div>
                      )}
                      {phase.reasoning && (
                        <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                          <div className="text-[9px] font-semibold mb-1 flex items-center gap-1" style={{ color: "#8b5cf6" }}><Brain size={9} /> Reasoning</div>
                          <pre className="text-[10px] whitespace-pre-wrap max-h-24 overflow-y-auto" style={{ color: "var(--foreground)" }}>{phase.reasoning}</pre>
                        </div>
                      )}
                      {phase.tasksMd && (
                        <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                          <div className="text-[9px] font-semibold mb-1 flex items-center gap-1" style={{ color: "#3b82f6" }}><ListTodo size={9} /> Tasks</div>
                          <pre className="text-[10px] whitespace-pre-wrap max-h-24 overflow-y-auto" style={{ color: "var(--foreground)" }}>{phase.tasksMd}</pre>
                        </div>
                      )}
                      {phase.walkthroughMd && (
                        <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                          <div className="text-[9px] font-semibold mb-1 flex items-center gap-1" style={{ color: "#22c55e" }}><FileText size={9} /> Walkthrough</div>
                          <pre className="text-[10px] whitespace-pre-wrap max-h-24 overflow-y-auto" style={{ color: "var(--foreground)" }}>{phase.walkthroughMd}</pre>
                        </div>
                      )}
                      {phase.outputPreview && (
                        <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
                          <div className="text-[9px] font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Output</div>
                          <pre className="text-[9px] whitespace-pre-wrap max-h-24 overflow-y-auto font-mono" style={{ color: "var(--muted-foreground)" }}>{phase.outputPreview}</pre>
                        </div>
                      )}
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
                                ) : art.filename === "INTERVENE.md" && !showingDiff ? (
                                  <div className="p-3 space-y-2">
                                    {editingIntervene ? (
                                      <>
                                        <textarea
                                          value={interveneContent}
                                          onChange={(e) => setInterveneContent(e.target.value)}
                                          className="w-full text-xs font-mono rounded border p-2"
                                          rows={12}
                                          style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border)", color: "var(--foreground)" }}
                                        />
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              setInterveneSaving(true);
                                              try {
                                                await fetch(`/api/pipelines/${data.id}/intervene`, {
                                                  method: "PUT",
                                                  headers: { "Content-Type": "application/json" },
                                                  body: JSON.stringify({ content: interveneContent }),
                                                });
                                                setEditingIntervene(false);
                                                load();
                                              } catch {}
                                              setInterveneSaving(false);
                                            }}
                                            disabled={interveneSaving}
                                            className="text-xs px-3 py-1 rounded"
                                            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                                          >
                                            {interveneSaving ? "Saving..." : "Save"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setEditingIntervene(false)}
                                            className="text-xs px-3 py-1 rounded border"
                                            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              if (!confirm("Delete intervene note and reset pipeline?")) return;
                                              await fetch(`/api/pipelines/${data.id}/intervene`, { method: "DELETE" });
                                              window.location.reload();
                                            }}
                                            className="text-xs px-3 py-1 rounded ml-auto"
                                            style={{ background: "#ef4444", color: "#fff" }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <div>
                                        <pre className="text-[11px] p-3 overflow-auto leading-relaxed font-mono"
                                          style={{ background: "rgba(0,0,0,0.12)", color: "var(--foreground)" }}
                                        >
                                          {(art.content as string) || "(empty)"}
                                        </pre>
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            try {
                                              const res = await fetch(`/api/pipelines/${data.id}/intervene`);
                                              const d = await res.json();
                                              setInterveneContent(d.content || "");
                                              setEditingIntervene(true);
                                            } catch {}
                                          }}
                                          className="text-xs px-2 py-1 rounded mt-2 border"
                                          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                                        >
                                          Edit intervene note
                                        </button>
                                      </div>
                                    )}
                                  </div>
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
                    openExecuteModal(idx + 1, phase.label);
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
            <span className="ml-auto text-xs" style={{ color: "var(--muted-foreground)" }}>
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
                <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>[{t.complexity}]</span>
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
            <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
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
            <span className="ml-auto text-[10px]" style={{ color: "var(--muted-foreground)" }}>completed</span>
          </div>
        </div>
      )}

      {/* Execute modal */}
      <Dialog open={showExecuteModal} onOpenChange={(open) => { if (!open) setShowExecuteModal(false); }}>
        <DialogContent className="max-w-[55vw] w-full">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Play size={13} />
              Execute Pipeline — Phase {executingPhase}: {executingLabel}
            </DialogTitle>
            <DialogDescription className="text-xs">
              This prompt will be sent to OpenCode. Edit it before executing if needed.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={executePrompt}
            onChange={(e) => setExecutePrompt(e.target.value)}
            className="w-full text-xs font-mono rounded border p-3"
            rows={12}
            style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowExecuteModal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleExecute} className="gap-1.5">
              <Play size={12} />
              Execute
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visual settings floating toolbar */}
      <VisualToolbar
        open={showVisual}
        onOpenChange={setShowVisual}
        settings={visualSettings}
        onSettingsChange={(next) => {
          setVisualSettings(next);
          saveVisualSettings(next);
        }}
        showDagHeight={true}
      />
    </div>
  );
}
