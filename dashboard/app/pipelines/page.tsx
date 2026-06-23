"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronRight, Clock, FolderKanban, GitBranch, Play, XCircle, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

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

import { formatTime } from "@/lib/settings";

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

export default function PipelinesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const projectFilter = urlProject || (viewAll ? "" : (getActiveProject() || "__none__"));
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const filteredPipelines = projectFilter
    ? pipelines.filter((p) => p.project === projectFilter)
    : pipelines;

  const load = useCallback(async () => {
    const params = projectFilter && projectFilter !== "__none__" ? `?project=${encodeURIComponent(projectFilter)}` : "";
    const res = await fetch(`/api/pipelines${params}`);
    const data = await res.json();
    setPipelines(data.pipelines ?? []);
  }, [projectFilter]);

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
              <CardHeader className="flex flex-row items-center gap-3 px-4 py-3">
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
      <div className="flex items-center gap-3 mb-1">
        <GitBranch size={18} style={{ color: "var(--accent)" }} />
        <h1 className="text-xl font-semibold">Pipeline GitGraph</h1>
      </div>
      <p className="text-sm mb-4 text-muted-foreground">
        Visual DAG of all PAOS pipelines — click to expand phases and details
      </p>

      {/* Project filter */}
      <div className="flex items-center gap-2 mb-4">
        {["", ...new Set(pipelines.map((p) => p.project || ""))].filter(Boolean).map((proj) => (
          <button
            key={proj}
            type="button"
            onClick={() => router.push(proj === projectFilter ? "/pipelines" : `/pipelines?project=${encodeURIComponent(proj)}`)}
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
            onClick={() => router.push("/pipelines")}
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

      <div className="flex gap-6 items-stretch">
        {/* Pipeline list — scrollable card */}
        <Card className="flex-1 min-w-0 max-w-4xl max-h-[calc(100vh-14rem)] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-semibold">
              <GitBranch size={13} />
              {projectFilter ? projectFilter : "All Pipelines"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {filteredPipelines.length === 0 ? (
              <div className="text-sm py-12 text-center text-muted-foreground">
                <GitBranch size={24} className="mx-auto mb-3 opacity-30" />
                {projectFilter === "__none__"
                  ? "View All is disabled. Select a project from Settings or add ?project= to the URL."
                  : projectFilter
                  ? `No pipelines in "${projectFilter}"`
                  : "No pipelines yet"}
              </div>
            ) : (
              filteredPipelines.map((p, i) => (
                <PipelineNode key={p.id} p={p} index={i} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Queue panel — cards with flow arrows */}
        <div className="w-[36rem] shrink-0 sticky top-4 space-y-3"
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
    </div>
  );
}
