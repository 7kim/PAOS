"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";

interface Plan {
  id: string;
  title: string;
  preview: string;
  plan: string;
  tasks: string;
  walkthrough: string;
  hasWalkthrough: boolean;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [tab, setTab] = useState<"plan" | "tasks" | "walkthrough">("plan");

  const load = useCallback(async () => {
    const res = await fetch("/api/plans");
    const data = await res.json();
    setPlans(data.plans ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 30000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="flex gap-4 h-full">
      <div className="w-72 shrink-0 space-y-2">
        <h1 className="text-xl font-semibold mb-1">Plans</h1>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Implementation plans from pm-logs/</p>

        {plans.length === 0 && (
          <div className="text-sm py-8 text-center" style={{ color: "var(--muted)" }}>
            No plans yet
          </div>
        )}
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelected(p); setTab("plan"); }}
            className="w-full text-left rounded-lg border p-3 transition-colors"
            style={{
              background: selected?.id === p.id ? "rgba(252,213,53,0.07)" : "var(--card-bg)",
              borderColor: selected?.id === p.id ? "var(--accent)" : "var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              {p.hasWalkthrough
                ? <CheckCircle size={12} style={{ color: "#22c55e" }} />
                : <Clock size={12} style={{ color: "var(--muted)" }} />
              }
              <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{p.id}</span>
            </div>
            <div className="text-sm font-medium truncate">{p.title}</div>
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        {!selected ? (
          <div
            className="rounded-lg border h-full flex items-center justify-center text-sm"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Select a plan to view
          </div>
        ) : (
          <div
            className="rounded-lg border overflow-hidden flex flex-col h-full"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <div className="border-b flex" style={{ borderColor: "var(--border)" }}>
              {(["plan", "tasks", "walkthrough"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-4 py-3 text-sm capitalize transition-colors"
                  style={{
                    color: tab === t ? "var(--accent)" : "var(--muted)",
                    borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                >
                  {t}
                  {t === "walkthrough" && !selected.hasWalkthrough && (
                    <span className="ml-1.5 text-xs opacity-50">(pending)</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre
                className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
                style={{ color: "var(--foreground)", opacity: 0.85 }}
              >
                {tab === "plan" ? selected.plan
                  : tab === "tasks" ? (selected.tasks || "No TASKS.md found")
                  : (selected.walkthrough || "WALKTHROUGH.md not generated yet")}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
