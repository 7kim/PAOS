import { access, readFile, readdir, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { delimiter, join, resolve } from "node:path";

export const REPO_ROOT = process.env.PAOS_ROOT || "/home/dev/AI_Workflow";
export const REGISTRY_PATH = join(REPO_ROOT, "agents", "registry.json");

export async function readRegistry() {
  const raw = await readFile(REGISTRY_PATH, "utf-8");
  return JSON.parse(raw);
}

export function resolveRepoPath(path) {
  return path.startsWith("/") ? path : join(REPO_ROOT, path);
}

export async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function findBinary(binary) {
  if (!binary) return null;
  if (binary.includes("/")) {
    return (await pathExists(binary)) ? binary : null;
  }
  for (const dir of (process.env.PATH || "").split(delimiter)) {
    if (!dir) continue;
    const candidate = resolve(dir, binary);
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Continue.
    }
  }
  const localCandidate = join(REPO_ROOT, "bin", binary);
  return (await pathExists(localCandidate)) ? localCandidate : null;
}

export async function fileMtime(path) {
  try {
    return (await stat(path)).mtime.toISOString();
  } catch {
    return null;
  }
}

export async function inboxCount(path) {
  try {
    const files = await readdir(path);
    return files.filter((file) => file.endsWith(".md")).length;
  } catch {
    return 0;
  }
}

export function codexMcpConfigPresent(raw) {
  return raw.includes("[mcp_servers.shared-memory]") &&
    raw.includes("[mcp_servers.scaffold]") &&
    raw.includes("mcp/shared-memory-server/index.js") &&
    raw.includes("mcp/scaffold-server/index.js");
}

export function opencodeMcpConfigPresent(raw) {
  try {
    const parsed = JSON.parse(raw);
    const shared = parsed.mcp?.["shared-memory"];
    const scaffold = parsed.mcp?.scaffold;
    return Boolean(
      shared?.type === "local" &&
      shared?.enabled === true &&
      Array.isArray(shared?.command) &&
      shared?.environment?.MEMORY_DIR &&
      scaffold?.type === "local" &&
      Array.isArray(scaffold?.command)
    );
  } catch {
    return false;
  }
}

export async function getAgentHealth(agent, registry = null) {
  const checks = [];
  const binaryPath = await findBinary(agent.binary);
  checks.push({
    name: "binary",
    ok: Boolean(binaryPath),
    detail: binaryPath || `${agent.binary} not found on PATH`,
  });

  const configResults = await Promise.all(
    agent.configPaths.map(async (configPath) => ({
      path: configPath,
      ok: await pathExists(resolveRepoPath(configPath)),
    }))
  );
  checks.push({
    name: "config",
    ok: configResults.some((result) => result.ok),
    detail: configResults,
  });

  const inboxPath = resolveRepoPath(agent.inbox);
  checks.push({
    name: "inbox",
    ok: await pathExists(inboxPath),
    detail: { path: agent.inbox, count: await inboxCount(inboxPath) },
  });

  const logPath = resolveRepoPath(agent.log);
  checks.push({
    name: "log",
    ok: await pathExists(logPath),
    detail: { path: agent.log, lastActivity: await fileMtime(logPath) },
  });

  const gitOk = Boolean(agent.gitIdentity?.name && agent.gitIdentity?.email?.includes("@"));
  checks.push({
    name: "identity",
    ok: gitOk,
    detail: agent.gitIdentity || null,
  });

  if (agent.mcpServers?.length) {
    const knownServers = registry?.mcpServers || {};
    const missing = agent.mcpServers.filter((server) => !knownServers[server]);
    checks.push({
      name: "mcp",
      ok: missing.length === 0,
      detail: missing.length ? `Missing registry servers: ${missing.join(", ")}` : agent.mcpServers,
    });
  }

  if (agent.id === "codex") {
    const raw = await readFile(resolveRepoPath("config/codex/config.toml"), "utf-8").catch(() => "");
    checks.push({
      name: "codex-mcp",
      ok: codexMcpConfigPresent(raw),
      detail: "config/codex/config.toml",
    });
  }

  if (agent.id === "opencode") {
    const raw = await readFile(resolveRepoPath("config/opencode/opencode.json"), "utf-8").catch(() => "");
    checks.push({
      name: "opencode-mcp",
      ok: opencodeMcpConfigPresent(raw),
      detail: "config/opencode/opencode.json",
    });
  }

  if (agent.id === "openclaw") {
    const readme = await readFile(resolveRepoPath("config/openclaw/README.md"), "utf-8").catch(() => "");
    checks.push({
      name: "openclaw-mcp",
      ok: readme.includes("openclaw mcp"),
      detail: "config/openclaw/README.md documents mcp registry/serve flow",
    });
  }

  const blocking = checks.filter((check) => !check.ok).map((check) => check.name);
  let status = "healthy";
  if (blocking.includes("binary")) status = "binary_missing";
  else if (blocking.some((name) => name.includes("mcp"))) status = "mcp_missing";
  else if (blocking.length) status = "configured";

  return {
    id: agent.id,
    label: agent.label,
    role: agent.role,
    color: agent.color,
    riskLevel: agent.riskLevel,
    status,
    checks,
  };
}

export async function getSystemHealth() {
  const registry = await readRegistry();
  const agents = await Promise.all(registry.agents.map((agent) => getAgentHealth(agent, registry)));
  return {
    registryVersion: registry.version,
    status: agents.every((agent) => agent.status === "healthy") ? "healthy" : "degraded",
    agents,
  };
}
