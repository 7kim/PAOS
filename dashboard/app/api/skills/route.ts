import { NextResponse } from "next/server";
import { readdir, readFile, writeFile, mkdir, rm, stat, copyFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const HOME = process.env.HOME || "/home/dev";
const SKILLS_DIR = join(HOME, "AI_Workflow", "skills");

async function listSkills() {
  const entries = await readdir(SKILLS_DIR).catch(() => [] as string[]);
  const skills: any[] = [];
  for (const name of entries) {
    if (name.startsWith(".")) continue;
    const dir = join(SKILLS_DIR, name);
    const s = await stat(dir).catch(() => null);
    if (!s?.isDirectory()) continue;
    const skillPath = join(dir, "SKILL.md");
    const exists = existsSync(skillPath);
    if (!exists && !name.includes("ponytail") && name !== "INDEX.md") {
      // allow dirs without SKILL.md but skip files
      if (name.endsWith(".md")) continue;
    }
    let description = "";
    let disabled = false;
    let sourcePath = join("skills", name, "SKILL.md");
    try {
      const raw = await readFile(skillPath, "utf-8");
      const first = raw.split("\n").slice(0, 30).join("\n");
      const descMatch = first.match(/^#\s+(.+)/m);
      if (descMatch) description = descMatch[1].slice(0, 120);
      const fm = raw.slice(0, 500);
      if (fm.includes("disabled: true") || fm.includes("enabled: false")) disabled = true;
      // check .disabled marker
      if (existsSync(join(dir, ".disabled"))) disabled = true;
    } catch { /* no skill file */ }
    skills.push({ name, description: description || `Skill: ${name}`, enabled: !disabled, sourcePath, rawPath: skillPath });
  }
  // fallback hardcode if empty
  if (skills.length === 0) {
    return [
      { name: "ponytail", description: "Lazy senior dev: minimal code", enabled: true, sourcePath: "skills/ponytail/SKILL.md", rawPath: join(SKILLS_DIR, "ponytail/SKILL.md") },
      { name: "system-analysis-and-design", description: "SRS and system design", enabled: true, sourcePath: "skills/system-analysis-and-design/SKILL.md", rawPath: join(SKILLS_DIR, "system-analysis-and-design/SKILL.md") },
    ];
  }
  return skills;
}

export async function GET() {
  try {
    const skills = await listSkills();
    return NextResponse.json({ skills });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || body.id || "").trim();
    if (!name || !/^[a-zA-Z0-9._-]+$/.test(name)) return NextResponse.json({ error: "valid name required (alphanumeric . _ -)" }, { status: 400 });
    const content = body.content ?? body.skill ?? body.value ?? "";
    const description = body.description || "";
    const enabled = body.enabled !== false;
    const sourcePath = body.sourcePath || body.path || "";

    const dir = join(SKILLS_DIR, name);
    const skillFile = join(dir, "SKILL.md");
    await mkdir(dir, { recursive: true });
    // backup if exists
    try { if (existsSync(skillFile)) await copyFile(skillFile, skillFile + ".bak"); } catch { /* ignore */ }

    let md = "";
    if (content && typeof content === "string" && content.includes("#")) {
      md = content;
    } else if (content) {
      md = `# ${name}\n\n${content}\n`;
    } else {
      md = `# ${name}\n\n${description || `Skill ${name} — created via PAOS`}\n\n## Instructions\n\n${sourcePath ? `Source: ${sourcePath}\n\n` : ""}Add skill instructions here.\n`;
    }
    // handle disabled marker
    const disabledMarker = join(dir, ".disabled");
    if (!enabled) await writeFile(disabledMarker, "disabled\n", "utf-8"); else try { await rm(disabledMarker, { force: true }); } catch { /* ignore */ }

    await writeFile(skillFile, md, "utf-8");
    return NextResponse.json({ ok: true, name, path: join("skills", name, "SKILL.md") });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id") || url.searchParams.get("name") || "";
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = (body.id || body.name || "").trim();
    }
    id = id.trim();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const dir = join(SKILLS_DIR, id);
    if (!existsSync(dir)) return NextResponse.json({ error: `skill ${id} not found` }, { status: 404 });
    // backup via copy to .bak dir
    try {
      const bakDir = join(SKILLS_DIR, ".bak");
      await mkdir(bakDir, { recursive: true });
      await copyFile(join(dir, "SKILL.md"), join(bakDir, `${id}-SKILL.md.bak`)).catch(() => {});
    } catch { /* ignore */ }
    await rm(dir, { recursive: true, force: true });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
