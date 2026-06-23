import { NextResponse } from "next/server";
import { mkdir, writeFile, readdir, stat, symlink, readlink } from "fs/promises";
import { join, resolve } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

export async function POST(req: Request) {
  try {
    const { name, sourcePath } = await req.json();

    // Validate name
    if (!name || typeof name !== "string" || !/^[a-zA-Z0-9_-]+$/.test(name)) {
      return NextResponse.json({ error: "Invalid project name. Use letters, numbers, hyphens, underscores." }, { status: 400 });
    }

    // Validate source path
    if (!sourcePath || typeof sourcePath !== "string") {
      return NextResponse.json({ error: "sourcePath is required" }, { status: 400 });
    }

    const resolvedPath = resolve(sourcePath);
    const sourceStat = await stat(resolvedPath).catch(() => null);
    if (!sourceStat?.isDirectory()) {
      return NextResponse.json({ error: `Source path does not exist or is not a directory: ${resolvedPath}` }, { status: 400 });
    }

    // Check if project already exists
    const projectDir = join(PIPELINES_DIR, name);
    const existing = await stat(projectDir).catch(() => null);
    if (existing) {
      return NextResponse.json({ error: `Project "${name}" already exists` }, { status: 409 });
    }

    // Create project directory
    await mkdir(projectDir, { recursive: true });

    // Write project meta
    const meta = {
      name,
      sourcePath: resolvedPath,
      importedAt: new Date().toISOString(),
      type: "imported",
    };
    await writeFile(join(projectDir, ".project-meta.json"), JSON.stringify(meta, null, 2));

    // Scan source for a brief summary
    const entries = await readdir(resolvedPath).catch(() => []);
    const topLevel = entries.filter((e) => !e.startsWith(".")).slice(0, 30);

    // Detect project type from common files
    const hasPackage = entries.some((e) => e === "package.json" || e === "pyproject.toml" || e === "Cargo.toml" || e === "go.mod" || e === "Gemfile");
    const hasReadme = entries.some((e) => e.toLowerCase().startsWith("readme"));
    const hasGit = entries.some((e) => e === ".git");

    return NextResponse.json({
      ok: true,
      name,
      path: `memory/pipelines/${name}`,
      summary: {
        topLevelCount: entries.length,
        hasPackage,
        hasReadme,
        hasGit,
        topLevel,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
