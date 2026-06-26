import { readFile, writeFile, mkdir, symlink } from "fs/promises";
import { join } from "path";
import { execSync } from "child_process";
import { existsSync } from "fs";

const HOME = process.env.HOME || "/home/dev";
const AI_WORKFLOW = join(HOME, "AI_Workflow");
const REGISTRY_PATH = join(AI_WORKFLOW, "agents", "registry.json");
const LOCAL_BIN = join(HOME, ".local", "bin");

interface AgentEntry {
  id: string;
  label: string;
  role: string;
  binary: string;
  installType: "npm" | "pip" | "binary" | "git";
  installPackage: string;
  configPaths: string[];
  enabled: boolean;
  inbox: string;
  log: string;
  riskLevel: "low" | "medium" | "high";
  gitIdentity: { name: string; email: string };
}

/** Get all agents from registry. */
export async function getRegistry(): Promise<{ agents: AgentEntry[] }> {
  const raw = await readFile(REGISTRY_PATH, "utf-8");
  return JSON.parse(raw);
}

/** Save registry. */
export async function saveRegistry(registry: { agents: AgentEntry[] }): Promise<void> {
  await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

/** Toggle agent enabled/disabled. */
export async function toggleAgent(id: string): Promise<boolean> {
  const registry = await getRegistry();
  const agent = registry.agents.find((a) => a.id === id);
  if (!agent) throw new Error(`Agent "${id}" not found`);
  agent.enabled = !agent.enabled;
  await saveRegistry(registry);
  return agent.enabled;
}

/** List agents not yet installed (no binary found, not in registry as present). */
export async function getInstallableAgents(): Promise<AgentEntry[]> {
  const registry = await getRegistry();
  const installed = new Set(registry.agents.map((a) => a.id));
  // Built-in catalog of installable agents
  const catalog: AgentEntry[] = [
    { id: "gemini", label: "Gemini CLI", role: "Google Gemini coding executor", binary: "gemini", installType: "npm", installPackage: "@google/gemini-cli", configPaths: ["agents/gemini/soul.md"], enabled: false, inbox: "memory/inbox/gemini/", log: "logs/agents/gemini/", riskLevel: "high", gitIdentity: { name: "Gemini", email: "gemini@paos.nodealgo.com" } },
    { id: "antigravity", label: "Antigravity CLI", role: "Google Antigravity coding executor", binary: "antigravity", installType: "npm", installPackage: "antigravity-cli", configPaths: ["agents/antigravity/soul.md"], enabled: false, inbox: "memory/inbox/antigravity/", log: "logs/agents/antigravity/", riskLevel: "high", gitIdentity: { name: "Antigravity", email: "antigravity@paos.nodealgo.com" } },
    { id: "codex", label: "OpenAI Codex", role: "OpenAI CLI coding executor", binary: "codex", installType: "npm", installPackage: "@openai/codex", configPaths: ["agents/codex/soul.md"], enabled: false, inbox: "memory/inbox/codex/", log: "logs/agents/codex/", riskLevel: "high", gitIdentity: { name: "Codex", email: "codex@paos.nodealgo.com" } },
    { id: "ollama", label: "Ollama", role: "Local model runtime", binary: "ollama", installType: "binary", installPackage: "https://ollama.ai/install.sh", configPaths: ["agents/ollama/soul.md"], enabled: false, inbox: "memory/inbox/ollama/", log: "logs/agents/ollama/", riskLevel: "medium", gitIdentity: { name: "Ollama", email: "ollama@paos.nodealgo.com" } },
  ];
  return catalog.filter((a) => !installed.has(a.id));
}

/** Install an agent: self-contained in AI_Workflow/agents/<id>/. */
export async function installAgent(id: string): Promise<{ ok: boolean; steps: string[] }> {
  const steps: string[] = [];
  const catalog = await getInstallableAgents();
  const info = catalog.find((a) => a.id === id);
  if (!info) throw new Error(`Agent "${id}" not found in installable catalog`);

  const agentDir = join(AI_WORKFLOW, "agents", id);
  const binDir = join(agentDir, "bin");

  // Step 1: Create agent directory
  await mkdir(agentDir, { recursive: true });
  await mkdir(binDir, { recursive: true });
  steps.push(`Created ${agentDir}/`);

  // Step 2: Install binary
  if (info.installType === "npm") {
    execSync(`cd "${agentDir}" && npm init -y && npm install ${info.installPackage} 2>&1`, { stdio: "pipe", timeout: 120_000 });
    // Symlink the binary from node_modules
    const nodeBin = join(agentDir, "node_modules", ".bin", info.binary);
    if (existsSync(nodeBin)) {
      await symlink(nodeBin, join(binDir, info.binary));
    }
    steps.push(`Installed ${info.installPackage} via npm`);
  } else if (info.installType === "pip") {
    execSync(`cd "${agentDir}" && python3 -m venv venv && ./venv/bin/pip install ${info.installPackage} 2>&1`, { stdio: "pipe", timeout: 120_000 });
    await symlink(join(agentDir, "venv", "bin", info.binary), join(binDir, info.binary));
    steps.push(`Installed ${info.installPackage} via pip`);
  } else if (info.installType === "binary") {
    execSync(`curl -fsSL ${info.installPackage} | bash -s -- --install-dir "${binDir}" 2>&1`, { stdio: "pipe", timeout: 120_000 });
    steps.push(`Downloaded binary from ${info.installPackage}`);
  }

  // Step 3: Create PATH symlink
  await mkdir(LOCAL_BIN, { recursive: true });
  try { await symlink(join(binDir, info.binary), join(LOCAL_BIN, info.binary)); } catch { /* already exists */ }
  steps.push(`Symlinked ${LOCAL_BIN}/${info.binary}`);

  // Step 4: Write soul.md
  const soulContent = `---
name: ${info.id}
role: ${info.role}
description: PAOS-managed agent — installed via self-contained deployment
status: active
tags:
  - paos
  - agent
  - ${info.id}
---

# SOUL — ${info.label}

## Identity

I am **${info.label}**, installed and managed by PAOS at \`agents/${info.id}/\`.

## Capabilities

- Installed via ${info.installType}: ${info.installPackage}
- Binary: \`${info.binary}\`
- Inbox: \`memory/inbox/${info.id}/\`

## Health Checks

- \`${info.binary} --version\` — binary available
`;
  await writeFile(join(agentDir, "soul.md"), soulContent);
  steps.push(`Wrote soul.md`);

  // Step 5: Create inbox
  const inboxDir = join(AI_WORKFLOW, "memory", "inbox", info.id);
  await mkdir(inboxDir, { recursive: true });
  await writeFile(join(inboxDir, ".gitkeep"), "");
  steps.push(`Created inbox at ${inboxDir}`);

  // Step 6: Create events file
  const eventsDir = join(AI_WORKFLOW, "memory", id);
  await mkdir(eventsDir, { recursive: true });
  await writeFile(join(eventsDir, "events.md"), `# ${info.label} — Events

`);
  steps.push(`Created events file`);

  // Step 7: Add to registry
  const registry = await getRegistry();
  registry.agents.push({ ...info, enabled: true });
  await saveRegistry(registry);
  steps.push(`Registered in ${REGISTRY_PATH}`);

  // Step 8: Verify
  try {
    const out = execSync(`${binDir}/${info.binary} --version 2>&1`, { timeout: 10_000, encoding: "utf-8" });
    steps.push(`Verified: ${out.trim().split("\n")[0]}`);
  } catch {
    steps.push("Warning: binary verification failed (may need manual config)");
  }

  return { ok: true, steps };
}
