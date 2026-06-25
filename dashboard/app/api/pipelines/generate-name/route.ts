import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");
const COUNTER_FILE = join(PIPELINES_DIR, "PIPE_COUNTER");

function nowFormatted(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy}---${hh}-${min}`;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const project = url.searchParams.get("project") || "PAOS";

    // Read current counter (next number = current + 1)
    let count = 0;
    try {
      const raw = await readFile(COUNTER_FILE, "utf-8");
      count = parseInt(raw.trim(), 10) || 0;
    } catch { /* no counter yet */ }
    const nextCount = count + 1;

    const name = `${project}-PIPE_${nextCount}-${nowFormatted()}`;
    return NextResponse.json({ name, nextCounter: nextCount, currentCounter: count });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
