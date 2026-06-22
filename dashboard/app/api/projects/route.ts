import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const REPO_ROOT = process.env.PAOS_ROOT || "/home/dev/AI_Workflow";

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

// 30s TTL cache
let cache: { data: { current: ProjectEntry[]; previous: ProjectEntry[] }; ts: number } | null = null;
const CACHE_TTL = 30_000;

function parseProjectsMd(raw: string): ProjectEntry[] {
  const lines = raw.split("\n");
  const projects: ProjectEntry[] = [];
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith("|--")) { inTable = true; continue; }
    if (!inTable || !line.startsWith("|")) continue;
    const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    const name = cells[0].replace(/\*\*/g, "").trim();
    if (!name) continue;
    projects.push({
      name,
      path: cells[1] || undefined,
      stack: cells[2] || undefined,
      status: cells[3] || undefined,
      notes: cells[4] || undefined,
      isPrevious: false,
      ledgerCount: 0,
    });
  }
  return projects;
}

async function scanMemoryProjects(): Promise<ProjectEntry[]> {
  const dirs = await readdir(join(MEMORY_DIR, "projects")).catch(() => []);
  const projects: ProjectEntry[] = [];

  for (const d of dirs) {
    if (d.startsWith("_") || d === "index.md") continue;
    const statRes = await stat(join(MEMORY_DIR, "projects", d)).catch(() => null);
    if (!statRes?.isDirectory()) continue;

    // Read ledger.md if present
    const ledgerRaw = await readFile(join(MEMORY_DIR, "projects", d, "ledger.md"), "utf-8").catch(() => "");
    const ledgerCount = ledgerRaw ? ledgerRaw.split("\n").filter((l) => l.startsWith("|") && !l.includes(":---")).length - 1 : 0;

    // Get last activity from ledger or dir mtime
    const lastActivity = ledgerCount > 0
      ? findLastTimestamp(ledgerRaw) || statRes.mtime.toISOString()
      : statRes.mtime.toISOString();

    projects.push({
      name: d,
      path: `~/AI_Workflow/memory/projects/${d}`,
      status: ledgerCount > 0 ? "Active" : "Empty",
      lastActivity,
      ledgerCount: Math.max(0, ledgerCount),
      isPrevious: false,
    });
  }
  return projects;
}

function findLastTimestamp(raw: string): string | null {
  const lines = raw.split("\n").filter((l) => l.startsWith("|") && !l.includes(":---")).reverse();
  for (const line of lines) {
    const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells[0] && !cells[0].includes("Timestamp")) return cells[0];
  }
  return null;
}

async function scanPreviousProjects(): Promise<ProjectEntry[]> {
  const dirs = await readdir(join(REPO_ROOT, "knowledge", "previous-projects")).catch(() => []);
  const projects: ProjectEntry[] = [];

  for (const entry of dirs) {
    if (entry === "README.md") continue;
    const fullPath = join(REPO_ROOT, "knowledge", "previous-projects", entry);
    const statRes = await stat(fullPath).catch(() => null);
    if (!statRes) continue;

    projects.push({
      name: entry,
      path: `~/AI_Workflow/knowledge/previous-projects/${entry}`,
      lastActivity: statRes.mtime.toISOString(),
      ledgerCount: 0,
      isPrevious: true,
    });
  }
  return projects;
}

export async function GET() {
  // Check cache
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  // 1. Parse projects.md for active projects
  const projectsMdRaw = await readFile(join(REPO_ROOT, "projects.md"), "utf-8").catch(() => "");
  const activeFromMd = parseProjectsMd(projectsMdRaw);

  // 2. Scan memory/projects/ for all project dirs with ledgers
  const memoryProjects = await scanMemoryProjects();

  // 3. Merge — memory projects override md entries with same name
  const nameSet = new Set<string>();
  const current: ProjectEntry[] = [];

  for (const p of [...memoryProjects, ...activeFromMd]) {
    if (nameSet.has(p.name)) continue;
    nameSet.add(p.name);
    current.push(p);
  }

  // 4. Scan previous-projects/
  const previous = await scanPreviousProjects();

  const data = { current, previous };
  cache = { data, ts: Date.now() };

  return NextResponse.json(data);
}
