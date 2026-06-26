"use client";
import { useCallback, useEffect, useState , Suspense} from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronRight, Clock, FolderKanban, GitBranch, Play, XCircle, Eye, Loader2, Trash2, Plus, Workflow } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";
import { formatTime } from "@/lib/settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Phase {
  name: string;
  completed: number;
  total: number;
}

interface Pipeline {
  id: string;
  status: string;
  queue?: string;
  project?: string;
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
  return formatTime(iso);
}

function QueueItem({ p }: { p: Pipeline }) {
  const progress = p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0;
  return (
    <Link
      href={`/pipelines/${p.id}/visualize`}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all duration-300 hover:opacity-80 mb-1 last:mb-0"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
        <div className="w-2 h-2 rounded-full shrink-0" style={{
          background: p.status === "completed" ? "var(--green)" :
                       p.status === "executing" || p.status === "running" ? "#3b82f6" :
                       p.status === "failed" ? "#ef4444" : "var(--orange)"
        }} />
        <div className="flex-1 min-w-0">
          <div className="truncate font-mono" style={{ color: "var(--foreground)" }}>
            {p.id.replace("AI_Workflow-", "").replace(/^PIPE-/, "")}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full transition-all" style={{
                width: `${progress}%`,
                background: progress === 100 ? "var(--green)" : "linear-gradient(90deg, var(--accent), #f59e0b)"
              }} />
            </div>
            <Badge variant="outline" className="text-[9px] font-mono px-1">
              {p.completedTasks}/{p.totalTasks}
            </Badge>
          </div>
        </div>
      </Link>
    );
  }

export default function PipelinesPageWrapper() {
  return (
    <Suspense fallback={"Loading..."}>
      <PipelinesPage />
    </Suspense>
  );
}

function PipelinesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const projectFilter = urlProject || (viewAll ? "" : (getActiveProject() || ""));
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [executePrompt, setExecutePrompt] = useState("");
  const [executeTargetId, setExecuteTargetId] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createTab, setCreateTab] = useState<"manual" | "template">("manual");
  const [createProject, setCreateProject] = useState("PAOS");
  const [createPrompt, setCreatePrompt] = useState("");
  const [createPlan, setCreatePlan] = useState("");
  const [createTasks, setCreateTasks] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const pageSize = 20;

  const filteredPipelines = projectFilter
    ? pipelines.filter((p) => p.project === projectFilter)
    : pipelines;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (projectFilter) params.set("project", projectFilter);
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    const res = await fetch(`/api/pipelines?${params}`);
    const data = await res.json();
    setPipelines(data.pipelines ?? []);
    setPagination(data.pagination ?? null);
    setLoading(false);
  }, [projectFilter, page]);

  const loadTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch { setTemplates([]); }
    setLoadingTemplates(false);
  }, []);

  const executePipeline = useCallback(async (id: string) => {
    const prompt = `You have been assigned pipeline ${id}. Read ~/AI_Workflow/memory/pipelines/PAOS/${id}/META.json, PLAN.md, and TASKS.md. Execute ALL tasks in order. Update TASKS.md task markers ([ ] → [~] → [x]) as you complete each one. Update ~/AI_Workflow/memory/pipelines/PAOS/${id}/pipeline.json with your progress. When ALL tasks are done, write WALKTHROUGH.md and update META.json status to "completed".`;
    setExecuteTargetId(id);
    setExecutePrompt(prompt);
    setShowExecuteModal(true);
  }, []);

  async function handleExecuteFromModal() {
    if (!executeTargetId) return;
    setShowExecuteModal(false);
    setExecutingId(executeTargetId);
    try {
      await fetch(`/api/pipelines/${executeTargetId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: executePrompt }),
      });
      setTimeout(() => { load(); setExecutingId(null); }, 2000);
    } catch {
      setExecutingId(null);
    }
  }

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

    const statusBadge = () => {
      switch (p.status) {
        case "completed":
          return <Badge className="bg-green-500/20 text-green-500">Completed</Badge>;
        case "executing":
          return <Badge className="bg-blue-500/20 text-blue-500">Executing</Badge>;
        case "failed":
          return <Badge variant="destructive">Failed</Badge>;
        default:
          return <Badge variant="secondary">Pending</Badge>;
      }
    };

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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={(e) => { e.stopPropagation(); executePipeline(p.id); }}
                  title="Execute pipeline"
                >
                  <Play size={14} style={{ color: statusColor }} />
                </Button>
              )}
            </div>
            {/* Vertical line to next */}
            {!isLast && (
              <div className="w-0.5 flex-1 min-h-[2rem]" style={{ background: "var(--border)" }} />
            )}
          </div>

          {/* Right column: pipeline card */}
          <div className="flex-1 pb-6 pl-3">
            <Card
              size="sm"
              onClick={() => toggle(p.id)}
              className={`cursor-pointer transition-colors ${isExpanded ? "ring-2 ring-[var(--primary)]" : ""}`}
              style={{
                background: isExpanded ? "rgba(252,213,53,0.05)" : "var(--card-bg)",
              }}
            >
              <CardHeader className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
                {isExpanded ? (
                  <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                )}
                <span
                  className="text-xs font-mono"
                  style={{ color: statusColor }}
                >
                  {p.id}
                </span>
                {statusBadge()}
                <span className="text-xs ml-auto text-muted-foreground">
                  {timeAgo(p.created_at)}
                </span>
                <Link
                  href={`/pipelines/${p.id}/visualize`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="sm" className="text-[10px]">
                    <Eye size={11} />
                    Visualize
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] text-red-400 hover:text-red-300"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!confirm(`Delete pipeline "${p.id}"? This cannot be undone.`)) return;
                    try {
                      await fetch(`/api/pipelines/${encodeURIComponent(p.id)}`, { method: "DELETE" });
                      load();
                    } catch { /* ignore */ }
                  }}
                >
                  <Trash2 size={11} />
                </Button>
              </CardHeader>

              <CardContent className="px-4 pb-2 space-y-3">
                {/* Prompt */}
                <p className="text-sm leading-snug line-clamp-2" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  {p.prompt || "No prompt"}
                </p>

                {/* Progress bar */}
                {p.totalTasks > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        {p.completedTasks}/{p.totalTasks} tasks
                      </span>
                      <span className="text-xs ml-auto font-mono" style={{ color: progress === 100 ? "var(--green)" : "var(--accent)" }}>
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                {/* Planner + Executor badges */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Planner:</span>
                  <span className="font-mono" style={{ color: "var(--orange)" }}>{p.planner}</span>
                  <span className="text-muted-foreground" style={{ marginLeft: 8 }}>Executor:</span>
                  <span className="font-mono" style={{ color: "#3b82f6" }}>{p.executor}</span>
                </div>
              </CardContent>
            </Card>

            {/* Expanded section: phases */}
            {isExpanded && p.phases.length > 0 && (
              <div className="mt-2 ml-4 rounded-lg border p-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
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
                            <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{phase.name}</span>
                            <span className="text-xs font-mono shrink-0 ml-2 text-muted-foreground">
                              {phase.completed}/{phase.total}
                            </span>
                          </div>
                          <div className="mt-1">
                            <Progress value={pct} />
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
                  <span className="text-muted-foreground">Pipeline ID </span>
                  <span className="font-mono">{p.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created </span>
                  <span>{p.created_at || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed </span>
                  <span>{p.completed_at || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Executor </span>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-3">
          <GitBranch size={18} style={{ color: "var(--accent)" }} />
          <h1 className="text-xl font-semibold">Pipeline GitGraph</h1>
        </div>
        <Button size="sm" onClick={() => setShowCreateDialog(true)} className="gap-1.5">
          <Plus size={13} />
          New Pipeline
        </Button>
        <Link href="/pipelines/builder">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Workflow size={13} />
            Flow Builder
          </Button>
        </Link>
      </div>
      <p className="text-sm mb-4 text-muted-foreground">
        Visual DAG of all PAOS pipelines — click to expand phases and details
      </p>

      {/* Project filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {["", ...new Set(pipelines.map((p) => p.project || ""))].filter(Boolean).map((proj) => (
          <button
            key={proj}
            type="button"
            onClick={() => window.location.href = proj === projectFilter ? "/pipelines" : `/pipelines?project=${encodeURIComponent(proj)}`}
            className="text-xs px-3 py-1.5 rounded-md border transition-colors"
            style={{
              borderColor: projectFilter === proj ? "var(--primary)" : "var(--border)",
              color: projectFilter === proj ? "var(--primary)" : "var(--muted-foreground)",
              background: projectFilter === proj ? "rgba(240,185,11,0.08)" : "transparent",
            }}
          >
            {proj}
          </button>
        ))}
        {projectFilter && (
          <button
            type="button"
            onClick={() => window.location.href = "/pipelines"}
            className="text-xs px-3 py-1.5 rounded-md border transition-colors text-muted-foreground"
            style={{ borderColor: "var(--border)" }}
          >
            View All
          </button>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredPipelines.length} pipeline{filteredPipelines.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Pipeline list — scrollable card */}
        <Card className="flex-1 min-w-0 max-w-4xl max-h-[calc(100vh-14rem)] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-semibold">
              <GitBranch size={13} />
              {projectFilter ? projectFilter : "All Pipelines"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {loading ? (
              <div className="space-y-4 p-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPipelines.length === 0 ? (
            <div className="text-sm py-12 text-center text-muted-foreground">
              <GitBranch size={24} className="mx-auto mb-3 opacity-30" />
              {projectFilter
                ? `No pipelines in "${projectFilter}"`
                : !viewAll && !urlProject
                ? "No active project selected. Enable View All in Settings or add ?project= to the URL."
                : "No pipelines yet"}
            </div>
            ) : (
              filteredPipelines.map((p, i) => (
                <PipelineNode key={p.id} p={p} index={i} />
              ))
            )}
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 px-1 text-[10px]">
                <span style={{ color: "var(--muted-foreground)" }}>
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost" size="sm" className="h-6 text-[10px]"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← Prev
                  </Button>
                  <Button
                    variant="ghost" size="sm" className="h-6 text-[10px]"
                    disabled={page >= (pagination.totalPages || 1)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queue panel — cards with flow arrows */}
        <div className="w-full max-w-xl lg:w-[36rem] shrink-0 sticky top-4 space-y-3"
          style={{ minHeight: "36rem" }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold px-1 mb-2">
            <Clock size={13} />
            Pipeline Queue
            <span className="ml-auto font-normal text-muted-foreground">
              FIFO · {pipelines.length} total
            </span>
          </div>

          {/* Running card */}
          <Card className={`transition-all duration-300 ${pipelines.filter(p => p.queue === "running").length > 0 ? "ring-2 ring-primary/20" : ""}`}>
            <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
              <span className="text-xs font-semibold" style={{ color: "#3b82f6" }}>Running</span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {pipelines.filter(p => p.queue === "running").length} pipeline{pipelines.filter(p => p.queue === "running").length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="px-3 py-2 min-h-[3rem] transition-all duration-300">
              {pipelines.filter(p => p.queue === "running").length > 0 ? (
                pipelines.filter(p => p.queue === "running").map(p => (
                  <QueueItem key={p.id} p={p} />
                ))
              ) : (
                <div className="text-[10px] py-3 text-center transition-all duration-300 text-muted-foreground">
                  <div className="text-lg mb-0.5 opacity-20">⚡</div>
                  Idle — no pipeline running
                </div>
              )}
            </div>
          </Card>

          {/* Flow arrow: Running → Pending */}
          <div className="flex justify-center transition-opacity duration-300" style={{
            opacity: pipelines.filter(p => p.queue === "running").length > 0 ? 1 : 0.3,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)" }}>
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>

          {/* Pending card */}
          <Card className={`transition-all duration-300 ${pipelines.filter(p => p.queue === "pending").length > 0 ? "ring-2 ring-[var(--orange)]/20" : ""}`}>
            <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]" />
              <span className="text-xs font-semibold" style={{ color: "var(--orange)" }}>Pending</span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {pipelines.filter(p => p.queue === "pending").length} pipeline{pipelines.filter(p => p.queue === "pending").length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="px-3 py-2 min-h-[3rem] transition-all duration-300">
              {pipelines.filter(p => p.queue === "pending").length > 0 ? (
                pipelines.filter(p => p.queue === "pending").map(p => (
                  <QueueItem key={p.id} p={p} />
                ))
              ) : (
                <div className="text-[10px] py-3 text-center transition-all duration-300 text-muted-foreground">
                  <div className="text-lg mb-0.5 opacity-20">⏳</div>
                  Queue empty
                </div>
              )}
            </div>
          </Card>

          {/* Flow arrow: Pending → Done */}
          <div className="flex justify-center transition-opacity duration-300" style={{
            opacity: pipelines.filter(p => p.queue === "pending").length > 0 ? 1 : 0.3,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)" }}>
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>

          {/* Done card */}
          <Card className="transition-all duration-300" style={{
            minHeight: pipelines.filter(p => p.queue === "done").length === 0 ? "4rem" : "auto",
          }}>
            <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
              <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
              <span className="text-xs font-semibold" style={{ color: "var(--green)" }}>Done</span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {pipelines.filter(p => p.queue === "done").length} pipeline{pipelines.filter(p => p.queue === "done").length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="px-3 py-2 transition-all duration-300">
              {pipelines.filter(p => p.queue === "done").length > 0 ? (
                <>
                  {pipelines.filter(p => p.queue === "done").slice(0, 5).map(p => (
                    <QueueItem key={p.id} p={p} />
                  ))}
                  {pipelines.filter(p => p.queue === "done").length > 5 && (
                    <div className="text-[10px] text-center pt-1 transition-all duration-300 text-muted-foreground">
                      +{pipelines.filter(p => p.queue === "done").length - 5} more
                    </div>
                  )}
                </>
              ) : (
                <div className="text-[10px] py-3 text-center transition-all duration-300 text-muted-foreground">
                  <div className="text-lg mb-0.5 opacity-20">✅</div>
                  No completed pipelines
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Pipeline dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => { if (!open) { setShowCreateDialog(false); setSelectedTemplate(null); } }}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Plus size={13} />
              New Pipeline
            </DialogTitle>
            <DialogDescription className="text-xs">
              Create from scratch or from a template
            </DialogDescription>
          </DialogHeader>

          {/* Tab switcher */}
          <div className="flex gap-1 border-b pb-2" style={{ borderColor: "var(--border)" }}>
            <button type="button" onClick={() => { setCreateTab("manual"); setSelectedTemplate(null); }}
              className="text-xs px-3 py-1 rounded-md transition-colors"
              style={{ background: createTab === "manual" ? "var(--primary)" : "transparent", color: createTab === "manual" ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
            >Manual</button>
            <button type="button" onClick={() => { setCreateTab("template"); loadTemplates(); }}
              className="text-xs px-3 py-1 rounded-md transition-colors"
              style={{ background: createTab === "template" ? "var(--primary)" : "transparent", color: createTab === "template" ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
            >From Template</button>
          </div>

          {createTab === "manual" ? (
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div>
                <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Project</label>
                <input value={createProject} onChange={(e) => setCreateProject(e.target.value)}
                  className="w-full text-sm rounded px-2 py-1.5 border"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Prompt</label>
                <textarea value={createPrompt} onChange={(e) => setCreatePrompt(e.target.value)}
                  className="w-full text-sm rounded px-2 py-1.5 border resize-none" rows={3}
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>PLAN.md <span className="text-[9px]">(optional)</span></label>
                <textarea value={createPlan} onChange={(e) => setCreatePlan(e.target.value)}
                  className="w-full text-xs font-mono rounded px-2 py-1.5 border resize-none" rows={4}
                  style={{ background: "rgba(0,0,0,0.12)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>TASKS.md <span className="text-[9px]">(optional)</span></label>
                <textarea value={createTasks} onChange={(e) => setCreateTasks(e.target.value)}
                  className="w-full text-xs font-mono rounded px-2 py-1.5 border resize-none" rows={4}
                  style={{ background: "rgba(0,0,0,0.12)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {loadingTemplates ? (
                <div className="text-xs text-center py-8 opacity-50">Loading templates...</div>
              ) : templates.length === 0 ? (
                <div className="text-xs text-center py-8 opacity-50">No templates available</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates.map((t: any) => (
                    <div key={t.id}
                      className="rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md"
                      style={{ borderColor: selectedTemplate?.id === t.id ? "var(--primary)" : "var(--border)", background: selectedTemplate?.id === t.id ? "rgba(240,185,11,0.05)" : "var(--card-bg)" }}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setCreatePrompt(t.description || `Pipeline from template: ${t.name}`);
                      }}
                    >
                      <div className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{t.name}</div>
                      <p className="text-[9px] mt-1 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{t.description}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[8px] px-1.5 py-0.5 rounded capitalize" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>{t.category}</span>
                        <span className="text-[8px] opacity-50" style={{ color: "var(--muted-foreground)" }}>{t.nodes?.length || 0} nodes</span>
                        {selectedTemplate?.id === t.id && <span className="ml-auto text-[9px]" style={{ color: "var(--primary)" }}>Selected</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 justify-end pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <Button variant="outline" size="sm" onClick={() => { setShowCreateDialog(false); setSelectedTemplate(null); }}>Cancel</Button>
            <Button size="sm" disabled={creating || (createTab === "manual" && !createPrompt.trim()) || (createTab === "template" && !selectedTemplate)}
              onClick={async () => {
                setCreating(true);
                try {
                  const body: any = { project: createProject || "PAOS" };
                  if (createTab === "template" && selectedTemplate) {
                    body.templateId = selectedTemplate.id;
                    body.builderLayout = { nodes: selectedTemplate.nodes, edges: selectedTemplate.edges || [] };
                    body.prompt = createPrompt || `Pipeline from template: ${selectedTemplate.name}`;
                  } else {
                    body.prompt = createPrompt;
                    body.planMd = createPlan;
                    body.tasksMd = createTasks;
                  }
                  await fetch("/api/pipelines", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  });
                  setShowCreateDialog(false);
                  setCreatePrompt(""); setCreatePlan(""); setCreateTasks(""); setSelectedTemplate(null);
                  load();
                } catch {}
                setCreating(false);
              }}
              className="gap-1.5"
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Execute modal */}
      <Dialog open={showExecuteModal} onOpenChange={(open) => { if (!open) setShowExecuteModal(false); }}>
        <DialogContent className="max-w-[55vw] w-full">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Play size={13} />
              Execute Pipeline — {executeTargetId}
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
            <Button size="sm" onClick={handleExecuteFromModal} className="gap-1.5">
              <Play size={12} />
              Execute
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
