import { readdir, readFile } from "fs/promises";
import { join } from "path";
import * as yaml from "js-yaml";

const HOME = process.env.HOME || "/home/dev";
const DOCS_DIR = join(HOME, "AI_Workflow", "knowledge", "docs");

export interface HealthIssue {
  type: "broken-wikilink" | "missing-frontmatter" | "orphan";
  file: string;
  detail: string;
}

export interface HealthSummary {
  totalDocs: number;
  issues: HealthIssue[];
  brokenLinks: number;
  orphans: number;
  missingFrontmatter: number;
}

/** Extract all [[wikilink]] targets from text, normalising |pipe and #heading forms. */
function extractWikilinks(text: string): string[] {
  const regex = /\[\[([^\]]+)\]\]/g;
  const targets: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    // Get the part before any |pipe or #heading
    const raw = match[1];
    // Strip display text after |
    const withoutDisplay = raw.split("|")[0];
    // Strip heading after #
    const target = withoutDisplay.split("#")[0].trim();
    if (target) targets.push(target);
  }
  return targets;
}

/** Extract YAML frontmatter from markdown content. Returns null if missing. */
function parseFrontmatter(
  content: string
): Record<string, unknown> | null {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith("---")) return null;
  const endIndex = trimmed.indexOf("---", 3);
  if (endIndex === -1) return null;
  const yamlStr = trimmed.slice(3, endIndex).trim();
  if (!yamlStr) return null;
  try {
    const parsed = yaml.load(yamlStr);
    if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
    return null;
  } catch {
    return null;
  }
}

/** Run the health check against the knowledge docs directory. */
export async function scanKnowledgeHealth(): Promise<HealthSummary> {
  let files: string[];
  try {
    files = (await readdir(DOCS_DIR)).filter(
      (f) => f.endsWith(".md") && !f.startsWith(".")
    );
  } catch {
    return { totalDocs: 0, issues: [], brokenLinks: 0, orphans: 0, missingFrontmatter: 0 };
  }

  const issues: HealthIssue[] = [];

  // Build a set of known doc filenames (without .md extension) for wikilink resolution
  const knownDocs = new Set(files.map((f) => f.replace(/\.md$/, "")));

  // Track per-file data
  const fileData: Record<
    string,
    { content: string; wikilinks: string[]; hasFrontmatter: boolean }
  > = {};

  // Inbound link tracking: file -> set of files that link to it
  const inboundLinks: Record<string, Set<string>> = {};
  for (const f of files) {
    const baseName = f.replace(/\.md$/, "");
    inboundLinks[baseName] = new Set();
  }

  // Phase 1: read all files, check frontmatter, extract wikilinks
  for (const file of files) {
    const fullPath = join(DOCS_DIR, file);
    let content: string;
    try {
      content = await readFile(fullPath, "utf-8");
    } catch {
      continue;
    }

    const baseName = file.replace(/\.md$/, "");
    const fm = parseFrontmatter(content);
    const hasFrontmatter = fm !== null;

    if (!hasFrontmatter) {
      issues.push({
        type: "missing-frontmatter",
        file,
        detail: "File has no valid YAML frontmatter",
      });
    }

    const wikilinks = extractWikilinks(content);

    fileData[baseName] = { content, wikilinks, hasFrontmatter };

    // Track inbound links
    for (const link of wikilinks) {
      if (link === baseName) continue; // skip self-links
      if (inboundLinks[link]) {
        inboundLinks[link].add(baseName);
      }
    }
  }

  // Phase 2: check wikilinks are valid (target exists)
  for (const [baseName, data] of Object.entries(fileData)) {
    for (const link of data.wikilinks) {
      // Skip self-links
      if (link === baseName) continue;
      // Check if the target exists as a known doc
      if (!knownDocs.has(link)) {
        issues.push({
          type: "broken-wikilink",
          file: `${baseName}.md`,
          detail: `Wikilink [[${link}]] points to non-existent document`,
        });
      }
    }
  }

  // Phase 3: find orphans (files with zero inbound links from other files)
  for (const file of files) {
    const baseName = file.replace(/\.md$/, "");
    if ((inboundLinks[baseName]?.size ?? 0) === 0) {
      issues.push({
        type: "orphan",
        file,
        detail: "No inbound [[wikilinks]] from any other document",
      });
    }
  }

  return {
    totalDocs: files.length,
    issues,
    brokenLinks: issues.filter((i) => i.type === "broken-wikilink").length,
    orphans: issues.filter((i) => i.type === "orphan").length,
    missingFrontmatter: issues.filter((i) => i.type === "missing-frontmatter").length,
  };
}
