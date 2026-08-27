"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Loader2, CheckCircle2, XCircle, ExternalLink, RefreshCw,
  Copy, Terminal, Power, PowerOff, Download, BarChart3, Search, FileText, Eye, Trash2, Pencil, FolderKanban,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AgentInfo {
  id: string;
  label: string;
  available: boolean;
  version: string;
  error: string;
}

interface RegistryAgent {
  id: string;
  label: string;
  role: string;
  enabled: boolean;
  riskLevel: string;
  binary: string;
}

interface InstallableAgent {
  id: string;
  label: string;
  role: string;
  installType: string;
  binary: string;
}

interface AgentStats {
  totalActions: number;
  pipelinesRun: number;
  successRate: string;
  lastActive: string | null;
  actionsByType: Record<string, number>;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [registry, setRegistry] = useState<RegistryAgent[]>([]);
  const [installable, setInstallable] = useState<InstallableAgent[]>([]);
  const [stats, setStats] = useState<Record<string, AgentStats>>({});
  const [loading, setLoading] = useState(true);
  const [installError, setInstallError] = useState("");
  const [installing, setInstalling] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [agentFiles, setAgentFiles] = useState<Record<string, any[]>>({});
  const [agentMeta, setAgentMeta] = useState<Record<string, any>>({});
  const [viewFile, setViewFile] = useState<{ agent: string; path: string; content: string } | null>(null);
  const [editFile, setEditFile] = useState<{ agent: string; path: string; content: string } | null>(null);
  const [editContent, setEditContent] = useState("");
  const [savingFile, setSavingFile] = useState(false);
  const [deleteAgentTarget, setDeleteAgentTarget] = useState<string | null>(null);
  const [deleteAgentConfirm, setDeleteAgentConfirm] = useState("");
  const [deletingAgent, setDeletingAgent] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [agentsRes, registryRes, installableRes, statsRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/agents/scoped"),
        fetch("/api/agents/installable"),
        fetch("/api/agents/stats"),
      ]);
      const agentsData = await agentsRes.json();
      const registryData = await registryRes.json();
      const installableData = await installableRes.json();
      const statsData = await statsRes.json();

      setAgents(agentsData.agents || []);
      setRegistry(registryData.scopedProjects?.flatMap((p: any) => p.agents?.map((a: string) => ({ id: a, label: a, enabled: true, role: "", riskLevel: "medium", binary: a })) || []) || []);
      setInstallable(installableData.agents || []);
      setStats(statsData.agents || {});
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggleAgent = async (id: string) => {
    try {
      const res = await fetch(`/api/agents/${id}/toggle`, { method: "PATCH" });
      if (res.ok) {
        setRegistry((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a));
      }
    } catch { /* ignore */ }
  };

  const installAgent = async (id: string) => {
    setInstalling(id);
    setInstallError("");
    try {
      const res = await fetch(`/api/agents/${id}/install`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setInstallable((prev) => prev.filter((a) => a.id !== id));
        setRegistry((prev) => [...prev, { id, label: id, enabled: true, role: "", riskLevel: "medium", binary: id }]);
      } else {
        setInstallError(data.error || "Install failed");
      }
    } catch (e) {
      setInstallError(String(e));
    }
    setInstalling(null);
  };

  const loadAgentFiles = async (agentId: string) => {
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(agentId)}/files`);
      const data = await res.json();
      if (res.ok) {
        setAgentFiles((prev) => ({ ...prev, [agentId]: data.files || [] }));
        setAgentMeta((prev) => ({ ...prev, [agentId]: { binary: data.binary, label: data.label, role: data.role } }));
      }
    } catch { /* ignore */ }
  };

  const toggleExpand = async (agentId: string) => {
    if (expandedAgent === agentId) { setExpandedAgent(null); return; }
    setExpandedAgent(agentId);
    await loadAgentFiles(agentId);
  };

  const openViewFile = async (agentId: string, path: string) => {
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(agentId)}/files?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (res.ok) setViewFile({ agent: agentId, path, content: data.content || "" });
      else setViewFile({ agent: agentId, path, content: `Error: ${data.error}` });
    } catch (e) { setViewFile({ agent: agentId, path, content: String(e) }); }
  };

  const openEditFile = async (agentId: string, path: string) => {
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(agentId)}/files?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (res.ok) { setEditFile({ agent: agentId, path, content: data.content || "" }); setEditContent(data.content || ""); }
      else { setEditFile({ agent: agentId, path, content: "" }); setEditContent(""); }
    } catch { setEditFile({ agent: agentId, path, content: "" }); setEditContent(""); }
  };

  const saveEditFile = async () => {
    if (!editFile) return;
    setSavingFile(true);
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(editFile.agent)}/files`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: editFile.path, content: editContent }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditFile(null); await loadAgentFiles(editFile.agent);
    } catch (e) { alert(String(e)); }
    setSavingFile(false);
  };

  const deleteFile = async (agentId: string, path: string) => {
    if (!confirm(`Delete file ${path}? Only this file will be deleted.`)) return;
    await fetch(`/api/agents/${encodeURIComponent(agentId)}/files?path=${encodeURIComponent(path)}`, { method: "DELETE" });
    await loadAgentFiles(agentId);
  };

  const deleteAgentCompletely = async () => {
    if (!deleteAgentTarget || deleteAgentConfirm !== `${deleteAgentTarget}_Delete`) return;
    setDeletingAgent(deleteAgentTarget);
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(deleteAgentTarget)}/files`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setDeleteAgentTarget(null); setDeleteAgentConfirm("");
      await loadAll();
      setAgentFiles((prev) => { const n = { ...prev }; delete n[deleteAgentTarget]; return n; });
      if (expandedAgent === deleteAgentTarget) setExpandedAgent(null);
    } catch (e) { alert(String(e)); }
    setDeletingAgent(null);
  };

  // Merge registry with live health check info
  const mergedAgents = registry.map((r) => {
    const live = agents.find((a) => a.id === r.id || a.id === r.id.replace(/-/g, "-"));
    return { ...r, available: live?.available ?? false, version: live?.version || "" };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Agents</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            Manage PAOS agent lifecycle — {mergedAgents.filter((a) => a.enabled).length} active · {installable.length} available to install
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/agents/explorer">
            <Button variant="ghost" size="sm" className="text-[10px] gap-1">
              <Search size={12} />
              Explorer
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setShowStats(!showStats)} className="text-[10px] gap-1">
            <BarChart3 size={12} />
            {showStats ? "Hide Stats" : "Stats"}
          </Button>
          <Button variant="ghost" size="sm" onClick={loadAll} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin opacity-50" />
        </div>
      ) : (
        <>
          {/* ── Active Agents ── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Terminal size={14} />
                Active Agents ({mergedAgents.filter((a) => a.enabled).length})
              </CardTitle>
              <CardDescription className="text-[10px]">
                Agents registered in PAOS. Toggle to enable/disable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mergedAgents.length === 0 ? (
                <div className="text-[10px] text-center py-4 opacity-50">No agents registered</div>
              ) : (
                mergedAgents.map((agent) => {
                  const isExpanded = expandedAgent === agent.id;
                  const files = agentFiles[agent.id] || [];
                  const meta = agentMeta[agent.id] || {};
                  return (
                  <div
                    key={agent.id}
                    className="rounded-lg border transition-all overflow-hidden"
                    style={{
                      borderColor: isExpanded ? "var(--primary)" : "var(--border)",
                      background: agent.enabled ? "var(--card-bg)" : "transparent",
                      opacity: agent.enabled ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-center justify-between p-3">
                    <button type="button" onClick={() => toggleExpand(agent.id)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
                      {agent.enabled ? (
                        <CheckCircle2 size={14} style={{ color: agent.available ? "var(--success, #22c55e)" : "var(--muted-foreground)" }} />
                      ) : (
                        <XCircle size={14} style={{ color: "var(--muted-foreground)" }} />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate flex items-center gap-2">
                          {agent.label || agent.id}
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">
                            {agent.riskLevel || "—"}
                          </Badge>
                          {agent.available && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0" style={{ color: "var(--success, #22c55e)" }}>
                              {agent.version?.slice(0, 30) || "Online"}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[9px] px-1 py-0" style={{ color: "var(--muted-foreground)" }} title={`Binary: ${meta.binary || agent.id}`}>{meta.binary || agent.id} · {agent.id}</Badge>
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          {agent.id}{agent.available ? "" : " · Binary not found on PATH"} · {meta.role || ""} · click to view files ({files.length || "?"})
                        </div>
                        {/* Stats for this agent */}
                        {showStats && stats[agent.id] && (
                          <div className="flex flex-wrap gap-2 mt-1.5 text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                            <span>{stats[agent.id].totalActions} actions</span>
                            <span>{stats[agent.id].pipelinesRun} pipelines</span>
                            <span>Success: {stats[agent.id].successRate}</span>
                            {stats[agent.id].lastActive && (
                              <span>Last: {stats[agent.id].lastActive?.slice(0, 10)}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      {agent.available && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => { e.stopPropagation(); toggleAgent(agent.id); }}
                          title={agent.enabled ? "Disable" : "Enable"}
                        >
                          {agent.enabled ? <PowerOff size={12} /> : <Power size={12} />}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1" onClick={(e) => { e.stopPropagation(); toggleExpand(agent.id); }} title="View files, edit, see app mapping">
                        <FolderKanban size={11} /> {isExpanded ? "Hide" : "Files"}
                      </Button>
                      <Badge className="text-[9px]" style={{
                        background: agent.enabled ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)",
                        color: agent.enabled ? "#22c55e" : "var(--muted-foreground)",
                      }}>
                        {agent.enabled ? "ON" : "OFF"}
                      </Badge>
                    </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t p-3 space-y-2" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.12)" }}>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
                            Files for {agent.id} · binary <span className="font-mono" style={{ color: "var(--primary)" }}>{meta.binary || agent.id}</span> ({meta.label || agent.label}) — {files.length} paths
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-red-400 hover:text-red-300" onClick={() => { setDeleteAgentTarget(agent.id); setDeleteAgentConfirm(""); }} title="Delete this agent completely — souls + registry + inbox/log (only this agent)">
                            <Trash2 size={10} /> Delete Agent
                          </Button>
                        </div>
                        {files.length === 0 ? (
                          <div className="text-[10px] py-4 text-center opacity-50">No files yet — click Files to load</div>
                        ) : (
                          <div className="space-y-1">
                            {files.map((f: any) => (
                              <div key={f.path} className="flex items-center gap-2 p-2 rounded border text-[10px]" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
                                <FileText size={10} style={{ color: f.exists ? "var(--primary)" : "var(--muted-foreground)" }} className="shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-mono truncate" style={{ color: f.exists ? "var(--foreground)" : "var(--muted-foreground)" }}>{f.path} {!f.exists && " (missing)"} {f.isDir && " [dir]"}</div>
                                  <div className="text-[9px] truncate" style={{ color: "var(--muted-foreground)" }}>used by <span className="font-mono" style={{ color: "var(--primary)" }}>{f.binary || meta.binary}</span> ({f.app || meta.label}) · {f.size} bytes · {f.role || ""}</div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openViewFile(agent.id, f.path)} title="View"><Eye size={10} /></Button>
                                  {!f.isDir && <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openEditFile(agent.id, f.path)} title="Edit"><Pencil size={10} /></Button>}
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400" onClick={() => deleteFile(agent.id, f.path)} title="Delete only this file"><Trash2 size={10} /></Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-[9px] text-center" style={{ color: "var(--muted-foreground)" }}>
                          View / Edit / Delete per-file — Delete Agent removes souls, registry entry, and inbox/log for <span className="font-mono">{agent.id}</span> only.
                        </div>
                      </div>
                    )}
                  </div>
                );})
              )}
            </CardContent>
          </Card>

          {/* ── Installable Agents ── */}
          {installable.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Download size={14} />
                  Available to Install ({installable.length})
                </CardTitle>
                <CardDescription className="text-[10px]">
                  Self-contained installation inside ~/AI_Workflow/agents/ with auto-configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {installError && (
                  <div className="text-[10px] p-2 rounded" style={{ color: "var(--destructive)", background: "rgba(255,0,0,0.05)" }}>
                    {installError}
                  </div>
                )}
                {installable.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Download size={14} style={{ color: "var(--primary)" }} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium">{agent.label}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          {agent.role} · install via {agent.installType}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[10px] gap-1 h-7"
                      disabled={installing === agent.id}
                      onClick={() => installAgent(agent.id)}
                    >
                      {installing === agent.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Download size={10} />
                      )}
                      {installing === agent.id ? "Installing..." : "Install"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Global Stats Summary ── */}
          {showStats && Object.keys(stats).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 size={14} />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(stats).slice(0, 8).map(([agentId, s]) => (
                    <div key={agentId} className="p-2 rounded-lg border text-center" style={{ borderColor: "var(--border)" }}>
                      <div className="text-[9px] font-medium truncate" style={{ color: "var(--muted-foreground)" }}>
                        {agentId}
                      </div>
                      <div className="text-sm font-semibold mt-1">{s.totalActions}</div>
                      <div className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>actions</div>
                      <div className="text-[9px] font-medium" style={{ color: s.successRate === "100%" ? "#22c55e" : "var(--primary)" }}>
                        {s.successRate} success
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* View file dialog */}
      <Dialog open={!!viewFile} onOpenChange={(o) => { if (!o) setViewFile(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2"><FileText size={13} /> {viewFile?.path}</DialogTitle>
            <DialogDescription className="text-xs font-mono">Agent {viewFile?.agent} · {viewFile?.path}</DialogDescription>
          </DialogHeader>
          <pre className="text-xs font-mono whitespace-pre-wrap p-3 rounded border overflow-auto" style={{ background: "rgba(0,0,0,0.3)", borderColor: "var(--border)", color: "var(--muted-foreground)", maxHeight: "60vh" }}>{viewFile?.content || "(empty)"}</pre>
        </DialogContent>
      </Dialog>

      {/* Edit file dialog */}
      <Dialog open={!!editFile} onOpenChange={(o) => { if (!o) setEditFile(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2"><Pencil size={13} /> Edit {editFile?.path}</DialogTitle>
            <DialogDescription className="text-xs">Editing <code className="font-mono">{editFile?.path}</code> for {editFile?.agent} — .bak kept.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={20} className="w-full text-xs font-mono rounded border p-3" style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditFile(null)}>Cancel</Button>
              <Button size="sm" onClick={saveEditFile} disabled={savingFile} className="gap-1.5">{savingFile && <Loader2 size={12} className="animate-spin" />} Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete agent completely — typed confirmation */}
      <Dialog open={!!deleteAgentTarget} onOpenChange={(o) => { if (!o) { setDeleteAgentTarget(null); setDeleteAgentConfirm(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2 text-red-400"><Trash2 size={13} /> Delete Agent {deleteAgentTarget}</DialogTitle>
            <DialogDescription className="text-xs">This deletes <span className="font-mono">agents/{deleteAgentTarget}/</span>, removes from <code className="font-mono">agents/registry.json</code>, and deletes <code className="font-mono">memory/inbox/{deleteAgentTarget}</code> & <code className="font-mono">logs/{deleteAgentTarget}/</code> (.bak kept). Only this agent — others untouched.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Type <span className="font-mono px-1 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>{deleteAgentTarget}_Delete</span> to confirm:</p>
            <Input value={deleteAgentConfirm} onChange={(e) => setDeleteAgentConfirm(e.target.value)} placeholder={`${deleteAgentTarget}_Delete`} className="text-xs font-mono" autoFocus />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setDeleteAgentTarget(null); setDeleteAgentConfirm(""); }}>Cancel</Button>
              <Button size="sm" disabled={deleteAgentConfirm !== `${deleteAgentTarget}_Delete` || deletingAgent === deleteAgentTarget} onClick={deleteAgentCompletely} className="gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20">{deletingAgent === deleteAgentTarget ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete only this agent</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
