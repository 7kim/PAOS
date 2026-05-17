import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const LOGS_DIR = process.env.LOGS_DIR || "/home/dev/AI_Workflow/logs";

const KNOWN_AGENTS = [
  { id: "claude", label: "Claude Code", color: "#f97316" },
  { id: "opencode-developer", label: "OpenCode Developer", color: "#3b82f6" },
  { id: "opencode-plan", label: "OpenCode Plan", color: "#60a5fa" },
  { id: "codex", label: "Codex", color: "#10b981" },
  { id: "openclaw", label: "OpenClaw", color: "#8b5cf6" },
  { id: "ollama", label: "Ollama", color: "#22c55e" },
  { id: "antigravity", label: "Antigravity", color: "#ec4899" },
];

async function getLastActivity(agentId: string): Promise<string | null> {
  try {
    // Check inbox for messages
    const inboxDir = join(MEMORY_DIR, "inbox");
    const dirs = await readdir(inboxDir).catch(() => []);

    // Check logs dir
    const logDir = join(LOGS_DIR, agentId);
    const s = await stat(logDir).catch(() => null);
    if (s) return s.mtime.toISOString();
    return null;
  } catch {
    return null;
  }
}

async function getInboxCount(agentId: string): Promise<number> {
  try {
    const inboxDir = join(MEMORY_DIR, "inbox", agentId);
    const files = await readdir(inboxDir);
    return files.filter((f) => f.endsWith(".md")).length;
  } catch {
    return 0;
  }
}

async function getRecentLog(agentId: string): Promise<string> {
  try {
    const logFile = join(LOGS_DIR, agentId, "events.md");
    const raw = await readFile(logFile, "utf-8");
    const lines = raw.split("\n").filter(Boolean);
    return lines[lines.length - 1] ?? "";
  } catch {
    return "";
  }
}

export async function GET() {
  const agents = await Promise.all(
    KNOWN_AGENTS.map(async (a) => ({
      ...a,
      inbox: await getInboxCount(a.id),
      lastActivity: await getLastActivity(a.id),
      recentLog: await getRecentLog(a.id),
    }))
  );
  return NextResponse.json({ agents });
}
