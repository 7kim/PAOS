import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, stat } from "fs/promises";
import { join } from "path";

const HOME = process.env.HOME || "/home/dev";
const PROJECTS_DIR = join(HOME, "AI_Workflow", "projects");
const PIPELINES_DIR = join(HOME, "AI_Workflow", "memory", "pipelines");

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
  } catch { /* fall back to pipelines */ }

  try {
    const dirExists = await stat(activeSecretsDir).then(() => true).catch(() => false);
    if (!dirExists) {
      return NextResponse.json({ project, secrets: {} });
    }

    const content = await readFile(activeSecretsPath, "utf-8").catch(() => "");
    const secrets: Record<string, string> = {};

    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (key) secrets[key] = val;
      }
    }

    return NextResponse.json({ project, secrets, path: activeSecretsPath.replace(HOME, "~") });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { project, secrets } = await req.json();
    if (!project || typeof secrets !== "object") {
      return NextResponse.json({ error: "project and secrets object required" }, { status: 400 });
    }

    // Write to projects/{name}/secrets/ first, fall back to pipelines/{name}/secrets
    let secretsDir = join(PROJECTS_DIR, project, "secrets");
    try {
      await stat(secretsDir);
    } catch {
      secretsDir = join(PIPELINES_DIR, project, "secrets");
    }
    await mkdir(secretsDir, { recursive: true });

    // Build .env content
    const lines: string[] = [
      `# Project Secrets — ${project}`,
      `# Created: ${new Date().toISOString()}`,
      `# Edit values below. Lines starting with # are comments.`,
      ``,
    ];

    for (const [key, val] of Object.entries(secrets)) {
      lines.push(`${key}=${val}`);
    }

    await writeFile(join(secretsDir, ".env"), lines.join("\n") + "\n", "utf-8");

    return NextResponse.json({ ok: true, project, path: `memory/pipelines/${project}/secrets/.env` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
