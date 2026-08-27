import { NextResponse } from "next/server";
import { readFile, writeFile, stat, readdir, rm, mkdir, copyFile } from "fs/promises";
import { join, resolve, relative } from "path";

const HOME = process.env.HOME || "/home/dev";
const REPO_ROOT = join(HOME, "AI_Workflow");
const REGISTRY_PATH = join(REPO_ROOT, "agents", "registry.json");

// guard: path must resolve inside REPO_ROOT and not escape
function safePath(p: string): string | null {
  if (!p) return null;
  if (p.includes("\0")) return null;
  const abs = resolve(REPO_ROOT, p);
  const rel = relative(REPO_ROOT, abs);
  if (rel.startsWith("..") || abs === REPO_ROOT) return null;
  // allow only certain roots
  const allowedPrefixes = ["agents/", "config/", "memory/inbox/", "logs/", "skills/", "mcp/", "knowledge/"];
  if (!allowedPrefixes.some((pre) => rel.startsWith(pre)) && !rel.startsWith("agents/")) {
    // also allow exact files like config/xxx
    if (!rel.startsWith("config/") && !rel.startsWith("agents/") && !rel.startsWith("skills/")) return null;
  }
  return abs;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(_req.url);
  const qPath = url.searchParams.get("path") || url.searchParams.get("file") || "";

  // If no path, list files for this agent from registry
  if (!qPath) {
    try {
      const regRaw = await readFile(REGISTRY_PATH, "utf-8");
      const reg = JSON.parse(regRaw);
      const agent = (reg.agents || []).find((a: any) => a.id === id || (a.aliases || []).includes(id));
      if (!agent) return NextResponse.json({ error: `agent ${id} not found` }, { status: 404 });
      const files: any[] = [];
      // configPaths
      for (const p of agent.configPaths || []) {
        const abs = safePath(p);
        if (!abs) continue;
        try {
          const s = await stat(abs);
          files.push({ path: p, exists: true, isDir: s.isDirectory(), size: s.isDirectory() ? 0 : s.size, binary: agent.binary, app: agent.label || agent.id, role: agent.role });
        } catch {
          files.push({ path: p, exists: false, isDir: false, size: 0, binary: agent.binary, app: agent.label || agent.id, role: agent.role });
        }
      }
      // also list agents/<id> dir contents
      const agentDir = join(REPO_ROOT, "agents", id);
      try {
        const entries = await readdir(agentDir);
        for (const e of entries) {
          const rel = join("agents", id, e);
          const abs = join(agentDir, e);
          try {
            const s = await stat(abs);
            if (!files.some((f) => f.path === rel)) {
              files.push({ path: rel, exists: true, isDir: s.isDirectory(), size: s.size, binary: agent.binary, app: agent.label || agent.id, role: agent.role });
            }
          } catch { /* ignore */ }
        }
      } catch { /* no agent dir */ }
      // inbox + log
      for (const p of [agent.inbox, agent.log].filter(Boolean)) {
        const abs = safePath(p as string);
        if (!abs) continue;
        try { const s = await stat(abs); files.push({ path: p as string, exists: true, isDir: s.isDirectory(), size: s.isDirectory() ? 0 : s.size, binary: agent.binary, app: agent.label || agent.id, role: agent.role }); } catch { files.push({ path: p as string, exists: false, isDir: false, size: 0, binary: agent.binary, app: agent.label || agent.id, role: agent.role }); }
      }
      return NextResponse.json({ id, files, binary: agent.binary, label: agent.label, role: agent.role });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  // Read single file content
  const abs = safePath(qPath);
  if (!abs) return NextResponse.json({ error: "invalid path (must be inside AI_Workflow and under allowed roots)" }, { status: 400 });
  try {
    const content = await readFile(abs, "utf-8");
    const s = await stat(abs);
    return NextResponse.json({ path: qPath, content, size: s.size });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const p = (body.path || body.file || "").trim();
    const content = body.content ?? body.value ?? "";
    if (!p) return NextResponse.json({ error: "path required" }, { status: 400 });
    const abs = safePath(p);
    if (!abs) return NextResponse.json({ error: "invalid path" }, { status: 400 });
    // backup
    try { await copyFile(abs, abs + ".bak"); } catch { /* no existing */ }
    await mkdir(join(abs, ".."), { recursive: true });
    await writeFile(abs, content, "utf-8");
    return NextResponse.json({ ok: true, path: p });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const qPath = url.searchParams.get("path") || url.searchParams.get("file") || "";
  let bodyPath = "";
  try { const b = await req.json().catch(() => ({})); bodyPath = b.path || b.file || ""; } catch { /* ignore */ }
  const targetPath = (qPath || bodyPath).trim();

  // If path given, delete just that file (must belong to agent or allowed)
  if (targetPath) {
    const abs = safePath(targetPath);
    if (!abs) return NextResponse.json({ error: "invalid path" }, { status: 400 });
    try {
      await copyFile(abs, abs + ".bak").catch(() => {});
      await rm(abs, { force: true });
      return NextResponse.json({ ok: true, path: targetPath });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  // No path => delete whole agent: rm agents/<id>/ + remove from registry + optionally inbox/log
  const full = url.searchParams.get("full") !== "false"; // default full delete
  try {
    const regRaw = await readFile(REGISTRY_PATH, "utf-8");
    const reg = JSON.parse(regRaw);
    const idx = (reg.agents || []).findIndex((a: any) => a.id === id || (a.aliases || []).includes(id));
    if (idx === -1) return NextResponse.json({ error: `agent ${id} not found in registry` }, { status: 404 });
    const agent = reg.agents[idx];
    // backup registry
    try { await copyFile(REGISTRY_PATH, REGISTRY_PATH + ".bak"); } catch { /* ignore */ }
    // remove agent dir
    const agentDir = join(REPO_ROOT, "agents", id);
    await rm(agentDir, { recursive: true, force: true }).catch(() => {});
    // also try alias dirs
    for (const alias of agent.aliases || []) {
      await rm(join(REPO_ROOT, "agents", alias), { recursive: true, force: true }).catch(() => {});
    }
    // remove inbox/log if requested (default full)
    if (full) {
      for (const p of [agent.inbox, agent.log].filter(Boolean)) {
        const abs = safePath(p as string);
        if (!abs) continue;
        await rm(abs, { recursive: true, force: true }).catch(() => {});
      }
    }
    // remove from registry
    reg.agents.splice(idx, 1);
    await writeFile(REGISTRY_PATH, JSON.stringify(reg, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true, id, deleted: agent.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
