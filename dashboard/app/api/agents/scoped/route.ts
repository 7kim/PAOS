import { NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

import { WORKSPACES_DIR, HOME_DIR } from "@/lib/global-config";
const HOME = HOME_DIR;

const GIT_IDENTITIES: Record<string, { name: string; role: string }> = {
  "opencode-developer": { name: "OpenCode Developer", role: "executor" },
  "hermes-nous": { name: "Hermes Agent", role: "orchestrator" },
  architect: { name: "Architect", role: "reviewer" },
  coordinator: { name: "Coordinator", role: "coordinator" },
  claude: { name: "Claude", role: "developer" },
};

export async function POST(req: Request) {
  try {
    const { project } = await req.json();
    if (!project || typeof project !== "string" || !/^[a-zA-Z0-9_-]+$/.test(project)) {
      return NextResponse.json({ error: "Invalid project name" }, { status: 400 });
    }

    const wsPath = join(WORKSPACES_DIR, `${project}.code-workspace`);
    let workspace: Record<string, unknown> = {};
    try {
      workspace = JSON.parse(await readFile(wsPath, "utf-8"));
    } catch {
      return NextResponse.json({ error: `Workspace "${project}" not found` }, { status: 404 });
    }

    const gitIdentities: Record<string, { name: string; email: string }> = {};
    for (const [agentId, config] of Object.entries(GIT_IDENTITIES)) {
      gitIdentities[agentId] = {
        name: `${project}_${config.name}`,
        email: `${agentId}+${project}@paos.com`,
      };
    }

    // Update workspace file with git identity overrides
    const paosSettings = (workspace.settings as Record<string, unknown>)?.paos as Record<string, unknown> || {};
    paosSettings.gitIdentities = gitIdentities;
    paosSettings.identitiesCreatedAt = new Date().toISOString();

    if (!workspace.settings) workspace.settings = {};
    (workspace.settings as Record<string, unknown>).paos = paosSettings;

    await writeFile(wsPath, JSON.stringify(workspace, null, 2));

    return NextResponse.json({
      ok: true,
      project,
      gitIdentities: Object.keys(gitIdentities).length,
      note: "Agents remain global. Git commit identities are now scoped to this project.",
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const files = await readdir(WORKSPACES_DIR).catch(() => []);
    const wsFiles = files.filter((f) => f.endsWith(".code-workspace"));

    const results: { project: string; agents: string[] }[] = [];

    for (const f of wsFiles) {
      const project = f.replace(/\.code-workspace$/, "");
      try {
        const raw = await readFile(join(WORKSPACES_DIR, f), "utf-8");
        const ws = JSON.parse(raw);
        const paos = (ws.settings as Record<string, unknown>)?.paos as Record<string, unknown> || {};
        const identities = paos.gitIdentities as Record<string, unknown> | undefined;
        if (identities && Object.keys(identities).length > 0) {
          results.push({ project, agents: Object.keys(identities).map((k) => `${project}_${k}`) });
        }
      } catch { /* skip */ }
    }

    return NextResponse.json({ scopedProjects: results });
  } catch (e) {
    return NextResponse.json({ scopedProjects: [], error: String(e) });
  }
}
