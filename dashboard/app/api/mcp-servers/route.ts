import { NextResponse } from "next/server";
import { readFile, writeFile, rename, copyFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { MEMORY_DIR } from "@/lib/global-config";

const MCP_PATH = join(MEMORY_DIR, "..", "mcp", "mcp-config.json");

function normalizeServer(s: any) {
  if (!s || typeof s !== "object") return s;
  // normalize enabled/disabled to single enabled flag
  if (s.disabled === true) { s.enabled = false; delete s.disabled; }
  if (s.enabled === undefined && s.disabled === undefined) s.enabled = true;
  return s;
}

export async function GET() {
  try {
    const mcpConfig = await readFile(MCP_PATH, "utf-8");
    const config = JSON.parse(mcpConfig);
    const servers: any[] = [];
    if (config.mcpServers) {
      for (const [name, server] of Object.entries(config.mcpServers as Record<string, any>)) {
        const s = normalizeServer({ ...server });
        const isHttp = s.type === "http" || !!s.url;
        servers.push({
          name,
          description: isHttp ? `HTTP: ${s.url || ""}` : `Command: ${s.command || ""} ${(s.args || []).join(" ").slice(0,80)}`,
          enabled: s.enabled !== false,
          raw: s,
        });
      }
    }
    return NextResponse.json({ servers });
  } catch {
    return NextResponse.json({
      servers: [
        { name: "context7", description: "Library documentation search", enabled: true, raw: {} },
        { name: "shared-memory", description: "PAOS shared agent memory", enabled: true, raw: {} },
      ],
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || body.id || "").trim();
    const server = body.server ?? body.config ?? body.value;
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
    if (!server || typeof server !== "object") return NextResponse.json({ error: "server config object required" }, { status: 400 });

    // Validate: must have command or url/type http
    const hasCommand = !!server.command;
    const hasUrl = !!server.url || server.type === "http";
    if (!hasCommand && !hasUrl) return NextResponse.json({ error: "server must have command or url" }, { status: 400 });

    const raw = await readFile(MCP_PATH, "utf-8").catch(() => '{"mcpServers":{}}');
    const config = JSON.parse(raw);
    if (!config.mcpServers) config.mcpServers = {};

    // backup
    try { await copyFile(MCP_PATH, MCP_PATH + ".bak"); } catch { /* ignore */ }
    config.mcpServers[name] = normalizeServer(server);
    const tmp = MCP_PATH + ".tmp";
    await writeFile(tmp, JSON.stringify(config, null, 2) + "\n", "utf-8");
    await rename(tmp, MCP_PATH);
    return NextResponse.json({ ok: true, name });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id") || url.searchParams.get("name") || "";
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = (body.id || body.name || "").trim();
    }
    id = id.trim();
    if (!id) return NextResponse.json({ error: "id required (?id= or {id})" }, { status: 400 });
    const raw = await readFile(MCP_PATH, "utf-8").catch(() => '{"mcpServers":{}}');
    const config = JSON.parse(raw);
    if (!config.mcpServers || !config.mcpServers[id]) return NextResponse.json({ error: `server ${id} not found` }, { status: 404 });
    try { await copyFile(MCP_PATH, MCP_PATH + ".bak"); } catch { /* ignore */ }
    delete config.mcpServers[id];
    const tmp = MCP_PATH + ".tmp";
    await writeFile(tmp, JSON.stringify(config, null, 2) + "\n", "utf-8");
    await rename(tmp, MCP_PATH);
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
