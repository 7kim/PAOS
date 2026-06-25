import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

const PREFS_PATH = join(MEMORY_DIR, "config", "preferences.json");

const DEFAULTS = {
  defaultProject: "PAOS",
  defaultAgent: "hermes-nous",
  theme: "dark",
  defaultView: "pipeline",
  pipelinePageSize: 10,
  autoSave: true,
};

export async function GET() {
  try {
    const raw = await readFile(PREFS_PATH, "utf-8").catch(() => "{}");
    const prefs = { ...DEFAULTS, ...JSON.parse(raw) };
    return NextResponse.json({ preferences: prefs });
  } catch {
    return NextResponse.json({ preferences: DEFAULTS });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    // Merge: don't replace all, only update provided keys
    const raw = await readFile(PREFS_PATH, "utf-8").catch(() => "{}");
    const current = JSON.parse(raw);
    const merged = { ...current, ...body };
    const dir = join(MEMORY_DIR, "config");
    await writeFile(PREFS_PATH, JSON.stringify(merged, null, 2), "utf-8");
    return NextResponse.json({ ok: true, preferences: merged });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
