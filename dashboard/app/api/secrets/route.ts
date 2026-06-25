import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, stat } from "fs/promises";
import { join } from "path";

import { PROJECTS_DIR, PIPELINES_DIR, HOME_DIR } from "@/lib/global-config";
const HOME = HOME_DIR;

export interface SecretEntry {
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
      const notedKey = noteMatch[1];
      const noteContent = noteMatch[2].trim();
      // Store note for the next KEY=VALUE line
      currentNote = noteContent;
      continue;
    }

    // Skip other comments
    if (trimmed.startsWith("#")) {
      currentNote = "";
      continue;
    }

    // Parse KEY=VALUE
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

function buildEnvWithNotes(
  project: string,
  secrets: Record<string, SecretEntry>
): string[] {
  // Separate entries: ones with notes come first (preserve order), then others
  const lines: string[] = [
    `# Project Secrets — ${project}`,
    `# Created: ${new Date().toISOString()}`,
    `# Lines starting with # are comments.`,
    `# Notes are stored as # KEY: your note on the line before KEY=VALUE`,
    ``,
  ];

  for (const [key, entry] of Object.entries(secrets)) {
    const trimmedKey = key.trim();
    const trimmedVal = entry.value.trim();
    if (!trimmedKey || !trimmedVal) continue;
    if (entry.note) {
      // Write note comment before the entry
      lines.push(`# ${trimmedKey}: ${entry.note}`);
    }
    lines.push(`${trimmedKey}=${trimmedVal}`);
  }

  return lines;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project") || "";

  if (!project) {
    return NextResponse.json({ error: "project parameter required" }, { status: 400 });
  }

  const secretsDir = join(PIPELINES_DIR, project, "secrets");
  const secretsPath = join(secretsDir, ".env");

  // Try projects/{name}/secrets first, fall back to pipelines/{name}/secrets
  const projectsSecretsDir = join(PROJECTS_DIR, project, "secrets");
  const projectsSecretsPath = join(projectsSecretsDir, ".env");
  let activeSecretsDir = secretsDir;
  let activeSecretsPath = secretsPath;
  try {
    await stat(projectsSecretsDir);
    activeSecretsDir = projectsSecretsDir;
    activeSecretsPath = projectsSecretsPath;
  } catch {
    /* fall back to pipelines */
  }

  try {
    const dirExists = await stat(activeSecretsDir)
      .then(() => true)
      .catch(() => false);
    if (!dirExists) {
      return NextResponse.json({ project, secrets: {} });
    }

    const content = await readFile(activeSecretsPath, "utf-8").catch(() => "");
    const secrets = parseEnvWithNotes(content);

    return NextResponse.json({
      project,
      secrets,
      path: activeSecretsPath.replace(HOME, "~"),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { project, secrets } = await req.json();
    if (!project || typeof secrets !== "object") {
      return NextResponse.json(
        { error: "project and secrets object required" },
        { status: 400 }
      );
    }

    // Write to projects/{name}/secrets/ first, fall back to pipelines/{name}/secrets
    let secretsDir = join(PROJECTS_DIR, project, "secrets");
    try {
      await stat(secretsDir);
    } catch {
      secretsDir = join(PIPELINES_DIR, project, "secrets");
    }
    await mkdir(secretsDir, { recursive: true });

    const lines = buildEnvWithNotes(project, secrets);
    await writeFile(join(secretsDir, ".env"), lines.join("\n") + "\n", "utf-8");

    return NextResponse.json({
      ok: true,
      project,
      path: `projects/${project}/secrets/.env`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
