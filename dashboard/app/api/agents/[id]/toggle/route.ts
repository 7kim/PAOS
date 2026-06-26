import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const REGISTRY_PATH = join(process.env.HOME || "/home/dev", "AI_Workflow", "agents", "registry.json");

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const raw = await readFile(REGISTRY_PATH, "utf-8");
    const registry = JSON.parse(raw);
    const agent = registry.agents?.find((a: any) => a.id === id);
    if (!agent) {
      return NextResponse.json({ error: `Agent "${id}" not found in registry` }, { status: 404 });
    }
    agent.enabled = !agent.enabled;
    await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2));
    return NextResponse.json({ ok: true, id, enabled: agent.enabled });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
