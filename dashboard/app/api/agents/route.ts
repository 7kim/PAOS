import { NextResponse } from "next/server";
import { execSync } from "child_process";

const AGENTS = [
  { id: "opencode-developer", label: "OpenCode Developer", package: "opencode", checkCmd: "opencode --version 2>&1", installCmd: "npm install -g opencode-cli", url: "https://github.com/sst/opencode" },
  { id: "claude-code", label: "Claude Code", package: "claude", checkCmd: "claude --version 2>&1", installCmd: "npm install -g @anthropic-ai/claude-code", url: "https://docs.anthropic.com/en/docs/claude-code" },
  { id: "hermes-nous", label: "Hermes (Nous)", package: "hermes", checkCmd: "hermes --version 2>&1", installCmd: "pip install hermes-agent", url: "https://github.com/nousresearch/hermes" },
  { id: "codex", label: "OpenAI Codex", package: "codex", checkCmd: "codex --version 2>&1", installCmd: "npm install -g @openai/codex", url: "https://github.com/openai/codex" },
];

export async function GET() {
  const results = [];

  for (const agent of AGENTS) {
    let version = "";
    let available = false;
    let error = "";

    try {
      const out = execSync(agent.checkCmd, { timeout: 5000, encoding: "utf-8" });
      version = out.trim().split("\n")[0].trim();
      available = !!version;
    } catch (e: any) {
      error = e.stderr?.trim()?.slice(0, 100) || e.message?.slice(0, 100) || "";
      available = false;
    }

    results.push({
      ...agent,
      available,
      version: version || "",
      error,
    });
  }

  return NextResponse.json({ agents: results });
}