import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get("agent");

  try {
    const inboxDir = join(MEMORY_DIR, "inbox");
    const allEntries = await readdir(inboxDir).catch(() => []);
    // Filter to actual directories only (exclude stray .md files)
    const agentDirs: string[] = [];
    for (const entry of allEntries) {
      const s = await stat(join(inboxDir, entry)).catch(() => null);
      if (s?.isDirectory()) agentDirs.push(entry);
    }

    const targetDirs = agent ? [agent] : agentDirs;

    const messages = await Promise.all(
      targetDirs.map(async (dir) => {
        const dirPath = join(inboxDir, dir);
        const files = await readdir(dirPath).catch(() => []);
        const mdFiles = files.filter((f) => f.endsWith(".md")).sort().reverse();

        return Promise.all(
          mdFiles.map(async (f) => {
            const raw = await readFile(join(dirPath, f), "utf-8");
            const lines = raw.split("\n");
            const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim() ?? f;
            const fromLine = lines.find((l) => l.toLowerCase().startsWith("**from**:"));
            const tsLine = lines.find((l) => l.toLowerCase().startsWith("**timestamp**:"));
            const body = lines
              .filter((l) => !l.startsWith("#") && !l.startsWith("**From**") && !l.startsWith("**Timestamp**"))
              .join("\n")
              .trim();

            return {
              id: f,
              inbox: dir,
              title,
              from: fromLine?.split(":")[1]?.trim() ?? "unknown",
              timestamp: tsLine?.replace("**Timestamp**:", "").trim() ?? "",
              body,
            };
          })
        );
      })
    );

    return NextResponse.json({ messages: messages.flat(), inboxes: agentDirs });
  } catch {
    return NextResponse.json({ messages: [], inboxes: [] });
  }
}
