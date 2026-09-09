import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { spawn } from "child_process";

interface EnvEntry {
  key: string;
  value: string;
  masked: boolean;
}

interface AliasEntry {
  name: string;
  command: string;
}

interface PathEntry {
  path: string;
  exists: boolean;
}

interface BashrcData {
  raw: string;
  envVars: EnvEntry[];
  aliases: AliasEntry[];
  pathEntries: PathEntry[];
  functions: string[];
  sources: string[];
  other: string[];
}

const SECRET_KEYS = ["secret", "token", "key", "password", "auth", "credential", "api_key"];

function isSecret(key: string): boolean {
  return SECRET_KEYS.some((s) => key.toLowerCase().includes(s));
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

// GET /api/settings/env — Read and parse ~/.bashrc
export async function GET() {
  try {
    const home = process.env.HOME || "/home/dev";
    const bashrcPath = join(home, ".bashrc");
    const profilePath = join(home, ".profile");
    const bashProfilePath = join(home, ".bash_profile");

    let raw = "";
    const sources: string[] = [];

    // Read .bashrc
    try {
      raw = await readFile(bashrcPath, "utf-8");
      sources.push(".bashrc");
    } catch { /* ignore */ }

    // Read .profile
    try {
      const profile = await readFile(profilePath, "utf-8");
      if (profile.trim()) {
        raw += "\n\n# === .profile ===\n" + profile;
        sources.push(".profile");
      }
    } catch { /* ignore */ }

    // Read .bash_profile
    try {
      const bashProfile = await readFile(bashProfilePath, "utf-8");
      if (bashProfile.trim()) {
        raw += "\n\n# === .bash_profile ===\n" + bashProfile;
        sources.push(".bash_profile");
      }
    } catch { /* ignore */ }

    // Parse environment variables
    const envVars: EnvEntry[] = [];
    const envRegex = /^export\s+(\w+)=(.*)$/gm;
    let match;
    while ((match = envRegex.exec(raw)) !== null) {
      const key = match[1];
      let value = match[2].replace(/^["']|["']$/g, "");
      envVars.push({
        key,
        value,
        masked: isSecret(key),
      });
    }

    // Parse PATH entries
    const pathEntries: PathEntry[] = [];
    const pathRegex = /export\s+PATH="([^"]+)"/g;
    while ((match = pathRegex.exec(raw)) !== null) {
      const paths = match[1].split(":");
      for (const p of paths) {
        const cleanPath = p.replace("$HOME", home).replace("~", home);
        if (!pathEntries.find((e) => e.path === cleanPath)) {
          pathEntries.push({ path: cleanPath, exists: false });
        }
      }
    }
    // Check existence
    for (const entry of pathEntries) {
      entry.exists = await fileExists(entry.path);
    }

    // Parse aliases
    const aliases: AliasEntry[] = [];
    const aliasRegex = /^alias\s+(\w+)=(.*)$/gm;
    while ((match = aliasRegex.exec(raw)) !== null) {
      aliases.push({
        name: match[1],
        command: match[2].replace(/^["']|["']$/g, ""),
      });
    }

    // Parse functions (simple detection)
    const functions: string[] = [];
    const funcRegex = /^(\w+)\s*\(\)\s*\{/gm;
    while ((match = funcRegex.exec(raw)) !== null) {
      functions.push(match[1]);
    }

    // Parse source/. commands
    const sourceLines: string[] = [];
    const sourceRegex = /^(?:source|\.\s+)\s+(.+)$/gm;
    while ((match = sourceRegex.exec(raw)) !== null) {
      sourceLines.push(match[1]);
    }

    // Other non-export, non-alias, non-comment lines
    const other: string[] = [];
    const lines = raw.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed &&
        !trimmed.startsWith("#") &&
        !trimmed.startsWith("export ") &&
        !trimmed.startsWith("alias ") &&
        !trimmed.startsWith("source ") &&
        !trimmed.startsWith(". ") &&
        !trimmed.match(/^\w+\(\)\s*\{/) &&
        !trimmed.startsWith("if ") &&
        !trimmed.startsWith("fi") &&
        !trimmed.startsWith("then") &&
        !trimmed.startsWith("else") &&
        !trimmed.startsWith("esac") &&
        !trimmed.startsWith("case ") &&
        !trimmed.startsWith("shopt ") &&
        !trimmed.startsWith("[") &&
        !trimmed.startsWith("eval ")
      ) {
        other.push(trimmed);
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        raw,
        sources,
        envVars,
        aliases,
        pathEntries,
        functions,
        sources: sourceLines,
        other: other.slice(0, 20),
      } as BashrcData,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

// POST /api/settings/env — Add/update environment variable
export async function POST(req: Request) {
  try {
    const { key, value, action } = await req.json();
    const home = process.env.HOME || "/home/dev";
    const bashrcPath = join(home, ".bashrc");

    let content = await readFile(bashrcPath, "utf-8");

    if (action === "add" || action === "update") {
      const line = `export ${key}="${value}"`;
      const regex = new RegExp(`^export\\s+${key}=.*$`, "m");
      if (regex.test(content)) {
        content = content.replace(regex, line);
      } else {
        content += `\n${line}`;
      }
    } else if (action === "delete") {
      const regex = new RegExp(`^export\\s+${key}=.*$`, "m");
      content = content.replace(regex, "");
    }

    await writeFile(bashrcPath, content, "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
