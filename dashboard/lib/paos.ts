import { access, readdir, readFile, stat } from "fs/promises";
import { constants } from "fs";
import { delimiter, join, resolve } from "path";

export const REPO_ROOT = process.env.PAOS_ROOT || "/home/dev/AI_Workflow";
export const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
export const LOGS_DIR = process.env.LOGS_DIR || "/home/dev/AI_Workflow/logs";

export interface AgentRegistryEntry {
  id: string;
  label: string;
  role: string;
  binary: string;
  color?: string;
  configPaths: string[];
  mcpServers: string[];
  inbox: string;
  log: string;
  gitIdentity: { name: string; email: string };
  permissions: { read: string[]; write: string[]; execute: string[] };
  healthChecks: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface AgentRegistry {
  version: string;
  mcpServers: Record<string, unknown>;
  agents: AgentRegistryEntry[];
}

export async function readRegistry(): Promise<AgentRegistry> {
  const raw = await readFile(join(/* turbopackIgnore: true */ REPO_ROOT, "agents", "registry.json"), "utf-8");
  return JSON.parse(raw) as AgentRegistry;
}

export function repoPath(path: string) {
  return path.startsWith("/") ? path : join(/* turbopackIgnore: true */ REPO_ROOT, path);
}

async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function executableOnPath(binary: string) {
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
  const local = join(/* turbopackIgnore: true */ REPO_ROOT, "bin", binary);
  return (await exists(local)) ? local : null;
}

async function inboxCount(path: string) {
  const files = await readdir(path).catch(() => []);
  return files.filter((file) => file.endsWith(".md")).length;
}

async function lastActivity(path: string) {
  try {
    return (await stat(path)).mtime.toISOString();
  } catch {
    return null;
  }
}

export async function agentHealth(agent: AgentRegistryEntry, registry: AgentRegistry) {
  const binaryPath = await executableOnPath(agent.binary);
  const config = await Promise.all(
    agent.configPaths.map(async (path) => ({ path, ok: await exists(repoPath(path)) }))
  );
  const inboxPath = repoPath(agent.inbox);
  const logPath = repoPath(agent.log);
  const checks = [
    { name: "binary", ok: Boolean(binaryPath), detail: binaryPath || `${agent.binary} not found` },
    { name: "config", ok: config.some((item) => item.ok), detail: config },
    { name: "inbox", ok: await exists(inboxPath), detail: { path: agent.inbox, count: await inboxCount(inboxPath) } },
    { name: "log", ok: await exists(logPath), detail: { path: agent.log, lastActivity: await lastActivity(logPath) } },
    { name: "identity", ok: Boolean(agent.gitIdentity?.email?.includes("@")), detail: agent.gitIdentity },
    {
      name: "mcp",
      ok: agent.mcpServers.every((server) => registry.mcpServers[server]),
      detail: agent.mcpServers,
    },
  ];

  if (agent.id === "codex") {
    const raw = await readFile(repoPath("config/codex/config.toml"), "utf-8").catch(() => "");
    checks.push({
      name: "codex-mcp",
      ok: raw.includes("[mcp_servers.shared-memory]") && raw.includes("[mcp_servers.scaffold]"),
      detail: "config/codex/config.toml",
    });
  }

  if (agent.id === "openclaw") {
    const raw = await readFile(repoPath("config/openclaw/README.md"), "utf-8").catch(() => "");
    checks.push({
      name: "openclaw-mcp",
      ok: raw.includes("openclaw mcp"),
      detail: "config/openclaw/README.md",
    });
  }

  const failed = checks.filter((check) => !check.ok).map((check) => check.name);
  let status = "healthy";
  if (failed.includes("binary")) status = "binary_missing";
  else if (failed.some((name) => name.includes("mcp"))) status = "mcp_missing";
  else if (failed.length) status = "configured";

  return {
    id: agent.id,
    label: agent.label,
    role: agent.role,
    color: agent.color ?? "#64748b",
    riskLevel: agent.riskLevel,
    status,
    checks,
  };
}

export async function systemDoctor() {
  const registry = await readRegistry();
  const agents = await Promise.all(registry.agents.map((agent) => agentHealth(agent, registry)));
  return {
    registryVersion: registry.version,
    status: agents.every((agent) => agent.status === "healthy") ? "healthy" : "degraded",
    agents,
  };
}
