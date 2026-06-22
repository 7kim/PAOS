"use client";
import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";

interface TreeNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: TreeNode[];
}

interface ProjectTreeProps {
  tree: TreeNode[];
  onSelect: (node: TreeNode) => void;
  selectedPath?: string;
}

function TreeNodeItem({
  node,
  depth,
  onSelect,
  selectedPath,
}: {
  node: TreeNode;
  depth: number;
  onSelect: (node: TreeNode) => void;
  selectedPath?: string;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isDir = node.type === "directory";
  const isSelected = selectedPath === node.path;
  const hasChildren = isDir && node.children && node.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (isDir) setExpanded(!expanded);
          onSelect(node);
        }}
        className="flex items-center gap-1.5 w-full text-left px-2 py-1 rounded text-sm transition-colors"
        style={{
          paddingLeft: `${depth * 16 + 8}px`,
          background: isSelected ? "rgba(252,213,53,0.1)" : "transparent",
          color: isSelected ? "var(--accent)" : "var(--foreground)",
        }}
      >
        {/* Expand/collapse chevron for dirs */}
        <span className="w-4 shrink-0 flex items-center justify-center" style={{ color: "var(--muted)" }}>
          {isDir && hasChildren ? (
            expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : null}
        </span>

        {/* Icon */}
        <span className="shrink-0" style={{ color: isDir ? "var(--accent)" : "var(--muted)", opacity: 0.7 }}>
          {isDir ? <Folder size={14} /> : <FileText size={14} />}
        </span>

        {/* Name */}
        <span className="truncate text-xs">{node.name}</span>

        {/* Children count badge */}
        {isDir && hasChildren && (
          <span
            className="text-[10px] px-1 rounded ml-auto"
            style={{ color: "var(--muted)", background: "rgba(255,255,255,0.05)" }}
          >
            {node.children!.length}
          </span>
        )}
      </button>

      {/* Children */}
      {isDir && expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectTree({ tree, onSelect, selectedPath }: ProjectTreeProps) {
  if (tree.length === 0) {
    return (
      <div className="text-sm py-8 text-center" style={{ color: "var(--muted)" }}>
        <Folder size={20} className="mx-auto mb-2 opacity-30" />
        Empty project
      </div>
    );
  }

  return (
    <div>
      {tree.map((node) => (
        <TreeNodeItem
          key={node.path}
          node={node}
          depth={0}
          onSelect={onSelect}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}
