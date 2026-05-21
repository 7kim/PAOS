"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, Inbox, Search, TriangleAlert, XCircle } from "lucide-react";

interface Check {
  name: string;
  ok: boolean;
  detail: unknown;
}

interface Agent {
  id: string;
  label: string;
  role: string;
  color: string;
  inbox: number;
  lastActivity: string | null;
  recentLog: string;
  status: string;
  riskLevel: string;
  binary: string;
  mcpServers: string[];
  checks: Check[];
}

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch {
    return iso ?? "unknown";
  }
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data.agents ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 5000);
    return () => clearInterval(id);
  }, [load]);

  const filtered = agents.filter((agent) => {
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const haystack = `${agent.id} ${agent.label} ${agent.role} ${agent.binary}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  });
  const selected = agents.find((agent) => agent.id === selectedId) ?? filtered[0] ?? null;
  const healthyCount = agents.filter((agent) => agent.status === "healthy").length;

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Agents</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Registry-backed health, identity, MCP, inbox, and runtime checks
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "healthy", "configured", "mcp_missing", "binary_missing"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-3 py-1.5 rounded-md text-xs border"
              style={{
                background: statusFilter === status ? "var(--accent)" : "var(--card-bg)",
                borderColor: statusFilter === status ? "var(--accent)" : "var(--border)",
                color: statusFilter === status ? "#fff" : "var(--muted)",
              }}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 mb-4 md:grid-cols-3">
        <div className="rounded-lg border p-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>Registered</div>
          <div className="text-2xl font-semibold">{agents.length}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>Healthy</div>
          <div className="text-2xl font-semibold" style={{ color: "#22c55e" }}>{healthyCount}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>Degraded</div>
          <div className="text-2xl font-semibold" style={{ color: agents.length === healthyCount ? "#22c55e" : "#eab308" }}>
            {agents.length - healthyCount}
          </div>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search agents, roles, binaries..."
          className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedId(agent.id)}
            className="rounded-lg border p-4 text-left"
            style={{
              background: selected?.id === agent.id ? "rgba(59,130,246,0.08)" : "var(--card-bg)",
              borderColor: selected?.id === agent.id ? "var(--accent)" : "var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: agent.color }}
              />
              <div className="min-w-0">
                <div className="font-medium text-sm">{agent.label}</div>
                <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>{agent.id}</div>
              </div>
              {agent.status === "healthy" ? (
                <CheckCircle2 size={15} className="ml-auto" style={{ color: "#22c55e" }} />
              ) : (
                <TriangleAlert size={15} className="ml-auto" style={{ color: "#eab308" }} />
              )}
            </div>

            <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--muted)" }}>{agent.role}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                <Inbox size={12} />
                <span>{agent.inbox} inbox {agent.inbox === 1 ? "message" : "messages"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                <Clock size={12} />
                <span>Last active: {timeAgo(agent.lastActivity)}</span>
              </div>
              <div className="text-xs" style={{ color: agent.status === "healthy" ? "#22c55e" : "#eab308" }}>
                {agent.status} · {agent.riskLevel} risk
              </div>
            </div>

            {agent.recentLog && (
              <div
                className="mt-3 pt-3 border-t text-xs truncate"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {agent.recentLog}
              </div>
            )}
          </button>
          ))}
        </div>

        <div className="rounded-lg border p-4 h-fit" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          {!selected ? (
            <div className="text-sm" style={{ color: "var(--muted)" }}>No agent selected</div>
          ) : (
            <>
              <div className="flex items-start gap-3 mb-4">
                <span className="w-3 h-3 rounded-full mt-1" style={{ background: selected.color }} />
                <div>
                  <h2 className="font-semibold">{selected.label}</h2>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{selected.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div>
                  <div style={{ color: "var(--muted)" }}>Binary</div>
                  <div className="font-mono mt-1">{selected.binary}</div>
                </div>
                <div>
                  <div style={{ color: "var(--muted)" }}>MCP</div>
                  <div className="font-mono mt-1">{selected.mcpServers.join(", ") || "none"}</div>
                </div>
              </div>

              <div className="space-y-2">
                {selected.checks.map((check) => (
                  <div
                    key={check.name}
                    className="flex items-center gap-2 rounded-md border px-3 py-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {check.ok ? (
                      <CheckCircle2 size={14} style={{ color: "#22c55e" }} />
                    ) : (
                      <XCircle size={14} style={{ color: "#ef4444" }} />
                    )}
                    <span className="text-sm">{check.name}</span>
                    <span className="text-xs ml-auto" style={{ color: check.ok ? "#22c55e" : "#ef4444" }}>
                      {check.ok ? "pass" : "fail"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
