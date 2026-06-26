/**
 * PAOS RAG Search — semantic search over PAOS knowledge documents.
 *
 * Indexes markdown files from the knowledge directory at startup
 * and provides ranked search results using cosine similarity
 * (via lib/similarity.ts). No external embeddings or ML deps.
 *
 * For production-scale, swap to sqlite-vec or pgvector.
 */

import { readdir, readFile, stat } from "fs/promises";
import { join, relative } from "path";
import { cosineSimilarity } from "@/lib/similarity";

// ── Types ───────────────────────────────────────────────────────────────

/** A single indexed document chunk. */
export interface DocChunk {
  path: string;
  title: string;
  content: string;
  /** First 200 chars for preview. */
  snippet: string;
  /** File modification time (for cache invalidation). */
  mtimeMs: number;
}

export interface SearchResult {
  path: string;
  title: string;
  snippet: string;
  score: number;
  /** Line number of the best match. */
  matchLine?: number;
}

// ── Index ───────────────────────────────────────────────────────────────

const KNOWLEDGE_DIRS = [
  "knowledge/docs",
  "docs",
];

let cachedIndex: DocChunk[] | null = null;
let lastIndexTime = 0;
const INDEX_TTL = 30_000; // rebuild every 30s

/** Build or rebuild the document index from knowledge directories. */
async function buildIndex(root: string): Promise<DocChunk[]> {
  const chunks: DocChunk[] = [];
  const seen = new Set<string>();

  for (const subdir of KNOWLEDGE_DIRS) {
    const dir = join(root, subdir);
    const files = await readdir(dir).catch(() => []);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const fullPath = join(dir, file);
      const relPath = `${subdir}/${file}`;
      if (seen.has(relPath)) continue;
      seen.add(relPath);

      try {
        const content = await readFile(fullPath, "utf-8");
        const mtime = (await stat(fullPath)).mtimeMs;

        // Extract title from first H1 or filename
        const titleMatch = content.match(/^#\s+(.+)/m);
        const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, "");

        // Split into chunks by H2 sections for granularity
        const sections = content.split(/(?=^##\s)/m);
        for (const section of sections) {
          const cleaned = section.trim();
          if (cleaned.length < 20) continue;
          chunks.push({
            path: relPath,
            title,
            content: cleaned,
            snippet: cleaned.slice(0, 200).replace(/\n/g, " ").trim(),
            mtimeMs: mtime,
          });
        }
      } catch {
        // skip unreadable files
      }
    }
  }

  return chunks;
}

/** Get index, rebuilding if stale. */
export async function getIndex(root: string): Promise<DocChunk[]> {
  const now = Date.now();
  if (cachedIndex && now - lastIndexTime < INDEX_TTL) {
    return cachedIndex;
  }
  cachedIndex = await buildIndex(root);
  lastIndexTime = now;
  return cachedIndex;
}

// ── Search ──────────────────────────────────────────────────────────────

/** Search indexed documents by query, returning top-k results. */
export async function search(
  query: string,
  root: string,
  topK = 10,
): Promise<SearchResult[]> {
  const index = await getIndex(root);
  if (!query.trim()) return [];

  const scored = index
    .map((chunk) => ({
      path: chunk.path,
      title: chunk.title,
      snippet: chunk.snippet,
      score: cosineSimilarity(query, chunk.content),
      content: chunk.content,
    }))
    .filter((r) => r.score > 0.01)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Find best matching line for each result
  return scored.map((r) => {
    const lines = r.content.split("\n");
    const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
    let bestLine = 0;
    let bestHits = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineLow = lines[i].toLowerCase();
      const hits = queryWords.filter((w) => lineLow.includes(w)).length;
      if (hits > bestHits) {
        bestHits = hits;
        bestLine = i + 1;
      }
    }
    return {
      path: r.path,
      title: r.title,
      snippet: r.snippet,
      score: Math.round(r.score * 1000) / 10, // percentage-like
      matchLine: bestLine,
    };
  });
}
