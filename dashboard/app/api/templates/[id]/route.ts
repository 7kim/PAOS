import { NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";

const TEMPLATES_DIR = "/home/dev/AI_Workflow/config/templates";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const content = await readFile(join(TEMPLATES_DIR, `${id}.json`), "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const existing = JSON.parse(await readFile(join(TEMPLATES_DIR, `${id}.json`), "utf-8"));
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await writeFile(join(TEMPLATES_DIR, `${id}.json`), JSON.stringify(updated, null, 2));
    return NextResponse.json({ ok: true, template: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await unlink(join(TEMPLATES_DIR, `${id}.json`));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
}
