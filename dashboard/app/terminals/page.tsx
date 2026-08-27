"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Terminal, Loader2, ExternalLink, XCircle, Play,
  Maximize2, Minimize2, ChevronDown, ChevronRight,
} from "lucide-react";

interface TerminalSession {
  id: string;
  pid: number;
  agent: string;
  label: string;
  startTime: string;
  pipelineId: string;
  nodeId: string;
  output: string[];
  status: string;
  cmd: string;
  app?: string;
  cpu?: string;
  mem?: string;
  memMB?: number | null;
  ioReadMB?: number | null;
  ioWriteMB?: number | null;
  gpuMB?: number | null;
  cwd?: string;
  category?: string;
}

export default function TerminalsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 size={20} className="animate-spin opacity-50" /></div>}>
      <TerminalsContent />
    </Suspense>
  );
}

function TerminalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightPid = searchParams.get("pid");

  const [terminals, setTerminals] = useState<TerminalSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPid, setExpandedPid] = useState<number | null>(
    highlightPid ? parseInt(highlightPid) : null
  );
  const [output, setOutput] = useState("");
  const [outputLoading, setOutputLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/terminals");
      const data = await res.json();
      setTerminals(data.terminals || []);
      if (highlightPid) {
        const pid = parseInt(highlightPid);
        loadOutput(pid);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [highlightPid]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const loadOutput = useCallback(async (pid: number) => {
    setExpandedPid(pid);
    setOutputLoading(true);
    setOutput("");
    try {
      const res = await fetch(`/api/terminals/${pid}`);
      const data = await res.json();
      setOutput(data.output || "# No output available");
    } catch { setOutput("# Failed to load output"); }
    setOutputLoading(false);
  }, []);

  const killProcess = useCallback(async (pid: number) => {
    if (!confirm(`Kill process ${pid}? This will terminate the running agent.`)) return;
    try {
      await fetch("/api/terminals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid, action: "kill" }),
      });
      load();
    } catch { /* ignore */ }
  }, [load]);

  return (
    <div className={`p-6 space-y-4 ${fullScreen ? "fixed inset-0 z-50 bg-background overflow-auto" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Terminal size={16} /> Terminals
          </h1>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {terminals.length} active sessions · auto-refresh every 5s
          </p>
        </div>
        <button
          onClick={() => setFullScreen(!fullScreen)}
          className="text-xs px-2 py-1 rounded border flex items-center gap-1"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
        >
          {fullScreen ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
          {fullScreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 size={16} className="animate-spin opacity-50" />
        </div>
      ) : terminals.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
          <Terminal size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No active terminal sessions</p>
          <p className="text-xs mt-1">Terminals appear when pipeline phases are executing</p>
        </div>
      ) : (
        <div className="space-y-2">
          {terminals.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: expandedPid === t.pid ? "var(--primary)" : "var(--border)",
              }}
            >
              {/* Session header — enriched: PID · app · cpu/mem/io/gpu · category */}
              <div className="flex items-center gap-2 p-2 flex-wrap">
                <button
                  onClick={() => expandedPid === t.pid ? setExpandedPid(null) : loadOutput(t.pid)}
                  className="flex items-center gap-2 flex-1 text-left min-w-0"
                >
                  {expandedPid === t.pid ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: t.status === "running" ? "#22c55e" : t.status === "completed" ? "#3b82f6" : "#ef4444",
                    }}
                  />
                  <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>
                    PID {t.pid}
                  </span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>
                    {(t as any).app || t.agent || "unknown"}
                  </span>
                  <span className="text-[10px] font-mono hidden sm:inline" style={{ color: "var(--muted-foreground)" }}>
                    {t.cmd?.slice(0, 50)}
                  </span>
                  {t.pipelineId && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(240,185,11,0.1)", color: "var(--primary)" }}>
                      {t.pipelineId.slice(0, 16)}...
                    </span>
                  )}
                </button>
                {/* Resource badges */}
                <div className="flex items-center gap-1 flex-wrap">
                  {(t as any).cpu !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }} title="CPU %">CPU {(t as any).cpu}%</span>
                  )}
                  {(t as any).memMB !== undefined && (t as any).memMB !== null && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }} title="Resident memory">MEM {(t as any).memMB}MB</span>
                  )}
                  {(t as any).mem !== undefined && (
                    <span className="text-[9px] px-1 py-0.5 rounded font-mono" style={{ background: "rgba(100,116,139,0.12)", color: "var(--muted-foreground)" }}>{(t as any).mem}%</span>
                  )}
                  {((t as any).ioReadMB !== null || (t as any).ioWriteMB !== null) && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }} title="Read / Write bytes">IO R:{(t as any).ioReadMB ?? 0} W:{(t as any).ioWriteMB ?? 0} MB</span>
                  )}
                  {(t as any).gpuMB !== null && (t as any).gpuMB !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>GPU {(t as any).gpuMB}MB</span>
                  )}
                  {(t as any).category && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase" style={{ background: (t as any).category === "cpu" ? "rgba(59,130,246,0.15)" : (t as any).category === "memory" ? "rgba(168,85,247,0.15)" : (t as any).category === "io" ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.12)", color: (t as any).category === "cpu" ? "#3b82f6" : (t as any).category === "memory" ? "#a855f7" : (t as any).category === "io" ? "#22c55e" : "var(--muted-foreground)" }} title="Heuristic: cpu>50% = cpu, mem>500MB = memory, io>100MB = io">{(t as any).category}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {expandedPid === t.pid && (
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1"
                      style={{
                        borderColor: editMode ? "#22c55e" : "var(--border)",
                        color: editMode ? "#22c55e" : "var(--muted-foreground)",
                      }}
                    >
                      <Play size={8} />
                      {editMode ? "Edit Mode" : "View Only"}
                    </button>
                  )}
                  <button
                    onClick={() => killProcess(t.pid)}
                    className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1"
                    style={{ borderColor: "var(--border)", color: "#ef4444" }}
                  >
                    <XCircle size={8} /> Kill
                  </button>
                </div>
              </div>

              {/* Details + Output */}
              {expandedPid === t.pid && (
                <div className="border-t" style={{ borderColor: "var(--border)" }}>
                  {/* Enriched details */}
                  <div className="p-3 space-y-1 text-[10px] font-mono border-b" style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                    <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>App:</span> {(t as any).app || t.agent} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>PID:</span> {t.pid} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>CWD:</span> {(t as any).cwd || "—"} </div>
                    <div className="break-all"><span className="font-semibold" style={{ color: "var(--foreground)" }}>Cmd:</span> {t.cmd || "—"}</div>
                    <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Resources:</span> CPU {(t as any).cpu ?? "—"}% · MEM {(t as any).memMB ?? "—"}MB ({(t as any).mem ?? "—"}%) · IO R:{(t as any).ioReadMB ?? "—"} W:{(t as any).ioWriteMB ?? "—"} MB · GPU {(t as any).gpuMB ?? "—"}MB · Category {(t as any).category || "idle"} { (t as any).category === "network" ? "" : "(network: n/a — needs eBPF)"}</div>
                  </div>
                  {outputLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 size={12} className="animate-spin opacity-50" />
                    </div>
                  ) : (
                    <pre
                      className="p-3 text-[10px] font-mono whitespace-pre-wrap overflow-auto leading-relaxed"
                      style={{
                        color: "var(--muted-foreground)",
                        maxHeight: editMode ? "none" : "400px",
                        background: "rgba(0,0,0,0.3)",
                      }}
                    >
                      {output || "# No output"}
                    </pre>
                  )}
                  {!editMode && output.length > 2000 && (
                    <div
                      className="text-[9px] text-center py-1 border-t cursor-pointer"
                      style={{ borderColor: "var(--border)", color: "var(--primary)" }}
                      onClick={() => setEditMode(true)}
                    >
                      Output truncated. Click "Edit Mode" to view full output.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
