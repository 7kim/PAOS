"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

interface Task {
  id: string;
  title: string;
  status: string;
  agent: string;
  project: string;
  raw: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  done: { bg: "rgba(14,203,129,0.12)", color: "#0ecb81", label: "Done" },
  ready_for_execution: { bg: "rgba(252,213,53,0.12)", color: "#fcd535", label: "Ready" },
  in_progress: { bg: "rgba(252,213,53,0.08)", color: "#f0b90b", label: "In Progress" },
  planning: { bg: "rgba(168,85,247,0.12)", color: "#a855f7", label: "Planning" },
  needs_planning: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", label: "Needs Planning" },
  pending: { bg: "rgba(112,122,138,0.12)", color: "#929aa5", label: "Pending" },
  unknown: { bg: "rgba(112,122,138,0.1)", color: "#707a8a", label: "Unknown" },
};

function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.unknown;
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
  const projectFilter = urlProject || (viewAll ? "" : (getActiveProject() || "__none__"));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);

  const load = useCallback(async () => {
    const params = projectFilter && projectFilter !== "__none__" ? `?project=${encodeURIComponent(projectFilter)}` : "";
    const res = await fetch(`/api/tasks${params}`);
    const data = await res.json();
    setTasks(data.tasks ?? []);
  }, [projectFilter]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 20000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="flex gap-4 h-full">
      <div className={`flex-1 min-w-0 flex flex-col`}>
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-1">Tasks</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Task cards from <span className="font-mono">memory/tasks/</span> — click to inspect
          </p>
        </div>

        {tasks.length === 0 ? (
          <div
            className="rounded-lg border p-12 text-center text-sm"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            No task cards found in <span className="font-mono">memory/tasks/</span>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const s = statusStyle(task.status);
              const isSelected = selected?.id === task.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelected(isSelected ? null : task)}
                  className="w-full text-left rounded-lg border p-4 flex items-center gap-4 transition-colors"
                  style={{
                    background: isSelected ? "rgba(252,213,53,0.06)" : "var(--card-bg)",
                    borderColor: isSelected ? "var(--accent)" : "var(--border)",
                    borderLeft: isSelected ? "2px solid var(--accent)" : undefined,
                  }}
                >
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{task.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {task.id}
                      {task.project && ` · ${task.project}`}
                      {task.agent && ` · ${task.agent}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

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
