import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";

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
      })
      .reverse(); // newest first

    return NextResponse.json({ entries: rows, raw });
  } catch {
    return NextResponse.json({ entries: [], raw: "" });
  }
}
