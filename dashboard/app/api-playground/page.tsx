"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Play,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  RefreshCw,
} from "lucide-react";

interface ApiEndpoint {
  path: string;
  method: "GET" | "POST";
  description: string;
  dynamic?: { param: string; options: string[] };
  bodyPlaceholder?: string;
}

const endpoints: ApiEndpoint[] = [
  { path: "/api/overview", method: "GET", description: "Dashboard overview stats — agents, ledger, tasks, recent activity" },
  { path: "/api/agents", method: "GET", description: "List all registered PAOS agents" },
  { path: "/api/agents/[id]/health", method: "GET", description: "Health check for a specific agent", dynamic: { param: "id", options: [] } },
  { path: "/api/tasks", method: "GET", description: "List all tracked task cards" },
  { path: "/api/handoff", method: "GET", description: "Get the current HANDOFF.md state" },
  { path: "/api/ledger", method: "GET", description: "Get global audit ledger entries" },
  { path: "/api/inbox", method: "GET", description: "Get inbox messages for all agents" },
  { path: "/api/pipelines", method: "GET", description: "List all active pipelines" },
  { path: "/api/plans", method: "GET", description: "List all PM plans" },
  { path: "/api/gitview", method: "GET", description: "Git log and repository view" },
  { path: "/api/system/doctor", method: "GET", description: "Full system diagnostics — checks every agent" },
  { path: "/api/send-message", method: "POST", description: "Send a message to an agent's inbox", bodyPlaceholder: '{"targetAgent":"...", "sender":"...", "subject":"...", "body":"..."}' },
];

function statusColor(code: number) {
  if (code >= 200 && code < 300) return "var(--green)";
  if (code >= 400) return "#ef4444";
  return "var(--accent)";
}

function formatJson(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export default function ApiPlaygroundPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { status: number; body: unknown; error?: string }>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [requestBody, setRequestBody] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  // Load agent IDs for the dynamic endpoint
  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((d) => {
        const ids = (d.agents ?? []).map((a: { id: string }) => a.id).sort();
        setAgentIds(ids);
        // Update the options in the endpoint
        const ep = endpoints.find((e) => e.path === "/api/agents/[id]/health");
        if (ep && ep.dynamic) ep.dynamic.options = ids;
      })
      .catch(() => {});
  }, []);

  const buildUrl = useCallback(
    (ep: ApiEndpoint) => {
      if (!ep.dynamic) return ep.path;
      const agent = selectedAgent || agentIds[0] || "";
      return ep.path.replace("[id]", agent);
    },
    [selectedAgent, agentIds]
  );

  const sendRequest = useCallback(
    async (ep: ApiEndpoint) => {
      const url = buildUrl(ep);
      setLoading(ep.path);
      setResults((prev) => ({ ...prev, [ep.path]: undefined as unknown as { status: number; body: unknown } }));

      try {
        const opts: RequestInit = { method: ep.method };
        if (ep.method === "POST" && requestBody) {
          opts.headers = { "Content-Type": "application/json" };
          opts.body = requestBody;
        }
        const res = await fetch(url, opts);
        let body: unknown;
        try {
          body = await res.json();
        } catch {
          body = await res.text().catch(() => "(empty)");
        }
        setResults((prev) => ({ ...prev, [ep.path]: { status: res.status, body } }));
      } catch (e) {
        setResults((prev) => ({
          ...prev,
          [ep.path]: { status: 0, body: null, error: String(e) },
        }));
      }
      setLoading(null);
    },
    [buildUrl, requestBody]
  );

  const copyResult = (path: string) => {
    const r = results[path];
    if (!r) return;
    const text = typeof r.body === "string" ? r.body : formatJson(r.body);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(path);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">API Playground</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Browse and test PAOS API endpoints. Click any endpoint to expand and send requests.
      </p>

      <div className="space-y-2">
        {endpoints.map((ep) => {
          const isOpen = expanded === ep.path;
          const result = results[ep.path];
          const isLoading = loading === ep.path;
          const url = buildUrl(ep);

          return (
            <div
              key={ep.path}
              className="rounded-lg border overflow-hidden"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              {/* Header — clickable */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : ep.path)}
                className="w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:opacity-80"
              >
                {isOpen ? <ChevronDown size={14} style={{ color: "var(--muted)" }} /> : <ChevronRight size={14} style={{ color: "var(--muted)" }} />}
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0"
                  style={{
                    background: ep.method === "GET" ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)",
                    color: ep.method === "GET" ? "var(--green)" : "var(--accent)",
                  }}
                >
                  {ep.method}
                </span>
                <span className="text-sm font-mono flex-1" style={{ color: "var(--foreground)" }}>
                  {ep.path}
                </span>
                {result && (
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `${statusColor(result.status)}20`, color: statusColor(result.status) }}
                  >
                    {result.status}
                  </span>
                )}
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4 border-t pt-3 space-y-3" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{ep.description}</p>

                  {/* URL bar */}
                  <div
                    className="flex items-center gap-2 rounded px-3 py-2 text-sm font-mono"
                    style={{ background: "rgba(255,255,255,0.03)", color: "var(--foreground)" }}
                  >
                    <span className="text-xs font-bold" style={{ color: ep.method === "GET" ? "var(--green)" : "var(--accent)" }}>
                      {ep.method}
                    </span>
                    <span style={{ opacity: 0.6 }}>/</span>
                    <span className="truncate flex-1">{url.replace("/api/", "")}</span>
                    <button
                      type="button"
                      title="Copy URL"
                      onClick={() => navigator.clipboard.writeText(url)}
                      className="p-1 rounded hover:opacity-70"
                      style={{ color: "var(--muted)" }}
                    >
                      <Copy size={12} />
                    </button>
                  </div>

                  {/* Dynamic param selector */}
                  {ep.dynamic && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {ep.dynamic.param}:
                      </span>
                      <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="text-xs font-mono rounded px-2 py-1 border"
                        style={{
                          background: "var(--card-bg)",
                          color: "var(--foreground)",
                          borderColor: "var(--border)",
                        }}
                      >
                        {agentIds.length === 0 && <option value="">(loading agents...)</option>}
                        {agentIds.map((id) => (
                          <option key={id} value={id}>
                            {id}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* POST body input */}
                  {ep.method === "POST" && (
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder={ep.bodyPlaceholder}
                      rows={3}
                      className="w-full text-xs font-mono rounded px-3 py-2 border"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        color: "var(--foreground)",
                        borderColor: "var(--border)",
                        resize: "vertical",
                      }}
                    />
                  )}

                  {/* Send button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => sendRequest(ep)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors"
                      style={{
                        background: "var(--accent)",
                        color: "var(--accent-on)",
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                      {isLoading ? "Sending..." : "Send Request"}
                    </button>
                  </div>

                  {/* Response */}
                  {result && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                          Response {result.status > 0 && (
                            <span style={{ color: statusColor(result.status) }}>
                              ({result.status})
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyResult(ep.path)}
                          className="flex items-center gap-1 text-xs rounded px-2 py-1 transition-colors"
                          style={{ color: "var(--muted)" }}
                        >
                          {copied === ep.path ? <Check size={11} /> : <Copy size={11} />}
                          {copied === ep.path ? "Copied" : "Copy"}
                        </button>
                      </div>
                      {result.error ? (
                        <div
                          className="text-xs font-mono rounded p-3 overflow-auto max-h-96 whitespace-pre-wrap"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                        >
                          {result.error}
                        </div>
                      ) : (
                        <pre
                          className="text-xs font-mono rounded p-3 overflow-auto max-h-96 leading-relaxed"
                          style={{ background: "rgba(255,255,255,0.03)", color: "var(--foreground)" }}
                        >
                          {formatJson(result.body)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
