import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";

export async function GET() {
  try {
    const handoffPath = join(MEMORY_DIR, "shared", "HANDOFF.md");
    const content = await readFile(handoffPath, "utf-8");
    return NextResponse.json({ content, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ content: "HANDOFF.md not found.", updatedAt: null });
  }
}
