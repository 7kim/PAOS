import { NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";

import { PIPELINES_DIR } from "@/lib/global-config";

async function findPipelineDir(id: string): Promise<string> {
  const { readdir } = await import("fs/promises");
  // Try flat path first (legacy)
  const flat = join(PIPELINES_DIR, id);
  try {
    await readFile(join(flat, "META.json"), "utf-8");
    return flat;
  } catch { /* try project-scoped */ }

  const projects = await readdir(PIPELINES_DIR).catch(() => [] as string[]);
  for (const project of projects) {
    if (project.startsWith(".")) continue;
    const candidate = join(PIPELINES_DIR, project, id);
    try {
      await readFile(join(candidate, "META.json"), "utf-8");
      return candidate;
    } catch { /* not this project */ }
  }
  return "";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dir = await findPipelineDir(id);
  if (!dir) {
    return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
  }

  try {
    const content = await readFile(join(dir, "INTERVENE.md"), "utf-8");
    return NextResponse.json({ content, pipeline: id });
  } catch {
    return NextResponse.json({ error: "No intervene note found" }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }

  const dir = await findPipelineDir(id);
  if (!dir) {
    return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
  }

  await writeFile(join(dir, "INTERVENE.md"), content, "utf-8");
  return NextResponse.json({ ok: true, pipeline: id });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dir = await findPipelineDir(id);
  if (!dir) {
    return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
  }

  try {
    await unlink(join(dir, "INTERVENE.md"));
    // Remove from META.json artifacts
    const metaRaw = await readFile(join(dir, "META.json"), "utf-8").catch(() => "{}");
    const meta = JSON.parse(metaRaw) as Record<string, unknown>;
    const phases = (meta.phases as Record<string, unknown>[]) ?? [];
    for (const phase of phases) {
      const artifacts = (phase.artifacts as string[]) ?? [];
      phase.artifacts = artifacts.filter((a: string) => a !== "INTERVENE.md");
      if (phase.status === "paused") phase.status = "pending";
    }
    meta.status = "submitted";
    meta.error = undefined;
    await writeFile(join(dir, "META.json"), JSON.stringify(meta, null, 2), "utf-8");

    // Reset pipeline.json
    const pjRaw = await readFile(join(dir, "pipeline.json"), "utf-8").catch(() => "{}");
    const pj = JSON.parse(pjRaw) as Record<string, unknown>;
    pj.status = "submitted";
    pj.currentTask = "";
    pj.error = undefined;
    pj.updatedAt = new Date().toISOString();
    await writeFile(join(dir, "pipeline.json"), JSON.stringify(pj, null, 2), "utf-8");

    return NextResponse.json({ ok: true, pipeline: id, message: "Intervention cancelled, pipeline reset to submitted" });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dir = await findPipelineDir(id);
  if (!dir) {
    return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
  }

  try {
    const body = await req.json();
    const phaseNum = body?.phase ?? 0;
    const phaseLabel = body?.label ?? `Phase ${phaseNum}`;

    const interveneContent = [
      `# Intervention Note — ${phaseLabel}`,
      "",
      `**Pipeline**: ${id}`,
      `**Phase**: ${phaseNum} — ${phaseLabel}`,
      `**Intervened at**: ${new Date().toISOString()}`,
      "",
      "## Reason for Intervention",
      "",
      "*(Write your reason here)*",
      "",
      "## Changes Made",
      "",
      "*(Describe what you changed)*",
      "",
      "## Next Step",
      "",
      "Click the arrow (↓) below this phase to advance when ready.",
      "",
    ].join("\n");

    await writeFile(join(dir, "INTERVENE.md"), interveneContent);

    // Update pipeline.json to show paused
    const pjPath = join(dir, "pipeline.json");
    const pjRaw = await readFile(pjPath, "utf-8").catch(() => "{}");
    const pj = JSON.parse(pjRaw) as Record<string, unknown>;
    pj.status = "paused";
    pj.currentTask = `User intervened at phase ${phaseNum} (${phaseLabel}). Edit INTERVENE.md in pipeline directory, then click arrow to resume.`;
    pj.updatedAt = new Date().toISOString();
    await writeFile(pjPath, JSON.stringify(pj, null, 2));

    // Add INTERVENE.md to META.json phase artifacts
    const metaPath = join(dir, "META.json");
    const metaRaw = await readFile(metaPath, "utf-8").catch(() => "{}");
    const meta = JSON.parse(metaRaw) as Record<string, unknown>;
    const phases = (meta.phases as Record<string, unknown>[]) ?? [];
    const targetPhase = phases[phaseNum - 1];
    if (targetPhase) {
      const artifacts = (targetPhase.artifacts as string[]) ?? [];
      if (!artifacts.includes("INTERVENE.md")) {
        artifacts.push("INTERVENE.md");
      }
      targetPhase.artifacts = artifacts;
      targetPhase.status = "paused";
    }
    meta.status = "paused";
    await writeFile(metaPath, JSON.stringify(meta, null, 2));

    return NextResponse.json({
      ok: true,
      pipeline: id,
      status: "paused",
      message: `INTERVENE.md created at phase ${phaseNum}. Edit the file, then click the arrow to resume.`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
