"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Plus, ExternalLink, Trash2, Eye, EyeOff, Loader2, Import, Bot, Lock, Save, Users, X, Power, PowerOff, FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SecretNote {
  value: string;
  note: string;
}

interface Project {
  name: string;
  pipelineCount: number;
  createdAt: string;
  displayName?: string;
  sourcePath?: string;
  pipelinePath?: string;
  folders?: { path: string }[];
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Create dialog
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  // Import dialog
  const [showImport, setShowImport] = useState(false);
  const [importName, setImportName] = useState("");
  const [importPath, setImportPath] = useState("");
  const [importGitUrl, setImportGitUrl] = useState("");
  const [importMode, setImportMode] = useState<"local" | "github">("local");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  // Integrate state
  const [integrating, setIntegrating] = useState<string | null>(null);

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null);

  // Secrets state
  const [secretsProject, setSecretsProject] = useState<string | null>(null);
  const [secretsData, setSecretsData] = useState<Record<string, SecretNote>>({});
  const [secretsLoading, setSecretsLoading] = useState(false);
  const [secretsDirty, setSecretsDirty] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Scoped git identities state
  const [scopedMap, setScopedMap] = useState<Record<string, string[]>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const [viewAll, setViewAll] = useState(true);
  const [activeProject, setActiveProject] = useState("");
  const [defaultDir, setDefaultDir] = useState("~/AI_Workflow/projects");
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("paos-settings") || "{}");
      setViewAll(stored.viewAll !== false);
    } catch { /* ignore */ }
    try {
      const dir = localStorage.getItem("paos-default-projects-dir");
      if (dir) setDefaultDir(dir);
    } catch { /* ignore */ }
    try {
      const ap = localStorage.getItem("paos-active-project");
      if (ap) setActiveProject(ap);
    } catch { /* ignore */ }
  }, []);

  async function openSecrets(name: string) {
    setSecretsProject(name);
    setSecretsLoading(true);
    const res = await fetch(`/api/secrets?project=${encodeURIComponent(name)}`);
    const data = await res.json();
    const secrets = data.secrets ?? {};
    // Handle both new format (with notes) and legacy format (plain strings)
    const normalized: Record<string, SecretNote> = {};
    for (const [k, v] of Object.entries(secrets)) {
      if (typeof v === "object" && v !== null && "value" in v) {
        normalized[k] = v as SecretNote;
      } else {
        normalized[k] = { value: String(v ?? ""), note: "" };
      }
    }
    setSecretsData(normalized);
    setSecretsLoading(false);
    setSecretsDirty(false);
  }

  async function saveSecrets() {
    if (!secretsProject) return;
    // Filter out entries with empty keys or empty values
    const cleaned: Record<string, { value: string; note: string }> = {};
    for (const [k, v] of Object.entries(secretsData)) {
      if (k.trim() && v.value.trim()) cleaned[k.trim()] = { value: v.value.trim(), note: v.note.trim() };
    }
    await fetch("/api/secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: secretsProject, secrets: cleaned }),
    });
    setSecretsDirty(false);
    setSecretsProject(null); // close dialog
  }

  const load = useCallback(async () => {
    setLoading(true);
    const [wsRes, scopedRes] = await Promise.all([
      fetch("/api/workspaces"),
      fetch("/api/agents/scoped"),
    ]);
    const wsData = await wsRes.json();
    const scopedData = await scopedRes.json();

    setProjects(wsData.workspaces ?? []);
    
    // Build map: project name → array of agent identity names
    const map: Record<string, string[]> = {};
    for (const s of scopedData.scopedProjects ?? []) {
      map[s.project] = s.agents;
    }
    setScopedMap(map);
    setLoading(false);
  }, []);

  async function generateGitIdentities(project: string) {
    setGeneratingFor(project);
    await fetch("/api/agents/scoped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });
    // Reload to pick up changes
    await load();
    setGeneratingFor(null);
  }

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        setNewName("");
        setShowCreate(false);
        await load();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create project");
      }
    } catch {
      alert("Failed to create project");
    } finally {
      setCreating(false);
    }
  }

  async function handleImport() {
    if (!importName.trim()) return;
    setImporting(true);
    setImportResult(null);
    try {
      const body: Record<string, string> = { name: importName.trim() };
      if (importMode === "github") {
        if (!importGitUrl.trim()) {
          setImportResult("Error: GitHub URL is required");
          setImporting(false);
          return;
        }
        body.source = "github";
        body.gitUrl = importGitUrl.trim();
      } else {
        if (!importPath.trim()) {
          setImportResult("Error: Source path is required");
          setImporting(false);
          return;
        }
        body.sourcePath = importPath.trim();
      }

      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setImportResult(`Imported "${importName}" successfully`);
        setImportName("");
        setImportPath("");
        setImportGitUrl("");
        await load();
      } else {
        setImportResult(`Error: ${data.error}`);
      }
    } catch {
      setImportResult("Error: Failed to import project");
    } finally {
      setImporting(false);
    }
  }

  async function handleIntegrate(name: string) {
    setIntegrating(name);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(name)}/integrate`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(`PAOS integrated into "${name}".\n\nDetected: ${data.analysis.languages.join(", ") || "languages"}\nFiles created: ${data.filesCreated.join(", ")}`);
      } else {
        alert(`Integration failed: ${data.error}`);
      }
    } catch {
      alert("Integration failed");
    } finally {
      setIntegrating(null);
    }
  }

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  async function handleDelete() {
    if (!deleteTarget) return;
    const expected = `${deleteTarget}_Delete`;
    if (deleteConfirmText !== expected) return;
    setDeleting(deleteTarget);
    try {
      const res = await fetch(`/api/workspaces/${encodeURIComponent(deleteTarget)}`, { method: "DELETE" });
      if (res.ok) {
        await load();
        setDeleteTarget(null);
        setDeleteConfirmText("");
      }
    } catch {
      alert("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-1">
        <FolderKanban size={18} style={{ color: "var(--primary)" }} />
        <h1 className="text-xl font-semibold">Projects</h1>
        <span className="text-xs text-muted-foreground">{projects.length} projects</span>
      </div>
      <p className="text-sm mb-6 text-muted-foreground">
        PAOS project workspaces — each project has its own pipelines, plans, and tasks.
      </p>

      {/* Actions bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
          <Plus size={13} />
          New Project
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowImport(true)} className="gap-1.5">
          <Import size={13} />
          Import Project
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.push("/pipelines")} className="gap-1.5">
          <Eye size={13} />
          View All Pipelines
        </Button>
      </div>

      {/* Default projects directory */}
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
        <span>Default projects directory:</span>
        <span className="font-mono">{defaultDir}</span>
        <button
          type="button"
          onClick={() => {
            const dir = prompt("Default projects directory:", defaultDir);
            if (dir && dir.trim()) {
              setDefaultDir(dir.trim());
              localStorage.setItem("paos-default-projects-dir", dir.trim());
            }
          }}
          className="px-2 py-0.5 rounded border text-[10px] hover:border-primary/30 transition-colors"
          style={{ borderColor: "var(--border)" }}
        >
          Change
        </button>
      </div>

      {/* View All + Scoped Agents bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={viewAll}
            onChange={(e) => {
              const stored = JSON.parse(localStorage.getItem("paos-settings") || "{}");
              stored.viewAll = e.target.checked;
              localStorage.setItem("paos-settings", JSON.stringify(stored));
              setViewAll(e.target.checked);
            }}
            className="accent-[var(--primary)]"
          />
          <Eye size={12} style={{ color: viewAll ? "var(--primary)" : "var(--muted-foreground)" }} />
          View All Projects
          <span className="text-[10px] text-muted-foreground">
            {viewAll ? "(all active)" : "(single active)"}
          </span>
        </label>
      </div>

      {/* Project grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-12 justify-center">
          <Loader2 size={14} className="animate-spin" />
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban size={28} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm text-muted-foreground">No projects yet</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
                <Plus size={13} />
                Create your first project
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowImport(true)}>
                <Import size={13} />
                Import a project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const isActive = activeProject === p.name || viewAll;
            return (
            <Card key={p.name} className="transition-all hover:border-primary/30" style={isActive ? { borderColor: "var(--primary)", boxShadow: "0 0 12px rgba(240,185,11,0.15)" } : {}}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FolderKanban size={14} style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }} />
                  {p.name}
                  {isActive && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold ml-auto" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                      ACTIVE
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  {p.pipelineCount} pipeline{p.pipelineCount !== 1 ? "s" : ""}
                  {p.createdAt && ` · created ${new Date(p.createdAt).toLocaleDateString()}`}
                </CardDescription>
                <p className="text-[10px] font-mono text-muted-foreground mt-1 truncate" title={p.pipelinePath}>
                  ~/{p.pipelinePath}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => {
                      setActiveProject(p.name);
                      localStorage.setItem("paos-active-project", p.name);
                      router.push(`/pipelines?project=${encodeURIComponent(p.name)}`);
                    }}
                    style={isActive ? { background: "var(--primary)", color: "var(--primary-foreground)" } : {}}
                  >
                    {isActive ? <Power size={12} /> : <ExternalLink size={12} />}
                    {isActive ? "Open" : "Open"}
                  </Button>
                  {isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveProject("");
                        localStorage.removeItem("paos-active-project");
                      }}
                      className="gap-1.5"
                    >
                      <PowerOff size={12} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => router.push(`/plans?project=${encodeURIComponent(p.name)}`)}
                  >
                    <Eye size={12} />
                    Plans
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={integrating === p.name}
                    onClick={() => handleIntegrate(p.name)}
                    className="gap-1.5"
                    title="Integrate PAOS agents into this project's source"
                  >
                    {integrating === p.name ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openSecrets(p.name)}
                    className="gap-1.5"
                    title="Project secrets"
                  >
                    <Lock size={12} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deleting === p.name}
                    onClick={() => setDeleteTarget(p.name)}
                    className="gap-1.5 text-red-400 hover:text-red-300"
                  >
                    {deleting === p.name ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </Button>
                </div>
                {/* Git identities — always visible */}
                {scopedMap[p.name] && scopedMap[p.name].length > 0 ? (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="flex flex-wrap gap-1">
                      {scopedMap[p.name].map((a) => (
                        <span key={a} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(240,185,11,0.1)", color: "var(--primary)" }}>
                          {a}@paos.com
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={generatingFor === p.name}
                      onClick={() => generateGitIdentities(p.name)}
                      className="text-[10px] gap-1 w-full"
                    >
                      {generatingFor === p.name ? <Loader2 size={10} className="animate-spin" /> : <Users size={10} />}
                      Generate Git Identities
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}

      {/* Create project dialog */}
      <Dialog open={showCreate} onOpenChange={(open) => { if (!open) setShowCreate(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Create Project</DialogTitle>
            <DialogDescription className="text-xs">
              Creates an empty project workspace under <code className="font-mono">memory/pipelines/</code>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Project name (letters, numbers, hyphens)"
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button size="sm" onClick={handleCreate} disabled={creating || !newName.trim()} className="gap-1.5">
                {creating && <Loader2 size={12} className="animate-spin" />}
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import project dialog */}
      <Dialog open={showImport} onOpenChange={(open) => { if (!open) { setShowImport(false); setImportResult(null); }}}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm">Import Project</DialogTitle>
            <DialogDescription className="text-xs">
              Import an existing project into PAOS.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={importName}
              onChange={(e) => setImportName(e.target.value)}
              placeholder="Project name (e.g. my-awesome-app)"
              className="text-sm"
            />

            {/* Mode toggle */}
            <div className="flex bg-muted rounded-lg p-1 border">
              <button
                type="button"
                onClick={() => setImportMode("local")}
                className="flex-1 px-3 py-1.5 text-xs rounded-md transition-all"
                style={{
                  background: importMode === "local" ? "var(--primary)" : "transparent",
                  color: importMode === "local" ? "var(--primary-foreground)" : undefined,
                  fontWeight: importMode === "local" ? 600 : 400,
                }}
              >
                Local Path
              </button>
              <button
                type="button"
                onClick={() => setImportMode("github")}
                className="flex-1 px-3 py-1.5 text-xs rounded-md transition-all"
                style={{
                  background: importMode === "github" ? "var(--primary)" : "transparent",
                  color: importMode === "github" ? "var(--primary-foreground)" : undefined,
                  fontWeight: importMode === "github" ? 600 : 400,
                }}
              >
                GitHub URL
              </button>
            </div>

            {importMode === "local" ? (
              <Input
                value={importPath}
                onChange={(e) => setImportPath(e.target.value)}
                placeholder="Full path to repo (e.g. /home/dev/projects/my-app)"
                className="text-sm font-mono"
              />
            ) : (
              <Input
                value={importGitUrl}
                onChange={(e) => setImportGitUrl(e.target.value)}
                placeholder="GitHub URL (e.g. https://github.com/user/repo.git)"
                className="text-sm font-mono"
              />
            )}

            {importResult && (
              <div className={`text-xs p-2 rounded ${importResult.startsWith("Error") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                {importResult}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setShowImport(false); setImportResult(null); }}>Cancel</Button>
              <Button size="sm" onClick={handleImport} disabled={importing || !importName.trim()} className="gap-1.5">
                {importing && <Loader2 size={12} className="animate-spin" />}
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Secrets dialog */}
      <Dialog open={!!secretsProject} onOpenChange={(open) => { if (!open) setSecretsProject(null); }}>
        <DialogContent className="max-w-[55vw] sm:max-w-[55vw] w-full max-h-[85vh] flex flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Lock size={13} />
              Project Secrets — {secretsProject}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Stored at <code className="font-mono">projects/{secretsProject}/secrets/.env</code> &middot; Notes appear as <code className="font-mono"># KEY: note</code> comments
            </DialogDescription>
          </DialogHeader>
          {secretsLoading ? (
            <div className="flex items-center gap-2 py-8 justify-center text-xs text-muted-foreground">
              <Loader2 size={12} className="animate-spin" />
              Loading secrets...
            </div>
          ) : (
            <div className="space-y-3">
              {Object.keys(secretsData).length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">No secrets yet. Add key-value pairs below or use Templates.</p>
              )}
              {Object.entries(secretsData).map(([key, entry], idx) => {
                const isRevealed = revealedKeys.has(key);
                const lastTwo = entry.value.length >= 2 ? entry.value.slice(-2) : entry.value;
                const masked = entry.value ? `********${lastTwo}` : "";
                return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      value={key}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        setSecretsData((prev) => {
                          const next = { ...prev };
                          delete next[key];
                          if (newVal) next[newVal] = entry;
                          return next;
                        });
                        setSecretsDirty(true);
                      }}
                      className="flex-[2.5] text-xs font-mono rounded border px-2 py-1"
                      style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
                      placeholder="KEY"
                    />
                    <span className="text-muted-foreground shrink-0">=</span>
                    <div className="flex-[4] flex items-center gap-1 rounded border px-2 py-1" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                      <input
                        type={isRevealed ? "text" : "password"}
                        value={entry.value}
                        onChange={(e) => {
                          setSecretsData((prev) => ({ ...prev, [key]: { value: e.target.value, note: entry.note } }));
                          setSecretsDirty(true);
                        }}
                        className="flex-1 text-xs font-mono bg-transparent border-none outline-none"
                        style={{ color: "var(--foreground)" }}
                        placeholder="value"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setRevealedKeys((prev) => {
                            const next = new Set(prev);
                            if (next.has(key)) next.delete(key); else next.add(key);
                            return next;
                          });
                        }}
                        className="p-0.5 shrink-0"
                        style={{ color: "var(--muted-foreground)" }}
                        title={isRevealed ? "Hide value" : "Show value"}
                      >
                        {isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSecretsData((prev) => {
                          const next = { ...prev };
                          delete next[key];
                          return next;
                        });
                        setSecretsDirty(true);
                      }}
                      className="p-1 rounded hover:bg-white/5 shrink-0"
                      style={{ color: "var(--muted-foreground)" }}
                      title="Delete this secret"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <input
                    value={entry.note}
                    onChange={(e) => {
                      setSecretsData((prev) => ({ ...prev, [key]: { value: entry.value, note: e.target.value } }));
                      setSecretsDirty(true);
                    }}
                    className="w-full text-[10px] rounded border px-2 py-1"
                    style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    placeholder="note — e.g. Supabase, GitHub, OpenAI platform..."
                  />
                </div>
                );
              })}
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1"
                  onClick={() => {
                    setSecretsData({});
                    setSecretsDirty(true);
                  }}
                >
                  <X size={11} />
                  Clear All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1"
                  onClick={() => {
                    setSecretsData((prev) => ({ ...prev, "": { value: "", note: "" } }));
                    setSecretsDirty(true);
                  }}
                >
                  + Add Secret
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1"
                  onClick={() => setShowTemplates(true)}
                >
                  <FileJson size={11} />
                  Templates
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSecretsProject(null)}>Close</Button>
                  <Button size="sm" onClick={saveSecrets} disabled={!secretsDirty} className="gap-1.5">
                    <Save size={12} />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Templates dialog */}
      <Dialog open={showTemplates} onOpenChange={(open) => { if (!open) setShowTemplates(false); }}>
        <DialogContent className="max-w-[55vw] sm:max-w-[55vw] w-full max-h-[85vh] flex flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <FileJson size={13} />
              Secret Templates
            </DialogTitle>
            <DialogDescription className="text-xs">
              Click a template to add standardized environment variables to your project secrets.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {(() => {
              // Brand logo SVGs
              const logos: Record<string, string> = {
                OpenAI: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v8l-7 4-7-4V6l7-4z" fill="#10a37f"/><path d="M12 6l3.5 2v4L12 14l-3.5-2V8L12 6z" fill="#fff"/></svg>`,
                Anthropic: `<svg viewBox="0 0 24 24"><text x="2" y="19" font-family="Arial" font-weight="bold" font-size="18" fill="#d97757">C</text></svg>`,
                "Google Gemini": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#4285F4"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="#fff">G</text></svg>`,
                DeepSeek: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#4F46E5"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="#fff">D</text></svg>`,
                "Hugging Face": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#FFD21E"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#333">HF</text></svg>`,
                Groq: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#F97316"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="#fff">G</text></svg>`,
                "Together AI": `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#8B5CF6"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">TA</text></svg>`,
                Mistral: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2563EB"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="#fff">M</text></svg>`,
                Replicate: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#1F2937"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">R</text></svg>`,
                PostgreSQL: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C9 2 7 4 7 7v10c0 3 2 5 5 5s5-2 5-5V7c0-3-2-5-5-5z" fill="#336791"/><path d="M10 8h4M10 12h4M10 16h2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
                MongoDB: `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="14" rx="6" ry="7" fill="#47A248"/><text x="12" y="18" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">M</text></svg>`,
                Redis: `<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="#DC382D"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">R</text></svg>`,
                Supabase: `<svg viewBox="0 0 24 24"><path d="M6 14l6-12v8h6l-6 12v-8H6z" fill="#3ECF8E"/></svg>`,
                AWS: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#FF9900"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">AWS</text></svg>`,
                "Google Cloud": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#4285F4"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">GC</text></svg>`,
                Azure: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#0078D4"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">AZ</text></svg>`,
                Cloudflare: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#F38020"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">CF</text></svg>`,
                "NextAuth.js": `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#000"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">NA</text></svg>`,
                "GitHub OAuth": `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.68-.217.68-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#181717"/></svg>`,
                "Google OAuth": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4285F4"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="9" fill="#fff">G</text></svg>`,
                Twilio: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#F22F46"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">T</text></svg>`,
                Slack: `<svg viewBox="0 0 24 24"><path d="M6 14a2 2 0 11-4 0 2 2 0 014 0z" fill="#4A154B"/><path d="M6 6a2 2 0 114 0v8a2 2 0 11-4 0V6z" fill="#4A154B"/><path d="M10 18a2 2 0 110 4 2 2 0 010-4z" fill="#4A154B"/><path d="M18 10a2 2 0 110-4 2 2 0 010 4z" fill="#4A154B"/><path d="M14 6h4a2 2 0 110 4h-4a2 2 0 010-4z" fill="#4A154B"/><path d="M14 14a2 2 0 114 0v4a2 2 0 11-4 0v-4z" fill="#4A154B"/><path d="M10 18V6a2 2 0 114 0v12a2 2 0 11-4 0z" fill="#4A154B"/></svg>`,
                "Telegram Bot": `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.8 6.8l-1.6 8.2c-.1.5-.4.6-.8.4l-2.2-1.7-1.1 1c-.1.1-.2.2-.4.2l.2-2 3.6-3.3c.2-.1 0-.3-.2-.2l-4.6 2.8-2-.6c-.5-.2-.5-.5.1-.7l7.8-3c.4-.1.7.1.6.6z" fill="#26A5E4"/></svg>`,
                Resend: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#000"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">RE</text></svg>`,
                SendGrid: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#1A82E2"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">SG</text></svg>`,
                Stripe: `<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="3" fill="#635BFF"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">ST</text></svg>`,
                "Lemon Squeezy": `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#FFC233"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#333">LS</text></svg>`,
                "GitHub Token": `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.68-.217.68-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#181717"/></svg>`,
                "Docker Registry": `<svg viewBox="0 0 24 24"><path d="M13.983 11.078h-2.09v2.09h2.09v-2.09zM16.164 11.078h-2.09v2.09h2.09v-2.09zM11.803 11.078H9.714v2.09h2.09v-2.09zM9.714 8.897H7.625v2.09h2.09V8.897zM11.803 8.897h-2.09v2.09h2.09V8.897zM13.983 8.897h-2.09v2.09h2.09V8.897zM16.164 8.897h-2.09v2.09h2.09V8.897zM7.625 8.897H5.535v2.09h2.09V8.897z" fill="#099CEC"/><path d="M22.752 10.565c-.69-.552-2.14-.943-3.3-.69-.138-1.013-.598-1.955-1.288-2.714l-.414-.414-.414.414c-.828.828-1.243 2.003-1.243 3.177 0 .506.092 1.013.276 1.473-.368.184-.874.322-1.426.322H1.703c-.092.598-.092 1.196 0 1.794.046.276.138.552.276.828.046.046.046.092.092.138.598 1.243 1.61 2.14 2.852 2.624 1.61.598 3.45.69 5.107.322 1.426.92 3.13 1.426 4.973 1.426 3.59 0 6.854-1.518 9.158-4.14.92-1.013 1.564-2.086 1.84-3.22.046-.184.092-.368.092-.552 0-.322-.092-.598-.276-.782l-.322-.276z" fill="#099CEC"/><circle cx="6.44" cy="16.106" r="1.104" fill="#099CEC"/><path d="M1.979 13.629h14.51" stroke="#099CEC" stroke-width=".6"/></svg>`,
                Vercel: `<svg viewBox="0 0 24 24"><path d="M12 2L22 22H2L12 2z" fill="#fff"/></svg>`,
                "S3 Compatible": `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#569A31"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">S3</text></svg>`,
                Sentry: `<svg viewBox="0 0 24 24"><path d="M13.164 2.808a1.67 1.67 0 00-2.894 0L6.44 9.482a21.173 21.173 0 018.44 8.44l3.828-6.674-5.544-8.44z" fill="#362D59"/><path d="M5.298 18.15a1.67 1.67 0 01-1.447-.836 1.67 1.67 0 010-1.672l1.736-3.03a23.478 23.478 0 006.933 5.538H9.109c-1.376 0-2.493.993-2.493 2.507 0 .256.037.508.11.752-1.009.003-1.84-.54-2.428-1.26z" fill="#362D59"/><path d="M7.092 22c-.552 0-1-.448-1-1s.448-1 1-1h5.087a8.558 8.558 0 01-1.357 2H7.092z" fill="#362D59"/></svg>`,
                Datadog: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#632CA6"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">DD</text></svg>`,
                "App Config": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="var(--muted-foreground)"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="var(--muted-foreground)" stroke-width="1.5" stroke-linecap="round"/></svg>`,
                "JWT Auth": `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="7" rx="1.5" fill="var(--muted-foreground)"/><path d="M8 11V7a4 4 0 118 0v4" stroke="var(--muted-foreground)" stroke-width="1.5" fill="none"/></svg>`,
                "PAOS Agent": `<svg viewBox="0 0 24 24"><path d="M12 2l7 4v8l-7 4-7-4V6l7-4z" fill="#f0b90b"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#000">P</text></svg>`,
                OpenRouter: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#84309C"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">OR</text></svg>`,
                zAI: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#10B981"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="#fff">Z</text></svg>`,
                "NVIDIA NIM": `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#76B900"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">NV</text></svg>`,
                "Cloudflare AI": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#F38020"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">AI</text></svg>`,
                Hostinger: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#512BD4"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">H</text></svg>`,
                Bybit: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#F7A600"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#333">BY</text></svg>`,
                MEXC: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#00B0E8"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">MX</text></svg>`,
                "Crypto.com": `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#1E3A5F"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">CD</text></svg>`,
                MySQL: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#4479A1"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">MY</text></svg>`,
                Auth0: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#EB5424"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">A0</text></svg>`,
                cohere: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#39594D"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="8" fill="#fff">C</text></svg>`,
              };

              const categories = [
                    { category: "AI / LLM APIs", icon: "🤖", templates: [
                      { label: "OpenAI", note: "OpenAI Platform", desc: "GPT-4, embeddings, DALL-E, Whisper", vars: [{k:"OPENAI_API_KEY",h:"sk-..."},{k:"OPENAI_ORGANIZATION",h:"org-..."},{k:"OPENAI_BASE_URL",h:"https://api.openai.com/v1"}] },
                      { label: "Anthropic", note: "Anthropic", desc: "Claude API — Sonnet, Haiku, Opus", vars: [{k:"ANTHROPIC_API_KEY",h:"sk-ant-..."},{k:"ANTHROPIC_BASE_URL",h:"https://api.anthropic.com"}] },
                      { label: "Google Gemini", note: "Google AI", desc: "Gemini 2.0, 2.5 models", vars: [{k:"GEMINI_API_KEY",h:"AIza..."},{k:"GOOGLE_GENAI_API_KEY",h:"AIza..."}] },
                      { label: "DeepSeek", note: "DeepSeek", desc: "DeepSeek V3, R1 reasoning", vars: [{k:"DEEPSEEK_API_KEY",h:"sk-..."},{k:"DEEPSEEK_BASE_URL",h:"https://api.deepseek.com"}] },
                      { label: "xAI", note: "xAI", desc: "Grok models", vars: [{k:"XAI_API_KEY",h:"..."},{k:"XAI_BASE_URL",h:"https://api.x.ai"}] },
                      { label: "Perplexity", note: "Perplexity", desc: "Search-augmented LLM API", vars: [{k:"PERPLEXITY_API_KEY",h:"pplx-..."}] },
                      { label: "Hugging Face", note: "HuggingFace", desc: "Model inference & hub", vars: [{k:"HUGGINGFACE_API_KEY",h:"hf_..."},{k:"HUGGINGFACE_TOKEN",h:"hf_..."}] },
                      { label: "Groq", note: "Groq", desc: "LPU inference — extremely fast", vars: [{k:"GROQ_API_KEY",h:"gsk_..."}] },
                      { label: "Fireworks AI", note: "Fireworks AI", desc: "Fast inference, fine-tuning", vars: [{k:"FIREWORKS_API_KEY",h:"..."},{k:"FIREWORKS_BASE_URL",h:"https://api.fireworks.ai/inference/v1"}] },
                      { label: "Together AI", note: "Together AI", desc: "Open-source model inference", vars: [{k:"TOGETHER_API_KEY",h:"t1v..."}] },
                      { label: "Mistral", note: "Mistral", desc: "Le Chat, embeddings, fine-tuning", vars: [{k:"MISTRAL_API_KEY",h:"..."},{k:"MISTRAL_BASE_URL",h:"https://api.mistral.ai"}] },
                      { label: "Replicate", note: "Replicate", desc: "Open-source models as API", vars: [{k:"REPLICATE_API_TOKEN",h:"r8_..."}] },
                      { label: "ElevenLabs", note: "ElevenLabs", desc: "Text-to-speech, voice cloning", vars: [{k:"ELEVENLABS_API_KEY",h:"..."},{k:"ELEVENLABS_VOICE_ID",h:"..."}] },
                      { label: "Stability AI", note: "Stability AI", desc: "Image gen — Stable Diffusion", vars: [{k:"STABILITY_API_KEY",h:"sk-..."}] },
                      { label: "RunPod", note: "RunPod", desc: "Serverless GPU inference", vars: [{k:"RUNPOD_API_KEY",h:"..."},{k:"RUNPOD_ENDPOINT_ID",h:"..."}] },
                      { label: "Modal", note: "Modal", desc: "Cloud functions & GPU jobs", vars: [{k:"MODAL_TOKEN_ID",h:"..."},{k:"MODAL_TOKEN_SECRET",h:"..."}] },
                      { label: "Cohere", note: "Cohere", desc: "Embeddings, rerank, classify", vars: [{k:"COHERE_API_KEY",h:"..."}] },
                      { label: "OpenRouter", note: "OpenRouter", desc: "Multi-model API router marketplace", vars: [{k:"OPENROUTER_API_KEY",h:"sk-or-v1-..."},{k:"OPENROUTER_BASE_URL",h:"https://openrouter.ai/api/v1"},{k:"OPENROUTER_SITE_URL",h:"https://example.com"},{k:"OPENROUTER_APP_NAME",h:"MyApp"}] },
                      { label: "zAI", note: "z.ai", desc: "Z API — fast reasoning models", vars: [{k:"ZAI_API_KEY",h:"..."},{k:"ZAI_BASE_URL",h:"https://api.z.ai/v1"}] },
                      { label: "NVIDIA NIM", note: "NVIDIA", desc: "NVIDIA Inference Microservices", vars: [{k:"NVIDIA_API_KEY",h:"nvapi-..."},{k:"NVIDIA_BASE_URL",h:"https://api.nvcf.nvidia.com/v1"},{k:"NVIDIA_NIM_ENDPOINT",h:"..."}] },
                      { label: "Cloudflare AI", note: "Cloudflare Workers AI", desc: "Workers AI & AI Gateway", vars: [{k:"CLOUDFLARE_AI_API_KEY",h:"..."},{k:"CLOUDFLARE_ACCOUNT_ID",h:"..."},{k:"CLOUDFLARE_AI_GATEWAY_URL",h:"https://gateway.ai.cloudflare.com/v1/..."}] },
                    ]},
                    { category: "Databases", icon: "🗄️", templates: [
                      { label: "PostgreSQL", note: "Supabase / Neon / RDS", desc: "Connection string + config", vars: [{k:"DATABASE_URL",h:"postgresql://user:***@host:5432/db"},{k:"PGHOST",h:"localhost"},{k:"PGPORT",h:"5432"},{k:"PGDATABASE",h:"mydb"},{k:"PGUSER",h:"postgres"},{k:"PGPASSWORD",h:"********"}] },
                      { label: "Neon", note: "Neon Serverless Postgres", desc: "Serverless Postgres with branching", vars: [{k:"DATABASE_URL",h:"postgresql://user:***@ep-xxx.us-east-2.aws.neon.tech/db"},{k:"NEON_API_KEY",h:"..."},{k:"NEON_PROJECT_ID",h:"..."}] },
                      { label: "PlanetScale", note: "PlanetScale MySQL", desc: "Serverless MySQL with branches", vars: [{k:"DATABASE_URL",h:"mysql://user:***@aws.connect.psdb.cloud/db"},{k:"PLANETSCALE_SERVICE_TOKEN",h:"..."},{k:"PLANETSCALE_SERVICE_TOKEN_NAME",h:"..."},{k:"PLANETSCALE_ORG",h:"..."}] },
                      { label: "MongoDB", note: "MongoDB Atlas", desc: "Document DB connection", vars: [{k:"MONGODB_URI",h:"mongodb+srv://user:***@cluster.mongodb.net/db"}] },
                      { label: "Redis", note: "Redis / Upstash", desc: "Cache, queue, session store", vars: [{k:"REDIS_URL",h:"redis://user:***@host:6379"},{k:"REDIS_HOST",h:"localhost"},{k:"REDIS_PORT",h:"6379"},{k:"REDIS_PASSWORD",h:"********"}] },
                      { label: "Upstash", note: "Upstash Serverless", desc: "Serverless Redis + Kafka + QStash", vars: [{k:"UPSTASH_REDIS_REST_URL",h:"https://xxx.upstash.io"},{k:"UPSTASH_REDIS_REST_TOKEN",h:"..."},{k:"QSTASH_TOKEN",h:"..."},{k:"UPSTASH_KAFKA_REST_URL",h:"https://xxx.upstash.io"}] },
                      { label: "Turso", note: "Turso (libSQL)", desc: "Edge-hosted SQLite", vars: [{k:"TURSO_DATABASE_URL",h:"libsql://xxx.turso.io"},{k:"TURSO_AUTH_TOKEN",h:"..."}] },
                      { label: "ClickHouse", note: "ClickHouse", desc: "Real-time OLAP analytics", vars: [{k:"CLICKHOUSE_HOST",h:"..."},{k:"CLICKHOUSE_PORT",h:"8443"},{k:"CLICKHOUSE_USER",h:"default"},{k:"CLICKHOUSE_PASSWORD",h:"..."},{k:"CLICKHOUSE_DB",h:"default"}] },
                      { label: "Supabase", note: "Supabase", desc: "Postgres + Auth + Storage + Realtime", vars: [{k:"SUPABASE_URL",h:"https://xxx.supabase.co"},{k:"SUPABASE_ANON_KEY",h:"eyJ..."},{k:"SUPABASE_SERVICE_ROLE_KEY",h:"eyJ..."},{k:"DATABASE_URL",h:"postgresql://..."}] },
                      { label: "DynamoDB", note: "AWS DynamoDB", desc: "NoSQL key-value & document", vars: [{k:"AWS_ACCESS_KEY_ID",h:"AKIA..."},{k:"AWS_SECRET_ACCESS_KEY",h:"..."},{k:"AWS_REGION",h:"us-east-1"},{k:"DYNAMODB_TABLE",h:"my-table"}] },
                      { label: "Firestore", note: "GCP Firestore", desc: "NoSQL document database", vars: [{k:"FIRESTORE_PROJECT_ID",h:"my-project"},{k:"GOOGLE_APPLICATION_CREDENTIALS",h:"/path/to/sa.json"},{k:"FIRESTORE_COLLECTION",h:"users"}] },
                    ]},
                    { category: "Cloud Providers", icon: "☁️", templates: [
                      { label: "AWS", note: "AWS IAM", desc: "S3, EC2, Lambda, RDS, DynamoDB", vars: [{k:"AWS_ACCESS_KEY_ID",h:"AKIA..."},{k:"AWS_SECRET_ACCESS_KEY",h:"..."},{k:"AWS_REGION",h:"us-east-1"},{k:"AWS_S3_BUCKET",h:"my-bucket"},{k:"AWS_SESSION_TOKEN",h:"..."}] },
                      { label: "Google Cloud", note: "GCP", desc: "GCS, Cloud Run, GKE, Firestore", vars: [{k:"GOOGLE_CLOUD_PROJECT",h:"my-project"},{k:"GOOGLE_API_KEY",h:"AIza..."},{k:"GOOGLE_APPLICATION_CREDENTIALS",h:"/path/to/sa.json"}] },
                      { label: "Azure", note: "Microsoft Azure", desc: "Blob, Functions, AKS, CosmosDB", vars: [{k:"AZURE_TENANT_ID",h:"..."},{k:"AZURE_CLIENT_ID",h:"..."},{k:"AZURE_CLIENT_SECRET",h:"..."},{k:"AZURE_SUBSCRIPTION_ID",h:"..."}] },
                      { label: "Cloudflare", note: "Cloudflare", desc: "R2, Workers, D1, KV, DNS", vars: [{k:"CLOUDFLARE_API_TOKEN",h:"..."},{k:"CLOUDFLARE_ACCOUNT_ID",h:"..."},{k:"CLOUDFLARE_ZONE_ID",h:"..."},{k:"CLOUDFLARE_API_KEY",h:"..."}] },
                      { label: "DigitalOcean", note: "DigitalOcean", desc: "Droplets, Spaces, App Platform", vars: [{k:"DIGITALOCEAN_TOKEN",h:"..."},{k:"DIGITALOCEAN_SPACES_KEY",h:"..."},{k:"DIGITALOCEAN_SPACES_SECRET",h:"..."},{k:"DIGITALOCEAN_SPACES_REGION",h:"nyc3"}] },
                      { label: "Hetzner", note: "Hetzner Cloud", desc: "VPS, dedicated servers", vars: [{k:"HETZNER_API_TOKEN",h:"..."}] },
                    ]},
                    { category: "Auth & OAuth", icon: "🔐", templates: [
                      { label: "NextAuth.js", note: "Auth.js", desc: "NextAuth/Auth.js configuration", vars: [{k:"NEXTAUTH_SECRET",h:"openssl rand -base64 32"},{k:"NEXTAUTH_URL",h:"http://localhost:3000"},{k:"AUTH_SECRET",h:"..."},{k:"AUTH_URL",h:"http://localhost:3000"}] },
                      { label: "Clerk", note: "Clerk", desc: "User management & auth UI", vars: [{k:"CLERK_SECRET_KEY",h:"sk_test_..."},{k:"CLERK_PUBLISHABLE_KEY",h:"pk_test_..."},{k:"CLERK_WEBHOOK_SECRET",h:"whsec_..."}] },
                      { label: "Firebase Auth", note: "Firebase", desc: "Google Firebase Authentication", vars: [{k:"FIREBASE_API_KEY",h:"AIza..."},{k:"FIREBASE_AUTH_DOMAIN",h:"xxx.firebaseapp.com"},{k:"FIREBASE_PROJECT_ID",h:"my-project"},{k:"FIREBASE_PRIVATE_KEY",h:"-----BEGIN PRIVATE KEY-----\\n..."}] },
                      { label: "Supabase Auth", note: "Supabase Auth", desc: "Supabase built-in auth", vars: [{k:"SUPABASE_URL",h:"https://xxx.supabase.co"},{k:"SUPABASE_ANON_KEY",h:"eyJ..."},{k:"SUPABASE_SERVICE_ROLE_KEY",h:"eyJ..."}] },
                      { label: "WorkOS", note: "WorkOS", desc: "SSO, SCIM, Org management", vars: [{k:"WORKOS_API_KEY",h:"sk_..."},{k:"WORKOS_CLIENT_ID",h:"client_..."}] },
                      { label: "Stytch", note: "Stytch", desc: "Passwordless auth, MFA, sessions", vars: [{k:"STYTCH_PROJECT_ID",h:"project-..."},{k:"STYTCH_SECRET",h:"secret-..."},{k:"STYTCH_PUBLIC_TOKEN",h:"public-token-..."}] },
                      { label: "Auth0", note: "Auth0", desc: "Universal auth platform", vars: [{k:"AUTH0_CLIENT_ID",h:"..."},{k:"AUTH0_CLIENT_SECRET",h:"..."},{k:"AUTH0_ISSUER_BASE_URL",h:"https://xxx.us.auth0.com"},{k:"AUTH0_AUDIENCE",h:"https://api.example.com"}] },
                      { label: "GitHub OAuth", note: "GitHub OAuth", desc: "GitHub OAuth app", vars: [{k:"GITHUB_CLIENT_ID",h:"Iv1..."},{k:"GITHUB_CLIENT_SECRET",h:"..."}] },
                      { label: "Google OAuth", note: "Google Cloud OAuth", desc: "Google OAuth credentials", vars: [{k:"GOOGLE_CLIENT_ID",h:"xxx.apps.googleusercontent.com"},{k:"GOOGLE_CLIENT_SECRET",h:"GOCSPX-..."}] },
                      { label: "Better Auth", note: "Better Auth", desc: "Type-safe auth framework", vars: [{k:"BETTER_AUTH_SECRET",h:"..."},{k:"BETTER_AUTH_URL",h:"http://localhost:3000"}] },
                    ]},
                    { category: "Messaging & Email", icon: "✉️", templates: [
                      { label: "Twilio", note: "Twilio", desc: "SMS, Voice, WhatsApp API", vars: [{k:"TWILIO_ACCOUNT_SID",h:"AC..."},{k:"TWILIO_AUTH_TOKEN",h:"..."},{k:"TWILIO_PHONE_NUMBER",h:"+1555..."}] },
                      { label: "Slack", note: "Slack", desc: "Bot, webhook, app integration", vars: [{k:"SLACK_BOT_TOKEN",h:"xoxb-..."},{k:"SLACK_SIGNING_SECRET",h:"..."},{k:"SLACK_WEBHOOK_URL",h:"https://hooks.slack.com/services/..."}] },
                      { label: "Telegram Bot", note: "Telegram", desc: "Bot API token & chat ID", vars: [{k:"TELEGRAM_BOT_TOKEN",h:"123456:ABC-DEF..."},{k:"TELEGRAM_CHAT_ID",h:"-100..."}] },
                      { label: "Discord Bot", note: "Discord", desc: "Discord bot & webhook", vars: [{k:"DISCORD_BOT_TOKEN",h:"..."},{k:"DISCORD_CLIENT_ID",h:"..."},{k:"DISCORD_CLIENT_SECRET",h:"..."},{k:"DISCORD_PUBLIC_KEY",h:"..."},{k:"DISCORD_WEBHOOK_URL",h:"https://discord.com/api/webhooks/..."}] },
                      { label: "Resend", note: "Resend", desc: "Transactional email for devs", vars: [{k:"RESEND_API_KEY",h:"re_..."}] },
                      { label: "SendGrid", note: "SendGrid / Twilio", desc: "Transactional email API", vars: [{k:"SENDGRID_API_KEY",h:"SG.xxx..."},{k:"SENDGRID_FROM_EMAIL",h:"noreply@example.com"}] },
                      { label: "Mailgun", note: "Mailgun", desc: "Email API for developers", vars: [{k:"MAILGUN_API_KEY",h:"..."},{k:"MAILGUN_DOMAIN",h:"mg.example.com"},{k:"MAILGUN_PUBLIC_KEY",h:"..."}] },
                      { label: "Postmark", note: "Postmark", desc: "Reliable transactional email", vars: [{k:"POSTMARK_API_KEY",h:"..."},{k:"POSTMARK_FROM_EMAIL",h:"noreply@example.com"},{k:"POSTMARK_MESSAGE_STREAM",h:"outbound"}] },
                      { label: "Amazon SES", note: "AWS SES", desc: "AWS Simple Email Service", vars: [{k:"AWS_ACCESS_KEY_ID",h:"AKIA..."},{k:"AWS_SECRET_ACCESS_KEY",h:"..."},{k:"AWS_REGION",h:"us-east-1"},{k:"SES_FROM_EMAIL",h:"noreply@example.com"}] },
                      { label: "OneSignal", note: "OneSignal", desc: "Push notifications, SMS, email", vars: [{k:"ONESIGNAL_APP_ID",h:"..."},{k:"ONESIGNAL_REST_API_KEY",h:"..."}] },
                      { label: "Pusher", note: "Pusher", desc: "WebSockets & realtime", vars: [{k:"PUSHER_APP_ID",h:"..."},{k:"PUSHER_KEY",h:"..."},{k:"PUSHER_SECRET",h:"..."},{k:"PUSHER_CLUSTER",h:"us2"}] },
                      { label: "Ably", note: "Ably", desc: "Realtime pub/sub messaging", vars: [{k:"ABLY_API_KEY",h:"..."}] },
                    ]},
                    { category: "Payments", icon: "💳", templates: [
                      { label: "Stripe", note: "Stripe", desc: "Full payment processing platform", vars: [{k:"STRIPE_SECRET_KEY",h:"sk_live_..."},{k:"STRIPE_PUBLISHABLE_KEY",h:"pk_live_..."},{k:"STRIPE_WEBHOOK_SECRET",h:"whsec_..."}] },
                      { label: "Checkout.com", note: "Checkout.com", desc: "Global payment gateway", vars: [{k:"CHECKOUT_SECRET_KEY",h:"sk_..."},{k:"CHECKOUT_PUBLIC_KEY",h:"pk_..."},{k:"CHECKOUT_WEBHOOK_SECRET",h:"whsec_..."}] },
                      { label: "PayPal", note: "PayPal", desc: "PayPal payments & subscriptions", vars: [{k:"PAYPAL_CLIENT_ID",h:"..."},{k:"PAYPAL_CLIENT_SECRET",h:"..."},{k:"PAYPAL_WEBHOOK_ID",h:"..."},{k:"PAYPAL_MODE",h:"sandbox"}] },
                      { label: "Paddle", note: "Paddle", desc: "Global SaaS payments & tax", vars: [{k:"PADDLE_VENDOR_ID",h:"..."},{k:"PADDLE_API_KEY",h:"..."},{k:"PADDLE_WEBHOOK_SECRET",h:"..."},{k:"PADDLE_PUBLIC_KEY",h:"..."}] },
                      { label: "Square", note: "Square", desc: "In-person & online payments", vars: [{k:"SQUARE_ACCESS_TOKEN",h:"..."},{k:"SQUARE_APPLICATION_ID",h:"..."},{k:"SQUARE_LOCATION_ID",h:"..."},{k:"SQUARE_WEBHOOK_SIGNATURE_KEY",h:"..."}] },
                      { label: "Adyen", note: "Adyen", desc: "Enterprise payment platform", vars: [{k:"ADYEN_API_KEY",h:"..."},{k:"ADYEN_MERCHANT_ACCOUNT",h:"..."},{k:"ADYEN_CLIENT_KEY",h:"..."},{k:"ADYEN_HMAC_KEY",h:"..."}] },
                      { label: "Razorpay", note: "Razorpay", desc: "India payments & subscriptions", vars: [{k:"RAZORPAY_KEY_ID",h:"rzp_live_..."},{k:"RAZORPAY_KEY_SECRET",h:"..."},{k:"RAZORPAY_WEBHOOK_SECRET",h:"..."}] },
                      { label: "Mercado Pago", note: "Mercado Pago", desc: "Latin America payments", vars: [{k:"MERCADO_PAGO_ACCESS_TOKEN",h:"..."},{k:"MERCADO_PAGO_PUBLIC_KEY",h:"..."},{k:"MERCADO_PAGO_WEBHOOK_SECRET",h:"..."}] },
                      { label: "RevenueCat", note: "RevenueCat", desc: "In-app subscriptions & purchases", vars: [{k:"REVENUECAT_API_KEY",h:"appl_..."},{k:"REVENUECAT_PUBLIC_API_KEY",h:"..."},{k:"REVENUECAT_WEBHOOK_SECRET",h:"..."}] },
                      { label: "Lemon Squeezy", note: "Lemon Squeezy", desc: "Payments & software licensing", vars: [{k:"LEMON_SQUEEZY_API_KEY",h:"..."},{k:"LEMON_SQUEEZY_STORE_ID",h:"..."}] },
                      { label: "Coinbase Commerce", note: "Coinbase", desc: "Crypto payment gateway", vars: [{k:"COINBASE_COMMERCE_API_KEY",h:"..."},{k:"COINBASE_COMMERCE_WEBHOOK_SECRET",h:"..."}] },
                    ]},
                    { category: "Crypto & Web3", icon: "⛓️", templates: [
                      { label: "Alchemy", note: "Alchemy", desc: "EVM RPC, NFT, WebSocket APIs", vars: [{k:"ALCHEMY_API_KEY",h:"..."},{k:"ALCHEMY_ETH_URL",h:"https://eth-mainnet.g.alchemy.com/v2/..."},{k:"ALCHEMY_BASE_URL",h:"https://base-mainnet.g.alchemy.com/v2/..."}] },
                      { label: "Infura", note: "Infura", desc: "Ethereum & IPFS gateway", vars: [{k:"INFURA_API_KEY",h:"..."},{k:"INFURA_API_SECRET",h:"..."},{k:"INFURA_ETH_URL",h:"https://mainnet.infura.io/v3/..."},{k:"INFURA_IPFS_URL",h:"https://ipfs.infura.io"}] },
                      { label: "QuickNode", note: "QuickNode", desc: "Multi-chain RPC endpoints", vars: [{k:"QUICKNODE_HTTP_URL",h:"https://xxx.quiknode.pro/..."},{k:"QUICKNODE_WSS_URL",h:"wss://xxx.quiknode.pro/..."},{k:"QUICKNODE_API_KEY",h:"..."}] },
                      { label: "Moralis", note: "Moralis", desc: "Web3 API — EVM + Solana", vars: [{k:"MORALIS_API_KEY",h:"..."},{k:"MORALIS_WEB3_API_URL",h:"https://deep-index.moralis.io/api/v2"}] },
                      { label: "Etherscan", note: "Etherscan", desc: "Ethereum blockchain explorer API", vars: [{k:"ETHERSCAN_API_KEY",h:"..."},{k:"ETHERSCAN_BASE_URL",h:"https://api.etherscan.io"}] },
                      { label: "Solana Web3", note: "Solana", desc: "Solana RPC & program deployment", vars: [{k:"SOLANA_RPC_URL",h:"https://api.mainnet-beta.solana.com"},{k:"SOLANA_PRIVATE_KEY",h:"..."},{k:"SOLANA_PUBLIC_KEY",h:"..."}] },
                      { label: "The Graph", note: "The Graph", desc: "Subgraph querying (GraphQL)", vars: [{k:"THE_GRAPH_API_KEY",h:"..."},{k:"THE_GRAPH_SUBGRAPH_URL",h:"https://gateway.thegraph.com/..."}] },
                      { label: "Chainlink", note: "Chainlink", desc: "Oracle & CCIP cross-chain", vars: [{k:"CHAINLINK_RPC_URL",h:"..."},{k:"CHAINLINK_ORACLE_ADDRESS",h:"0x..."},{k:"CHAINLINK_CCIP_ROUTER",h:"0x..."}] },
                      { label: "Binance", note: "Binance", desc: "Binance exchange & BSC", vars: [{k:"BINANCE_API_KEY",h:"..."},{k:"BINANCE_API_SECRET",h:"..."},{k:"BINANCE_BSC_RPC",h:"https://bsc-dataseed.binance.org"}] },
                      { label: "Coinbase", note: "Coinbase", desc: "Coinbase Exchange + Prime", vars: [{k:"COINBASE_API_KEY",h:"..."},{k:"COINBASE_API_SECRET",h:"..."},{k:"COINBASE_PASSPHRASE",h:"..."}] },
                      { label: "Kraken", note: "Kraken", desc: "Kraken exchange API", vars: [{k:"KRAKEN_API_KEY",h:"..."},{k:"KRAKEN_API_SECRET",h:"..."}] },
                      { label: "Bybit", note: "Bybit", desc: "Bybit exchange API — spot & derivatives", vars: [{k:"BYBIT_API_KEY",h:"..."},{k:"BYBIT_API_SECRET",h:"..."},{k:"BYBIT_TESTNET",h:"false"}] },
                      { label: "MEXC", note: "MEXC", desc: "MEXC exchange API — spot & futures", vars: [{k:"MEXC_API_KEY",h:"..."},{k:"MEXC_API_SECRET",h:"..."}] },
                      { label: "Crypto.com", note: "Crypto.com", desc: "Crypto.com Exchange API", vars: [{k:"CRYPTO_DOT_COM_API_KEY",h:"..."},{k:"CRYPTO_DOT_COM_API_SECRET",h:"..."}] },
                    ]},
                    { category: "DevOps & Hosting", icon: "🚀", templates: [
                      { label: "GitHub Token", note: "GitHub", desc: "PAT, Actions, API access", vars: [{k:"GITHUB_TOKEN",h:"ghp_..."},{k:"GITHUB_USERNAME",h:"username"},{k:"GITHUB_REPOSITORY",h:"owner/repo"}] },
                      { label: "GitLab CI", note: "GitLab", desc: "CI/CD pipeline tokens", vars: [{k:"GITLAB_TOKEN",h:"glpat-..."},{k:"GITLAB_PROJECT_ID",h:"..."},{k:"CI_JOB_TOKEN",h:"..."}] },
                      { label: "Docker Registry", note: "Docker", desc: "Docker Hub & registry auth", vars: [{k:"DOCKER_USERNAME",h:"username"},{k:"DOCKER_PASSWORD",h:"..."},{k:"DOCKER_REGISTRY",h:"https://index.docker.io/v1/"}] },
                      { label: "Vercel", note: "Vercel", desc: "Deployment & environment", vars: [{k:"VERCEL_TOKEN",h:"..."},{k:"VERCEL_PROJECT_ID",h:"prj_..."},{k:"VERCEL_ORG_ID",h:"team_..."}] },
                      { label: "Netlify", note: "Netlify", desc: "Hosting & functions", vars: [{k:"NETLIFY_AUTH_TOKEN",h:"nfp_..."},{k:"NETLIFY_SITE_ID",h:"..."}] },
                      { label: "Railway", note: "Railway", desc: "Infrastructure platform", vars: [{k:"RAILWAY_TOKEN",h:"..."},{k:"RAILWAY_PROJECT_ID",h:"..."}] },
                      { label: "Hostinger", note: "Hostinger", desc: "VPS, domains, shared hosting", vars: [{k:"HOSTINGER_API_KEY",h:"..."},{k:"HOSTINGER_WHM_USERNAME",h:"..."},{k:"HOSTINGER_WHM_PASSWORD",h:"..."},{k:"HOSTINGER_DOMAIN",h:"example.com"}] },
                      { label: "Render", note: "Render", desc: "Cloud application hosting", vars: [{k:"RENDER_API_KEY",h:"rnd_..."},{k:"RENDER_SERVICE_ID",h:"srv-..."}] },
                      { label: "Fly.io", note: "Fly.io", desc: "Edge app hosting & Postgres", vars: [{k:"FLY_API_TOKEN",h:"..."},{k:"FLY_ORG",h:"personal"}] },
                      { label: "CircleCI", note: "CircleCI", desc: "CI/CD pipeline platform", vars: [{k:"CIRCLE_CI_TOKEN",h:"..."},{k:"CIRCLE_PROJECT_SLUG",h:"gh/org/repo"}] },
                      { label: "S3 Compatible", note: "S3 Storage", desc: "MinIO, Backblaze, Wasabi", vars: [{k:"S3_ACCESS_KEY_ID",h:"..."},{k:"S3_SECRET_ACCESS_KEY",h:"..."},{k:"S3_ENDPOINT",h:"https://s3.us-east-1.amazonaws.com"},{k:"S3_REGION",h:"us-east-1"},{k:"S3_BUCKET",h:"my-bucket"}] },
                      { label: "Doppler", note: "Doppler", desc: "Secrets management platform", vars: [{k:"DOPPLER_TOKEN",h:"dp.pt.xxx"},{k:"DOPPLER_PROJECT",h:"my-project"},{k:"DOPPLER_CONFIG",h:"prd"}] },
                    ]},
                    { category: "Monitoring & Logging", icon: "📊", templates: [
                      { label: "Sentry", note: "Sentry", desc: "Error tracking & performance", vars: [{k:"SENTRY_DSN",h:"https://xxx@oxxx.ingest.us.sentry.io/..."},{k:"SENTRY_ORG",h:"my-org"},{k:"SENTRY_PROJECT",h:"my-project"},{k:"SENTRY_AUTH_TOKEN",h:"..."}] },
                      { label: "Datadog", note: "Datadog", desc: "Monitoring, APM, logs", vars: [{k:"DATADOG_API_KEY",h:"..."},{k:"DATADOG_APP_KEY",h:"..."},{k:"DATADOG_SITE",h:"datadoghq.com"}] },
                      { label: "New Relic", note: "New Relic", desc: "Full-stack observability", vars: [{k:"NEW_RELIC_LICENSE_KEY",h:"..."},{k:"NEW_RELIC_APP_NAME",h:"my-app"}] },
                      { label: "Grafana", note: "Grafana / Loki", desc: "Metrics, logs, dashboards", vars: [{k:"GRAFANA_API_KEY",h:"..."},{k:"GRAFANA_URL",h:"https://xxx.grafana.net"},{k:"LOKI_URL",h:"https://xxx.grafana.net/loki"}] },
                      { label: "Logtail", note: "Logtail / BetterStack", desc: "Cloud log management", vars: [{k:"LOGTAIL_SOURCE_TOKEN",h:"..."}] },
                      { label: "BetterStack", note: "BetterStack", desc: "Uptime & status pages", vars: [{k:"BETTERSTACK_API_KEY",h:"..."},{k:"BETTERSTACK_STATUS_PAGE_ID",h:"..."}] },
                      { label: "PostHog", note: "PostHog", desc: "Product analytics & feature flags", vars: [{k:"POSTHOG_API_KEY",h:"phc_..."},{k:"POSTHOG_HOST",h:"https://app.posthog.com"},{k:"POSTHOG_PROJECT_ID",h:"..."}] },
                      { label: "LogRocket", note: "LogRocket", desc: "Session replay & frontend monitoring", vars: [{k:"LOGROCKET_APP_ID",h:"..."}] },
                      { label: "Plausible", note: "Plausible", desc: "Privacy-first analytics", vars: [{k:"PLAUSIBLE_API_KEY",h:"..."},{k:"PLAUSIBLE_SITE_ID",h:"example.com"}] },
                    ]},
                    { category: "Search & Data", icon: "🔍", templates: [
                      { label: "Algolia", note: "Algolia", desc: "Search-as-a-service API", vars: [{k:"ALGOLIA_APP_ID",h:"..."},{k:"ALGOLIA_ADMIN_API_KEY",h:"..."},{k:"ALGOLIA_SEARCH_API_KEY",h:"..."},{k:"ALGOLIA_INDEX",h:"my_index"}] },
                      { label: "Meilisearch", note: "Meilisearch", desc: "Open-source search engine", vars: [{k:"MEILISEARCH_URL",h:"http://localhost:7700"},{k:"MEILISEARCH_API_KEY",h:"..."},{k:"MEILISEARCH_INDEX",h:"my_index"}] },
                      { label: "Typesense", note: "Typesense", desc: "Typo-tolerant search engine", vars: [{k:"TYPESENSE_API_KEY",h:"..."},{k:"TYPESENSE_HOST",h:"localhost"},{k:"TYPESENSE_PORT",h:"8108"},{k:"TYPESENSE_PROTOCOL",h:"http"}] },
                      { label: "Elasticsearch", note: "Elasticsearch", desc: "Full-text search & analytics", vars: [{k:"ELASTICSEARCH_URL",h:"http://localhost:9200"},{k:"ELASTICSEARCH_API_KEY",h:"..."},{k:"ELASTICSEARCH_USERNAME",h:"elastic"},{k:"ELASTICSEARCH_PASSWORD",h:"..."}] },
                      { label: "SerpAPI", note: "SerpAPI", desc: "Google Search results API", vars: [{k:"SERPAPI_API_KEY",h:"..."},{k:"SERPAPI_ENGINE",h:"google"}] },
                      { label: "Tavily", note: "Tavily", desc: "AI-powered search API", vars: [{k:"TAVILY_API_KEY",h:"tvly-..."}] },
                      { label: "Exa", note: "Exa", desc: "Embeddings-based search API", vars: [{k:"EXA_API_KEY",h:"..."}] },
                      { label: "Brave Search", note: "Brave Search", desc: "Privacy-focused search API", vars: [{k:"BRAVE_SEARCH_API_KEY",h:"..."}] },
                    ]},
                    { category: "Video & Media", icon: "🎬", templates: [
                      { label: "Mux", note: "Mux", desc: "Video encoding, hosting, playback", vars: [{k:"MUX_TOKEN_ID",h:"..."},{k:"MUX_TOKEN_SECRET",h:"..."},{k:"MUX_WEBHOOK_SECRET",h:"..."}] },
                      { label: "Cloudflare Stream", note: "Cloudflare", desc: "Video streaming & encoding", vars: [{k:"CLOUDFLARE_STREAM_TOKEN",h:"..."},{k:"CLOUDFLARE_ACCOUNT_ID",h:"..."}] },
                      { label: "Cloudinary", note: "Cloudinary", desc: "Image & video CDN, optimization", vars: [{k:"CLOUDINARY_CLOUD_NAME",h:"..."},{k:"CLOUDINARY_API_KEY",h:"..."},{k:"CLOUDINARY_API_SECRET",h:"..."}] },
                      { label: "ImageKit", note: "ImageKit", desc: "Image optimization & CDN", vars: [{k:"IMAGEKIT_PUBLIC_KEY",h:"..."},{k:"IMAGEKIT_PRIVATE_KEY",h:"..."},{k:"IMAGEKIT_URL_ENDPOINT",h:"https://ik.imagekit.io/..."}] },
                      { label: "UploadThing", note: "UploadThing", desc: "File uploads for frameworks", vars: [{k:"UPLOADTHING_SECRET",h:"sk_live_..."},{k:"UPLOADTHING_APP_ID",h:"..."}] },
                    ]},
                    { category: "Analytics & CRO", icon: "📈", templates: [
                      { label: "Google Analytics", note: "Google", desc: "Universal analytics & GA4", vars: [{k:"GA_MEASUREMENT_ID",h:"G-xxxxxxx"},{k:"GA_API_SECRET",h:"..."}] },
                      { label: "Mixpanel", note: "Mixpanel", desc: "Product analytics & user tracking", vars: [{k:"MIXPANEL_TOKEN",h:"..."},{k:"MIXPANEL_PROJECT_ID",h:"..."},{k:"MIXPANEL_SERVICE_ACCOUNT",h:"..."},{k:"MIXPANEL_SERVICE_ACCOUNT_SECRET",h:"..."}] },
                      { label: "Amplitude", note: "Amplitude", desc: "Product analytics & experimentation", vars: [{k:"AMPLITUDE_API_KEY",h:"..."},{k:"AMPLITUDE_SECRET_KEY",h:"..."}] },
                      { label: "Segment", note: "Segment", desc: "Customer data platform (CDP)", vars: [{k:"SEGMENT_WRITE_KEY",h:"..."},{k:"SEGMENT_SOURCE_ID",h:"..."}] },
                      { label: "Hotjar", note: "Hotjar", desc: "Session recording & heatmaps", vars: [{k:"HOTJAR_SITE_ID",h:"..."},{k:"HOTJAR_API_KEY",h:"..."}] },
                      { label: "FullStory", note: "FullStory", desc: "Session replay & analytics", vars: [{k:"FULLSTORY_ORG_ID",h:"..."},{k:"FULLSTORY_API_KEY",h:"..."}] },
                    ]},
                    { category: "Maps & Location", icon: "📍", templates: [
                      { label: "Google Maps", note: "Google Maps", desc: "Maps, geocoding, places API", vars: [{k:"GOOGLE_MAPS_API_KEY",h:"AIza..."},{k:"GOOGLE_PLACES_API_KEY",h:"AIza..."}] },
                      { label: "Mapbox", note: "Mapbox", desc: "Custom maps & navigation", vars: [{k:"MAPBOX_ACCESS_TOKEN",h:"pk.eyJ1..."},{k:"MAPBOX_SECRET_TOKEN",h:"sk.eyJ1..."}] },
                      { label: "MapTiler", note: "MapTiler", desc: "OpenStreetMap-based tiles", vars: [{k:"MAPTILER_API_KEY",h:"..."}] },
                    ]},
                    { category: "General", icon: "⚙️", templates: [
                      { label: "App Config", note: "App Config", desc: "Common application env vars", vars: [{k:"NODE_ENV",h:"development"},{k:"PORT",h:"3000"},{k:"HOST",h:"0.0.0.0"},{k:"APP_URL",h:"http://localhost:3000"},{k:"API_URL",h:"http://localhost:3000/api"},{k:"LOG_LEVEL",h:"debug"},{k:"CORS_ORIGIN",h:"*"}] },
                      { label: "JWT Auth", note: "JWT Auth", desc: "Token signing & expiry config", vars: [{k:"JWT_SECRET",h:"openssl rand -base64 64"},{k:"JWT_EXPIRES_IN",h:"7d"},{k:"JWT_REFRESH_EXPIRES_IN",h:"30d"},{k:"JWT_ALGORITHM",h:"HS256"}] },
                      { label: "OTel / OpenTelemetry", note: "OpenTelemetry", desc: "Distributed tracing & metrics", vars: [{k:"OTEL_SERVICE_NAME",h:"my-service"},{k:"OTEL_EXPORTER_OTLP_ENDPOINT",h:"http://localhost:4318"},{k:"OTEL_EXPORTER_OTLP_HEADERS",h:""},{k:"OTEL_TRACES_SAMPLER",h:"parentbased_traceidratio"},{k:"OTEL_TRACES_SAMPLER_ARG",h:"0.1"}] },
                      { label: "Encryption Keys", note: "Encryption", desc: "App-level encryption config", vars: [{k:"ENCRYPTION_KEY",h:"openssl rand -hex 32"},{k:"ENCRYPTION_ALGORITHM",h:"aes-256-gcm"},{k:"SALT_ROUNDS",h:"10"}] },
                      { label: "Rate Limiting", note: "Rate Limit", desc: "API rate limiting config", vars: [{k:"RATE_LIMIT_WINDOW_MS",h:"60000"},{k:"RATE_LIMIT_MAX",h:"100"},{k:"RATE_LIMIT_MESSAGE",h:"Too many requests"}] },
                      { label: "Database SSL", note: "DB SSL", desc: "DB TLS certificate paths", vars: [{k:"DB_SSL_CA",h:"/path/to/ca.pem"},{k:"DB_SSL_CERT",h:"/path/to/client-cert.pem"},{k:"DB_SSL_KEY",h:"/path/to/client-key.pem"},{k:"DB_SSL_REJECT_UNAUTHORIZED",h:"true"}] },
                      { label: "PAOS Agent", note: "PAOS Agent", desc: "Hermes agent configuration", vars: [{k:"HERMES_HOME",h:"/home/dev/AI_Workflow/hermes"},{k:"HERMES_PROVIDER",h:"deepseek"},{k:"HERMES_MODEL",h:"deepseek-v4-flash"},{k:"TELEGRAM_BOT_TOKEN",h:"..."}] },
                    ]},
                  ];
              return categories.map((cat) => (
                <div key={cat.category}>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
                    <span>{cat.icon}</span>
                    {cat.category}
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cat.templates.map((tpl) => (
                      <button
                        key={tpl.label}
                        type="button"
                        onClick={() => {
                          // Merge template vars into secrets, preserving existing entries
                          setSecretsData((prev) => {
                            const next = { ...prev };
                            for (const v of tpl.vars) {
                              // Only add if key doesn't already exist
                              if (!(v.k in prev)) {
                                next[v.k] = { value: v.h, note: tpl.note };
                              }
                            }
                            return next;
                          });
                          setSecretsDirty(true);
                          setShowTemplates(false);
                        }}
                        className="text-left text-[10px] p-2 rounded border transition-all hover:border-primary/40 flex items-start gap-2"
                        style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
                      >
                        <span
                          className="shrink-0 w-6 h-6 rounded flex items-center justify-center overflow-hidden"
                          dangerouslySetInnerHTML={{ __html: logos[tpl.label] || `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="var(--muted-foreground)"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="var(--card-bg)">${tpl.label[0]}</text></svg>` }}
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-xs" style={{ color: "var(--foreground)" }}>{tpl.label}</div>
                          <div className="mt-0.5 text-[9px] leading-tight" style={{ color: "var(--muted-foreground)" }}>{tpl.desc}</div>
                          <div className="mt-1 text-[8px] font-mono opacity-60">{tpl.vars.length} variable{tpl.vars.length !== 1 ? "s" : ""}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteConfirmText(""); }}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2" style={{ color: "var(--error)" }}>
              <Trash2 size={13} />
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-xs">
              This will permanently delete <strong>{deleteTarget}</strong> and all its pipelines, events, vault, secrets, and history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Type <code className="font-mono text-foreground bg-muted px-1 rounded">{deleteTarget}_Delete</code> to confirm:
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && deleteConfirmText === `${deleteTarget}_Delete` && deleting !== deleteTarget) {
                  handleDelete();
                }
              }}
              placeholder={`${deleteTarget}_Delete`}
              className="text-sm font-mono"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setDeleteTarget(null); setDeleteConfirmText(""); }}>Cancel</Button>
              <Button
                size="sm"
                disabled={deleteConfirmText !== `${deleteTarget}_Delete` || deleting === deleteTarget}
                onClick={handleDelete}
                className="gap-1.5"
                style={{ background: "var(--error)" }}
              >
                {deleting === deleteTarget ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
