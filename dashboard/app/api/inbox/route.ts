import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

const HOME = process.env.HOME || "/home/dev";
const MEMORY_DIR = join(HOME, "AI_Workflow", "memory");
const PROJECTS_DIR = join(HOME, "AI_Workflow", "projects");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get("agent");
  const project = searchParams.get("project");

  // Global or project-scoped inbox base
  // For projects: try projects/{name}/inbox/ first, fall back to memory/pipelines/{name}/inbox/
  const inboxBase = await (async () => {
    if (!project) return join(MEMORY_DIR, "inbox");
    const projectsInbox = join(PROJECTS_DIR, project, "inbox");
    try {
      await stat(projectsInbox);
      return projectsInbox;
    } catch {
      return join(MEMORY_DIR, "pipelines", project, "inbox");
    }
  })();

  try {
    const allEntries = await readdir(inboxBase).catch(() => []);
    const agentDirs: string[] = [];
    for (const entry of allEntries) {
      const s = await stat(join(inboxBase, entry)).catch(() => null);
      if (s?.isDirectory()) agentDirs.push(entry);
    }

    const targetDirs = agent ? [agent] : agentDirs;

    const messages = await Promise.all(
      targetDirs.map(async (dir) => {
        const dirPath = join(inboxBase, dir);
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

    return NextResponse.json({
      messages: messages.flat(),
      inboxes: agentDirs,
      project: project || "global",
    });
  } catch {
    return NextResponse.json({ messages: [], inboxes: [], project: project || "global" });
  }
}
