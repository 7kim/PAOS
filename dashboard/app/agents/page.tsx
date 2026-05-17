"use client";
import { useEffect, useState } from "react";
import { Inbox, Clock } from "lucide-react";

interface Agent {
  id: string;
  label: string;
  color: string;
  inbox: number;
  lastActivity: string | null;
  recentLog: string;
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

  async function load() {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data.agents ?? []);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Agents</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        All registered AI agents in the orchestration hub
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-lg border p-4"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: agent.color }}
              />
              <div>
                <div className="font-medium text-sm">{agent.label}</div>
                <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>{agent.id}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                <Inbox size={12} />
                <span>{agent.inbox} inbox {agent.inbox === 1 ? "message" : "messages"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                <Clock size={12} />
                <span>Last active: {timeAgo(agent.lastActivity)}</span>
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
          </div>
        ))}
      </div>
    </div>
  );
}
