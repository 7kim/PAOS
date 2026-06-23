import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, readdir, stat } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  // Find the project
  const projectDir = join(PIPELINES_DIR, name);
  const projectStat = await stat(projectDir).catch(() => null);
  if (!projectStat?.isDirectory()) {
    return NextResponse.json({ error: `Project "${name}" not found` }, { status: 404 });
  }

  // Read project meta for source path
  let meta: Record<string, unknown> = {};
  try {
    meta = JSON.parse(await readFile(join(projectDir, ".project-meta.json"), "utf-8"));
  } catch { /* no meta */ }

  const sourcePath = meta.sourcePath as string | undefined;
  if (!sourcePath) {
    return NextResponse.json({ error: `Project "${name}" has no source path. Import it first.` }, { status: 400 });
  }

  const sourceStat = await stat(sourcePath).catch(() => null);
  if (!sourceStat?.isDirectory()) {
    return NextResponse.json({ error: `Source path no longer exists: ${sourcePath}` }, { status: 400 });
  }

  // Analyze the project
  const entries = await readdir(sourcePath).catch(() => []);
  const analysis = {
    languages: [] as string[],
    frameworks: [] as string[],
    hasTests: false,
    hasCI: false,
    hasDocker: false,
    entryPoints: [] as string[],
    packageManager: "",
  };

  // Detect languages and frameworks
  for (const entry of entries) {
    if (entry === "package.json") {
      analysis.languages.push("TypeScript/JavaScript");
      try {
        const pkg = JSON.parse(await readFile(join(sourcePath, "package.json"), "utf-8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies } || {};
        if (deps.next) analysis.frameworks.push("Next.js");
        if (deps.react) analysis.frameworks.push("React");
        if (deps.vue) analysis.frameworks.push("Vue");
        if (deps.express) analysis.frameworks.push("Express");
        if (deps.astro) analysis.frameworks.push("Astro");
        analysis.packageManager = pkg.packageManager?.split("@")[0] || "npm";
      } catch { /* ignore */ }
    }
    if (entry === "pyproject.toml") { analysis.languages.push("Python"); analysis.packageManager = "uv/pip"; }
    if (entry === "requirements.txt") { analysis.languages.push("Python"); analysis.packageManager = "pip"; }
    if (entry === "Cargo.toml") analysis.languages.push("Rust");
    if (entry === "go.mod") analysis.languages.push("Go");
    if (entry === "Gemfile") { analysis.languages.push("Ruby"); analysis.packageManager = "bundler"; }
    if (entry === "composer.json") analysis.languages.push("PHP");

    // Tests
    if (entry.match(/^(vitest\.config|jest\.config|.eslintrc|tsconfig\.json)/i)) {
      analysis.entryPoints.push(entry);
    }
    if (entry.startsWith("__tests__") || entry.startsWith("tests") || entry.endsWith(".test.ts") || entry.endsWith(".spec.ts")) {
      analysis.hasTests = true;
    }

    // Containers / CI
    if (entry === "Dockerfile" || entry === "docker-compose.yml") analysis.hasDocker = true;
    if (entry === ".github") analysis.hasCI = true;
  }

  // Create PAOS integration directory within the project
  const paosDir = join(sourcePath, ".paos");
  await mkdir(paosDir, { recursive: true });

  // Write project brief for PAOS agents
  const brief = [
    `# ${name} — PAOS Integration`,
    ``,
    `Integrated at: ${new Date().toISOString()}`,
    `Source: ${sourcePath}`,
    ``,
    `## Project Analysis`,
    ``,
    analysis.languages.length > 0 ? `Languages: ${analysis.languages.join(", ")}` : "Languages: detected",
    analysis.frameworks.length > 0 ? `Frameworks: ${analysis.frameworks.join(", ")}` : null,
    analysis.packageManager ? `Package manager: ${analysis.packageManager}` : null,
    analysis.hasTests ? "Has tests: yes" : "Has tests: no",
    analysis.hasDocker ? "Docker: yes" : null,
    analysis.hasCI ? "CI: yes" : null,
    ``,
    `## Top-Level Structure`,
    ``,
    ...entries.filter((e) => !e.startsWith(".")).slice(0, 25).map((e) => `- ${e}`),
    ``,
    `## PAOS Agents`,
    ``,
    `This project is managed by PAOS. Pipelines live in \`memory/pipelines/${name}/\`.`,
    `Agents can read this brief at \`.paos/project-brief.md\` for context.`,
  ].filter(Boolean).join("\n");

  await writeFile(join(paosDir, "project-brief.md"), brief);

  // Write agent soul template
  const soul = [
    `# Agent Soul — ${name}`,
    ``,
    `You are a PAOS agent working on the "${name}" project.`,
    `Source directory: ${sourcePath}`,
    ``,
    `## Project Context`,
    ``,
    analysis.languages.length > 0 ? `- Languages: ${analysis.languages.join(", ")}` : null,
    analysis.frameworks.length > 0 ? `- Frameworks: ${analysis.frameworks.join(", ")}` : null,
    analysis.packageManager ? `- Package manager: ${analysis.packageManager}` : null,
    `- Integrated: ${new Date().toISOString()}`,
    ``,
    `## Available Commands`,
    ``,
    analysis.packageManager === "npm" ? "- \`npm run dev\` — dev server" : null,
    analysis.packageManager === "npm" ? "- \`npm run build\` — build" : null,
    analysis.packageManager === "npm" ? "- \`npm test\` — tests" : null,
    `- \`hermes\` — Hermes Agent CLI`,
    ``,
    `## Pipelines`,
    ``,
    `All pipelines for this project live under \`memory/pipelines/${name}/\`.`,
    `Submit new pipelines through the PAOS pipeline system.`,
  ].filter(Boolean).join("\n");

  await writeFile(join(paosDir, "AGENT.md"), soul);

  // Update project meta with integration status
  meta.integratedAt = new Date().toISOString();
  meta.analysis = analysis;
  await writeFile(join(projectDir, ".project-meta.json"), JSON.stringify(meta, null, 2));

  return NextResponse.json({
    ok: true,
    project: name,
    sourcePath,
    analysis,
    filesCreated: [".paos/project-brief.md", ".paos/AGENT.md"],
  });
}
