"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  inbox: string;
  title: string;
  from: string;
  timestamp: string;
  body: string;
}

interface Agent {
  id: string;
  label: string;
  color: string;
  inbox: number;
}

function agentColor(agent: string, agentColors: Record<string, string>) {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeInbox, setActiveInbox] = useState("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  const inboxes = useMemo(() => ["all", ...agents.map((agent) => agent.id)], [agents]);
  const agentColors = useMemo(
    () => Object.fromEntries(agents.map((agent) => [agent.id, agent.color])),
    [agents]
  );

  const load = useCallback(async () => {
    const params = activeInbox !== "all" ? `?agent=${activeInbox}` : "";
    const res = await fetch(`/api/inbox${params}`);
    const data = await res.json();
    setMessages(data.messages ?? []);
  }, [activeInbox]);

  const loadAgents = useCallback(async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data.agents ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadAgents());
  }, [loadAgents]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [load]);

  async function send() {
    if (!composeTo || !composeBody) return;
    setSending(true);
    await fetch("/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: composeTo, from: "dashboard", subject: composeSubject, body: composeBody }),
    });
    setSending(false);
    setShowCompose(false);
    setComposeTo(""); setComposeSubject(""); setComposeBody("");
    void load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold mb-1">Inbox</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Agent message inbox</p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm"
          style={{ background: "var(--accent)", color: "var(--accent-on)" }}
        >
          <Send size={13} /> Send Message
        </button>
      </div>

      {showCompose && (
        <div
          className="rounded-lg border p-4 mb-4 space-y-3"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--muted)" }}>To (inbox)</label>
              <select
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                className="w-full text-sm rounded px-2 py-1.5 border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="">Select agent...</option>
                {inboxes.filter((i) => i !== "all").map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--muted)" }}>Subject</label>
              <input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Optional subject"
                className="w-full text-sm rounded px-2 py-1.5 border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: "var(--muted)" }}>Message</label>
            <textarea
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              rows={3}
              className="w-full text-sm rounded px-2 py-1.5 border resize-none"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
          <button
            onClick={send}
            disabled={sending || !composeTo || !composeBody}
            className="px-4 py-1.5 text-sm rounded"
            style={{ background: "var(--accent)", color: "var(--accent-on)", opacity: (sending || !composeTo || !composeBody) ? 0.5 : 1 }}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      )}

      <div className="flex gap-1 mb-4 flex-wrap">
        {inboxes.map((inbox) => (
          <button
            key={inbox}
            onClick={() => setActiveInbox(inbox)}
            className="px-3 py-1 rounded-full text-xs transition-colors"
            style={{
              background: activeInbox === inbox ? "var(--accent)" : "var(--card-bg)",
              color: activeInbox === inbox ? "var(--accent-on)" : "var(--muted)",
              border: `1px solid ${activeInbox === inbox ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {inbox}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {messages.length === 0 && (
          <div
            className="col-span-3 rounded-lg border p-8 text-center text-sm"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted)" }}
          >
            No messages in this inbox
          </div>
        )}
        {messages.map((msg) => (
          <button
            key={`${msg.inbox}-${msg.id}`}
            onClick={() => setSelected(selected?.id === msg.id ? null : msg)}
            className="text-left rounded-lg border p-4 transition-colors"
            style={{
              background: selected?.id === msg.id ? "rgba(252,213,53,0.07)" : "var(--card-bg)",
              borderColor: selected?.id === msg.id ? "var(--accent)" : "var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: `${agentColor(msg.from, agentColors)}22`, color: agentColor(msg.from, agentColors) }}
              >
                {msg.from}
              </span>
              <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>→ {msg.inbox}</span>
            </div>
            <div className="font-medium text-sm truncate mb-1">{msg.title}</div>
            <div className="text-xs truncate" style={{ color: "var(--muted)" }}>
              {msg.body.slice(0, 80)}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="mt-4 rounded-lg border p-4"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-medium">{selected.title}</h2>
            <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>{selected.timestamp}</span>
          </div>
          <pre
            className="text-sm whitespace-pre-wrap leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.85 }}
          >
            {selected.body}
          </pre>
        </div>
      )}
    </div>
  );
}
