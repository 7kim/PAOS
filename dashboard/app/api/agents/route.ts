import { NextResponse } from "next/server";
import { readFile, readdir, stat } from "fs/promises";
import { dirname } from "path";
import { agentHealth, readRegistry, repoPath } from "@/lib/paos";

async function recentLog(logPath: string) {
  const raw = await readFile(repoPath(logPath), "utf-8").catch(() => "");
  const lines = raw.split("\n").filter(Boolean);
  return lines[lines.length - 1] ?? "";
}

export async function GET() {
  const registry = await readRegistry();
  const agents = await Promise.all(
    registry.agents.map(async (agent) => ({
      ...agent,
      ...(await agentHealth(agent, registry)),
      inbox: await readdir(repoPath(agent.inbox)).then((files) => files.filter((file) => file.endsWith(".md")).length).catch(() => 0),
      lastActivity: await stat(dirname(repoPath(agent.log))).then((s) => s.mtime.toISOString()).catch(() => null),
      recentLog: await recentLog(agent.log),
    }))
  );
  return NextResponse.json({ agents });
}
