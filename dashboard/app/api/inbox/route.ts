import { NextResponse } from "next/server";
import { readdir, readFile, stat, unlink, rm, appendFile } from "fs/promises";
import { join } from "path";

import { MEMORY_DIR, PROJECTS_DIR } from "@/lib/global-config";

async function readInbox(baseDir: string, agentFilter?: string): Promise<{ messages: any[]; dirs: string[] }> {
  const allEntries = await readdir(baseDir).catch(() => []);
  const agentDirs: string[] = [];
  for (const entry of allEntries) {
    const s = await stat(join(baseDir, entry)).catch(() => null);
    if (s?.isDirectory()) agentDirs.push(entry);
  }

  const targetDirs = agentFilter ? [agentFilter] : agentDirs;
  const messages = await Promise.all(
    targetDirs.map(async (dir) => {
      const dirPath = join(baseDir, dir);
      const files = await readdir(dirPath).catch(() => []);
      const mdFiles = files.filter((f) => f.endsWith(".md")).sort().reverse();

      return Promise.all(
        mdFiles.map(async (f) => {
          const raw = await readFile(join(dirPath, f), "utf-8");
          const lines = raw.split("\n");

          // Parse YAML frontmatter (between --- markers)
          let from = "unknown";
          let to = "";
          let timestamp = "";
          let subject = "";
          let bodyStart = 0;

          if (lines[0]?.trim() === "---") {
            const endIdx = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
            if (endIdx > 0) {
              const fm = lines.slice(1, endIdx);
              for (const line of fm) {
                const colonIdx = line.indexOf(":");
                if (colonIdx > 0) {
                  const key = line.slice(0, colonIdx).trim().toLowerCase();
                  const val = line.slice(colonIdx + 1).trim();
                  if (key === "from") from = val;
                  else if (key === "to") to = val;
                  else if (key === "timestamp") timestamp = val;
                  else if (key === "subject") subject = val;
                }
              }
              bodyStart = endIdx + 1;
            }
          }

          // Fallback to markdown-style **key**: if frontmatter didn't give us these
          if (from === "unknown") {
            const fromLine = lines.find((l) => l.toLowerCase().startsWith("**from**:"));
            if (fromLine) from = fromLine.split(":")[1]?.trim() ?? "unknown";
          }
          if (!timestamp) {
            const tsLine = lines.find((l) => l.toLowerCase().startsWith("**timestamp**:"));
            if (tsLine) timestamp = tsLine.replace("**Timestamp**:", "").trim();
          }
          if (!subject) {
            const subjLine = lines.find((l) => l.toLowerCase().startsWith("**subject**:"));
            if (subjLine) subject = subjLine.split(":")[1]?.trim() ?? "";
          }

          const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim() ?? f;
          const body = lines
            .slice(bodyStart)
            .filter((l) => !l.startsWith("#") && !l.startsWith("**"))
            .join("\n")
            .trim();

          return {
            id: f,
            inbox: dir,
            title: subject || title,
            from,
            to,
            timestamp: timestamp || "",
            body,
            source: "global",
          };
        })
      );
    })
  );

  return { messages: messages.flat(), dirs: agentDirs };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get("agent") || undefined;
  const project = searchParams.get("project") || "";

  // When a project is active, return BOTH global inbox + project inbox merged
  if (project) {
    // Global inbox
    const globalInbox = await readInbox(join(MEMORY_DIR, "inbox"), agent);
    globalInbox.messages.forEach((m) => (m.source = "global"));

    // Project inbox
    let projectInboxBase = join(PROJECTS_DIR, project, "inbox");
    try {
      await stat(projectInboxBase);
    } catch {
      projectInboxBase = join(MEMORY_DIR, "pipelines", project, "inbox");
    }
    const projectInbox = await readInbox(projectInboxBase, agent);
    projectInbox.messages.forEach((m) => (m.source = `project:${project}`));

    // Merge: global first, then project
    const merged = [...globalInbox.messages, ...projectInbox.messages];
    // Sort by timestamp descending (newest first)
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    // Collect unique inbox dirs from both
    const allDirs = [...new Set([...globalInbox.dirs, ...projectInbox.dirs])];

    return NextResponse.json({
      messages: merged,
      inboxes: allDirs,
      project,
    });
  }

  // No project — global inbox only
  const globalInbox = await readInbox(join(MEMORY_DIR, "inbox"), agent);
  // Sort by timestamp descending
  globalInbox.messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return NextResponse.json({
    messages: globalInbox.messages,
    inboxes: globalInbox.dirs,
    project: "global",
  });
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id") || "";
    let inbox = searchParams.get("inbox") || searchParams.get("agent") || "";
    let project = searchParams.get("project") || "";
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id || body.filename || "";
      inbox = body.inbox || body.agent || inbox;
      project = body.project || project;
    }
    if (!id || !inbox) return NextResponse.json({ error: "id and inbox required (?id=<file>&inbox=<agent>)" }, { status: 400 });
    // guard path traversal
    if (id.includes("..") || inbox.includes("..") || id.includes("/")) id = id.split("/").pop() || id;
    let baseDir = join(MEMORY_DIR, "inbox", inbox);
    if (project) {
      let pBase = join(PROJECTS_DIR, project, "inbox", inbox);
      try { await stat(pBase); baseDir = pBase; } catch { baseDir = join(MEMORY_DIR, "pipelines", project, "inbox", inbox); }
    }
    const target = join(baseDir, id);
    await unlink(target);
    // audit ledger (dual-log minimal)
    try {
      const ts = new Date().toISOString();
      await appendFile(join(MEMORY_DIR, "global_ledger.md"), `\n| ${ts} | dashboard | DELETE | ${target.replace(process.env.HOME || "/home/dev", "~")} | Inbox message deleted via dashboard | - | - |\n`, "utf-8");
    } catch { /* ignore */ }
    return NextResponse.json({ ok: true, id, inbox });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
