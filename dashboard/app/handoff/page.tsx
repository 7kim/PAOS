"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function HandoffPage() {
  const [content, setContent] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/handoff");
    const data = await res.json();
    setContent(data.content ?? "");
    setUpdatedAt(data.updatedAt ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 30000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold">Handoff</h1>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
        Live state — what every agent reads first. Refreshes every 10s.
        {updatedAt && (
          <span className="ml-2 font-mono text-xs">
            fetched {new Date(updatedAt).toLocaleTimeString()}
          </span>
        )}
      </p>

      <div
        className="rounded-lg border p-5"
        style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        {loading ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading…</p>
        ) : (
          <pre
            className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
            style={{ color: "var(--foreground)" }}
          >
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
