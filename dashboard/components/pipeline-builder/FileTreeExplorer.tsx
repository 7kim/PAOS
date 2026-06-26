"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Search, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileRef } from "./types";

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

interface FileTreeExplorerProps {
  projectPath: string;
  selectedFiles: FileRef[];
  onToggleFile: (file: FileRef) => void;
  onClose: () => void;
  pipelineId?: string;
  benchmarkId?: string;
}

export const FileTreeExplorer = memo(function FileTreeExplorer({
  projectPath,
  selectedFiles,
  onToggleFile,
  onClose,
  pipelineId,
  benchmarkId,
}: FileTreeExplorerProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["/"]));
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pipelineFiles, setPipelineFiles] = useState<{ name: string; path: string }[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/projects/${encodeURIComponent(projectPath)}/tree?depth=3`)
      .then((r) => r.json())
      .then((data) => {
        if (data.tree) {
          setTree(data.tree);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [projectPath]);

  // Fetch pipeline phase files if pipelineId is provided
  useEffect(() => {
    if (!pipelineId) return;
    fetch(`/api/pipelines/${encodeURIComponent(pipelineId)}`)
      .then((r) => r.json())
      .then((data) => {
        const files: { name: string; path: string }[] = [];
        if (data.phases) {
          for (const phase of data.phases) {
            if (phase.artifacts) {
              for (const art of phase.artifacts) {
                files.push({ name: art.filename, path: art.filename });
              }
            }
          }
        }
        setPipelineFiles(files);
      })
      .catch(() => {});
  }, [pipelineId]);

  // Fetch benchmark files if benchmarkId is provided
  const [benchmarkFiles, setBenchmarkFiles] = useState<{ name: string; path: string }[]>([]);
  useEffect(() => {
    if (!benchmarkId) { setBenchmarkFiles([]); return; }
    fetch(`/api/benchmarks/${encodeURIComponent(benchmarkId)}`)
      .then((r) => r.json())
      .then((data) => {
        const files: { name: string; path: string }[] = [];
        if (data.srsAsIs) files.push({ name: "SRS-as-is.md", path: `benchmarks/${benchmarkId}/SRS-as-is.md` });
        if (data.srsToBe) files.push({ name: "SRS-to-be.md", path: `benchmarks/${benchmarkId}/SRS-to-be.md` });
        if (data.gapsCombined) files.push({ name: "gaps.md", path: `benchmarks/${benchmarkId}/gaps.md` });
        if (data.implementationDoc) files.push({ name: "implementation.md", path: `benchmarks/${benchmarkId}/implementation.md` });
        if (data.audit) files.push({ name: "full-audit.md", path: `benchmarks/${benchmarkId}/full-audit.md` });
        if (data.gaps) {
          for (const g of data.gaps) {
            files.push({ name: `gap-${String(g.number).padStart(2, "0")}.md`, path: `benchmarks/${benchmarkId}/gaps/gap-${String(g.number).padStart(2, "0")}.md` });
          }
        }
        setBenchmarkFiles(files);
      })
      .catch(() => {});
  }, [benchmarkId]);

  const toggleExpand = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const isSelected = useCallback(
    (path: string) => selectedFiles.some((f) => f.path === path),
    [selectedFiles]
  );

  const matchesSearch = useCallback(
    (name: string) => search === "" || name.toLowerCase().includes(search.toLowerCase()),
    [search]
  );

  function renderNode(node: TreeNode, depth: number = 0) {
    if (!matchesSearch(node.name)) {
      if (node.type === "folder" && node.children) {
        const hasMatch = node.children.some((c) => matchesSearch(c.name));
        if (!hasMatch) return null;
      } else {
        return null;
      }
    }

    const isExpanded = expanded.has(node.path);
    const selected = isSelected(node.path);

    return (
      <div key={node.path}>
        <button
          type="button"
          onClick={() => {
            if (node.type === "folder") {
              toggleExpand(node.path);
            }
            onToggleFile({
              path: node.path,
              type: node.type,
              name: node.name,
            });
          }}
          className={cn(
            "w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors text-left",
            selected
              ? "bg-[var(--primary)]/10 text-[var(--primary)]"
              : "hover:bg-white/5 text-[var(--foreground)]"
          )}
          style={{ paddingLeft: depth * 16 + 8 }}
        >
          {node.type === "folder" ? (
            <>
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                {isExpanded ? (
                  <ChevronDown size={10} className="opacity-60" />
                ) : (
                  <ChevronRight size={10} className="opacity-60" />
                )}
              </span>
              {isExpanded ? (
                <FolderOpen size={12} className="shrink-0" style={{ color: "var(--primary)" }} />
              ) : (
                <Folder size={12} className="shrink-0" style={{ color: "var(--primary)" }} />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5 h-3.5 shrink-0" />
              <File size={12} className="shrink-0 opacity-60" />
            </>
          )}
          <span className="truncate">{node.name}</span>
          {selected && (
            <span className="ml-auto text-[9px] px-1 rounded" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              ✓
            </span>
          )}
        </button>
        {node.type === "folder" && node.children && isExpanded && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <h4 className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--foreground)" }}>
          <Folder size={12} />
          File Explorer
        </h4>
        <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
          {selectedFiles.length} selected
        </span>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md border" style={{ borderColor: "var(--border)" }}>
          <Search size={10} className="opacity-40 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter files..."
            className="flex-1 text-[10px] bg-transparent outline-none"
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto px-1">
        {pipelineFiles.length > 0 && (
          <div className="mb-2">
            <div className="text-[9px] font-semibold px-2 py-1 flex items-center gap-1" style={{ color: "var(--primary)" }}>
              <Folder size={10} /> Pipeline Files
            </div>
            {pipelineFiles.map((pf) => {
              const selected = isSelected(pf.path);
              return (
                <button key={pf.path} type="button" onClick={() => onToggleFile({ path: pf.path, type: "file", name: pf.name })}
                  className="w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors text-left"
                  style={{
                    paddingLeft: 24,
                    background: selected ? "rgba(240,185,11,0.1)" : "transparent",
                    color: selected ? "var(--primary)" : "var(--foreground)",
                  }}
                >
                  <File size={12} className="shrink-0 opacity-60" />
                  <span className="truncate">{pf.name}</span>
                  {selected && <span className="ml-auto text-[9px]" style={{ color: "var(--primary)" }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}
        {benchmarkFiles.length > 0 && (
          <div className="mb-2">
            <div className="text-[9px] font-semibold px-2 py-1 flex items-center gap-1" style={{ color: "#8b5cf6" }}>
              <FileText size={10} /> Benchmark Files
            </div>
            {benchmarkFiles.map((bf) => {
              const selected = isSelected(bf.path);
              return (
                <button key={bf.path} type="button" onClick={() => onToggleFile({ path: bf.path, type: "file", name: bf.name })}
                  className="w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors text-left"
                  style={{
                    paddingLeft: 24,
                    background: selected ? "rgba(139,92,246,0.1)" : "transparent",
                    color: selected ? "#8b5cf6" : "var(--foreground)",
                  }}
                >
                  <File size={12} className="shrink-0 opacity-60" />
                  <span className="truncate">{bf.name}</span>
                  {selected && <span className="ml-auto text-[9px]" style={{ color: "#8b5cf6" }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={14} className="animate-spin opacity-50" />
          </div>
        ) : error ? (
          <p className="text-[10px] p-3 text-center opacity-60" style={{ color: "var(--muted-foreground)" }}>
            {error}
          </p>
        ) : tree.length === 0 ? (
          <p className="text-[10px] p-3 text-center opacity-60" style={{ color: "var(--muted-foreground)" }}>
            No files found
          </p>
        ) : (
          tree.map((node) => renderNode(node))
        )}
      </div>
    </div>
  );
});
