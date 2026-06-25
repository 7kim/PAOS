"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Search, Loader2 } from "lucide-react";
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
}

export function FileTreeExplorer({ projectPath, selectedFiles, onToggleFile, onClose }: FileTreeExplorerProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["/"]));
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

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
}
