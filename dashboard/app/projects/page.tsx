"use client";
import { useCallback, useEffect, useState } from "react";
import { FolderKanban, Loader2 } from "lucide-react";
import Tabs from "@/components/Tabs";
import ProjectTree from "@/components/ProjectTree";

interface ProjectEntry {
  name: string;
  path?: string;
  stack?: string;
  status?: string;
  notes?: string;
  lastActivity?: string;
  ledgerCount: number;
  isPrevious: boolean;
}

interface ProjectDetail {
  name: string;
  path: string;
  isPrevious: boolean;
  ledgerEntries: Array<{ timestamp: string; agent: string; action: string; description: string }>;
  fileCount: number;
}

interface TreeNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: TreeNode[];
}

function timeAgo(iso: string) {
  if (!iso) return "";
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return iso; }
}

export default function ProjectsPage() {
  const [current, setCurrent] = useState<ProjectEntry[]>([]);
  const [previous, setPrevious] = useState<ProjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState<string | undefined>();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setCurrent(data.current ?? []);
    setPrevious(data.previous ?? []);
    setLoading(false);
  }, []);

  const loadDetail = useCallback(async (name: string) => {
    setDetailLoading(true);
    const [detailRes, treeRes] = await Promise.all([
      fetch(`/api/projects/${encodeURIComponent(name)}`),
      fetch(`/api/projects/${encodeURIComponent(name)}/tree`),
    ]);
    const [detailData, treeData] = await Promise.all([detailRes.json(), treeRes.json()]);
    setDetail(detailData);
    setTreeData(treeData.tree ?? []);
    setSelectedNodePath(undefined);
    setDetailLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadProjects());
    const interval = setInterval(() => void loadProjects(), 30_000);
    return () => clearInterval(interval);
  }, [loadProjects]);

  const projects = activeTab === "current" ? current : previous;

  function handleSelectProject(project: ProjectEntry) {
    setSelectedProject(project);
    void loadDetail(project.name);
  }

  function handleSelectNode(node: TreeNode) {
    setSelectedNodePath(node.path);
  }

  // ── Detail panel content ──────────────────────────────────────────
  function renderDetail() {
    if (detailLoading) {
      return (
        <div className="flex items-center justify-center h-full py-20">
          <Loader2 size={20} className="animate-spin" style={{ color: "var(--muted)" }} />
        </div>
      );
    }

    if (!detail) {
      return (
        <div className="text-sm py-20 text-center" style={{ color: "var(--muted)" }}>
          <FolderKanban size={28} className="mx-auto mb-3 opacity-30" />
          Select a project to view details
        </div>
      );
    }

    return (
      <div>
        {/* Project header */}
        <h2 className="text-lg font-semibold mb-1">{detail.name}</h2>
        <p className="text-xs font-mono mb-4" style={{ color: "var(--muted)" }}>
          {detail.path}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border p-3 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="text-lg font-bold font-mono" style={{ color: "var(--accent)" }}>{detail.fileCount}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Files</div>
          </div>
          <div className="rounded-lg border p-3 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="text-lg font-bold font-mono" style={{ color: "var(--green)" }}>{detail.ledgerEntries.length}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Ledger Events</div>
          </div>
          <div className="rounded-lg border p-3 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="text-lg font-bold font-mono" style={{ color: detail.isPrevious ? "var(--muted)" : "var(--green)" }}>
              {detail.isPrevious ? "Archived" : "Active"}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Status</div>
          </div>
        </div>

        {/* Recent ledger */}
        {detail.ledgerEntries.length > 0 && (
          <div className="rounded-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              Recent Activity
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {detail.ledgerEntries.map((entry, i) => (
                <div key={i} className="px-4 py-2.5 flex items-start gap-3">
                  <span className="text-xs font-mono shrink-0 mt-0.5" style={{ color: "var(--muted)" }}>
                    {timeAgo(entry.timestamp)}
                  </span>
                  <span className="text-xs font-medium shrink-0" style={{ color: "var(--accent)" }}>
                    {entry.agent}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}
                  >
                    {entry.action}
                  </span>
                  <span className="text-xs" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                    {entry.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-1">
        <FolderKanban size={18} style={{ color: "var(--accent)" }} />
        <h1 className="text-xl font-semibold">Projects</h1>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
        File explorer — refreshes every 30s
      </p>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "current", label: "Current Projects", count: current.length },
          { id: "previous", label: "Previous Projects", count: previous.length },
        ]}
        activeId={activeTab}
        onChange={(id) => {
          setActiveTab(id);
          setSelectedProject(null);
          setDetail(null);
          setTreeData([]);
        }}
      />

      {/* Split panel */}
      <div className="flex flex-1 gap-4 mt-4 min-h-0">
        {/* Left: Project list + tree */}
        <div
          className="w-[30%] min-w-[200px] rounded-lg border overflow-hidden flex flex-col"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          {/* Project selector */}
          <div className="border-b" style={{ borderColor: "var(--border)" }}>
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-3">
                <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>Loading projects...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
                No projects
              </div>
            ) : (
              <div className="max-h-[200px] overflow-y-auto divide-y" style={{ borderColor: "var(--border)" }}>
                {projects.map((p) => {
                  const isSelected = selectedProject?.name === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectProject(p)}
                      className="w-full text-left px-4 py-2.5 transition-colors"
                      style={{
                        background: isSelected ? "rgba(252,213,53,0.08)" : "transparent",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-medium"
                          style={{ color: isSelected ? "var(--accent)" : "var(--foreground)" }}
                        >
                          {p.name}
                        </span>
                        {p.ledgerCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)" }}>
                            {p.ledgerCount}
                          </span>
                        )}
                      </div>
                      {p.lastActivity && (
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                          {timeAgo(p.lastActivity)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* File tree */}
          <div className="flex-1 overflow-y-auto p-2">
            {selectedProject ? (
              <>
                <div className="text-xs font-semibold px-2 py-1.5 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {selectedProject.name}/
                </div>
                {treeLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--muted)" }} />
                  </div>
                ) : (
                  <ProjectTree
                    tree={treeData}
                    onSelect={handleSelectNode}
                    selectedPath={selectedNodePath}
                  />
                )}
              </>
            ) : (
              <div className="text-xs py-6 text-center" style={{ color: "var(--muted)" }}>
                Select a project
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail panel */}
        <div
          className="flex-1 rounded-lg border p-4 overflow-y-auto"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          {renderDetail()}
        </div>
      </div>
    </div>
  );
}
