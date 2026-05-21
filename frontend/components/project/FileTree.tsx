"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { File, Folder, FolderOpen, ChevronRight } from "lucide-react";

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

const SRS_FILE_PATTERNS = [
  /IMPLEMENTATION_PLAN\.md$/,
  /TASKS\.md$/,
  /SRS\.md$/,
  /system-analysis/,
  /WALKTHROUGH\.md$/,
];

function filterFileTree(nodes: FileNode[], showSRS: boolean): FileNode[] {
  if (showSRS) return nodes;
  return nodes
    .filter((node) => {
      if (node.type === "file") {
        return !SRS_FILE_PATTERNS.some((p) => p.test(node.path));
      }
      return true; // keep directories
    })
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: filterFileTree(node.children, showSRS),
        };
      }
      return node;
    })
    .filter((node) => {
      // Remove empty directories
      if (node.type === "directory" && node.children?.length === 0) {
        return false;
      }
      return true;
    });
}

interface FileTreeProps {
  nodes: FileNode[];
  showSRS?: boolean;
  onToggleSRS?: () => void;
}

function FileTreeNode({
  node,
  depth,
}: {
  node: FileNode;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === "directory") {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-800 rounded-[4px] w-full text-left transition-colors"
          style={{ paddingLeft: `${8 + depth * 16}px` }}
        >
          <ChevronRight
            className={cn(
              "w-3.5 h-3.5 text-on-dark/40 transition-transform",
              expanded && "rotate-90",
            )}
          />
          {expanded ? (
            <FolderOpen className="w-4 h-4 text-brand-periwinkle" />
          ) : (
            <Folder className="w-4 h-4 text-on-dark/60" />
          )}
          <span className="font-sans text-[14px] text-on-dark/80">
            {node.name}
          </span>
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-800 rounded-[4px] transition-colors cursor-default"
      style={{ paddingLeft: `${24 + depth * 16}px` }}
    >
      <File className="w-4 h-4 text-on-dark/40" />
      <span className="font-sans text-[14px] text-on-dark/60">
        {node.name}
      </span>
    </div>
  );
}

export function FileTree({ nodes, showSRS = false }: FileTreeProps) {
  const filtered = filterFileTree(nodes, showSRS);

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-2">
      {filtered.length === 0 ? (
        <p className="font-sans text-[14px] text-on-dark/40 text-center py-8">
          No files generated yet. Start a new project to generate files.
        </p>
      ) : (
        filtered.map((node) => (
          <FileTreeNode key={node.path} node={node} depth={0} />
        ))
      )}
    </div>
  );
}
