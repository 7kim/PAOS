import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) {
  const { id, nodeId } = await params;
  const dir = join(MEMORY_DIR, "pipelines", id, "phases", nodeId);

  // Try to read output.log
  const logPath = join(dir, "output.log");
  let log = "";
  try {
    log = await readFile(logPath, "utf-8");
    // Truncate to last 50KB
    if (log.length > 50000) log = "... [truncated]\n" + log.slice(-50000);
  } catch {
    log = "# No output log found\n";
  }

  // List all files in the phase directory
  let files: string[] = [];
  try {
    files = await readdir(dir);
    files = files.filter(f => f !== "output.log");
  } catch { /* empty */ }

  return NextResponse.json({ log, files, nodeId, pipelineId: id });
}
