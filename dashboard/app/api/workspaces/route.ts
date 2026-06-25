import { NextResponse } from "next/server";
import { readdir, readFile, writeFile, rm, stat, mkdir, symlink } from "fs/promises";
import { join } from "path";

import { WORKSPACES_DIR, PIPELINES_DIR, PROJECTS_DIR } from "@/lib/global-config";

interface PaosSettings {
  version: number;
  project: string;
  createdAt: string;
  pipelinesDir: string;
  sourcePath?: string;
  importedAt?: string;
  integratedAt?: string;
  agents?: Record<string, string>;
  secrets?: { path?: string };
  vault?: { path?: string };
  analysis?: Record<string, unknown>;
}

function defaultWorkspace(name: string, sourcePath?: string): object {
  const now = new Date().toISOString();
  const workspace: Record<string, unknown> = {
    name,
    folders: sourcePath ? [{ path: sourcePath }] : [],
    settings: {
      paos: {
        version: 1,
        project: name,
        createdAt: now,
        pipelinesDir: `memory/pipelines/${name}`,
      } as PaosSettings,
    },
  };
  if (sourcePath) {
    (workspace.settings as Record<string, unknown>).paos = {
      ...(workspace.settings as Record<string, unknown>).paos as PaosSettings,
      sourcePath,
      importedAt: now,
    };
  }
  return workspace;
}

export async function GET() {
  try {
    await mkdir(WORKSPACES_DIR, { recursive: true }).catch(() => {});
    const files = await readdir(WORKSPACES_DIR).catch(() => []);
    const workspaceFiles = files.filter((f) => f.endsWith(".code-workspace"));

    const workspaces = await Promise.all(
      workspaceFiles.map(async (f) => {
        const name = f.replace(/\.code-workspace$/, "");
        let meta: Record<string, unknown> = {};
        try {
          const raw = await readFile(join(WORKSPACES_DIR, f), "utf-8");
          meta = JSON.parse(raw);
        } catch { /* parse error */ }

        // Count pipelines for this project
        const paos = (meta.settings as Record<string, unknown>)?.paos as Record<string, unknown> | undefined;
        const projectName = (paos?.project as string) || name;
        const projectPipelinesDir = join(PIPELINES_DIR, projectName);
        let pipelineCount = 0;
        try {
          const dirs = await readdir(projectPipelinesDir);
          pipelineCount = dirs.filter((d) => d.startsWith("PIPE-") || d.startsWith("AI_Workflow-PIPE") || d.startsWith("TEST-PIPE")).length;
        } catch { /* no pipelines dir */ }

        return {
          name,
          displayName: meta.name || name,
          sourcePath: paos?.sourcePath as string | undefined,
          pipelineCount,
          pipelinePath: `projects/${projectName}`,
          createdAt: paos?.createdAt as string || "",
          integratedAt: paos?.integratedAt as string | undefined,
          folders: meta.folders || [],
        };
      })
    );

    workspaces.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return NextResponse.json({ workspaces });
  } catch (e) {
    return NextResponse.json({ workspaces: [], error: String(e) });
  }
}

export async function POST(req: Request) {
  try {
    const { name, sourcePath, source, gitUrl } = await req.json();
    if (!name || typeof name !== "string" || !/^[a-zA-Z0-9_-]+$/.test(name)) {
      return NextResponse.json({ error: "Invalid project name. Use letters, numbers, hyphens, underscores." }, { status: 400 });
    }

    await mkdir(WORKSPACES_DIR, { recursive: true });
    const filePath = join(WORKSPACES_DIR, `${name}.code-workspace`);

    const exists = await stat(filePath).then(() => true).catch(() => false);
    if (exists) {
      return NextResponse.json({ error: `Workspace "${name}" already exists` }, { status: 409 });
    }

    let resolvedSourcePath = sourcePath;

    // GitHub import: git clone into projects/{name}/ directly
    if (source === "github") {
      if (!gitUrl) {
        return NextResponse.json({ error: "gitUrl is required for GitHub imports" }, { status: 400 });
      }
      // Ensure parent dir exists
      await mkdir(PROJECTS_DIR, { recursive: true });
      const cloneTarget = join(PROJECTS_DIR, name);
      // Remove partial leftovers from previous failed attempts
      try { await rm(cloneTarget, { recursive: true, force: true }); } catch {}
      const { execSync } = require("child_process");
      try {
        execSync(`git clone "${gitUrl}" "${cloneTarget}"`, { stdio: "pipe", timeout: 120000 });
        // Re-create PAOS directories after clone (clone may have created a subdir)
        // If clone created projects/{name}/{repo-name}/, move contents up
        const entries = await readdir(cloneTarget).catch(() => []);
        if (entries.length === 1 && entries[0] !== "vault" && entries[0] !== "secrets") {
          // Likely cloned into a subdir: projects/{name}/{repo-name}/
          const subdir = join(cloneTarget, entries[0]);
          const subStat = await stat(subdir).catch(() => null);
          if (subStat?.isDirectory()) {
            // Move contents up
            for (const item of await readdir(subdir)) {
              try { await rm(join(cloneTarget, item), { force: true, recursive: true }); } catch {}
              try { await writeFile(join(cloneTarget, item), ""); } catch {}
            }
            const { execSync: exec } = require("child_process");
            exec(`shopt -s dotglob; mv "${subdir}"/* "${cloneTarget}/" 2>/dev/null; rmdir "${subdir}" 2>/dev/null`, { shell: true });
          }
        }
        resolvedSourcePath = cloneTarget;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `Git clone failed: ${msg.slice(0, 200)}` }, { status: 500 });
      }
    }

    const workspace = defaultWorkspace(name, resolvedSourcePath);

    // If local source path provided, validate it
    if (resolvedSourcePath && source !== "github") {
      const srcStat = await stat(resolvedSourcePath).catch(() => null);
      if (!srcStat?.isDirectory()) {
        return NextResponse.json({ error: `Source path does not exist: ${resolvedSourcePath}` }, { status: 400 });
      }
    }

    await writeFile(filePath, JSON.stringify(workspace, null, 2));

    // Also ensure the pipelines directory exists
    const pipelinesProjectDir = join(PIPELINES_DIR, name);
    await mkdir(pipelinesProjectDir, { recursive: true });

    // Create projects/ directory structure
    const projectDir = join(PROJECTS_DIR, name);
    await mkdir(projectDir, { recursive: true });

    // ── All project-scoped files go under projects/{name}/ ──────────────

    // Auto-create events.md
    const eventsPath = join(projectDir, "events.md");
    const eventsContent = [
      `# Events — ${name}`,
      ``,
      `| Timestamp | Agent | Action | Description |`,
      `|-----------|-------|--------|-------------|`,
      `| ${new Date().toISOString()} | system | INIT | Project "${name}" created |`,
      ``,
    ].join("\n");
    await writeFile(eventsPath, eventsContent, "utf-8");

    // Auto-create shared-context.md
    const contextPath = join(projectDir, "shared-context.md");
    const contextContent = [
      `# Shared Context — ${name}`,
      ``,
      `Project created: ${new Date().toISOString()}`,
      ``,
      `## Current State`,
      ``,
      `Project "${name}" initialized. No active pipelines.`,
      ``,
      `## Active Decisions`,
      ``,
      `-`,
      ``,
      `## Open Questions`,
      ``,
      `-`,
      ``,
    ].join("\n");
    await writeFile(contextPath, contextContent, "utf-8");

    // Auto-create handoff.md
    const handoffPath = join(projectDir, "handoff.md");
    const handoffContent = [
      `# Handoff — ${name}`,
      ``,
      `**Last updated**: ${new Date().toISOString()}`,
      ``,
      `## Active Task`,
      ``,
      `Project initialized. No active task.`,
      ``,
      `## What Was Done`,
      ``,
      `- Project "${name}" created`,
      ``,
      `## What Needs Doing`,
      ``,
      `- Configure project settings`,
      `- Set up pipelines as needed`,
      ``,
      `## Decisions`,
      ``,
      `-`,
      ``,
    ].join("\n");
    await writeFile(handoffPath, handoffContent, "utf-8");

    // Auto-create ledger.md
    const ledgerPath = join(projectDir, "ledger.md");
    const ledgerContent = [
      `# Ledger — ${name}`,
      ``,
      `| Timestamp | Agent | Action | Description |`,
      `|-----------|-------|--------|-------------|`,
      `| ${new Date().toISOString()} | system | INIT | Project "${name}" created |`,
      ``,
    ].join("\n");
    await writeFile(ledgerPath, ledgerContent, "utf-8");

    // Create inbox directory
    await mkdir(join(projectDir, "inbox"), { recursive: true });

    // ── Symlinks in memory/pipelines/{name}/ for backward compat ──────
    async function trySymlink(target: string, link: string) {
      try { await rm(link, { force: true, recursive: true }); } catch {}
      try { await symlink(target, link); } catch (e) { console.error("symlink error:", e); }
    }

    await trySymlink(eventsPath, join(pipelinesProjectDir, "events.md"));
    await trySymlink(contextPath, join(pipelinesProjectDir, "shared-context.md"));
    await trySymlink(handoffPath, join(pipelinesProjectDir, "handoff.md"));
    await trySymlink(ledgerPath, join(pipelinesProjectDir, "ledger.md"));
    await trySymlink(join(projectDir, "inbox"), join(pipelinesProjectDir, "inbox"));

    // Symlink: projects/{name}/pipelines -> ../../memory/pipelines/{name}/
    const pipelinesTarget = join(PIPELINES_DIR, name);
    const pipelinesSymlink = join(projectDir, "pipelines");
    trySymlink(pipelinesTarget, pipelinesSymlink);

    // Create vault + secrets dirs in projects/{name}/
    await mkdir(join(projectDir, "vault", "daily"), { recursive: true });
    await mkdir(join(projectDir, "vault", "chats"), { recursive: true });
    await mkdir(join(projectDir, "secrets"), { recursive: true });

    return NextResponse.json({ ok: true, name, path: `workspaces/${name}.code-workspace` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
