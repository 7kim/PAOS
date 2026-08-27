"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { RefreshCw, Sparkles, Loader2, Pencil, Trash2, Plus, Power, PowerOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Skill {
  name: string;
  description: string;
  enabled?: boolean;
  sourcePath?: string;
  rawPath?: string;
}

export default function SkillsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <SkillsPage />
    </Suspense>
  );
}

function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ name: string; isNew: boolean } | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editSourcePath, setEditSourcePath] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [viewContent, setViewContent] = useState<{ name: string; content: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data.skills || []);
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function openEdit(s: Skill | null) {
    if (!s) {
      setEditing({ name: "", isNew: true }); setEditName(""); setEditDesc(""); setEditContent(""); setEditEnabled(true); setEditSourcePath("");
      return;
    }
    setEditing({ name: s.name, isNew: false }); setEditName(s.name); setEditDesc(s.description || ""); setEditEnabled(s.enabled !== false); setEditSourcePath(s.sourcePath || "");
    try {
      const raw = await fetch(`/api/skills?view=${encodeURIComponent(s.name)}`).then(r=>r.json()).catch(()=>null);
      // fallback: fetch file via agents files route? just load SKILL.md via read
      // For now load via direct fetch of rawPath not available, so try to fetch content via POST view hack: we will fetch file content by reading via new endpoint fallback
      // Instead try to fetch the skill file content via reading the file through a helper: we don't have GET with content, so load via reading SKILL.md via agent files API
      const fRes = await fetch(`/api/agents/developer/files?path=${encodeURIComponent(s.sourcePath || `skills/${s.name}/SKILL.md`)}`).then(r=>r.json()).catch(()=>null);
      if (fRes?.content) setEditContent(fRes.content);
      else setEditContent(`# ${s.name}\n\n${s.description}\n`);
    } catch { setEditContent(`# ${s.name}\n\n${s.description}\n`); }
  }

  async function saveEdit() {
    const name = editName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const body: any = { name, description: editDesc, content: editContent || `# ${name}\n\n${editDesc}\n`, enabled: editEnabled, sourcePath: editSourcePath };
      // If renaming, delete old
      const oldName = editing?.name;
      if (!editing?.isNew && oldName && oldName !== name) {
        await fetch(`/api/skills?id=${encodeURIComponent(oldName)}`, { method: "DELETE" });
      }
      const res = await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditing(null); await load();
    } catch (e) { alert(String(e)); }
    setSaving(false);
  }

  async function toggleEnabled(s: Skill) {
    const newEnabled = !(s.enabled !== false);
    await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: s.name, description: s.description, enabled: newEnabled }) });
    await load();
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteConfirm !== `${deleteTarget}_Delete`) return;
    await fetch(`/api/skills?id=${encodeURIComponent(deleteTarget)}`, { method: "DELETE" });
    setDeleteTarget(null); setDeleteConfirm(""); await load();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}><Sparkles size={16} style={{ color: "var(--primary)" }} /> Skills</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>PAOS skills — disable, add, delete, edit, repoint to other path (.bak kept, restart agent to apply)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => openEdit(null)} className="gap-1.5 text-xs"><Plus size={12} /> Add Skill</Button>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></Button>
        </div>
      </div>

      {error && <div className="text-xs p-3 rounded-lg border" style={{ borderColor: "var(--destructive)", color: "var(--destructive)" }}>{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={20} className="animate-spin opacity-50" /></div>
      ) : skills.length === 0 ? (
        <div className="text-xs text-center py-16 opacity-50">No skills found</div>
      ) : (
        <div className="grid gap-3">
          {skills.map((s) => (
            <Card key={s.name} style={{ opacity: s.enabled === false ? 0.6 : 1 }}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Sparkles size={16} style={{ color: s.enabled === false ? "var(--muted-foreground)" : "var(--primary)" }} />
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {s.name}
                        <Badge variant="secondary" className="text-[9px] px-1 py-0" style={{ background: s.enabled !== false ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)", color: s.enabled !== false ? "#22c55e" : "var(--muted-foreground)" }}>{s.enabled !== false ? "ON" : "OFF"}</Badge>
                      </CardTitle>
                      <CardDescription className="text-[10px] mt-0.5 truncate max-w-[60vw]">{s.description}</CardDescription>
                      <div className="text-[9px] font-mono mt-1 truncate" style={{ color: "var(--muted-foreground)" }}>{s.sourcePath}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleEnabled(s)} title={s.enabled !== false ? "Disable" : "Enable"}>{s.enabled !== false ? <PowerOff size={12} /> : <Power size={12} />}</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2" onClick={async () => {
                      try {
                        const r = await fetch(`/api/agents/developer/files?path=${encodeURIComponent(s.sourcePath || `skills/${s.name}/SKILL.md`)}`);
                        const d = await r.json();
                        setViewContent({ name: s.name, content: d.content || "(empty — SKILL.md not found)" });
                      } catch { setViewContent({ name: s.name, content: "(failed to load)" }); }
                    }}>View</Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(s)} title="Edit / repoint"><Pencil size={12} /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() => { setDeleteTarget(s.name); setDeleteConfirm(""); }} title="Delete"><Trash2 size={12} /></Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">{editing?.isNew ? "Add Skill" : `Edit ${editing?.name}`}</DialogTitle>
            <DialogDescription className="text-xs">Stored at <code className="font-mono">skills/{editName}/SKILL.md</code> (.bak kept). Repoint by changing Source Path to a custom location.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Name (id)</label><Input value={editName} onChange={(e)=>setEditName(e.target.value)} placeholder="my-skill" className="text-xs font-mono" disabled={!editing?.isNew} /></div>
            <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Description</label><Input value={editDesc} onChange={(e)=>setEditDesc(e.target.value)} placeholder="Short description" className="text-xs" /></div>
            <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>Source Path (repoint — default skills/&lt;name&gt;/SKILL.md)</label><Input value={editSourcePath} onChange={(e)=>setEditSourcePath(e.target.value)} placeholder="skills/my-skill/SKILL.md or config/custom/skill.md" className="text-xs font-mono" /></div>
            <div><label className="text-xs block mb-1" style={{ color: "var(--muted-foreground)" }}>SKILL.md Content</label><textarea value={editContent} onChange={(e)=>setEditContent(e.target.value)} placeholder="# My Skill\n\nInstructions..." rows={10} className="w-full text-xs font-mono rounded border px-2 py-1.5" style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} /></div>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={editEnabled} onChange={(e)=>setEditEnabled(e.target.checked)} className="accent-[var(--primary)]" /> Enabled</label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={()=>setEditing(null)}>Cancel</Button>
              <Button size="sm" onClick={saveEdit} disabled={saving || !editName.trim()} className="gap-1.5">{saving && <Loader2 size={12} className="animate-spin" />} Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewContent} onOpenChange={(o)=>{ if(!o) setViewContent(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-sm">{viewContent?.name} — SKILL.md</DialogTitle><DialogDescription className="text-xs font-mono">{skills.find(s=>s.name===viewContent?.name)?.sourcePath}</DialogDescription></DialogHeader>
          <pre className="text-xs font-mono whitespace-pre-wrap p-3 rounded border overflow-auto" style={{ background: "rgba(0,0,0,0.3)", borderColor:"var(--border)", color:"var(--muted-foreground)", maxHeight:"60vh" }}>{viewContent?.content}</pre>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o)=>{ if(!o){ setDeleteTarget(null); setDeleteConfirm(""); }}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2 text-red-400"><Trash2 size={13} /> Delete {deleteTarget}</DialogTitle>
            <DialogDescription className="text-xs">Type <span className="font-mono px-1 py-0.5 rounded" style={{ background:"rgba(239,68,68,0.15)", color:"#ef4444" }}>{deleteTarget}_Delete</span> to confirm. Deletes <code className="font-mono">skills/{deleteTarget}/</code> (moves SKILL.md to .bak). Other skills untouched.</DialogDescription>
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
