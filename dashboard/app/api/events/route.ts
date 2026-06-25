import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, readdir, stat } from "fs/promises";
import { join } from "path";

import { PIPELINES_DIR, PROJECTS_DIR } from "@/lib/global-config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project") || "";

  // If no project specified, fetch ALL project events
  if (!project) {
    const allEvents: Record<string, string> = {};
    const projects = new Set<string>();

    // Scan pipelines dir
    try {
      const pipelineDirs = await readdir(PIPELINES_DIR);
      for (const d of pipelineDirs) {
        if (d.startsWith(".")) continue;
        projects.add(d);
      }
    } catch { /* ignore */ }

    // Scan projects dir
    try {
      const projectDirs = await readdir(PROJECTS_DIR);
      for (const d of projectDirs) {
        if (d.startsWith(".")) continue;
        projects.add(d);
      }
    } catch { /* ignore */ }

    for (const p of projects) {
      const eventsPath = join(PIPELINES_DIR, p, "events.md");
      try {
        await stat(eventsPath);
        const content = await readFile(eventsPath, "utf-8");
        allEvents[p] = content;
      } catch {
        allEvents[p] = "# Events — " + p + "\n\n| Timestamp | Agent | Action | Description |\n|-----------|-------|--------|-------------|\n";
      }
    }

    return NextResponse.json({ projects: allEvents });
  }

  // Single project mode
  let eventsPath = join(PROJECTS_DIR, project, "events.md");
  try {
    await stat(eventsPath);
  } catch {
    eventsPath = join(PIPELINES_DIR, project, "events.md");
  }

  try {
    const content = await readFile(eventsPath, "utf-8");
    return NextResponse.json({ project, content });
  } catch {
    const defaultContent = [
      `# Events — ${project}`,
      ``,
      `| Timestamp | Agent | Action | Description |`,
      `|-----------|-------|--------|-------------|`,
      `| ${new Date().toISOString()} | system | INIT | Project "${project}" created |`,
      ``,
    ].join("\n");

    await mkdir(join(PIPELINES_DIR, project), { recursive: true }).catch(() => {});
    await writeFile(eventsPath, defaultContent, "utf-8");

    return NextResponse.json({ project, content: defaultContent, created: true });
  }
}

export async function POST(req: Request) {
  try {
    const { project, entry } = await req.json();
    if (!project || !entry) {
      return NextResponse.json({ error: "project and entry are required" }, { status: 400 });
    }

    let eventsPath = join(PROJECTS_DIR, project, "events.md");
    try {
      await stat(eventsPath);
    } catch {
      eventsPath = join(PIPELINES_DIR, project, "events.md");
    }

    let content = "";
    try {
      content = await readFile(eventsPath, "utf-8");
    } catch {
      content = [
        `# Events — ${project}`,
        ``,
        `| Timestamp | Agent | Action | Description |`,
        `|-----------|-------|--------|-------------|`,
      ].join("\n") + "\n";
      await mkdir(join(PIPELINES_DIR, project), { recursive: true }).catch(() => {});
    }

    const line = `| ${entry.timestamp || new Date().toISOString()} | ${entry.agent} | ${entry.action} | ${entry.description} |`;
    await writeFile(eventsPath, content.trimEnd() + "\n" + line + "\n", "utf-8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
