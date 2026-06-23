"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Plus, ExternalLink, Trash2, Eye, EyeOff, Loader2, Import, Bot, Lock, Save, Users, X, Power, PowerOff } from "lucide-react";
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
  const [secretsData, setSecretsData] = useState<Record<string, string>>({});
  const [secretsLoading, setSecretsLoading] = useState(false);
  const [secretsDirty, setSecretsDirty] = useState(false);

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
    setSecretsData(data.secrets ?? {});
    setSecretsLoading(false);
    setSecretsDirty(false);
  }

  async function saveSecrets() {
    if (!secretsProject) return;
    // Filter out entries with empty keys or empty values
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(secretsData)) {
      if (k.trim() && v.trim()) cleaned[k.trim()] = v.trim();
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
        <DialogContent className="max-w-[50vw] sm:max-w-[50vw] w-full max-h-[85vh] flex flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Lock size={13} />
              Project Secrets — {secretsProject}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Stored at <code className="font-mono">memory/pipelines/{secretsProject}/secrets/.env</code>
            </DialogDescription>
          </DialogHeader>
          {secretsLoading ? (
            <div className="flex items-center gap-2 py-8 justify-center text-xs text-muted-foreground">
              <Loader2 size={12} className="animate-spin" />
              Loading secrets...
            </div>
          ) : (
            <div className="space-y-2">
              {Object.keys(secretsData).length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">No secrets yet. Add key-value pairs below.</p>
              )}
              {Object.entries(secretsData).map(([key, val], idx) => {
                const isRevealed = revealedKeys.has(key);
                const lastTwo = val.length >= 2 ? val.slice(-2) : val;
                const masked = val ? `********${lastTwo}` : "";
                return (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={key}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      setSecretsData((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        if (newVal) next[newVal] = val;
                        return next;
                      });
                      setSecretsDirty(true);
                    }}
                    className="flex-[3] text-xs font-mono rounded border px-2 py-1"
                    style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    placeholder="KEY"
                  />
                  <span className="text-muted-foreground shrink-0">=</span>
                  <div className="flex-[5] flex items-center gap-1 rounded border px-2 py-1" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                    <input
                      type={isRevealed ? "text" : "password"}
                      value={val}
                      onChange={(e) => {
                        setSecretsData((prev) => ({ ...prev, [key]: e.target.value }));
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
                );
              })}
              <div className="flex items-center gap-2 pt-2">
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
                    setSecretsData((prev) => ({ ...prev, "": "" }));
                    setSecretsDirty(true);
                  }}
                >
                  + Add Secret
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
