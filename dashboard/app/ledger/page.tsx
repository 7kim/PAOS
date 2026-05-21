"use client";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

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
  "opencode-developer": "#3b82f6",
  "opencode-plan": "#60a5fa",
  "opencode-architect": "#818cf8",
  "opencode-coordinator": "#2563eb",
  opencode: "#3b82f6",
  codex: "#10b981",
  openclaw: "#8b5cf6",
  ollama: "#22c55e",
  antigravity: "#ec4899",
  "antigravity-ide": "#f472b6",
  gemini: "#4285f4",
  gitkraken: "#289473",
  hermes: "#eab308",
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
  const [selected, setSelected] = useState<LedgerEntry | null>(null);

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

  function toggle(entry: LedgerEntry) {
    setSelected((prev) =>
      prev?.timestamp === entry.timestamp && prev?.description === entry.description ? null : entry
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Audit Ledger</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        All agent actions — click any row to expand · newest first
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
            {entries.map((e, i) => {
              const isSelected =
                selected?.timestamp === e.timestamp && selected?.description === e.description;
              return (
                <>
                  <tr
                    key={i}
                    onClick={() => toggle(e)}
                    className="cursor-pointer transition-colors"
                    style={{
                      background: isSelected ? "rgba(252,213,53,0.06)" : undefined,
                      borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  >
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
                  {isSelected && (
                    <tr key={`${i}-detail`}>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div
                          className="px-5 py-4 border-b"
                          style={{ background: "rgba(252,213,53,0.04)", borderColor: "var(--border)" }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                              Entry Detail
                            </span>
                            <button
                              type="button"
                              title="Close"
                              onClick={() => setSelected(null)}
                              className="p-1 rounded"
                              style={{ color: "var(--muted)" }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                            <div>
                              <div className="mb-0.5" style={{ color: "var(--muted)" }}>Timestamp</div>
                              <div className="font-mono">{e.timestamp}</div>
                            </div>
                            <div>
                              <div className="mb-0.5" style={{ color: "var(--muted)" }}>Agent</div>
                              <div className="font-medium" style={{ color: agentColor(e.agent) }}>{e.agent}</div>
                            </div>
                            <div>
                              <div className="mb-0.5" style={{ color: "var(--muted)" }}>Action</div>
                              <div className="font-mono">{e.action || "—"}</div>
                            </div>
                            <div>
                              <div className="mb-0.5" style={{ color: "var(--muted)" }}>Task</div>
                              <div className="font-mono">{e.task || "—"}</div>
                            </div>
                            <div>
                              <div className="mb-0.5" style={{ color: "var(--muted)" }}>Commit</div>
                              <div className="font-mono">{e.commit || "—"}</div>
                            </div>
                          </div>
                          {e.file && (
                            <div className="mb-2">
                              <div className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>File(s)</div>
                              <div className="text-xs font-mono break-all">{e.file}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>Description</div>
                            <div className="text-sm leading-relaxed break-words">{e.description}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
