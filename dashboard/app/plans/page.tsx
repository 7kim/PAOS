"use client";
import { useCallback, useEffect, useMemo, useState , Suspense} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Clock, Download, FolderKanban, GitBranch, Layers, ListTodo, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

interface Plan {
  id: string;
  title: string;
  preview: string;
  plan: string;
  tasks: string;
  walkthrough: string;
  hasWalkthrough: boolean;
  source?: string;
  path?: string;
  project?: string;
}

type PlanStatus = "draft" | "in-progress" | "complete";

const columns: { id: PlanStatus; label: string; color: string }[] = [
  { id: "draft", label: "Draft", color: "#64748b" },
  { id: "in-progress", label: "In Progress", color: "#f97316" },
  { id: "complete", label: "Complete", color: "#0ecb81" },
];

export default function PlansPageWrapperWrapper() {
  return (
    <Suspense fallback={"Loading..."}>
      <PlansPageWrapper />
    </Suspense>
  );
}

function PlansPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <PlansPage />
    </Suspense>
  );
}

function PlansPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const projectFilter = urlProject || (viewAll ? "" : (getActiveProject() || "__none__"));
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [detailTab, setDetailTab] = useState<"plan" | "tasks" | "walkthrough">("plan");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const load = useCallback(async () => {
    const params = projectFilter ? `?project=${encodeURIComponent(projectFilter)}` : "";
    const res = await fetch(`/api/plans${params}`);
    const data = await res.json();
    setPlans(data.plans ?? []);
  }, [projectFilter]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 30000);
    return () => clearInterval(id);
  }, [load]);

  function getPlanStatus(p: Plan): PlanStatus {
    if (p.hasWalkthrough) return "complete";
    const tasks = p.tasks || "";
    const total = (tasks.match(/\[[ x]\]/gi) || []).length;
    const done = (tasks.match(/\[x\]/gi) || []).length;
    if (total === 0) return "draft";
    if (done === total) return "complete";
    return "in-progress";
  }

  function getTaskProgress(p: Plan): { done: number; total: number } {
    if (p.hasWalkthrough && p.tasks) {
      const tasks = p.tasks || "";
      const total = (tasks.match(/\[[ x]\]/gi) || []).length;
      return { done: total, total };
    }
    const tasks = p.tasks || "";
    const total = (tasks.match(/\[[ x]\]/gi) || []).length;
    const done = (tasks.match(/\[x\]/gi) || []).length;
    return { done, total };
  }

  async function deletePlan(p: Plan) {
    if (!confirm(`Delete plan "${p.title}" (${p.id})? Only this plan/pipeline will be deleted.`)) return;
    const params = new URLSearchParams({ id: p.id });
    if (p.project) params.set("project", p.project);
    await fetch(`/api/plans?${params}`, { method: "DELETE" });
    setSelected(null);
    void load();
  }

  function buildPlanMd(p: Plan): string {
    return [
      `# ${p.title}`,
      ``,
      `## PLAN`,
      ``,
      p.plan || "(empty)",
      ``,
      `## TASKS`,
      ``,
      p.tasks || "(empty)",
      ``,
      `## WALKTHROUGH`,
      ``,
      p.walkthrough || "(empty)",
    ].join("\n");
  }

  function downloadPlan(p: Plan) {
    const content = buildPlanMd(p);
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadSelected() {
    const selectedPlans = plans.filter((p) => checkedIds.has(p.id));
    if (selectedPlans.length === 0) return;
    if (selectedPlans.length === 1) {
      downloadPlan(selectedPlans[0]);
      return;
    }
    const parts: string[] = [];
    for (const p of selectedPlans) {
      parts.push(buildPlanMd(p));
      parts.push(`\n---\n`);
    }
    const content = parts.join("\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plans-selected-${selectedPlans.length}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleColumn(colId: PlanStatus) {
    const colPlans = grouped[colId].map((p) => p.id);
    const allChecked = colPlans.every((id) => checkedIds.has(id));
    setCheckedIds((prev) => {
      const next = new Set(prev);
      for (const id of colPlans) {
        if (allChecked) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    const allPlanIds = plans.map((p) => p.id);
    const allChecked = allPlanIds.every((id) => checkedIds.has(id));
    setCheckedIds((prev) => {
      const next = new Set(prev);
      for (const id of allPlanIds) {
        if (allChecked) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  const filteredPlans = projectFilter
    ? plans.filter((p) => p.project === projectFilter)
    : plans;

  const grouped = useMemo(() => {
    const map: Record<PlanStatus, Plan[]> = { draft: [], "in-progress": [], complete: [] };
    for (const p of filteredPlans) {
      map[getPlanStatus(p)].push(p);
    }
    return map;
  }, [filteredPlans]);

  const checkedCount = checkedIds.size;

  function toggleBulkMode() {
    if (bulkMode) {
      setCheckedIds(new Set()); // clear selections when leaving bulk mode
    }
    setBulkMode(!bulkMode);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <ListTodo size={18} style={{ color: "var(--primary)" }} />
        <h1 className="text-xl font-semibold">Plans</h1>
        <span className="text-xs text-muted-foreground">{plans.length} plans</span>

        <div className="ml-auto flex items-center gap-2">
          {bulkMode && checkedCount > 0 && (
            <button
              type="button"
              onClick={downloadSelected}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors hover:border-primary/50"
              style={{ borderColor: "var(--border)", color: "var(--primary)" }}
            >
              <Download size={12} />
              Download ({checkedCount})
            </button>
          )}
          <button
            type="button"
            onClick={toggleBulkMode}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors"
            style={{
              borderColor: bulkMode ? "var(--primary)" : "var(--border)",
              color: bulkMode ? "var(--primary)" : "var(--muted-foreground)",
              background: bulkMode ? "rgba(240,185,11,0.08)" : "transparent",
            }}
          >
            {bulkMode ? "✓ " : ""}
            Select to Download
          </button>
        </div>
      </div>

      {/* Project filter */}
      {plans.some((p) => p.project) && (
        <div className="flex items-center gap-2 mb-3 shrink-0">
          {["", ...new Set(plans.map((p) => p.project || ""))].filter(Boolean).map((proj) => (
            <button
              key={proj}
              type="button"
              onClick={() => router.push(proj === projectFilter ? "/plans" : `/plans?project=${encodeURIComponent(proj)}`)}
              className="text-xs px-3 py-1.5 rounded-md border transition-colors"
              style={{
                borderColor: projectFilter === proj ? "var(--primary)" : "var(--border)",
                color: projectFilter === proj ? "var(--primary)" : "var(--muted-foreground)",
                background: projectFilter === proj ? "rgba(240,185,11,0.08)" : "transparent",
              }}
            >
              <FolderKanban size={10} className="inline mr-1" />
              {proj}
            </button>
          ))}
          {projectFilter && (
            <button
              type="button"
              onClick={() => router.push("/plans")}
              className="text-xs px-3 py-1.5 rounded-md border transition-colors text-muted-foreground"
              style={{ borderColor: "var(--border)" }}
            >
              View All
            </button>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredPlans.length} plan{filteredPlans.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Kanban columns */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 pb-4 min-h-0">
        {columns.map((col) => {
          const items = grouped[col.id];
          const colAllChecked = items.length > 0 && items.every((p) => checkedIds.has(p.id));
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-lg border min-w-0 flex-1"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              {/* Column header */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider shrink-0"
                style={{ borderColor: "var(--border)", color: col.color }}
              >
                {bulkMode && (
                  <input
                    type="checkbox"
                    checked={colAllChecked}
                    onChange={() => toggleColumn(col.id)}
                    className="accent-[var(--primary)]"
                    title={`Select / deselect all ${col.label}`}
                  />
                )}
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                {col.label}
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">{items.length}</span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {items.length === 0 && (
                  <div className="text-xs text-center py-8 text-muted-foreground">No plans</div>
                )}
                {items.map((p) => {
                  const progress = getTaskProgress(p);
                  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
                  const isChecked = checkedIds.has(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`rounded-lg border transition-all hover:border-primary/30 ${bulkMode && isChecked ? "ring-1" : ""}`}
                      style={{
                        background: "var(--card-bg)",
                        borderColor: bulkMode && isChecked ? "var(--primary)" : "var(--border)",
                      }}
                    >
                      <div className="flex items-start gap-2 p-3">
                        {/* Checkbox — only in bulk mode */}
                        {bulkMode && (
                          <div className="pt-0.5 shrink-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCheck(p.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="accent-[var(--primary)]"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deletePlan(p); }}
                          className="p-1 rounded hover:bg-red-500/10 shrink-0 self-start mt-1"
                          style={{ color: "#ef4444" }}
                          title="Delete only this plan"
                        >
                          <Trash2 size={12} />
                        </button>
                        {/* Card body */}
                        <button
                          type="button"
                          onClick={() => { setSelected(p); setDetailTab("plan"); }}
                          className="flex-1 min-w-0 text-left"
                        >
                          {/* Title */}
                          <div className="text-xs font-medium truncate">{p.title}</div>

                          {/* Preview */}
                          {p.preview && (
                            <div className="text-[10px] mt-1 line-clamp-2 text-muted-foreground">
                              {p.preview}
                            </div>
                          )}

                          {/* Task progress bar */}
                          {progress.total > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <Progress value={pct} className="flex-1 h-1" />
                              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                                {progress.done}/{progress.total}
                              </span>
                            </div>
                          )}

                          {/* Footer badges */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                              style={{
                                background: p.source === "pipeline"
                                  ? "rgba(59,130,246,0.12)"
                                  : "rgba(168,85,247,0.12)",
                                color: p.source === "pipeline" ? "#3b82f6" : "#a855f7",
                              }}
                            >
                              {p.source === "pipeline" ? (
                                <><GitBranch size={8} className="inline mr-0.5" />pipeline</>
                              ) : (
                                <><Layers size={8} className="inline mr-0.5" />legacy</>
                              )}
                            </span>
                            {p.hasWalkthrough && (
                              <CheckCircle size={9} style={{ color: "var(--success)" }} />
                            )}
                            <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[80px]" title={p.path}>
                              {p.path?.replace("memory/pipelines/", "").replace("memory/pm-logs/", "") || p.id}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-7xl sm:max-w-7xl max-h-[85vh] w-full flex flex-col overflow-y-auto p-6">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-sm truncate">{selected?.title}</DialogTitle>
                <DialogDescription className="text-xs font-mono truncate">{selected?.path || selected?.id}</DialogDescription>
              </div>
              {selected && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => deletePlan(selected)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors hover:border-red-400/50 shrink-0"
                    style={{ borderColor: "var(--border)", color: "#ef4444" }}
                    title="Delete only this plan — other plans untouched"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadPlan(selected)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors hover:border-primary/50 shrink-0"
                    style={{ borderColor: "var(--border)", color: "var(--primary)" }}
                    title="Download PLAN + TASKS + WALKTHROUGH as a single markdown file"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              )}
            </div>
          </DialogHeader>
          {selected && (
            <>
              {/* Detail tabs */}
              <div className="border-b flex items-center gap-0 mb-3 shrink-0" style={{ borderColor: "var(--border)" }}>
                {(["plan", "tasks", "walkthrough"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDetailTab(t)}
                    className="px-3 py-2 text-xs capitalize transition-colors"
                    style={{
                      color: detailTab === t ? "var(--primary)" : "var(--muted-foreground)",
                      borderBottom: detailTab === t ? "2px solid var(--primary)" : "2px solid transparent",
                    }}
                  >
                    {t}
                    {t === "walkthrough" && !selected.hasWalkthrough && (
                      <span className="ml-1 text-[10px] opacity-50">(pending)</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Detail content — scrolls with dialog */}
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ opacity: 0.85 }}>
                {detailTab === "plan"
                  ? (selected.plan || "No PLAN.md found")
                  : detailTab === "tasks"
                  ? (selected.tasks || "No TASKS.md found")
                  : (selected.walkthrough || "WALKTHROUGH.md not generated yet")}
              </pre>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
