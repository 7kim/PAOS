import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";

const AGENTS_DIR = join(process.env.HOME || "/home/dev", "AI_Workflow", "agents");

async function readSoul(id: string): Promise<{
  id: string; label: string; role: string; capabilities: string[]; tools: string[]; enabled: boolean;
}> {
  const soulPath = join(AGENTS_DIR, id, "soul.md");
  try {
    const content = await readFile(soulPath, "utf-8");
    const label = content.match(/^name:\s*(.+)/m)?.[1]?.trim() || id;
    const role = content.match(/^role:\s*(.+)/m)?.[1]?.trim() || "";

    // Extract capability sections (lines after ## heading that look like lists)
    const capabilities: string[] = [];
    const capSection = content.match(/## Capabilities\s*([\s\S]*?)(?=##|$)/);
    if (capSection) {
      for (const line of capSection[1].split("\n")) {
        const match = line.match(/^[-*]\s+(.+)/);
        if (match) capabilities.push(match[1].trim());
      }
    }

    // Extract tool references from capabilities and body
    const toolRefs = content.match(/`([a-z_-]+)`/g) || [];
    const tools = [...new Set(toolRefs.map((t: string) => t.replace(/`/g, "")))];

    const enabled = !content.includes("status: inactive") && !content.includes("disabled: true");
    return { id, label, role, capabilities: capabilities.slice(0, 15), tools: tools.slice(0, 10), enabled };
  } catch {
    return { id, label: id, role: "", capabilities: [], tools: [], enabled: false };
  }
}

export async function GET() {
  try {
    const entries = await readdir(AGENTS_DIR).catch(() => []);
    const agentIds = entries.filter((e) => !e.startsWith("."));
    const agents = await Promise.all(agentIds.map(readSoul));
    agents.sort((a, b) => a.id.localeCompare(b.id));
    return NextResponse.json({ agents });
  } catch (e) {
    return NextResponse.json({ agents: [], error: String(e) });
  }
}
