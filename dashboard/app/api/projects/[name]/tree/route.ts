import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";

import { MEMORY_DIR } from "@/lib/global-config";
import { REPO_ROOT } from "@/lib/global-config";

const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "__pycache__", ".hermes", "cache", ".cache"]);
const MAX_DEPTH = 3;

interface TreeNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: TreeNode[];
}

async function buildTree(dir: string, relativePath: string, depth: number): Promise<TreeNode[]> {
  if (depth > MAX_DEPTH) return [];

  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith(".")) continue; // skip hidden

    const fullPath = join(dir, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    const s = await stat(fullPath).catch(() => null);
    if (!s) continue;

    if (entry.isDirectory()) {
      const children = await buildTree(fullPath, relPath, depth + 1);
      nodes.push({ name: entry.name, type: "directory", path: relPath, children });
    } else {
      nodes.push({ name: entry.name, type: "file", path: relPath });
    }
  }

  // Sort: directories first, then alphabetically
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  // Determine project root: check projects/<name>/, then memory/projects/<name>/, then previous-projects
  let projectRoot = join(REPO_ROOT, "projects", name);
  let s = await stat(projectRoot).catch(() => null);

  if (!s?.isDirectory()) {
    projectRoot = join(MEMORY_DIR, "projects", name);
    s = await stat(projectRoot).catch(() => null);
  }

  if (!s?.isDirectory()) {
    projectRoot = join(REPO_ROOT, "knowledge", "previous-projects", name);
    s = await stat(projectRoot).catch(() => null);
    if (!s?.isDirectory()) {
      return NextResponse.json({ tree: [], error: "Project not found" }, { status: 404 });
    }
  }

  const tree = await buildTree(projectRoot, "", 0);
  return NextResponse.json({ tree });
}
