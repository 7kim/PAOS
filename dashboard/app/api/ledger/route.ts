import { NextResponse } from "next/server";
import { readFile, readdir, stat } from "fs/promises";
import { join } from "path";

import { MEMORY_DIR, PROJECTS_DIR, PIPELINES_DIR } from "@/lib/global-config";

function parseTimestamp(raw: string): number {
  let d = new Date(raw.replace("Z", "").replace(" ", "T"));
  if (!isNaN(d.getTime())) return d.getTime();
  d = new Date(raw.replace(" ", "T"));
  if (!isNaN(d.getTime())) return d.getTime();
  d = new Date(raw);
  if (!isNaN(d.getTime())) return d.getTime();
  return 0;
}

interface LedgerEntry {
  timestamp: string;
  agent: string;
  action: string;
  file: string;
  description: string;
  task: string;
  commit: string;
}

function parseLedger(raw: string): LedgerEntry[] {
  return raw
    .split("\n")
    .filter(Boolean)
    .filter((l) => l.startsWith("|") && !l.includes("---"))
    .slice(1)
    .map((line) => {
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      return {
        timestamp: cells[0] ?? "",
        agent: cells[1] ?? "",
        action: cells[2] ?? "",
        file: cells[3] ?? "",
        description: cells[4] ?? "",
        task: cells[5] ?? "",
        commit: cells[6] ?? "",
      };
    })
    .sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project") || "";
  const all = searchParams.get("all") === "true";

  // View All mode — return all project ledgers + global ledger
  if (all) {
    const result: Record<string, { entries: LedgerEntry[]; raw: string }> = {};

    // Global ledger
    try {
      const globalRaw = await readFile(join(MEMORY_DIR, "global_ledger.md"), "utf-8");
      result["__global__"] = { entries: parseLedger(globalRaw), raw: globalRaw };
    } catch { /* ignore */ }

    // Project ledgers
    const projectNames = new Set<string>();
    for (const dir of [PIPELINES_DIR, PROJECTS_DIR]) {
      try {
        const entries = await readdir(dir);
        for (const e of entries) {
          if (!e.startsWith(".") && !e.startsWith("__")) projectNames.add(e);
        }
      } catch { /* ignore */ }
    }

    for (const p of projectNames) {
      let ledgerPath = join(PROJECTS_DIR, p, "ledger.md");
      try {
        await stat(ledgerPath);
      } catch {
        ledgerPath = join(PIPELINES_DIR, p, "ledger.md");
      }
      try {
        const raw = await readFile(ledgerPath, "utf-8");
        result[p] = { entries: parseLedger(raw), raw };
      } catch { /* ignore */ }
    }

    return NextResponse.json({ all: result });
  }

  // Single project or global mode
  try {
    let ledgerPath: string;
    if (project) {
      const projectsPath = join(PROJECTS_DIR, project, "ledger.md");
      try {
        await stat(projectsPath);
        ledgerPath = projectsPath;
      } catch {
        ledgerPath = join(PIPELINES_DIR, project, "ledger.md");
      }
    } else {
      ledgerPath = join(MEMORY_DIR, "global_ledger.md");
    }
    const raw = await readFile(ledgerPath, "utf-8");
    return NextResponse.json({ entries: parseLedger(raw), raw });
  } catch {
    return NextResponse.json({ entries: [], raw: "" });
  }
}
