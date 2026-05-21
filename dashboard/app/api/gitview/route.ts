import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { readFile } from "fs/promises";
import { join } from "path";

const REPO_ROOT = process.env.REPO_ROOT || "/home/dev/AI_Workflow";

// Agent git identities loaded from registry
function getAgentIdentities(): Record<string, { name: string; email: string }> {
  try {
    const reg = JSON.parse(
      require("fs").readFileSync(join(REPO_ROOT, "agents", "registry.json"), "utf-8")
    );
    const map: Record<string, { name: string; email: string }> = {};
    for (const a of reg.agents) {
      if (a.gitIdentity) {
        // Multiple agents can share identity (antigravity/antigravity-ide)
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

// ── API Routes ────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get("agent") || "";
  const commit = searchParams.get("commit") || "";
  const max = parseInt(searchParams.get("max") || "50", 10);
  const query = searchParams.get("q") || "";

  try {
    // ── Single commit detail ──────────────────────────────────────────────────
    if (commit) {
      const log = git(`log -1 --format="%H|%an|%ae|%ai|%s" ${commit}`);
      if (!log.trim()) {
        return NextResponse.json({ error: "Commit not found" }, { status: 404 });
      }
      const [hash, author, email, date, ...msgParts] = log.trim().split("|");
      const message = msgParts.join("|");

      // Full diff
      const diff = git(`diff ${commit}^..${commit} 2>/dev/null || show ${commit}`);

      // Files changed
      const files = git(`diff-tree --no-commit-id -r --name-status ${commit}`)
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line: string) => {
          const [status, ...pathParts] = line.trim().split(/\s+/);
          return { status, path: pathParts.join(" ") };
        });

      return NextResponse.json({
        hash,
        author,
        email,
        date,
        message,
        messageShort: message.split("\n")[0],
        diff,
        files,
      });
    }

    // ── Commit list ───────────────────────────────────────────────────────────
    const identities = getAgentIdentities();

    // Build author filter
    let authorFilter = "";
    if (agent && agent !== "all") {
      const id = identities[agent];
      if (id) {
        authorFilter = `--author="${id.name}"`;
      } else {
        authorFilter = `--author="${agent}"`;
      }
    }

    // Text search
    let grepFilter = "";
    if (query) {
      grepFilter = `--grep="${query}"`;
    }

    const format = "--format='%H|%an|%ae|%ai|%s'";
    const cmd = `log ${format} ${authorFilter} ${grepFilter} --max-count=${max} --graph`;
    const raw = git(cmd);

    const commits = raw
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line: string) => {
        // Extract graph prefix (may contain *, |, \, /) and the data part
        const match = line.match(/^([\s*|/\\-]+)?'?([^']*)'?\s*$/);
        const graph = (match?.[1] || "").trim();
        const data = (match?.[2] || line).trim();
        // Strip leading/trailing quotes
        const clean = data.replace(/^'|'$/g, "");
        const parts = clean.split("|");
        if (parts.length < 5) return null;
        return {
          hash: parts[0],
          author_name: parts[1],
          author_email: parts[2],
          date: parts[3],
          message: parts.slice(4).join("|"),
          graph: graph || null,
        };
      })
      .filter(Boolean);

    // Map agent id if we can identify from author email/name
    const agentList = Object.entries(identities).map(([id, ident]) => ({
      id,
      name: ident.name,
      email: ident.email,
    }));

    // Mark as GitKraken-powered
    const gkVersion = (() => {
      try {
        return require("child_process").execSync("gk --version", { encoding: "utf-8" }).trim();
      } catch { return "unknown"; }
    })();

    return NextResponse.json({
      commits,
      agents: agentList,
      total: commits.length,
      meta: {
        powered_by: "gitkraken-mcp",
        version: gkVersion,
        tools_url: "https://help.gitkraken.com/mcp/mcp-tools-reference/",
      },
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json({ error: err.message, commits: [], agents: [] }, { status: 500 });
  }
}
