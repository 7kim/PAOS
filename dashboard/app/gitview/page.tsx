"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronRight, ExternalLink, FileCode, GitCommit, GitGraph, Search, Terminal } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface Commit {
  hash: string;
  author_name: string;
  author_email: string;
  date: string;
  message: string;
  graph: string | null;
}

interface CommitDetail {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
  messageShort: string;
  diff: string;
  files: { status: string; path: string }[];
}

const GK_COLOR = "#289473";

const statusColors: Record<string, string> = {
  A: "var(--green)",
  M: GK_COLOR,
  D: "var(--red)",
  R: "#a855f7",
  C: "#3b82f6",
};

export default function GitViewPage() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  const [detail, setDetail] = useState<CommitDetail | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (agent: string, q: string) => {
    setLoading(true);
    const params = new URLSearchParams({ max: "50" });
    if (agent && agent !== "all") params.set("agent", agent);
    if (q) params.set("q", q);
    const res = await fetch(`/api/gitview?${params}`);
    const data = await res.json();
    setCommits(data.commits ?? []);
    if (data.agents) setAgents(data.agents);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load(selectedAgent, query));
    const id = setInterval(() => void load(selectedAgent, query), 60000);
    return () => clearInterval(id);
  }, [load, selectedAgent, query]);

  useEffect(() => {
    if (!selectedHash) { setDetail(null); return; }
    fetch(`/api/gitview?commit=${selectedHash}`)
      .then((r) => r.json())
      .then((d) => setDetail(d))
      .catch(() => setDetail(null));
  }, [selectedHash]);

  function shortHash(h: string) { return h.slice(0, 7); }

  function timeAgo(iso: string) {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const m = Math.floor(diff / 60000);
      if (m < 1) return "now";
      if (m < 60) return `${m}m`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h}h`;
      return `${Math.floor(h / 24)}d`;
    } catch { return iso; }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-3rem)]">
      {/* ── Left: Commit List ─────────────────────────────────────────────── */}
      <div className="w-80 shrink-0 flex flex-col gap-3">
        {/* GitKraken-branded header */}
        <div
          className="rounded-lg border p-3 flex items-center gap-2.5"
          style={{ borderColor: `${GK_COLOR}44`, background: `${GK_COLOR}0a` }}
        >
          <div
            className="w-8 h-8 rounded flex items-center justify-center shrink-0"
            style={{ background: GK_COLOR }}
          >
            <GitGraph size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold" style={{ color: GK_COLOR }}>
              GitKraken MCP
            </h1>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>
              29 tools · git · issues · PRs
            </p>
          </div>
          <div className="ml-auto">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ background: `${GK_COLOR}18`, color: GK_COLOR }}
            >
              v3.1.64
            </span>
          </div>
        </div>

        {/* Agent filter */}
        <select
          value={selectedAgent}
          onChange={(e) => { setSelectedAgent(e.target.value); setSelectedHash(null); }}
          className="rounded-md border px-3 py-1.5 text-sm w-full"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
        >
          <option value="all">All agents</option>
          {agents.filter((a, i, arr) => arr.findIndex((x) => x.email === a.email) === i).map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commits..."
            className="w-full rounded-md border py-1.5 pl-8 pr-3 text-xs"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        {/* Commit list */}
        <div className="flex-1 overflow-y-auto space-y-0.5 rounded-lg border" style={{ borderColor: "var(--border)" }}>
          {loading && commits.length === 0 && (
            <div className="p-4 text-xs text-center" style={{ color: "var(--muted)" }}>Loading...</div>
          )}
          {!loading && commits.length === 0 && (
            <div className="p-4 text-xs text-center" style={{ color: "var(--muted)" }}>No commits found</div>
          )}
          {commits.map((c) => (
            <button
              key={c.hash}
              onClick={() => setSelectedHash(c.hash)}
              className="w-full text-left px-3 py-2 border-b text-xs transition-colors"
              style={{
                background: selectedHash === c.hash ? `${GK_COLOR}0d` : "transparent",
                borderColor: "var(--border)",
                borderLeft: selectedHash === c.hash ? `2px solid ${GK_COLOR}` : "2px solid transparent",
              }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px]" style={{ color: GK_COLOR }}>
                  {shortHash(c.hash)}
                </span>
                <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
                  {timeAgo(c.date)}
                </span>
              </div>
              <div className="truncate font-medium text-xs">{c.message}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                {c.author_name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Detail Panel ───────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {!detail ? (
          <div
            className="rounded-lg border h-full flex flex-col items-center justify-center text-sm gap-3"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <GitGraph size={40} className="opacity-20" style={{ color: GK_COLOR }} />
            <div className="text-center">
              <p>Select a commit to view diff</p>
              <p className="text-xs mt-1">Powered by GitKraken MCP — 29 tools for AI agents</p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => window.open("https://help.gitkraken.com/mcp/mcp-tools-reference/", "_blank")}
                className="flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5 border transition-colors"
                style={{ borderColor: `${GK_COLOR}44`, color: GK_COLOR }}
              >
                <Terminal size={12} />
                MCP Tools Reference
                <ExternalLink size={10} />
              </button>
              <button
                onClick={() => window.open("https://www.gitkraken.com/mcp", "_blank")}
                className="flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5 border transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <ExternalLink size={10} />
                GitKraken MCP
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Commit header + MCP actions */}
            <div
              className="rounded-lg border p-3"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs" style={{ color: GK_COLOR }}>{detail.hash}</span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>by</span>
                <span className="text-xs font-medium">{detail.author}</span>
                <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>{detail.date}</span>
              </div>
              <div className="text-sm font-medium">{detail.messageShort}</div>
            </div>

            {/* Files changed */}
            <div
              className="rounded-lg border overflow-hidden"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="px-3 py-2 border-b text-xs font-semibold flex items-center gap-1.5" style={{ borderColor: "var(--border)" }}>
                <FileCode size={12} />
                Files changed ({detail.files.length})
              </div>
              <div className="divide-y max-h-32 overflow-y-auto" style={{ borderColor: "var(--border)" }}>
                {detail.files.map((f) => (
                  <div key={f.path} className="flex items-center gap-2 px-3 py-1.5 text-xs">
                    <span
                      className="font-mono text-[10px] w-5 text-center"
                      style={{ color: statusColors[f.status] || "var(--muted)" }}
                    >
                      {f.status}
                    </span>
                    <span className="truncate font-mono" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                      {f.path}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diff view */}
            <div
              className="rounded-lg border flex-1 overflow-hidden"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="px-3 py-2 border-b text-xs font-semibold flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <span>Diff</span>
                <span className="text-[10px] flex items-center gap-1" style={{ color: GK_COLOR }}>
                  <GitGraph size={10} />
                  GitKraken MCP
                </span>
              </div>
              <pre
                className="p-3 text-xs leading-relaxed overflow-auto h-full font-mono"
                style={{ color: "var(--foreground)", opacity: 0.85 }}
              >
                {detail.diff}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
