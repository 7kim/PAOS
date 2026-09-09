"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Plus, Trash2, Edit2, Check, X, FolderOpen, Terminal, Code, Settings } from "lucide-react";

interface EnvVar {
  key: string;
  value: string;
  masked: boolean;
}

interface Alias {
  name: string;
  command: string;
}

interface PathEntry {
  path: string;
  exists: boolean;
}

interface BashrcData {
  raw: string;
  sources: string[];
  envVars: EnvVar[];
  aliases: Alias[];
  pathEntries: PathEntry[];
  functions: string[];
  sourceLines: string[];
  other: string[];
}

export default function EnvPage() {
  const [data, setData] = useState<BashrcData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [showRaw, setShowRaw] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"env" | "path" | "aliases" | "functions" | "raw">("env");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/env");
      const json = await res.json();
      if (json.ok) {
        setData(json.data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleReveal = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const startEdit = (key: string, value: string) => {
    setEditing(key);
    setEditValue(value);
  };

  const saveEdit = async (key: string) => {
    setSaving(true);
    try {
      await fetch("/api/settings/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: editValue, action: "update" }),
      });
      setEditing(null);
      load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const deleteVar = async (key: string) => {
    setSaving(true);
    try {
      await fetch("/api/settings/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, action: "delete" }),
      });
      load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const addVar = async () => {
    if (!newKey.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/settings/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey, value: newValue, action: "add" }),
      });
      setAdding(false);
      setNewKey("");
      setNewValue("");
      load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} />
          <h1 className="text-lg font-semibold">Environment Path</h1>
        </div>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-sm text-red-400">Failed to load environment data</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings size={16} />
        <h1 className="text-lg font-semibold">Environment Path</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>
          {data.sources.join(", ")}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b pb-2" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setActiveTab("env")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "env" ? "var(--primary)" : "transparent",
            color: activeTab === "env" ? "var(--primary)" : "var(--muted-foreground)",
          }}
        >
          <Terminal size={10} /> Env Vars ({data.envVars.length})
        </button>
        <button
          onClick={() => setActiveTab("path")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "path" ? "var(--primary)" : "transparent",
            color: activeTab === "path" ? "var(--primary)" : "var(--muted-foreground)",
          }}
        >
          <FolderOpen size={10} /> PATH ({data.pathEntries.length})
        </button>
        <button
          onClick={() => setActiveTab("aliases")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "aliases" ? "var(--primary)" : "transparent",
            color: activeTab === "aliases" ? "var(--primary)" : "var(--muted-foreground)",
          }}
        >
          <Code size={10} /> Aliases ({data.aliases.length})
        </button>
        <button
          onClick={() => setActiveTab("functions")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "functions" ? "var(--primary)" : "transparent",
            color: activeTab === "functions" ? "var(--primary)" : "var(--muted-foreground)",
          }}
        >
          <Code size={10} /> Functions ({data.functions.length})
        </button>
        <button
          onClick={() => setActiveTab("raw")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "raw" ? "var(--primary)" : "transparent",
            color: activeTab === "raw" ? "var(--primary)" : "var(--muted-foreground)",
          }}
        >
          <Code size={10} /> Raw
        </button>
      </div>

      {/* Env Vars tab */}
      {activeTab === "env" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setAdding(true)}
              className="text-xs px-2 py-1 rounded border flex items-center gap-1"
              style={{ background: "rgba(14,203,129,0.1)", borderColor: "rgba(14,203,129,0.3)", color: "#0ecb81" }}
            >
              <Plus size={10} /> Add Variable
            </button>
          </div>

          {adding && (
            <div className="rounded-lg border p-3 space-y-2" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <input
                  placeholder="KEY"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="text-xs px-2 py-1 rounded border font-mono flex-1"
                  style={{ background: "rgba(0,0,0,0.2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
                <input
                  placeholder="value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="text-xs px-2 py-1 rounded border font-mono flex-2"
                  style={{ background: "rgba(0,0,0,0.2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
                <button
                  onClick={addVar}
                  disabled={saving}
                  className="p-1 rounded"
                  style={{ background: "rgba(14,203,129,0.1)", color: "#0ecb81" }}
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => { setAdding(false); setNewKey(""); setNewValue(""); }}
                  className="p-1 rounded"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {data.envVars.map((v) => (
            <div key={v.key} className="rounded-lg border p-3 flex items-center gap-3" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-medium" style={{ color: "var(--primary)" }}>{v.key}</div>
                {editing === v.key ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-xs px-2 py-1 rounded border font-mono w-full mt-1"
                    style={{ background: "rgba(0,0,0,0.2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                ) : (
                  <div className="text-xs font-mono mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
                    {v.masked && !revealed.has(v.key) ? "••••••••" : v.value}
                  </div>
                )}
              </div>
              {v.masked && (
                <button
                  onClick={() => toggleReveal(v.key)}
                  className="p-1 rounded"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {revealed.has(v.key) ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              )}
              {editing === v.key ? (
                <>
                  <button
                    onClick={() => saveEdit(v.key)}
                    className="p-1 rounded"
                    style={{ background: "rgba(14,203,129,0.1)", color: "#0ecb81" }}
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="p-1 rounded"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(v.key, v.value)}
                    className="p-1 rounded"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => deleteVar(v.key)}
                    className="p-1 rounded"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PATH tab */}
      {activeTab === "path" && (
        <div className="space-y-1">
          {data.pathEntries.map((entry) => (
            <div key={entry.path} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: entry.exists ? "#0ecb81" : "#ef4444" }}
              />
              <span className="text-xs font-mono" style={{ color: entry.exists ? "var(--foreground)" : "#ef4444" }}>
                {entry.path}
              </span>
              {!entry.exists && (
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                  MISSING
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Aliases tab */}
      {activeTab === "aliases" && (
        <div className="space-y-1">
          {data.aliases.map((a) => (
            <div key={a.name} className="rounded-lg border p-3" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
              <div className="text-xs font-mono font-medium" style={{ color: "var(--primary)" }}>{a.name}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{a.command}</div>
            </div>
          ))}
        </div>
      )}

      {/* Functions tab */}
      {activeTab === "functions" && (
        <div className="space-y-1">
          {data.functions.map((f) => (
            <div key={f} className="rounded-lg border px-3 py-2" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
              <div className="text-xs font-mono font-medium" style={{ color: "var(--primary)" }}>{f}()</div>
            </div>
          ))}
        </div>
      )}

      {/* Raw tab */}
      {activeTab === "raw" && (
        <pre className="text-xs whitespace-pre-wrap font-mono rounded-lg border p-3 overflow-auto max-h-[60vh]" style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          {data.raw}
        </pre>
      )}
    </div>
  );
}
