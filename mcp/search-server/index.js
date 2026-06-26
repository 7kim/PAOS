#!/usr/bin/env node

/**
 * PAOS Search MCP Server v2
 *
 * Provides a `search_knowledge` tool using Ollama embeddings for semantic search.
 * Falls back to TF-IDF cosine similarity when Ollama is unavailable.
 *
 * Embedding model: nomic-embed-text (auto-pulled if missing)
 * Cache: embeddings.json with content-hash keys for fast re-indexing
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile, readdir, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";

// ── Config ──────────────────────────────────────────────────────────────

const REPO_ROOT = process.env.REPO_ROOT || "/home/dev/AI_Workflow";
const KNOWLEDGE_DIRS = ["knowledge/docs", "docs"];
const INDEX_TTL = 60_000; // rebuild index every 60s
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const EMBED_MODEL = "nomic-embed-text";
const EMBED_DIM = 768;

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = join(__dirname, "embeddings.json");

// ── TF-IDF Fallback ─────────────────────────────────────────────────────

function tokenize(text) {
  const freq = new Map();
  const words = text.toLowerCase().match(/\p{L}+/gu) || [];
  const stopWords = new Set([
    "the","a","an","is","are","was","were","be","been","being","have","has","had",
    "do","does","did","will","would","could","should","may","might","shall","can",
    "to","of","in","for","on","with","at","by","from","as","into","through","during",
    "before","after","above","below","between","out","off","over","under","again",
    "further","then","once","here","there","when","where","why","how","all","each",
    "every","both","few","more","most","other","some","such","no","nor","not","only",
    "own","same","so","than","too","very","just","because","but","and","or","if",
    "while","that","this","these","those","it","its","you","your","we","our","they",
    "their","what","which","who","whom",
  ]);
  for (const w of words) {
    if (!stopWords.has(w) && w.length > 2) freq.set(w, (freq.get(w) || 0) + 1);
  }
  return freq;
}

function tfidfSimilarity(a, b) {
  const vecA = tokenize(a), vecB = tokenize(b);
  const allTerms = new Set([...vecA.keys(), ...vecB.keys()]);
  if (allTerms.size === 0) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (const t of allTerms) {
    const fa = vecA.get(t) || 0, fb = vecB.get(t) || 0;
    dot += fa * fb; magA += fa * fa; magB += fb * fb;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Ollama Embeddings ───────────────────────────────────────────────────

let ollamaAvailable = null; // null = untested, true/false = known

async function checkOllama() {
  if (ollamaAvailable !== null) return ollamaAvailable;
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    ollamaAvailable = res.ok;
    return ollamaAvailable;
  } catch {
    ollamaAvailable = false;
    return false;
  }
}

/** Ensure the embedding model is pulled. */
async function ensureModel() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: EMBED_MODEL, stream: false }),
      signal: AbortSignal.timeout(120_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Get embedding vector for a text string from Ollama. */
async function getEmbedding(text) {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, prompt: text.slice(0, 8192) }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Ollama returned ${res.status}`);
  const data = await res.json();
  return data.embedding;
}

/** Compute cosine similarity between two embedding vectors. */
function vecCosine(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Embedding Cache ─────────────────────────────────────────────────────

let embedCache = { model: "", version: 0, entries: {} };

async function loadCache() {
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    embedCache = JSON.parse(raw);
  } catch {
    embedCache = { model: EMBED_MODEL, version: 0, entries: {} };
  }
}

async function saveCache() {
  await writeFile(CACHE_FILE, JSON.stringify(embedCache, null, 2));
}

/** Content hash for cache key. */
function contentHash(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

// ── Document Index ──────────────────────────────────────────────────────

let cachedIndex = null;
let lastIndexTime = 0;

async function buildIndex() {
  const chunks = [];
  const seen = new Set();

  for (const subdir of KNOWLEDGE_DIRS) {
    const dir = join(REPO_ROOT, subdir);
    let files;
    try { files = await readdir(dir); } catch { continue; }

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      if (seen.has(file)) continue;
      seen.add(file);

      try {
        const content = await readFile(join(dir, file), "utf-8");
        const titleMatch = content.match(/^#\s+(.+)/m);
        const title = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, "");

        const sections = content.split(/(?=^##\s)/m);
        for (const section of sections) {
          const cleaned = section.trim();
          if (cleaned.length < 20) continue;
          chunks.push({
            path: `${subdir}/${file}`,
            title,
            content: cleaned,
            snippet: cleaned.slice(0, 200).replace(/\n/g, " ").trim(),
          });
        }
      } catch { /* skip */ }
    }
  }

  // If Ollama is available, pre-compute embeddings for new/changed chunks
  if (ollamaAvailable) {
    await loadCache();
    let changed = false;
    for (const chunk of chunks) {
      const h = contentHash(chunk.content);
      const key = `${chunk.path}::${h}`;
      if (!embedCache.entries[key]) {
        try {
          chunk.embedding = await getEmbedding(chunk.content);
          embedCache.entries[key] = chunk.embedding;
          changed = true;
        } catch {
          // Will fall back to TF-IDF for this chunk
        }
      } else {
        chunk.embedding = embedCache.entries[key];
      }
    }
    if (changed) await saveCache();
  }

  return chunks;
}

async function getIndex() {
  const now = Date.now();
  if (cachedIndex && now - lastIndexTime < INDEX_TTL) return cachedIndex;
  cachedIndex = await buildIndex();
  lastIndexTime = now;
  return cachedIndex;
}

// ── Search ──────────────────────────────────────────────────────────────

async function search(query, topK = 5) {
  const index = await getIndex();
  if (!query.trim()) return [];

  let queryEmbedding = null;
  if (ollamaAvailable) {
    try {
      queryEmbedding = await getEmbedding(query);
    } catch {
      // Fall back to TF-IDF
    }
  }

  const scored = index.map((chunk) => {
    let score;
    if (queryEmbedding && chunk.embedding) {
      score = vecCosine(queryEmbedding, chunk.embedding);
    } else {
      score = tfidfSimilarity(query, chunk.content);
    }
    return { ...chunk, score };
  });

  return scored
    .filter((r) => r.score > 0.01)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => ({
      path: r.path,
      title: r.title,
      snippet: r.snippet,
      score: Math.round(r.score * 1000) / 10,
    }));
}

// ── MCP Server ──────────────────────────────────────────────────────────

const server = new Server(
  { name: "paos-search", version: "2.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const ollamaOk = await checkOllama();
  return {
    tools: [
      {
        name: "search_knowledge",
        description: `Semantic search across PAOS knowledge documents using ${ollamaOk ? "Ollama embeddings (nomic-embed-text)" : "TF-IDF cosine similarity"}. Returns relevant snippets ranked by relevance.`,
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            topK: { type: "number", description: "Max results (default 5, max 20)", default: 5 },
          },
          required: ["query"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "search_knowledge") {
    const query = String(args?.query || "");
    const topK = Math.min(20, Math.max(1, parseInt(args?.topK) || 5));
    if (!query.trim()) return { content: [{ type: "text", text: "Provide a query." }], isError: true };

    try {
      // Lazy-init Ollama on first search
      if (ollamaAvailable === null) {
        await checkOllama();
        if (ollamaAvailable) await ensureModel();
      }

      const results = await search(query, topK);
      if (results.length === 0) {
        return { content: [{ type: "text", text: `No results for "${query}".` }] };
      }

      const engine = ollamaAvailable ? "Ollama embeddings" : "TF-IDF";
      const formatted = results
        .map((r, i) => `[${i + 1}] ${r.title} (${r.score}% match)\n    Path: ${r.path}\n    ${r.snippet}`)
        .join("\n\n");

      return {
        content: [{ type: "text", text: `Search results for "${query}" (${engine}):\n\n${formatted}` }],
      };
    } catch (e) {
      return { content: [{ type: "text", text: `Search error: ${e.message}` }], isError: true };
    }
  }

  return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
});

// ── Startup ─────────────────────────────────────────────────────────────

// Pre-check Ollama availability at startup
checkOllama().then((ok) => {
  if (ok) console.error(`[paos-search] Ollama available at ${OLLAMA_URL} — using ${EMBED_MODEL}`);
  else console.error("[paos-search] Ollama not available — using TF-IDF fallback");
}).catch(() => {});

const transport = new StdioServerTransport();
await server.connect(transport);
