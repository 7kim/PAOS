import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dir = join(PIPELINES_DIR, id);

  try {
    const body = await _req.json();
    const phaseNum = body?.phase ?? 0;
    const phaseLabel = body?.label ?? `Phase ${phaseNum}`;

    // Create INTERVENE.md file in the pipeline directory
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

    // Add INTERVENE.md to the phase's artifacts in META.json
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
