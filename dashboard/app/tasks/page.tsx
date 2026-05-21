"use client";
import { useCallback, useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  status: string;
  agent: string;
  project: string;
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 20000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Tasks</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Task cards from <span className="font-mono">memory/tasks/</span>
      </p>

      {tasks.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center text-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted)" }}
        >
          No task cards found in <span className="font-mono">memory/tasks/</span>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const s = statusStyle(task.status);
            return (
              <div
                key={task.id}
                className="rounded-lg border p-4 flex items-center gap-4"
                style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
              >
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{task.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {task.id}
                    {task.project && ` · ${task.project}`}
                    {task.agent && ` · ${task.agent}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
