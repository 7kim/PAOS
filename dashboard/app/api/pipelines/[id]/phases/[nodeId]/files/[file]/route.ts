import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; nodeId: string; file: string }> }
) {
  const { id, nodeId, file } = await params;
  const filePath = join(MEMORY_DIR, "pipelines", id, "phases", nodeId, file);

  // Security: prevent path traversal
  const resolved = filePath.replace(/\\/g, "/");
  if (resolved.includes("..") || resolved.includes("~")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const content = await readFile(filePath, "utf-8");
    return NextResponse.json({ content, file, nodeId, pipelineId: id });
  } catch {
    return NextResponse.json({ error: `File ${file} not found in phase ${nodeId}` }, { status: 404 });
  }
}
