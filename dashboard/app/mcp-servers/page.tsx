"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { RefreshCw, Server, Loader2, Pencil, Trash2, Plus, Power, PowerOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface McpServer {
  name: string;
  description: string;
  enabled?: boolean;
  raw?: any;
}

export default function McpServersPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <McpServersPage />
    </Suspense>
  );
}

function McpServersPage() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState<{ name: string; raw: any; isNew: boolean } | null>(null);
  const [editName, setEditName] = useState("");
  const [editCommand, setEditCommand] = useState("");
  const [editArgs, setEditArgs] = useState("");
  const [editEnv, setEditEnv] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editHeaders, setEditHeaders] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editType, setEditType] = useState<"stdio" | "http">("stdio");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/mcp-servers");
      const data = await res.json();
      setServers(data.servers || []);
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openEdit(s: McpServer | null) {
    if (!s) {
      setEditing({ name: "", raw: {}, isNew: true });
      setEditName(""); setEditCommand(""); setEditArgs(""); setEditEnv(""); setEditUrl(""); setEditHeaders(""); setEditEnabled(true); setEditType("stdio");
      return;
    }
    const raw = s.raw || {};
    const isHttp = raw.type === "http" || !!raw.url;
    setEditing({ name: s.name, raw, isNew: false });
    setEditName(s.name);
    setEditCommand(raw.command || "");
    setEditArgs((raw.args || []).join(" "));
    setEditEnv(Object.entries(raw.env || {}).map(([k,v]) => `${k}=${v}`).join("\n"));
    setEditUrl(raw.url || "");
    setEditHeaders(raw.headers ? JSON.stringify(raw.headers, null, 2) : "");
    setEditEnabled(raw.enabled !== false);
    setEditType(isHttp ? "http" : "stdio");
  }

  async function saveEdit() {
    const name = editName.trim();
    if (!name) return;
    let server: any = { enabled: editEnabled };
    if (editType === "http") {
      if (!editUrl.trim()) { alert("URL required for http type"); return; }
      server.type = "http"; server.url = editUrl.trim();
      if (editHeaders.trim()) {
        try { server.headers = JSON.parse(editHeaders); } catch { alert("Headers must be valid JSON"); return; }
      }
    } else {
      if (!editCommand.trim()) { alert("Command required"); return; }
      server.command = editCommand.trim();
      server.args = editArgs.trim() ? editArgs.trim().split(/\s+/) : [];
      if (editEnv.trim()) {
        server.env = {};
        for (const line of editEnv.split("\n")) {
          const idx = line.indexOf("="); if (idx < 0) continue;
          const k = line.slice(0, idx).trim(); const v = line.slice(idx+1).trim();
          if (k) server.env[k] = v;
        }
      }
    }
    // If renaming, delete old
    const oldName = editing?.name;
    setSaving(true);
    try {
      if (!editing?.isNew && oldName && oldName !== name) {
        await fetch(`/api/mcp-servers?id=${encodeURIComponent(oldName)}`, { method: "DELETE" });
      }
      const res = await fetch("/api/mcp-servers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, server }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditing(null); await load();
    } catch (e) { alert(String(e)); }
    setSaving(false);
  }

  async function toggleEnabled(s: McpServer) {
    const raw = { ...(s.raw || {}), enabled: !(s.enabled !== false) };
    await fetch("/api/mcp-servers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: s.name, server: raw }) });
    await load();
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteConfirm !== `${deleteTarget}_Delete`) return;
    await fetch(`/api/mcp-servers?id=${encodeURIComponent(deleteTarget)}`, { method: "DELETE" });
    setDeleteTarget(null); setDeleteConfirm(""); await load();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}><Server size={16} style={{ color: "var(--primary)" }} /> MCP Servers</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Model Context Protocol servers — disable, add, delete, edit, repoint (restart agent to apply)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => openEdit(null)} className="gap-1.5 text-xs"><Plus size={12} /> Add Server</Button>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></Button>
        </div>
      </div>

      {error && <div className="text-xs p-3 rounded-lg border" style={{ borderColor: "var(--destructive)", color: "var(--destructive)" }}>{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={20} className="animate-spin opacity-50" /></div>
      ) : servers.length === 0 ? (
        <div className="text-xs text-center py-16 opacity-50">No MCP servers configured</div>
      ) : (
        <div className="grid gap-3">
          {servers.map((s) => (
            <Card key={s.name} style={{ opacity: s.enabled === false ? 0.6 : 1, borderColor: s.enabled === false ? "var(--muted)" : "var(--border)" }}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Server size={16} style={{ color: s.enabled === false ? "var(--muted-foreground)" : "var(--primary)" }} />
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {s.name}
                        <Badge variant="secondary" className="text-[9px] px-1 py-0" style={{ background: s.enabled !== false ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)", color: s.enabled !== false ? "#22c55e" : "var(--muted-foreground)" }}>{s.enabled !== false ? "ON" : "OFF"}</Badge>
                        {s.raw?.type === "http" ? <Badge variant="outline" className="text-[9px] px-1 py-0">http</Badge> : <Badge variant="outline" className="text-[9px] px-1 py-0">stdio</Badge>}
                      </CardTitle>
                      <CardDescription className="text-[10px] mt-0.5 truncate max-w-[60vw]">{s.description} {s.raw?.command ? `· ${s.raw.command}` : ""} {s.raw?.url ? `· ${s.raw.url}` : ""}</CardDescription>
                      <div className="text-[9px] font-mono mt-1" style={{ color: "var(--muted-foreground)" }}>
                        {s.raw?.command ? `${s.raw.command} ${(s.raw.args||[]).join(" ")}`.slice(0,100) : s.raw?.url || ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleEnabled(s)} title={s.enabled !== false ? "Disable" : "Enable"}>{s.enabled !== false ? <PowerOff size={12} /> : <Power size={12} />}</Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(s)} title="Edit / repoint"><Pencil size={12} /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() => { setDeleteTarget(s.name); setDeleteConfirm(""); }} title="Delete"><Trash2 size={12} /></Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {!loading && servers.length > 0 && <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{servers.length} servers · toggle needs agent restart</div>}

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">{editing?.isNew ? "Add MCP Server" : `Edit ${editing?.name}`}</DialogTitle>
            <DialogDescription className="text-xs">Repoint by changing command/args or URL. Stored in <code className="font-mono">mcp/mcp-config.json</code> (symlinked to agents). .bak kept.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Name (id)</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="my-mcp" className="text-xs font-mono" disabled={!editing?.isNew} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditType("stdio")} className="flex-1 text-xs px-3 py-1.5 rounded border" style={{ background: editType==="stdio"?"var(--primary)":"transparent", color: editType==="stdio"?"var(--primary-foreground)":"var(--muted-foreground)", borderColor: editType==="stdio"?"var(--primary)":"var(--border)" }}>stdio (command)</button>
              <button type="button" onClick={() => setEditType("http")} className="flex-1 text-xs px-3 py-1.5 rounded border" style={{ background: editType==="http"?"var(--primary)":"transparent", color: editType==="http"?"var(--primary-foreground)":"var(--muted-foreground)", borderColor: editType==="http"?"var(--primary)":"var(--border)" }}>http (url)</button>
            </div>
            {editType==="stdio" ? (
              <>
                <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Command</label><Input value={editCommand} onChange={(e)=>setEditCommand(e.target.value)} placeholder="node or npx or /path/bin" className="text-xs font-mono" /></div>
                <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Args (space separated)</label><Input value={editArgs} onChange={(e)=>setEditArgs(e.target.value)} placeholder="/home/dev/AI_Workflow/mcp/.../index.js --flag" className="text-xs font-mono" /></div>
                <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Env (KEY=VALUE per line)</label><textarea value={editEnv} onChange={(e)=>setEditEnv(e.target.value)} placeholder="MEMORY_DIR=/home/dev/AI_Workflow/memory" rows={3} className="w-full text-xs font-mono rounded border px-2 py-1.5" style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} /></div>
              </>
            ) : (
              <>
                <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>URL</label><Input value={editUrl} onChange={(e)=>setEditUrl(e.target.value)} placeholder="https://mcp.example.com/mcp" className="text-xs font-mono" /></div>
                <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Headers (JSON)</label><textarea value={editHeaders} onChange={(e)=>setEditHeaders(e.target.value)} placeholder='{"Authorization":"Bearer ..."}' rows={3} className="w-full text-xs font-mono rounded border px-2 py-1.5" style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} /></div>
              </>
            )}
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={editEnabled} onChange={(e)=>setEditEnabled(e.target.checked)} className="accent-[var(--primary)]" /> Enabled</label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={()=>setEditing(null)}>Cancel</Button>
              <Button size="sm" onClick={saveEdit} disabled={saving || !editName.trim()} className="gap-1.5">{saving && <Loader2 size={12} className="animate-spin" />} Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o)=>{ if(!o){ setDeleteTarget(null); setDeleteConfirm(""); }}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2 text-red-400"><Trash2 size={13} /> Delete {deleteTarget}</DialogTitle>
            <DialogDescription className="text-xs">Type <span className="font-mono px-1 py-0.5 rounded" style={{ background:"rgba(239,68,68,0.15)", color:"#ef4444" }}>{deleteTarget}_Delete</span> to confirm. Removes entry from mcp-config.json (.bak kept). Other servers untouched.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={deleteConfirm} onChange={(e)=>setDeleteConfirm(e.target.value)} placeholder={`${deleteTarget}_Delete`} className="text-xs font-mono" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={()=>{ setDeleteTarget(null); setDeleteConfirm(""); }}>Cancel</Button>
              <Button size="sm" disabled={deleteConfirm !== `${deleteTarget}_Delete`} onClick={confirmDelete} className="bg-red-500/10 text-red-400 border border-red-500/20 gap-1.5"><Trash2 size={12}/> Delete only this</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
