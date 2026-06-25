"use client";
import { useCallback, useEffect, useState } from "react";
import { Send, FolderKanban, ChevronRight } from "lucide-react";
import { formatTime } from "@/lib/settings";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

// Safe search params — works during prerendering on Next.js without Suspense
function useSearchParam(key: string): string {
  const [val, setVal] = useState("");
  useEffect(() => {
    const url = new URL(window.location.href);
    setVal(url.searchParams.get(key) || "");
  }, [key]);
  return val;
}

interface Message {
  id: string;
  inbox: string;
  title: string;
  from: string;
  to?: string;
  timestamp: string;
  body: string;
  source?: string;
}

const INBOX_COLORS: Record<string, string> = {
  claude: "#f97316",
  developer: "#3b82f6",
  "opencode-developer": "#3b82f6",
  plan: "#60a5fa",
  architect: "#a855f7",
  coordinator: "#22c55e",
  codex: "#f59e0b",
  antigravity: "#ec4899",
  gemini: "#34d399",
  ollama: "#84cc16",
  openclaw: "#8b5cf6",
  signal: "#06b6d4",
  "hermes-nous": "#f472b6",
};

function inboxColor(name: string) {
  if (INBOX_COLORS[name]) return INBOX_COLORS[name];
  for (const [key, color] of Object.entries(INBOX_COLORS)) {
    if (name.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

export default function InboxPage() {
  const urlProject = useSearchParam("project");
  const viewAll = getViewAll();
  const projectFilter = urlProject || (viewAll ? "" : (getActiveProject() || ""));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inboxDirs, setInboxDirs] = useState<string[]>([]);
  const [activeInbox, setActiveInbox] = useState("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const inboxes = ["all", ...inboxDirs];

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (activeInbox !== "all") params.set("agent", activeInbox);
    if (projectFilter) params.set("project", projectFilter);
    const res = await fetch(`/api/inbox?${params}`);
    const data = await res.json();
    setMessages(data.messages ?? []);
    if (data.inboxes?.length) setInboxDirs(data.inboxes);
  }, [activeInbox, projectFilter]);

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

  const agColor = inboxColor;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 shrink-0">
        <div>
          <h1 className="text-xl font-semibold mb-1">Inbox</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Agent message inbox</p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm"
          style={{ background: "var(--accent)", color: "var(--accent-on)" }}
        >
          <Send size={13} /> Send Message
        </button>
      </div>

      {/* Compose form */}
      {showCompose && (
        <div className="rounded-lg border p-4 mb-4 space-y-3 shrink-0"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>To (inbox)</label>
              <select value={composeTo} onChange={(e) => setComposeTo(e.target.value)}
                className="w-full text-sm rounded px-2 py-1.5 border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                <option value="">Select agent...</option>
                {inboxes.filter((i) => i !== "all").map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Subject</label>
              <input value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Optional subject"
                className="w-full text-sm rounded px-2 py-1.5 border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Message</label>
            <textarea value={composeBody} onChange={(e) => setComposeBody(e.target.value)} rows={3}
              className="w-full text-sm rounded px-2 py-1.5 border resize-none"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <button onClick={send} disabled={sending || !composeTo || !composeBody}
            className="px-4 py-1.5 text-sm rounded"
            style={{ background: "var(--accent)", color: "var(--accent-on)", opacity: (sending || !composeTo || !composeBody) ? 0.5 : 1 }}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      )}

      {/* Agent filter pills */}
      <div className="flex gap-1 mb-3 flex-wrap shrink-0">
        {inboxes.map((inbox) => {
          const col = agColor(inbox);
          return (
          <button key={inbox} onClick={() => { setActiveInbox(inbox); setSelected(null); }}
            className="px-3 py-1 rounded-full text-xs transition-colors"
            style={{
              background: activeInbox === inbox ? col : "transparent",
              color: activeInbox === inbox ? "#fff" : col,
              border: `1px solid ${activeInbox === inbox ? col : col + "44"}`,
            }}>
            {inbox}
          </button>
          );
        })}
      </div>

      {/* Email list header */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider shrink-0"
          style={{ color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>
          <span className="flex-[2]">From → To</span>
          <span className="flex-[3]">Subject</span>
          <span className="w-[7rem] text-right">Date</span>
        </div>
      )}

      {/* Email list */}
      <div className="flex-1 overflow-y-auto border rounded-lg" style={{ borderColor: "var(--border)" }}>
        {messages.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            No messages in this inbox
          </div>
        )}
        {messages.map((msg, idx) => {
          const isSelected = selected?.id === msg.id;
          const senderCol = agColor(msg.from);
          const receiverCol = agColor(msg.to || msg.inbox);
          return (
            <div key={`${msg.inbox}-${msg.id}`}>
              <button
                onClick={() => setSelected(isSelected ? null : msg)}
                className="w-full text-left transition-colors flex items-center gap-2 px-3 py-2.5 hover:opacity-90"
                style={{
                  background: isSelected ? "rgba(252,213,53,0.06)" : (idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"),
                  borderLeft: isSelected ? `3px solid ${agColor(msg.from)}` : "3px solid transparent",
                }}>
                <div className="flex-[2] flex items-center gap-1 min-w-0">
                  <span className="text-[10px] px-1 py-0.5 rounded font-mono truncate max-w-[6rem]"
                    style={{ background: `${senderCol}22`, color: senderCol }}>
                    {msg.from}
                  </span>
                  <ChevronRight size={10} className="shrink-0" style={{ color: "var(--muted-foreground)" }} />
                  <span className="text-[10px] px-1 py-0.5 rounded font-mono truncate max-w-[6rem]"
                    style={{ background: `${receiverCol}22`, color: receiverCol }}>
                    {msg.to || msg.inbox}
                  </span>
                </div>
                <div className="flex-[3] min-w-0">
                  <div className="text-xs font-medium truncate">{msg.title}</div>
                  <div className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
                    {msg.body.slice(0, 60)}
                  </div>
                </div>
                <div className="w-[7rem] text-right shrink-0">
                  <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </button>
              {isSelected && (
                <div className="px-3 py-4 border-t" style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--border)",
                  borderLeft: `3px solid ${agColor(msg.from)}`,
                }}>
                  <div className="flex items-center gap-2 text-xs mb-3 flex-wrap" style={{ color: "var(--muted-foreground)" }}>
                    <span>From:</span>
                    <span className="px-1.5 py-0.5 rounded font-mono" style={{ background: `${senderCol}22`, color: senderCol }}>{msg.from}</span>
                    <span className="ml-2">To:</span>
                    <span className="px-1.5 py-0.5 rounded font-mono" style={{ background: `${receiverCol}22`, color: receiverCol }}>{msg.to || msg.inbox}</span>
                    {msg.source && msg.source !== "global" && (
                      <span className="px-1 py-0.5 rounded font-mono ml-2" style={{ background: "rgba(240,185,11,0.1)", color: "var(--primary)" }}>
                        {msg.source}
                      </span>
                    )}
                    <span className="ml-auto font-mono">{formatTime(msg.timestamp)}</span>
                  </div>
                  <h2 className="text-sm font-medium mb-2">{msg.title}</h2>
                  <pre className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                    {msg.body}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
