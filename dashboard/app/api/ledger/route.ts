import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";

function parseTimestamp(raw: string): number {
  // Try ISO 8601: "2026-05-21T09:30:00Z"
  let d = new Date(raw.replace("Z", "").replace(" ", "T"));
  if (!isNaN(d.getTime())) return d.getTime();
  // Try: "2026-05-21 09:30:00"
  d = new Date(raw.replace(" ", "T"));
  if (!isNaN(d.getTime())) return d.getTime();
  // Try: "05/21/2026 09:30:00"
  d = new Date(raw);
  if (!isNaN(d.getTime())) return d.getTime();
  return 0;
}

export async function GET() {
  try {
    const raw = await readFile(join(MEMORY_DIR, "global_ledger.md"), "utf-8");
    const lines = raw.split("\n").filter(Boolean);

    // Parse markdown table rows (skip header and separator)
    const rows = lines
      .filter((l) => l.startsWith("|") && !l.includes("---"))
      .slice(1) // skip header row
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
      });

    // Sort by timestamp descending (newest first)
    rows.sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));

    return NextResponse.json({ entries: rows, raw });
  } catch {
    return NextResponse.json({ entries: [], raw: "" });
  }
}
