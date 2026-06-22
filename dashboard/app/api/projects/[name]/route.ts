import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const REPO_ROOT = process.env.PAOS_ROOT || "/home/dev/AI_Workflow";

// 30s TTL cache (keyed by project name)
const cacheMap = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 30_000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const cacheKey = `detail:${name}`;
  const cached = cacheMap.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Try reading from memory/projects/<name>/
  const projectDir = join(MEMORY_DIR, "projects", name);
  const ledgerRaw = await readFile(join(projectDir, "ledger.md"), "utf-8").catch(() => null);

  // Parse last 10 ledger entries
  const ledgerEntries: Array<{ timestamp: string; agent: string; action: string; description: string }> = [];
  if (ledgerRaw) {
    // Filter: only table rows (start with |), exclude separator lines (:---)
    const lines = ledgerRaw.split("\n").filter((l) => l.startsWith("|") && !l.includes(":---"));
    // Skip header row (first line)
    const dataLines = lines.slice(1);
    for (const line of dataLines.slice(-10)) {
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 4) {
        ledgerEntries.push({
          timestamp: cells[0] ?? "",
          agent: cells[1] ?? "",
          action: cells[2] ?? "",
          description: cells[3] ?? "",
        });
      }
    }
  }

  // Count files in project dir
  const files = await readdir(projectDir).catch(() => []);
  const fileCount = files.length;

  // Also check if this is a previous project
  const previousDir = join(REPO_ROOT, "knowledge", "previous-projects", name);
  const isPrevious = !ledgerRaw && await readFile(join(previousDir, "README.md"), "utf-8").catch(() => null) !== null;

  const data = {
    name,
    path: projectDir.replace(REPO_ROOT, "~/AI_Workflow"),
    isPrevious,
    ledgerEntries: ledgerEntries.reverse(),
    fileCount,
  };

  cacheMap.set(cacheKey, { data, ts: Date.now() });
  return NextResponse.json(data);
}
