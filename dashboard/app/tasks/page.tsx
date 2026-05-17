"use client";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  status: string;
  agent: string;
  project: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  done: { bg: "#22c55e22", color: "#22c55e", label: "Done" },
  ready_for_execution: { bg: "#3b82f622", color: "#3b82f6", label: "Ready" },
  in_progress: { bg: "#eab30822", color: "#eab308", label: "In Progress" },
  planning: { bg: "#a855f722", color: "#a855f7", label: "Planning" },
  unknown: { bg: "#64748b22", color: "#64748b", label: "Unknown" },
};

function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.unknown;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function load() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks ?? []);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

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
