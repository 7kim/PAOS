"use client";
import { useCallback, useEffect, useState } from "react";

interface LedgerEntry {
  timestamp: string;
  agent: string;
  action: string;
  file: string;
  description: string;
  task: string;
  commit: string;
}

const agentColors: Record<string, string> = {
  claude: "#f97316",
  opencode: "#3b82f6",
  openclaw: "#8b5cf6",
  ollama: "#22c55e",
  antigravity: "#ec4899",
  dashboard: "#64748b",
};

function agentColor(agent: string) {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/ledger");
    const data = await res.json();
    setEntries(data.entries ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Audit Ledger</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        All agent actions — newest first
      </p>

      <div
        className="rounded-lg border overflow-hidden"
        style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left text-xs border-b"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">File</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "var(--muted)" }}>
                  No ledger entries yet
                </td>
              </tr>
            )}
            {entries.map((e, i) => (
              <tr key={i} className="hover:bg-white/[.02]">
                <td className="px-4 py-2.5 text-xs font-mono whitespace-nowrap" style={{ color: "var(--muted)" }}>
                  {e.timestamp.replace("T", " ").replace("Z", "").slice(0, 19)}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `${agentColor(e.agent)}22`,
                      color: agentColor(e.agent),
                    }}
                  >
                    {e.agent}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{e.action}</span>
                </td>
                <td className="px-4 py-2.5 text-sm max-w-xs truncate">{e.description}</td>
                <td className="px-4 py-2.5 text-xs font-mono" style={{ color: "var(--muted)" }}>{e.task}</td>
                <td className="px-4 py-2.5 text-xs font-mono truncate max-w-[12rem]" style={{ color: "var(--muted)" }}>
                  {e.file}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
