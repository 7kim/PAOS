"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2, CheckCircle2, XCircle, ExternalLink,
  Terminal, RefreshCw, ChevronDown, ChevronRight, Copy,
} from "lucide-react";

interface AgentInfo {
  id: string;
  label: string;
  package: string;
  checkCmd: string;
  installCmd: string;
  url: string;
  available: boolean;
  version: string;
  error: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Terminal size={16} /> Agents
          </h1>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Detected agents on this system · {agents.filter(a => a.available).length} available
          </p>
        </div>
        <button
          onClick={load}
          className="text-xs px-2 py-1 rounded border flex items-center gap-1"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
        >
          <RefreshCw size={10} /> Refresh
        </button>
      </div>

      <div className="grid gap-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: agent.available ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                }}
              >
                {agent.available ? (
                  <CheckCircle2 size={14} style={{ color: "#22c55e" }} />
                ) : (
                  <XCircle size={14} style={{ color: "#ef4444" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {agent.label}
                </div>
                <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="font-mono">{agent.package}</span>
                  {agent.available && agent.version && (
                    <span className="ml-2 opacity-60">v{agent.version}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === agent.id ? null : agent.id)}
                className="text-xs px-2 py-1 rounded border flex items-center gap-1"
                style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              >
                {expandedId === agent.id ? "Hide" : "Details"}
              </button>
            </div>

            {/* Expanded details */}
            {expandedId === agent.id && (
              <div className="border-t p-3 space-y-2" style={{ borderColor: "var(--border)" }}>
                {/* Status indicator */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span style={{ color: "var(--muted-foreground)" }}>Status:</span>
                  {agent.available ? (
                    <span className="flex items-center gap-1" style={{ color: "#22c55e" }}>
                      <CheckCircle2 size={10} /> Installed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1" style={{ color: "#ef4444" }}>
                      <XCircle size={10} /> Not Installed
                    </span>
                  )}
                </div>

                {/* Version info */}
                {agent.available && agent.version && (
                  <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    Version: <span className="font-mono">{agent.version}</span>
                  </div>
                )}

                {/* Error if unavailable */}
                {!agent.available && agent.error && (
                  <div className="text-[10px] p-2 rounded" style={{ background: "rgba(239,68,68,0.05)", color: "#ef4444" }}>
                    {agent.error}
                  </div>
                )}

                {/* Install snippet (21st.dev style) */}
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <div
                    className="flex items-center justify-between px-3 py-2 text-[10px] font-medium"
                    style={{ background: "rgba(255,255,255,0.03)", color: "var(--muted-foreground)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Terminal size={10} /> Install
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(agent.installCmd, agent.id)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/5"
                      >
                        {copiedId === agent.id ? (
                          <span style={{ color: "#22c55e" }}>Copied!</span>
                        ) : (
                          <><Copy size={9} /> Copy</>
                        )}
                      </button>
                      <a
                        href={agent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/5"
                      >
                        <ExternalLink size={9} /> Docs
                      </a>
                    </div>
                  </div>
                  <pre
                    className="px-3 py-2 text-[10px] font-mono whitespace-pre-wrap select-all"
                    style={{ color: "var(--foreground)" }}
                  >
                    {agent.installCmd}
                  </pre>
                </div>

                {/* Check command */}
                {!agent.available && (
                  <div className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                    After installing, run <code className="font-mono" style={{ color: "var(--foreground)" }}>{agent.checkCmd}</code> to verify.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
