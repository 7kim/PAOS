"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X, Trash2, CheckCircle, Clock, AlertCircle, User, Cpu, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

interface Task {
  id: string;
  title: string;
  status: string;
  agent: string;
  project: string;
  author: string;
  executor: string;
  priority: string;
  dueDate: string;
  progress: string;
  raw: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; icon: any }> = {
  draft: { bg: "rgba(112,122,138,0.12)", color: "#929aa5", label: "Draft", icon: Clock },
  approved: { bg: "rgba(252,213,53,0.12)", color: "#fcd535", label: "Approved", icon: CheckCircle },
  in_progress: { bg: "rgba(252,213,53,0.08)", color: "#f0b90b", label: "In Progress", icon: Cpu },
  done: { bg: "rgba(14,203,129,0.12)", color: "#0ecb81", label: "Done", icon: CheckCircle },
  failed: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "Failed", icon: AlertCircle },
  ready_for_execution: { bg: "rgba(252,213,53,0.12)", color: "#fcd535", label: "Ready", icon: CheckCircle },
  planning: { bg: "rgba(168,85,247,0.12)", color: "#a855f7", label: "Planning", icon: Clock },
  needs_planning: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", label: "Needs Planning", icon: Clock },
  pending: { bg: "rgba(112,122,138,0.12)", color: "#929aa5", label: "Pending", icon: Clock },
};

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  critical: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
  high: { bg: "rgba(249,115,22,0.15)", color: "#f97316" },
  normal: { bg: "rgba(112,122,138,0.12)", color: "#929aa5" },
  low: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
};

function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.draft;
}

function priorityStyle(priority: string) {
  return PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.normal;
}

const AUTHOR_COLORS: Record<string, string> = {
  "hermes-nous": "#eab308",
  "opencode-developer": "#3b82f6",
  "claude-code": "#f97316",
  "codex": "#10b981",
  "gemini": "#4285f4",
  "antigravity": "#ec4899",
  "developer": "#3b82f6",
  "architect": "#818cf8",
  "coordinator": "#2563eb",
};

function authorColor(author: string) {
  for (const [key, color] of Object.entries(AUTHOR_COLORS)) {
    if (author.toLowerCase().includes(key)) return color;
  }
  return "#707a8a";
}

export default function TasksPageWrapperWrapper() {
  return (
    <Suspense fallback={"Loading..."}>
      <TasksPageWrapper />
    </Suspense>
  );
}

function TasksPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <TasksPage />
    </Suspense>
  );
}

function TasksPage() {
  const searchParams = useSearchParams();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const initialProject = urlProject || (viewAll ? "" : (getActiveProject() || "__none__"));
  const [projectFilter, setProjectFilter] = useState(initialProject);
  const [projects, setProjects] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch projects list on mount (exclude non-project entries)
  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => setProjects(d.projects?.map((p: any) => p.name).filter((n: string) => n !== "AI_Workflow") || []))
      .catch(() => setProjects([]));
  }, []);

  const load = useCallback(async () => {
    const params = projectFilter && projectFilter !== "__none__" ? `?project=${encodeURIComponent(projectFilter)}` : "";
    const res = await fetch(`/api/tasks${params}`);
    const data = await res.json();
    setTasks(data.tasks ?? []);
  }, [projectFilter]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [load]);

  const updateStatus = useCallback(async (task: Task, newStatus: string) => {
    setActionLoading(task.id + newStatus);
    try {
      await fetch(`/api/tasks?id=${encodeURIComponent(task.id)}&status=${newStatus}`, { method: "PATCH" });
      load();
    } catch { /* ignore */ }
    setActionLoading(null);
  }, [load]);

  const updateProgress = useCallback(async (task: Task, progress: string) => {
    try {
      await fetch(`/api/tasks?id=${encodeURIComponent(task.id)}&progress=${encodeURIComponent(progress)}`, { method: "PATCH" });
      load();
    } catch { /* ignore */ }
  }, [load]);

  const deleteTask = useCallback(async (task: Task) => {
    if (!confirm(`Delete task "${task.title}" (${task.id})? Only this task will be deleted.`)) return;
    const params = new URLSearchParams({ id: task.id });
    if (task.project) params.set("project", task.project);
    else if (projectFilter && projectFilter !== "__none__") params.set("project", projectFilter);
    await fetch(`/api/tasks?${params}`, { method: "DELETE" });
    setSelected(null);
    void load();
  }, [load, projectFilter]);

  const stats = {
    total: tasks.length,
    draft: tasks.filter(t => t.status === "draft").length,
    approved: tasks.filter(t => t.status === "approved").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  return (
    <div className="flex gap-4 h-full">
      <div className={`flex-1 min-w-0 flex flex-col`}>
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold mb-1 flex items-center gap-2">
            Tasks
            <span className="text-xs font-normal px-2 py-0.5 rounded" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>
              {stats.total}
            </span>
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Task cards from {projectFilter && projectFilter !== "__none__" ? (
              <><span className="font-mono">projects/{projectFilter}/tasks/</span></>
            ) : (
              <><span className="font-mono">memory/tasks/</span> + <span className="font-mono">projects/*/tasks/</span></>
            )} — click to inspect, approve to dispatch
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(112,122,138,0.12)", color: "#929aa5" }}>
            Draft: {stats.draft}
          </span>
          <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(252,213,53,0.12)", color: "#fcd535" }}>
            Approved: {stats.approved}
          </span>
          <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(252,213,53,0.08)", color: "#f0b90b" }}>
            In Progress: {stats.inProgress}
          </span>
          <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(14,203,129,0.12)", color: "#0ecb81" }}>
            Done: {stats.done}
          </span>
        </div>

        {/* Project filter bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Project:</span>
          <button
            type="button"
            onClick={() => setProjectFilter("")}
            className="text-[10px] px-2 py-1 rounded font-mono transition-colors"
            style={{
              background: projectFilter === "" ? "rgba(240,185,11,0.15)" : "rgba(112,122,138,0.1)",
              color: projectFilter === "" ? "var(--primary)" : "var(--muted-foreground)",
              border: projectFilter === "" ? "1px solid rgba(240,185,11,0.3)" : "1px solid transparent",
            }}
          >
            All
          </button>
          {projects.map((proj) => (
            <button
              key={proj}
              type="button"
              onClick={() => setProjectFilter(proj)}
              className="text-[10px] px-2 py-1 rounded font-mono transition-colors"
              style={{
                background: projectFilter === proj ? "rgba(240,185,11,0.15)" : "rgba(112,122,138,0.1)",
                color: projectFilter === proj ? "var(--primary)" : "var(--muted-foreground)",
                border: projectFilter === proj ? "1px solid rgba(240,185,11,0.3)" : "1px solid transparent",
              }}
            >
              {proj}
            </button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div
            className="rounded-lg border p-12 text-center text-sm"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            No tasks found
            {projectFilter && projectFilter !== "__none__" && (
              <> for project <span className="font-mono">{projectFilter}</span></>
            )}
            <br />
            <span className="text-xs opacity-60">
              {projectFilter && projectFilter !== "__none__"
                ? "Try selecting a different project or click All"
                : "Create a task MD in memory/tasks/ or projects/{name}/tasks/"}
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const s = statusStyle(task.status);
              const p = priorityStyle(task.priority);
              const isSelected = selected?.id === task.id;
              const StatusIcon = s.icon;
              return (
                <div
                  key={task.id}
                  className="w-full text-left rounded-lg border p-4 flex items-center gap-4 transition-colors"
                  style={{
                    background: isSelected ? "rgba(252,213,53,0.06)" : "var(--card-bg)",
                    borderColor: isSelected ? "var(--accent)" : "var(--border)",
                    borderLeft: isSelected ? "2px solid var(--accent)" : undefined,
                  }}
                >
                  <button type="button" onClick={() => setSelected(isSelected ? null : task)} className="flex-1 min-w-0 flex items-center gap-4 text-left">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1"
                      style={{ background: s.bg, color: s.color }}
                    >
                      <StatusIcon size={10} />
                      {s.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{task.title}</div>
                      <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: "var(--muted-foreground)" }}>
                        <span className="font-mono">{task.id}</span>
                        {task.project && <span>· {task.project}</span>}
                        {task.agent && <span>· {task.agent}</span>}
                      </div>
                      {/* Identity row */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: authorColor(task.author) + "20", color: authorColor(task.author) }}>
                          <User size={8} /> {task.author}
                        </span>
                        {task.executor && task.executor !== task.author && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>
                            <Cpu size={8} /> {task.executor}
                          </span>
                        )}
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: p.bg, color: p.color }}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
                            <Calendar size={8} /> {task.dueDate}
                          </span>
                        )}
                      </div>
                      {/* Progress indicator */}
                      {task.progress && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(100,116,139,0.15)" }}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: task.progress.includes("100%") || task.progress.toLowerCase().includes("complete") || task.progress.toLowerCase().includes("done") ? "100%" :
                                       task.progress.includes("75%") ? "75%" :
                                       task.progress.includes("50%") ? "50%" :
                                       task.progress.includes("25%") ? "25%" : "10%",
                                background: task.progress.toLowerCase().includes("complete") || task.progress.toLowerCase().includes("done") ? "#0ecb81" : "var(--primary)",
                              }}
                            />
                          </div>
                          <span className="text-[9px] font-mono shrink-0" style={{ color: "var(--muted-foreground)" }}>{task.progress}</span>
                        </div>
                      )}
                    </div>
                  </button>
                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {task.status === "draft" && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateStatus(task, "approved"); }}
                        disabled={actionLoading === task.id + "approved"}
                        className="text-[9px] px-2 py-1 rounded border flex items-center gap-1"
                        style={{ borderColor: "#fcd535", color: "#fcd535" }}
                        title="Approve task — watcher will pick it up"
                      >
                        <CheckCircle size={10} /> Approve
                      </button>
                    )}
                    {task.status === "approved" && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateStatus(task, "in_progress"); }}
                        disabled={actionLoading === task.id + "in_progress"}
                        className="text-[9px] px-2 py-1 rounded border flex items-center gap-1"
                        style={{ borderColor: "#f0b90b", color: "#f0b90b" }}
                        title="Mark as in progress"
                      >
                        <Cpu size={10} /> Start
                      </button>
                    )}
                    {task.status === "in_progress" && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); updateStatus(task, "done"); }}
                        disabled={actionLoading === task.id + "done"}
                        className="text-[9px] px-2 py-1 rounded border flex items-center gap-1"
                        style={{ borderColor: "#0ecb81", color: "#0ecb81" }}
                        title="Mark as done"
                      >
                        <CheckCircle size={10} /> Done
                      </button>
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); deleteTask(task); }} className="p-1.5 rounded hover:bg-red-500/10 shrink-0" style={{ color: "#ef4444" }} title="Delete only this task"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="w-[420px] shrink-0 rounded-lg border flex flex-col overflow-hidden"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <span className="font-medium text-sm">{selected.title}</span>
              <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{selected.id}</div>
            </div>
            <button
              type="button"
              title="Close"
              onClick={() => setSelected(null)}
              className="p-1 rounded ml-2 shrink-0"
              style={{ color: "var(--muted-foreground)" }}
            >
              <X size={14} />
            </button>
          </div>
          {/* Identity panel */}
          <div className="px-4 py-3 border-b space-y-2" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.1)" }}>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>Author:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: authorColor(selected.author) + "20", color: authorColor(selected.author) }}>
                {selected.author}
              </span>
            </div>
            {selected.executor && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Executor:</span>
                <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>
                  {selected.executor}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>Status:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: statusStyle(selected.status).bg, color: statusStyle(selected.status).color }}>
                {statusStyle(selected.status).label}
              </span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>Priority:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: priorityStyle(selected.priority).bg, color: priorityStyle(selected.priority).color }}>
                {selected.priority}
              </span>
            </div>
            {selected.progress && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Progress:</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(100,116,139,0.15)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: selected.progress.includes("100%") || selected.progress.toLowerCase().includes("complete") || selected.progress.toLowerCase().includes("done") ? "100%" :
                             selected.progress.includes("75%") ? "75%" :
                             selected.progress.includes("50%") ? "50%" :
                             selected.progress.includes("25%") ? "25%" : "10%",
                      background: selected.progress.toLowerCase().includes("complete") || selected.progress.toLowerCase().includes("done") ? "#0ecb81" : "var(--primary)",
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono shrink-0" style={{ color: "var(--muted-foreground)" }}>{selected.progress}</span>
              </div>
            )}
            {selected.dueDate && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Due:</span>
                <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
                  {selected.dueDate}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre
              className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
              style={{ color: "var(--foreground)", opacity: 0.85 }}
            >
              {selected.raw}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
