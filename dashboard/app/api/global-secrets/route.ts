import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const HOME = process.env.HOME || "/home/dev";
const GLOBAL_SECRETS_PATH = join(HOME, "AI_Workflow", "config", "secrets", ".env");

interface SecretEntry {
  value: string;
  note: string;
}

function parseEnvWithNotes(content: string): Record<string, SecretEntry> {
  const secrets: Record<string, SecretEntry> = {};
  const lines = content.split("\n");
  let currentNote = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse note comments: # KEY: note content
    const noteMatch = trimmed.match(/^#\s*([A-Z_][A-Z0-9_]*):\s*(.+)$/i);
    if (noteMatch) {
      const noteContent = noteMatch[2].trim();
      currentNote = noteContent;
      continue;
    }

    if (trimmed.startsWith("#")) {
      currentNote = "";
      continue;
    }

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (key) {
        secrets[key] = { value: val, note: currentNote };
        currentNote = "";
      }
    }
  }

  return secrets;
}

export async function GET() {
  try {
    const content = await readFile(GLOBAL_SECRETS_PATH, "utf-8").catch(() => "");
    const secrets = parseEnvWithNotes(content);
    return NextResponse.json({ secrets, path: "config/secrets/.env" });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { secrets } = await req.json();
    if (!secrets || typeof secrets !== "object") {
      return NextResponse.json({ error: "secrets object required" }, { status: 400 });
    }

    const lines: string[] = [
      `# Global Secrets — PAOS Configuration`,
      `# Created: ${new Date().toISOString()}`,
      `# Shared across all projects and agents.`,
      `# Notes are stored as # KEY: your note on the line before KEY=VALUE`,
      ``,
    ];

    for (const [key, entry] of Object.entries(secrets)) {
      const e = entry as { value: string; note?: string };
      const trimmedKey = key.trim();
      const trimmedVal = e.value.trim();
      if (!trimmedKey || !trimmedVal) continue;
      if (e.note && e.note.trim()) {
        lines.push(`# ${trimmedKey}: ${e.note.trim()}`);
      }
      // Mask real secret values when writing back if they're already in the file
      lines.push(`${trimmedKey}=${trimmedVal}`);
    }

    await writeFile(GLOBAL_SECRETS_PATH, lines.join("\n") + "\n", "utf-8");

    return NextResponse.json({ ok: true, path: "config/secrets/.env" });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
