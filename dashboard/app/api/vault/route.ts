import { NextResponse } from "next/server";
import { readdir, readFile, stat, mkdir } from "fs/promises";
import { join } from "path";

const HOME = process.env.HOME || "/home/dev";
const PAOS_HOME = join(HOME, "AI_Workflow");

export async function GET(req: Request) {
  const url = new URL(req.url);
  const project = url.searchParams.get("project") || "";
  const type = url.searchParams.get("type") || "daily"; // daily | chats
  const date = url.searchParams.get("date") || "";

  // Base vault dir: try projects/{name}/vault first, fall back to memory/pipelines/{name}/vault
  let vaultDir: string;
  if (project) {
    const projectsVault = join(PAOS_HOME, "projects", project, "vault");
    const pipelinesVault = join(PAOS_HOME, "memory", "pipelines", project, "vault");
    // Check which one exists
    try {
      await stat(projectsVault);
      vaultDir = projectsVault;
    } catch {
      vaultDir = pipelinesVault;
    }
  } else {
    vaultDir = join(PAOS_HOME, "vault");
  }

  try {
    if (type === "daily") {
      const dailyDir = join(vaultDir, "daily");
      await mkdir(dailyDir, { recursive: true }).catch(() => {});
      const files = await readdir(dailyDir).catch(() => []);
      const dailyNotes = files
        .filter((f) => f.endsWith(".md"))
        .sort()
        .reverse()
        .slice(0, 30);

      // If a specific date is requested, return that file content
      if (date) {
        const filePath = join(dailyDir, `${date}.md`);
        try {
          const content = await readFile(filePath, "utf-8");
          return NextResponse.json({ date, content, project: project || "global" });
        } catch {
          return NextResponse.json({ error: `Daily note not found: ${date}` }, { status: 404 });
        }
      }

      // List all daily notes with metadata
      const notes = await Promise.all(
        dailyNotes.map(async (f) => {
          const d = f.replace(/\.md$/, "");
          let preview = "";
          try {
            const content = await readFile(join(dailyDir, f), "utf-8");
            preview = content.split("\n").slice(1, 5).join("\n").trim().slice(0, 200);
          } catch { /* ignore */ }
          return { date: d, preview, path: `vault/daily/${f}` };
        })
      );

      return NextResponse.json({ notes, project: project || "global" });
    }

    if (type === "chats") {
      const chatsDir = join(vaultDir, "chats");
      await mkdir(chatsDir, { recursive: true }).catch(() => {});
      const files = await readdir(chatsDir).catch(() => []);
      const chatFiles = files.filter((f) => f.endsWith(".md")).sort().reverse().slice(0, 30);

      const slug = url.searchParams.get("slug") || "";
      if (slug) {
        const filePath = join(chatsDir, `${slug}.md`);
        try {
          const content = await readFile(filePath, "utf-8");
          return NextResponse.json({ slug, content, project: project || "global" });
        } catch {
          return NextResponse.json({ error: `Chat not found: ${slug}` }, { status: 404 });
        }
      }

      const chats = await Promise.all(
        chatFiles.map(async (f) => {
          const s = f.replace(/\.md$/, "");
          let title = s;
          let preview = "";
          try {
            const content = await readFile(join(chatsDir, f), "utf-8");
            const line = content.split("\n")[0];
            if (line.startsWith("# ")) title = line.replace("# ", "");
            preview = content.split("\n").slice(1, 6).join("\n").trim().slice(0, 200);
          } catch { /* ignore */ }
          return { slug: s, title, preview, path: `vault/chats/${f}` };
        })
      );

      return NextResponse.json({ chats, project: project || "global" });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
