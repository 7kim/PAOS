import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

const SETTINGS_PATH = join(MEMORY_DIR, "config", "visual-settings.json");

const DEFAULTS = {
  backgroundType: "dots",
  backgroundOpacity: 0.03,
  backgroundColor: "#0a0a0a",
  connectorShape: "smoothstep",
  connectorThickness: 2,
  connectorColor: "#f0b90b",
  edgeAnimation: true,
  showGrid: true,
  showMinimap: true,
  zoom: 1,
  dagHeight: 300,
  phaseCardWidth: 100,
  phaseCardHeight: 0,
};

export async function GET() {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf-8").catch(() => "{}");
    const settings = { ...DEFAULTS, ...JSON.parse(raw) };
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: DEFAULTS });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const dir = join(MEMORY_DIR, "config");
    await writeFile(SETTINGS_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true, settings: body });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
