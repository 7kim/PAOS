import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { readFile } from "fs/promises";
import { join } from "path";

const REPO_ROOT = process.env.REPO_ROOT || "/home/dev/AI_Workflow";

function getAgentIdentities(): Record<string, { name: string; email: string }> {
  try {
    const reg = JSON.parse(
      require("fs").readFileSync(join(REPO_ROOT, "agents", "registry.json"), "utf-8")
    );
    const map: Record<string, { name: string; email: string }> = {};
    for (const a of reg.agents) {
      if (a.gitIdentity) {
        const key = a.email || a.gitIdentity.email;
        map[a.id] = { name: a.gitIdentity.name, email: key };
      }
    }
    return map;
  } catch {
    return {};
  }
}

function git(args: string): string {
  try {
    return execSync(`git ${args}`, { cwd: REPO_ROOT, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
  } catch (e: unknown) {
    const err = e as { stderr?: string; stdout?: string; message?: string };
    throw new Error(err.stderr?.trim() || err.stdout?.trim() || err.message || "git error");
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get("agent") || "";
  const commit = searchParams.get("commit") || "";
  const max = parseInt(searchParams.get("max") || "50", 10);
  const query = searchParams.get("q") || "";
  const visualize = searchParams.get("visualize") === "true";

  try {
    if (visualize) {
      const treeRaw = git(`ls-tree -r --name-only HEAD`);
      const files = treeRaw.trim().split("\n").filter(Boolean);
      const map: Record<string, { size: number; files: number }> = {};

      for (const file of files) {
        const parts = file.split("/");
        let current = "";
        for (let i = 0; i < parts.length; i++) {
          current += (i === 0 ? "" : "/") + parts[i];
          if (!map[current]) map[current] = { size: 0, files: 0 };
          map[current].files++;
        }
      }
      return NextResponse.json({ map });
    }

    if (commit) {
      try {
        const log = git(`log -1 --format="%H|%an|%ae|%ai|%s" ${commit}`);
        if (!log.trim()) {
          return NextResponse.json({ error: "Commit not found" }, { status: 404 });
        }
        const [hash, author, email, date, ...msgParts] = log.trim().split("|");
        const message = msgParts.join("|");
        const diff = git(`diff ${commit}^..${commit} 2>/dev/null || show ${commit}`);
        const files = git(`diff-tree --no-commit-id -r --name-status ${commit}`)
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((line: string) => {
            const [status, ...pathParts] = line.trim().split(/\s+/);
            return { status, path: pathParts.join(" ") };
          });
        const treeRaw = git(`ls-tree -r --name-only ${commit}`);
        const tree = treeRaw.trim().split("\n").filter(Boolean).map(path => ({
          path,
          type: 'file'
        }));

        return NextResponse.json({
          hash, author, email, date, message,
          messageShort: message.split("\n")[0],
          diff, files, tree,
        });
      } catch (e) {
        // Fallback for tags/special commits
        const diff = git(`show ${commit}`);
        const files = git(`diff-tree --no-commit-id -r --name-status ${commit}`)
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((line: string) => {
            const [status, ...pathParts] = line.trim().split(/\s+/);
            return { status, path: pathParts.join(" ") };
          });
        return NextResponse.json({
          hash: commit,
          author: "Unknown",
          email: "Unknown",
          date: "Unknown",
          message: "Commit details unavailable",
          messageShort: "Commit details unavailable",
          diff, files, tree: [],
        });
      }
    }

    const identities = getAgentIdentities();
    let authorFilter = "";
    if (agent && agent !== "all") {
      const id = identities[agent];
      authorFilter = id ? `--author="${id.email}"` : `--author="${agent}"`;
    }

    let grepFilter = query ? `--grep="${query}"` : "";
    const format = "--format='%H|%an|%ae|%ai|%s'";
    const cmd = `log ${format} ${authorFilter} ${grepFilter} --max-count=${max} --graph`;
    const raw = git(cmd);

    const commits = raw.trim().split("\n").filter(Boolean).map((line: string) => {
      const match = line.match(/^([\s*|/\\-]+)?'?([^']*)'?\s*$/);
      const graph = (match?.[1] || "").trim();
      const data = (match?.[2] || line).trim().replace(/^'|'$/g, "");
      const parts = data.split("|");
      if (parts.length < 5) return null;
      return {
        hash: parts[0],
        author_name: parts[1],
        author_email: parts[2],
        date: parts[3],
        message: parts.slice(4).join("|"),
        graph: graph || null,
      };
    }).filter(Boolean);

    const agentList = Object.entries(identities).map(([id, ident]) => ({
      id, name: ident.name, email: ident.email,
    }));

    const gkVersion = (() => {
      try { return require("child_process").execSync("gk --version", { encoding: "utf-8" }).trim(); }
      catch { return "unknown"; }
    })();

    return NextResponse.json({
      commits,
      agents: agentList,
      total: commits.length,
      meta: { powered_by: "gitkraken-mcp", version: gkVersion, tools_url: "https://help.gitkraken.com/mcp/mcp-tools-reference/" },
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json({ error: err.message, commits: [], agents: [] }, { status: 500 });
  }
}
