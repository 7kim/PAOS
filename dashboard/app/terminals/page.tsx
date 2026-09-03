"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Terminal, Loader2, XCircle, Play,
  Maximize2, Minimize2, ChevronDown, ChevronRight,
  Container, Cpu, Server, RefreshCw, PowerOff, Square, RotateCcw, Pause, Trash2,
  CheckCircle, AlertCircle, User, Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────

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

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  ports: string;
  created: string;
  cpu: string;
  mem: string;
  memPerc: string;
  netIO: string;
  blockIO: string;
  command: string;
  mounts: string;
  size: string;
}

interface NodeProcess {
  pid: number;
  ppid: number | null;
  cpu: string;
  mem: string;
  vszKB: number;
  rssKB: number;
  rssMB: number;
  vszMB: number;
  tty: string;
  stat: string;
  start: string;
  time: string;
  cmd: string;
  cwd: string;
  type: string;
  user: string;
}

interface SystemdService {
  name: string;
  description: string;
  status: string;
  subStatus: string;
  uptime: string;
  pid: number | null;
  memory: string;
  enabled: boolean;
}

// ─── Wrapper ──────────────────────────────────────────────────────────────

export default function TerminalsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 size={20} className="animate-spin opacity-50" /></div>}>
      <TerminalsContent />
    </Suspense>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────

function TerminalsContent() {
  const searchParams = useSearchParams();
  const highlightPid = searchParams.get("pid");
  const [activeTab, setActiveTab] = useState<"terminals" | "docker" | "node" | "services">("terminals");
  const [fullScreen, setFullScreen] = useState(false);

  // Terminals state
  const [terminals, setTerminals] = useState<TerminalSession[]>([]);
  const [terminalsLoading, setTerminalsLoading] = useState(true);
  const [expandedPid, setExpandedPid] = useState<number | null>(
    highlightPid ? parseInt(highlightPid) : null
  );
  const [output, setOutput] = useState("");
  const [outputLoading, setOutputLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Docker state
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [dockerLoading, setDockerLoading] = useState(true);
  const [dockerExpandedId, setDockerExpandedId] = useState<string | null>(null);
  const [dockerLogs, setDockerLogs] = useState("");
  const [dockerLogsLoading, setDockerLogsLoading] = useState(false);
  const [dockerActionLoading, setDockerActionLoading] = useState<string | null>(null);

  // Node state
  const [processes, setProcesses] = useState<NodeProcess[]>([]);

  // Systemd state
  const [services, setServices] = useState<SystemdService[]>([]);
  const [systemdLoading, setSystemdLoading] = useState(true);
  const [systemdExpandedName, setSystemdExpandedName] = useState<string | null>(null);
  const [systemdActionLoading, setSystemdActionLoading] = useState<string | null>(null);
  const [nodeLoading, setNodeLoading] = useState(true);
  const [nodeExpandedPid, setNodeExpandedPid] = useState<number | null>(null);
  const [nodeActionLoading, setNodeActionLoading] = useState<number | null>(null);
  const [nodeFilter, setNodeFilter] = useState("");

  // ─── Terminals ────────────────────────────────────────────────────────

  const loadTerminals = useCallback(async () => {
    setTerminalsLoading(true);
    try {
      const res = await fetch("/api/terminals");
      const data = await res.json();
      setTerminals(data.terminals || []);
      if (highlightPid) {
        const pid = parseInt(highlightPid);
        loadOutput(pid);
      }
    } catch { /* ignore */ }
    setTerminalsLoading(false);
  }, [highlightPid]);

  useEffect(() => { loadTerminals(); }, [loadTerminals]);

  useEffect(() => {
    if (activeTab !== "terminals") return;
    const interval = setInterval(loadTerminals, 5000);
    return () => clearInterval(interval);
  }, [loadTerminals, activeTab]);

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
      loadTerminals();
    } catch { /* ignore */ }
  }, [loadTerminals]);

  // ─── Docker ───────────────────────────────────────────────────────────

  const loadDocker = useCallback(async () => {
    setDockerLoading(true);
    try {
      const res = await fetch("/api/docker");
      const data = await res.json();
      setContainers(data.containers || []);
    } catch { /* ignore */ }
    setDockerLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab !== "docker") return;
    loadDocker();
    const interval = setInterval(loadDocker, 5000);
    return () => clearInterval(interval);
  }, [loadDocker, activeTab]);

  const loadDockerLogs = useCallback(async (id: string) => {
    setDockerExpandedId(id);
    setDockerLogsLoading(true);
    setDockerLogs("");
    try {
      const res = await fetch("/api/docker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "logs", tail: 200 }),
      });
      const data = await res.json();
      setDockerLogs(data.logs || data.error || "# No logs available");
    } catch { setDockerLogs("# Failed to load logs"); }
    setDockerLogsLoading(false);
  }, []);

  const dockerAction = useCallback(async (id: string, action: string) => {
    if (action === "rm" || action === "kill") {
      if (!confirm(`${action === "rm" ? "Remove" : "Kill"} container ${id.slice(0, 12)}?`)) return;
    }
    setDockerActionLoading(id + action);
    try {
      await fetch("/api/docker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      loadDocker();
    } catch { /* ignore */ }
    setDockerActionLoading(null);
  }, [loadDocker]);

  // ─── Node ─────────────────────────────────────────────────────────────

  const loadNode = useCallback(async () => {
    setNodeLoading(true);
    try {
      const res = await fetch("/api/node-processes");
      const data = await res.json();
      setProcesses(data.processes || []);
    } catch { /* ignore */ }
    setNodeLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab !== "node") return;
    loadNode();
    const interval = setInterval(loadNode, 5000);
    return () => clearInterval(interval);
  }, [loadNode, activeTab]);

  const killNodeProcess = useCallback(async (pid: number, action: string) => {
    if (!confirm(`${action === "kill" ? "Force kill" : "Terminate"} process ${pid}?`)) return;
    setNodeActionLoading(pid);
    try {
      await fetch("/api/node-processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid, action }),
      });
      loadNode();
    } catch { /* ignore */ }
    setNodeActionLoading(null);
  }, [loadNode]);

  // ─── Systemd ─────────────────────────────────────────────────────────

  const loadSystemd = useCallback(async () => {
    setSystemdLoading(true);
    try {
      const res = await fetch("/api/system/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch { /* ignore */ }
    setSystemdLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab !== "services") return;
    loadSystemd();
    const interval = setInterval(loadSystemd, 5000);
    return () => clearInterval(interval);
  }, [loadSystemd, activeTab]);

  const systemdAction = useCallback(async (name: string, action: string) => {
    if (action === "stop" || action === "restart" || action === "disable") {
      if (!confirm(`${action} service "${name}"?`)) return;
    }
    setSystemdActionLoading(name + action);
    try {
      await fetch("/api/system/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, action }),
      });
      loadSystemd();
    } catch { /* ignore */ }
    setSystemdActionLoading(null);
  }, [loadSystemd]);

  // ─── Helpers ──────────────────────────────────────────────────────────

  const getStatusColor = (state: string) => {
    const s = (state || "").toLowerCase();
    if (s.includes("up") || s.includes("running")) return "#22c55e";
    if (s.includes("exited") || s.includes("dead")) return "#ef4444";
    if (s.includes("paused")) return "#f59e0b";
    if (s.includes("restarting")) return "#3b82f6";
    return "#707a8a";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "next": return "#f0b90b";
      case "npm": case "npx": return "#cb3837";
      case "node": case "nodemon": return "#22c55e";
      case "ts-node": case "tsc": case "webpack": case "pm2": return "#3b82f6";
      case "vite": return "#a855f7";
      case "esbuild": return "#f97316";
      default: return "#707a8a";
    }
  };

  const filteredProcesses = processes.filter((p) => {
    if (!nodeFilter) return true;
    const f = nodeFilter.toLowerCase();
    return p.cmd.toLowerCase().includes(f) || p.type.toLowerCase().includes(f) || String(p.pid).includes(f) || (p.cwd || "").toLowerCase().includes(f);
  });

  const totalNodeMemMB = processes.reduce((sum, p) => sum + (p.rssMB || 0), 0);
  const totalNodeCpu = processes.reduce((sum, p) => sum + parseFloat(p.cpu || "0"), 0).toFixed(1);

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className={`p-6 space-y-4 ${fullScreen ? "fixed inset-0 z-50 bg-background overflow-auto" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Terminal size={16} /> Terminals
          </h1>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {activeTab === "terminals" && `${terminals.length} active sessions`}
            {activeTab === "docker" && `${containers.length} containers`}
            {activeTab === "node" && `${processes.length} processes · CPU ${totalNodeCpu}% · MEM ${totalNodeMemMB}MB`}
            {activeTab === "services" && `${services.length} services`}
            {" · auto-refresh every 5s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFullScreen(!fullScreen)}
            className="text-xs px-2 py-1 rounded border flex items-center gap-1"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            {fullScreen ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
            {fullScreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b pb-2" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setActiveTab("terminals")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "terminals" ? "var(--primary)" : "transparent",
            color: activeTab === "terminals" ? "var(--primary)" : "var(--muted-foreground)",
            background: activeTab === "terminals" ? "rgba(240,185,11,0.06)" : "transparent",
          }}
        >
          <Terminal size={12} /> Terminals
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>
            {terminals.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("docker")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "docker" ? "var(--primary)" : "transparent",
            color: activeTab === "docker" ? "var(--primary)" : "var(--muted-foreground)",
            background: activeTab === "docker" ? "rgba(240,185,11,0.06)" : "transparent",
          }}
        >
          <Container size={12} /> Docker
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
            {containers.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("node")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "node" ? "var(--primary)" : "transparent",
            color: activeTab === "node" ? "var(--primary)" : "var(--muted-foreground)",
            background: activeTab === "node" ? "rgba(240,185,11,0.06)" : "transparent",
          }}
        >
          <Cpu size={12} /> Node Processes
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
            {processes.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className="text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: activeTab === "services" ? "var(--primary)" : "transparent",
            color: activeTab === "services" ? "var(--primary)" : "var(--muted-foreground)",
            background: activeTab === "services" ? "rgba(240,185,11,0.06)" : "transparent",
          }}
        >
          <Server size={12} /> Startup Boot
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>
            {services.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "terminals" && (
        <TerminalsTab
          loading={terminalsLoading}
          terminals={terminals}
          expandedPid={expandedPid}
          output={output}
          outputLoading={outputLoading}
          editMode={editMode}
          onSetEditMode={setEditMode}
          onLoadOutput={loadOutput}
          onKill={killProcess}
        />
      )}
      {activeTab === "docker" && (
        <DockerTab
          loading={dockerLoading}
          containers={containers}
          expandedId={dockerExpandedId}
          logs={dockerLogs}
          logsLoading={dockerLogsLoading}
          actionLoading={dockerActionLoading}
          onLoadLogs={loadDockerLogs}
          onAction={dockerAction}
        />
      )}
      {activeTab === "node" && (
        <NodeTab
          loading={nodeLoading}
          processes={filteredProcesses}
          expandedPid={nodeExpandedPid}
          actionLoading={nodeActionLoading}
          filter={nodeFilter}
          onSetFilter={setNodeFilter}
          onSetExpandedPid={setNodeExpandedPid}
          onKill={killNodeProcess}
        />
      )}
      {activeTab === "services" && (
        <ServicesTab
          loading={systemdLoading}
          services={services}
          expandedName={systemdExpandedName}
          actionLoading={systemdActionLoading}
          onSetExpandedName={setSystemdExpandedName}
          onAction={systemdAction}
        />
      )}
    </div>
  );
}

// ─── Terminals Tab ────────────────────────────────────────────────────────

function TerminalsTab({
  loading, terminals, expandedPid, output, outputLoading, editMode,
  onSetEditMode, onLoadOutput, onKill,
}: {
  loading: boolean;
  terminals: TerminalSession[];
  expandedPid: number | null;
  output: string;
  outputLoading: boolean;
  editMode: boolean;
  onSetEditMode: (v: boolean) => void;
  onLoadOutput: (pid: number) => void;
  onKill: (pid: number) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 size={16} className="animate-spin opacity-50" />
      </div>
    );
  }

  if (terminals.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
        <Terminal size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No active terminal sessions</p>
        <p className="text-xs mt-1">Terminals appear when pipeline phases are executing</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {terminals.map((t) => (
        <div
          key={t.id}
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: expandedPid === t.pid ? "var(--primary)" : "var(--border)" }}
        >
          <div className="flex items-center gap-2 p-2 flex-wrap">
            <button
              onClick={() => expandedPid === t.pid ? onLoadOutput(t.pid) : onLoadOutput(t.pid)}
              className="flex items-center gap-2 flex-1 text-left min-w-0"
            >
              {expandedPid === t.pid ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.status === "running" ? "#22c55e" : t.status === "completed" ? "#3b82f6" : "#ef4444" }} />
              <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>PID {t.pid}</span>
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
            <div className="flex items-center gap-1 flex-wrap">
              {(t as any).cpu !== undefined && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>CPU {(t as any).cpu}%</span>}
              {(t as any).memMB !== undefined && (t as any).memMB !== null && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>MEM {(t as any).memMB}MB</span>}
              {((t as any).ioReadMB !== null || (t as any).ioWriteMB !== null) && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>IO R:{(t as any).ioReadMB ?? 0} W:{(t as any).ioWriteMB ?? 0} MB</span>}
              {(t as any).gpuMB !== null && (t as any).gpuMB !== undefined && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>GPU {(t as any).gpuMB}MB</span>}
            </div>
            <div className="flex items-center gap-1">
              {expandedPid === t.pid && (
                <button
                  onClick={() => onSetEditMode(!editMode)}
                  className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1"
                  style={{ borderColor: editMode ? "#22c55e" : "var(--border)", color: editMode ? "#22c55e" : "var(--muted-foreground)" }}
                >
                  <Play size={8} /> {editMode ? "Edit" : "View"}
                </button>
              )}
              <button
                onClick={() => onKill(t.pid)}
                className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1"
                style={{ borderColor: "var(--border)", color: "#ef4444" }}
              >
                <XCircle size={8} /> Kill
              </button>
            </div>
          </div>
          {expandedPid === t.pid && (
            <div className="border-t" style={{ borderColor: "var(--border)" }}>
              <div className="p-3 space-y-1 text-[10px] font-mono border-b" style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>App:</span> {(t as any).app || t.agent} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>PID:</span> {t.pid} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>CWD:</span> {(t as any).cwd || "—"}</div>
                <div className="break-all"><span className="font-semibold" style={{ color: "var(--foreground)" }}>Cmd:</span> {t.cmd || "—"}</div>
              </div>
              {outputLoading ? (
                <div className="flex items-center justify-center py-4"><Loader2 size={12} className="animate-spin opacity-50" /></div>
              ) : (
                <pre className="p-3 text-[10px] font-mono whitespace-pre-wrap overflow-auto leading-relaxed" style={{ color: "var(--muted-foreground)", maxHeight: editMode ? "none" : "400px", background: "rgba(0,0,0,0.3)" }}>
                  {output || "# No output"}
                </pre>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Docker Tab ───────────────────────────────────────────────────────────

function DockerTab({
  loading, containers, expandedId, logs, logsLoading, actionLoading,
  onLoadLogs, onAction,
}: {
  loading: boolean;
  containers: DockerContainer[];
  expandedId: string | null;
  logs: string;
  logsLoading: boolean;
  actionLoading: string | null;
  onLoadLogs: (id: string) => void;
  onAction: (id: string, action: string) => void;
}) {
  const getStatusColor = (state: string) => {
    const s = (state || "").toLowerCase();
    if (s.includes("up") || s.includes("running")) return "#22c55e";
    if (s.includes("exited") || s.includes("dead")) return "#ef4444";
    if (s.includes("paused")) return "#f59e0b";
    if (s.includes("restarting")) return "#3b82f6";
    return "#707a8a";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 size={16} className="animate-spin opacity-50" />
      </div>
    );
  }

  if (containers.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
        <Container size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No containers running</p>
        <p className="text-xs mt-1">Start a container to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {containers.map((c) => {
        const state = (c.state || c.status || "").toLowerCase();
        const isRunning = state.includes("up") || state.includes("running");
        const isPaused = state.includes("paused");

        return (
          <div key={c.id} className="rounded-lg border overflow-hidden" style={{ borderColor: expandedId === c.id ? "var(--primary)" : "var(--border)" }}>
            <div className="flex items-center gap-2 p-2 flex-wrap">
              <button onClick={() => expandedId === c.id ? onLoadLogs("") : onLoadLogs(c.id)} className="flex items-center gap-2 flex-1 text-left min-w-0">
                {expandedId === c.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: getStatusColor(c.state || c.status) }} />
                <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>{c.id.slice(0, 12)}</span>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>{c.name || "unnamed"}</span>
                <span className="text-[10px] hidden sm:inline" style={{ color: "var(--muted-foreground)" }}>{c.image}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>{(c.state || c.status || "").slice(0, 20)}</span>
              </button>
              <div className="flex items-center gap-1 flex-wrap">
                {c.cpu && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>CPU {c.cpu}</span>}
                {c.mem && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>MEM {c.mem}</span>}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {!isRunning && (
                  <button onClick={() => onAction(c.id, "start")} disabled={actionLoading === c.id + "start"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#22c55e" }}>
                    <Play size={8} /> Start
                  </button>
                )}
                {isRunning && !isPaused && (
                  <>
                    <button onClick={() => onAction(c.id, "stop")} disabled={actionLoading === c.id + "stop"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#f59e0b" }}>
                      <Square size={8} /> Stop
                    </button>
                    <button onClick={() => onAction(c.id, "pause")} disabled={actionLoading === c.id + "pause"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#3b82f6" }}>
                      <Pause size={8} /> Pause
                    </button>
                  </>
                )}
                {isPaused && (
                  <button onClick={() => onAction(c.id, "unpause")} disabled={actionLoading === c.id + "unpause"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#22c55e" }}>
                    <Play size={8} /> Resume
                  </button>
                )}
                {isRunning && (
                  <button onClick={() => onAction(c.id, "restart")} disabled={actionLoading === c.id + "restart"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#3b82f6" }}>
                    <RotateCcw size={8} /> Restart
                  </button>
                )}
                {isRunning && (
                  <button onClick={() => onAction(c.id, "kill")} disabled={actionLoading === c.id + "kill"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#ef4444" }}>
                    <PowerOff size={8} /> Kill
                  </button>
                )}
                <button onClick={() => onAction(c.id, "rm")} disabled={actionLoading === c.id + "rm"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#ef4444" }}>
                  <Trash2 size={8} /> Remove
                </button>
              </div>
            </div>
            {expandedId === c.id && (
              <div className="border-t" style={{ borderColor: "var(--border)" }}>
                <div className="p-3 space-y-1 text-[10px] font-mono border-b" style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                  <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Image:</span> {c.image}</div>
                  <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Status:</span> {c.status}</div>
                  {c.ports && <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Ports:</span> {c.ports}</div>}
                  {c.command && <div className="break-all"><span className="font-semibold" style={{ color: "var(--foreground)" }}>Command:</span> {c.command}</div>}
                  {c.mounts && <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Mounts:</span> {c.mounts}</div>}
                  {c.netIO && <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Net I/O:</span> {c.netIO}</div>}
                  {c.blockIO && <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Block I/O:</span> {c.blockIO}</div>}
                  {c.size && <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Size:</span> {c.size}</div>}
                  <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Created:</span> {c.created}</div>
                </div>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-4"><Loader2 size={12} className="animate-spin opacity-50" /></div>
                ) : (
                  <pre className="p-3 text-[10px] font-mono whitespace-pre-wrap overflow-auto leading-relaxed" style={{ color: "var(--muted-foreground)", maxHeight: "400px", background: "rgba(0,0,0,0.3)" }}>
                    {logs || "# No logs"}
                  </pre>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Node Tab ─────────────────────────────────────────────────────────────

function NodeTab({
  loading, processes, expandedPid, actionLoading, filter, onSetFilter,
  onSetExpandedPid, onKill,
}: {
  loading: boolean;
  processes: NodeProcess[];
  expandedPid: number | null;
  actionLoading: number | null;
  filter: string;
  onSetFilter: (v: string) => void;
  onSetExpandedPid: (v: number | null) => void;
  onKill: (pid: number, action: string) => void;
}) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "next": return "#f0b90b";
      case "npm": case "npx": return "#cb3837";
      case "node": case "nodemon": return "#22c55e";
      case "ts-node": case "tsc": case "webpack": case "pm2": return "#3b82f6";
      case "vite": return "#a855f7";
      case "esbuild": return "#f97316";
      default: return "#707a8a";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 size={16} className="animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats + Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
          Total: {processes.length}
        </span>
        <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>
          Next.js: {processes.filter(p => p.type === "next").length}
        </span>
        <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
          Node: {processes.filter(p => p.type === "node" || p.type === "nodemon").length}
        </span>
        <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(203,56,55,0.12)", color: "#cb3837" }}>
          NPM: {processes.filter(p => p.type === "npm" || p.type === "npx").length}
        </span>
        <span className="text-[9px] px-2 py-1 rounded font-mono" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>
          Build: {processes.filter(p => ["webpack", "vite", "esbuild", "tsc"].includes(p.type)).length}
        </span>
        <input
          type="text"
          placeholder="Filter by cmd, type, PID..."
          value={filter}
          onChange={(e) => onSetFilter(e.target.value)}
          className="text-xs px-2 py-1 rounded border w-48"
          style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
        />
      </div>

      {processes.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
          <Cpu size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">{filter ? "No processes match filter" : "No Node processes found"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {processes.map((p) => (
            <div key={p.pid} className="rounded-lg border overflow-hidden" style={{ borderColor: expandedPid === p.pid ? "var(--primary)" : "var(--border)" }}>
              <div className="flex items-center gap-2 p-2 flex-wrap">
                <button onClick={() => onSetExpandedPid(expandedPid === p.pid ? null : p.pid)} className="flex items-center gap-2 flex-1 text-left min-w-0">
                  {expandedPid === p.pid ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#22c55e" }} />
                  <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>PID {p.pid}</span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: getTypeColor(p.type) + "20", color: getTypeColor(p.type) }}>{p.type}</span>
                  {p.ppid && <span className="text-[9px] px-1 py-0.5 rounded" style={{ background: "rgba(100,116,139,0.12)", color: "var(--muted-foreground)" }}>PPID {p.ppid}</span>}
                  <span className="text-[10px] hidden sm:inline" style={{ color: "var(--muted-foreground)" }}>{p.cmd?.slice(0, 60)}</span>
                </button>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>CPU {p.cpu}%</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>MEM {p.rssMB}MB</span>
                  <span className="text-[9px] px-1 py-0.5 rounded font-mono" style={{ background: "rgba(100,116,139,0.12)", color: "var(--muted-foreground)" }}>VSZ {p.vszMB}MB</span>
                  <span className="text-[9px] px-1 py-0.5 rounded font-mono" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>{p.mem}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onKill(p.pid, "term")} disabled={actionLoading === p.pid} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#f59e0b" }}>
                    <PowerOff size={8} /> TERM
                  </button>
                  <button onClick={() => onKill(p.pid, "kill")} disabled={actionLoading === p.pid} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#ef4444" }}>
                    <XCircle size={8} /> KILL
                  </button>
                </div>
              </div>
              {expandedPid === p.pid && (
                <div className="border-t p-3 space-y-1 text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                  <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>PID:</span> {p.pid} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>PPID:</span> {p.ppid ?? "—"} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>User:</span> {p.user}</div>
                  <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Type:</span> {p.type} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>TTY:</span> {p.tty} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>Stat:</span> {p.stat}</div>
                  <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>CPU:</span> {p.cpu}% · <span className="font-semibold" style={{ color: "var(--foreground)" }}>MEM:</span> {p.mem}% · <span className="font-semibold" style={{ color: "var(--foreground)" }}>RSS:</span> {p.rssMB}MB · <span className="font-semibold" style={{ color: "var(--foreground)" }}>VSZ:</span> {p.vszMB}MB</div>
                  <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Start:</span> {p.start} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>Time:</span> {p.time}</div>
                  {p.cwd && <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>CWD:</span> {p.cwd}</div>}
                  <div className="break-all"><span className="font-semibold" style={{ color: "var(--foreground)" }}>Cmd:</span> {p.cmd || "—"}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Services Tab ──────────────────────────────────────────────────────────

function ServicesTab({
  loading, services, expandedName, actionLoading,
  onSetExpandedName, onAction,
}: {
  loading: boolean;
  services: SystemdService[];
  expandedName: string | null;
  actionLoading: string | null;
  onSetExpandedName: (v: string | null) => void;
  onAction: (name: string, action: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 size={16} className="animate-spin opacity-50" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
        <Server size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No systemd services found</p>
        <p className="text-xs mt-1">Services appear when configured with systemd --user</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {services.map((s) => {
        const isActive = s.status === "active";
        const statusColor = isActive ? "#22c55e" : s.status === "failed" ? "#ef4444" : "#707a8a";

        return (
          <div key={s.name} className="rounded-lg border overflow-hidden" style={{ borderColor: expandedName === s.name ? "var(--primary)" : "var(--border)" }}>
            <div className="flex items-center gap-2 p-2 flex-wrap">
              <button onClick={() => onSetExpandedName(expandedName === s.name ? null : s.name)} className="flex items-center gap-2 flex-1 text-left min-w-0">
                {expandedName === s.name ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor }} />
                <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>{s.name}</span>
                <span className="text-[10px] hidden sm:inline" style={{ color: "var(--muted-foreground)" }}>
                  {s.description?.slice(0, 50) || "—"}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: isActive ? "rgba(34,197,94,0.12)" : "rgba(112,122,138,0.12)", color: isActive ? "#22c55e" : "#707a8a" }}>
                  {s.subStatus}
                </span>
              </button>
              <div className="flex items-center gap-1 flex-wrap">
                {s.pid && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>PID {s.pid}</span>}
                {s.memory && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>{s.memory}</span>}
                {s.uptime && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>{s.uptime}</span>}
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: s.enabled ? "rgba(34,197,94,0.1)" : "rgba(112,122,138,0.1)", color: s.enabled ? "#22c55e" : "#707a8a" }}>
                  {s.enabled ? "enabled" : "disabled"}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {!isActive && (
                  <button onClick={() => onAction(s.name, "start")} disabled={actionLoading === s.name + "start"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#22c55e" }}>
                    <Play size={8} /> Start
                  </button>
                )}
                {isActive && (
                  <>
                    <button onClick={() => onAction(s.name, "stop")} disabled={actionLoading === s.name + "stop"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#f59e0b" }}>
                      <Square size={8} /> Stop
                    </button>
                    <button onClick={() => onAction(s.name, "restart")} disabled={actionLoading === s.name + "restart"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#3b82f6" }}>
                      <RotateCcw size={8} /> Restart
                    </button>
                  </>
                )}
                {s.enabled ? (
                  <button onClick={() => onAction(s.name, "disable")} disabled={actionLoading === s.name + "disable"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#ef4444" }}>
                    <XCircle size={8} /> Disable
                  </button>
                ) : (
                  <button onClick={() => onAction(s.name, "enable")} disabled={actionLoading === s.name + "enable"} className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1" style={{ borderColor: "var(--border)", color: "#22c55e" }}>
                    <CheckCircle size={8} /> Enable
                  </button>
                )}
              </div>
            </div>
            {expandedName === s.name && (
              <div className="border-t p-3 space-y-1 text-[10px] font-mono" style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Name:</span> {s.name}</div>
                <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Description:</span> {s.description || "—"}</div>
                <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Status:</span> {s.status} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>Sub:</span> {s.subStatus}</div>
                <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>PID:</span> {s.pid ?? "—"} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>Memory:</span> {s.memory || "—"}</div>
                <div><span className="font-semibold" style={{ color: "var(--foreground)" }}>Uptime:</span> {s.uptime || "—"} · <span className="font-semibold" style={{ color: "var(--foreground)" }}>Enabled:</span> {s.enabled ? "yes" : "no"}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
