import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

export async function GET() {
  const agents = [
    { id: "hermes-nous", label: "Hermes (Nous)", color: "#f0b90b", provider: "deepseek", model: "deepseek-v4-flash", type: "reasoning" },
    { id: "opencode-developer", label: "OpenCode Developer", color: "#3b82f6", provider: "cli", type: "coding" },
    { id: "claude-code", label: "Claude Code", color: "#8b5cf6", provider: "cli", model: "claude-sonnet-4", type: "coding" },
    { id: "codex", label: "OpenAI Codex", color: "#22c55e", provider: "cli", model: "gpt-5", type: "coding" },
  ];

  // Try to read from actual config for dynamically configured agents
  try {
    const configPath = join(MEMORY_DIR, "..", "hermes", "config.yaml");
    // Parse as simple YAML to find agent definitions
    const config = await readFile(configPath, "utf-8").catch(() => "");
    if (config) {
      const agentSection = config.match(/agents:\n([\s\S]*?)(?=\n\w|\n$)/);
      if (agentSection) {
        const lines = agentSection[1].split("\n").filter(l => l.includes(":"));
        for (const line of lines) {
          const match = line.match(/\s+(\w+):/);
          if (match && !agents.find(a => a.id === match[1])) {
            agents.push({
              id: match[1],
              label: match[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
              color: "#64748b",
              provider: "hermes",
              type: "general",
            });
          }
        }
      }
    }
  } catch { /* use defaults */ }

  return NextResponse.json({ agents });
}
