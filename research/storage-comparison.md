# Storage Approaches for PAOS Agent Memory — Comprehensive Comparison

> **Research date:** 2026-06-26
> **Context:** PAOS v1.0 — multi-agent AI orchestration with 13 agents, file-based inboxes, pipeline submission, Obsidian-backed knowledge vault.
> **Question:** What is the best storage/memory approach going forward?

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Approach A: RAG on Filesystem](#2-approach-a-rag-on-filesystem)
3. [Approach B: SQLite + sqlite-vec](#3-approach-b-sqlite--sqlite-vec)
4. [Approach C: PostgreSQL + pgvector](#4-approach-c-postgresql--pgvector)
5. [Approach D: Obsidian Vault Integration](#5-approach-d-obsidian-vault-integration)
6. [Comparison Matrix](#6-comparison-matrix)
7. [Recommendation](#7-recommendation)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. Current State

### What PAOS uses today

| Layer | Technology | Scale |
|-------|-----------|-------|
| Agent communication | File-based inboxes (`memory/inbox/<agent>/*.md`) | ~12 files across 10 inboxes |
| Pipeline state | `memory/pipelines/PAOS/<PIPE-ID>/` directories | 7 pipelines |
| Shared state | `memory/shared/HANDOFF.md`, `memory/shared/context.md` | 2 files |
| Audit | `memory/global_ledger.md` | ~54 lines |
| Knowledge docs | `knowledge/docs/*.md` (Obsidian vault) | 8 files, ~457 lines total |
| Queue | `memory/queue/queue.json` | 1 file |
| Per-agent events | `memory/<agent>/events.md` | ~11 files |
| Agent registry | `agents/registry.json` | JSON, 355 lines |

### Constraints

- **No pip** — Python 3.14.4 with PEP 668 (system package isolation). Must use `uv` or venv for any Python dependencies.
- **No PostgreSQL** available on this host (Ubuntu 7.0.0-22-generic, 98 GB disk, 27% used).
- **Obsidian vault already exists** at `knowledge/docs/` with `.obsidian/` config and plugins enabled (graph, backlinks, tags, global-search, canvas).
- **Shared-memory MCP server** (Node.js) already handles memory operations. Any new storage layer should integrate with or complement this.
- **Multi-agent access** — 13 distinct agents read/write memory. Any solution must handle concurrent access patterns.
- **Disk**: ~69 GB free. Running on a single VPS with Tailscale serve.

---

## 2. Approach A: RAG on Filesystem

### Description
Keep markdown files as the source of truth. Add a **semantic search layer** on top using local embeddings (Ollama, sentence-transformers, or TF-IDF) that indexes the `.md` files and returns relevant chunks to agents on query.

### Setup Effort

| Method | Effort | Dependencies |
|--------|--------|-------------|
| **TF-IDF** (scikit-learn) | Low — pure Python, no external model | `scikit-learn`, run via uv/venv |
| **sentence-transformers** | Medium — download model (~500 MB) | `sentence-transformers`, `torch` via uv |
| **Ollama embeddings** | Medium — needs Ollama server | Ollama installed + `nomic-embed-text` or similar model |

**Estimated time to prototype:** 2–4 hours (TF-IDF = fast, Ollama = slower)

### Query Performance

| Method | Latency (1st call) | Latency (subsequent) | Quality |
|--------|-------------------|---------------------|---------|
| TF-IDF | ~50 ms (build index on 100 docs) | ~10 ms | Keyword-only — misses synonyms, no semantic understanding |
| sentence-transformers | ~3 s (model load) + ~200 ms per query | ~200 ms per query | Good semantic matching, multilingual |
| Ollama embeddings | ~5 s (model load) + ~500 ms per query | ~300–500 ms per query | Good semantic matching, depends on model size |

### Scalability

| Scale | Feasibility | Notes |
|-------|-------------|-------|
| **100 docs** (~500 KB) | ✅ Excellent | TF-IDF index is instant. Embeddings fit in RAM. |
| **10K docs** (~50 MB) | ⚠️ Good | TF-IDF still fast. Embeddings ~2 GB RAM. Loading all into memory is fine. |
| **1M docs** (~5 GB) | ❌ Strained | Full-text grep + in-memory vectors struggle. Need chunking strategy, incremental indexing, and likely a real vector DB. |

### Integration Complexity with PAOS

- **Pro:** Zero changes to existing file structures. Knowledge docs remain plain `.md` files.
- **Pro:** Agents can still read files directly (no single point of failure).
- **Con:** Need a new service/script to run periodically to re-index changed files.
- **Con:** The `shared-memory` MCP server would need a RAG endpoint added (or a sidecar MCP server).
- **Con:** No ACID guarantees — concurrent writes from multiple agents can cause race conditions on file reads.

### Pros & Cons for Agent Memory Retrieval

| Pros | Cons |
|------|------|
| ✅ Zero migration — files are the source of truth | ❌ No structured query capabilities (no SQL, no filtering by agent/date/type) |
| ✅ Simple mental model — agents just read/write markdown | ❌ Stale index — files can change and the RAG index won't know without a watcher |
| ✅ Works with any tool (cat, grep, MCP, LLM) | ❌ TF-IDF has weak semantic understanding |
| ✅ No external services to manage (for TF-IDF) | ❌ sentence-transformers/Ollama add Python dependencies and GPU-via-CPU overhead |
| ✅ Cheap incremental cost | ❌ Cross-agent concurrent writes to same doc are risky |

---

## 3. Approach B: SQLite + sqlite-vec

### Description
Replace (or supplement) the file-based memory with **SQLite** using the **sqlite-vec** extension for vector search. Structured metadata (agent, timestamp, type, tags) lives in standard SQL tables. Document chunks have embedding vectors stored in sqlite-vec virtual tables. Single-file, zero-config.

### Setup Effort

| Component | Effort | Details |
|-----------|--------|---------|
| SQLite3 | ✅ Already available | `sqlite3` CLI and Python `sqlite3` stdlib included |
| sqlite-vec | **Low–Medium** | Must compile or download prebuilt extension (~5 MB). Python binding via `sqlite-vec` PyPI package. |
| Embeddings | **Medium** | Same embedding models as Approach A. Need to generate vectors during ingestion. |

**Estimated time to prototype:** 3–6 hours

### Query Performance

| Operation | Latency | Notes |
|-----------|---------|-------|
| INSERT (single doc) | ~1 ms + embedding time | Embedding is the bottleneck, not SQLite |
| Structured SELECT | ~1–5 ms | Fully indexed, B-tree for agent/timestamp/type |
| Vector k-NN search (100 docs) | ~5–15 ms | sqlite-vec uses IVF and flat indexes |
| Vector k-NN search (10K docs) | ~50–200 ms | Depends on index type (IVF vs flat) |
| Hybrid (structured + vector) | ~10–100 ms | Filter first, then re-rank by vector similarity |

### Scalability

| Scale | Feasibility | Notes |
|-------|-------------|-------|
| **100 docs** | ✅ Excellent | Trivial. Single-file, no config. |
| **10K docs** | ✅ Excellent | SQLite handles this easily. DB file ~200 MB with vectors. |
| **1M docs** | ⚠️ Moderate | SQLite can handle this (WAL mode, pragma tuning). Vector search slows but sqlite-vec IVF indexes help. Single-file DB would be ~2–5 GB. Concurrent readers are fine. **Writes become a bottleneck** — sqlite-vec doesn't support concurrent writers well. |

### Integration Complexity with PAOS

- **Pro:** Single file — easy to back up, sync, deploy. No daemon or server process needed.
- **Pro:** Can be exposed as an MCP tool via the existing `shared-memory` server (add sqlite3 bindings to the Node.js server).
- **Pro:** Structured queries enable powerful retrieval: "Find all messages from agent X in the last 24 hours about topic Y sorted by recency."
- **Con:** Requires migration of existing `.md` files into the DB. Hybrid approach (files + DB) adds complexity.
- **Con:** sqlite-vec is newer (2024+) — smaller community, fewer recipes/troubleshooting resources.
- **Con:** Agents that currently read/write `.md` files directly would need updated tooling.

### Pros & Cons for Agent Memory Retrieval

| Pros | Cons |
|------|------|
| ✅ Structured + vector search in one DB | ❌ Migration needed from flat-file system |
| ✅ Zero infrastructure — single file, no server | ❌ sqlite-vec is relatively new ecosystem |
| ✅ ACID transactions for concurrent agent writes | ❌ Concurrent write throughput limited |
| ✅ Very fast for small-to-medium scale (current PAOS size) | ❌ Embedding generation is still an external dependency |
| ✅ Backs up with `cp` (just copy the file) | ❌ Binary format — not human-readable like `.md` files |
| ✅ Works offline, no network needed | ❌ Long-running write transactions could block readers |

---

## 4. Approach C: PostgreSQL + pgvector

### Description
Stand up PostgreSQL with the **pgvector** extension. Structured memory data in relational tables. Document embeddings in a vector column with indexed nearest-neighbor search. This is the gold standard for production RAG systems.

### Setup Effort

| Component | Effort | Details |
|-----------|--------|---------|
| PostgreSQL install | **Medium** | `apt install postgresql postgresql-contrib` — not currently installed |
| pgvector extension | **Low** | `CREATE EXTENSION vector;` — available via apt or compile from source |
| Schema design | **Medium** | Agent memory tables, document chunks, vector columns |
| Connection management | **Low–Medium** | Need a connection pool for 13 concurrent agents |
| Embedding pipeline | **Medium** | Same as other approaches |

**Estimated time to prototype:** 4–8 hours

### Query Performance

| Operation | Latency | Notes |
|-----------|---------|-------|
| Structured SELECT | ~1–3 ms | Full PostgreSQL optimizer |
| Vector k-NN (IVFFlat index, 100 docs) | ~5 ms | Extremely fast with proper indexing |
| Vector k-NN (IVFFlat index, 10K docs) | ~10–30 ms | pgvector is production-grade |
| Hybrid (structured + vector) | ~10–50 ms | Filtered indexes, re-ranking |
| Concurrent reads/writes | ✅ Excellent | PostgreSQL handles hundreds of concurrent connections |

### Scalability

| Scale | Feasibility | Notes |
|-------|-------------|-------|
| **100 docs** | ✅ Excellent | Overkill for this scale, but it works. |
| **10K docs** | ✅ Excellent | Perfect fit — this is pgvector's sweet spot. |
| **1M docs** | ✅ Excellent | pgvector handles this scale easily. HNSW indexes for fast approximate search. JSONB + vector indexing. |
| **10M+ docs** | ✅ Good | Vertical scaling (more RAM) or read replicas. PostgreSQL can handle it. |

### Integration Complexity with PAOS

- **Pro:** Industry standard — vast ecosystem, tooling, monitoring, backups (`pg_dump`).
- **Pro:** Can be integrated as an MCP server (write a pgvector MCP tool).
- **Pro:** JSONB columns for flexible agent-specific metadata. Full-text search via `tsvector` alongside vector search.
- **Con:** **Not currently installed.** Needs `apt install`, `systemctl start`, user/database creation, firewall config.
- **Con:** Adds ~200 MB for PostgreSQL + ~100 MB RAM baseline. On a 98 GB disk VPS, this is manageable but is one more service to maintain.
- **Con:** Multi-agent connection management — each agent needs credentials or a pooled connection.
- **Con:** Backup/restore is more involved than copying files. Need `pg_dump` / WAL archiving.
- **Con:** pgvector has limited index types (IVFFlat, HNSW) compared to dedicated vector DBs (Pinecone, Qdrant), but sufficient for PAOS scale.

### Pros & Cons for Agent Memory Retrieval

| Pros | Cons |
|------|------|
| ✅ Best-in-class concurrent multi-agent access | ❌ Infrastructure overhead — new service to manage |
| ✅ Most mature vector search ecosystem | ❌ Overkill for current PAOS scale (~50 files) |
| ✅ Full ACID + replication + point-in-time recovery | ❌ Learning curve for agent developers |
| ✅ JSONB + full-text + vector = most flexible querying | ❌ Embeddings still an external pipeline |
| ✅ Huge community, endless troubleshooting resources | ❌ Binary wire protocol; agents need a driver |
| ✅ Scales to millions of documents without redesign | ❌ Memory footprint matters on a small VPS |

---

## 5. Approach D: Obsidian Vault Integration

### Description
**Obsidian is already partially integrated** — `knowledge/docs/` has `.obsidian/` config with graph, backlinks, tags, and global-search enabled. This approach deepens the integration: agents use Obsidian as their primary knowledge store, leveraging its graph view, bidirectional linking, tag taxonomy, and search. Agents write notes in Obsidian-flavored markdown with `[[wikilinks]]`, `#tags`, and structured frontmatter.

### Setup Effort

| Component | Effort | Details |
|-----------|--------|---------|
| Obsidian vault | ✅ Already exists | `knowledge/docs/.obsidian/` with plugins already configured |
| Agent tooling | **Low** | Teach agents to use `[[wikilinks]]` and `#tags` in their notes |
| Semantic search | **None–Medium** | Obsidian's built-in search is full-text only. For semantic search, need the Obsidian Local LLM plugin or a sidecar RAG |
| Graph API | **Low** | Parse the `.obsidian/graph.json` cache or rebuild the graph from file links |

**Estimated time to prototype:** 1–3 hours (basic integration), 4–8 hours (full semantic)

### Query Performance

| Operation | Latency | Notes |
|-----------|---------|-------|
| Full-text search | ~20–100 ms | Obsidian's built-in search (powered by ripgrep-like indexing) |
| Graph backlinks query | ~5–10 ms | Pre-computed from file links |
| Tag filter | ~5–10 ms | Obsidian tags are fast |
| Semantic search | **Variable** | Not natively supported — needs plugin or external RAG |
| Canvas view | GUI-only | No programmatic API for Obsidian canvas |

### Scalability

| Scale | Feasibility | Notes |
|-------|-------------|-------|
| **100 docs** | ✅ Excellent | Obsidian vaults are designed for this. Graph is fast, search is instant. |
| **10K docs** | 🌟 Excellent | Many Obsidian users have 5K–20K notes. Graph gets visually dense but functionally fine. |
| **1M docs** | ❌ Poor | Obsidian is not designed for this. File watcher and graph would become sluggish. Vault-level operations (full-text search rebuilds) would take minutes. |

### Integration Complexity with PAOS

- **Pro:** **Zero migration** — the vault already exists. Agents already write markdown.
- **Pro:** Obsidian's graph view is a powerful auditing/exploration tool for humans. You can visually see how agent knowledge is connected.
- **Pro:** Backlinks (`[[wikilinks]]`) create an implicit knowledge graph that agents can traverse: "What documents does this concept link to?"
- **Pro:** Tags (`#architecture`, `#decision`, `#bug`) create a lightweight taxonomy for filtering.
- **Pro:** Works fully offline. No server dependencies.
- **Con:** **No native semantic search.** Obsidian has no embedding/vector capability out of the box. You'd need a sidecar RAG system (back to Approach A).
- **Con:** **No programmatic graph API.** The graph is a GUI feature. Parsing backlinks requires scanning all files for `[[wikilinks]]` regex.
- **Con:** **No ACID for concurrent agents.** Multiple agents writing to the same vault can cause conflicts.
- **Con:** **Obsidian is a GUI tool.** Headless agents can't "see" the graph or canvas. They interact with flat markdown files.
- **Con:** Large-scale sync could be fragile. Obsidian Sync is a paid feature.

### Pros & Cons for Agent Memory Retrieval

| Pros | Cons |
|------|------|
| ✅ Already exists — no setup cost | ❌ No semantic search without external RAG |
| ✅ Human-friendly — inspect agent knowledge visually | ❌ No programmatic graph query API |
| ✅ Backlinks create implicit knowledge graph | ❌ Concurrent agent writes are risky |
| ✅ Tags enable lightweight filtering | ❌ Doesn't scale past ~50K docs |
| ✅ Agents write natural markdown | ❌ Graph analysis requires full file scan |
| ✅ Canvas for visual planning | ❌ Canvas is GUI-only, not agent-accessible |
| ✅ Works with git — vault is just markdown files | ❌ Obsidian Sync is paid; git is the alternative |

---

## 6. Comparison Matrix

| Criteria | A: RAG on Filesystem | B: SQLite + sqlite-vec | C: PostgreSQL + pgvector | D: Obsidian Vault |
|----------|---------------------|----------------------|------------------------|-------------------|
| **Setup effort** | 🟢 Low (TF-IDF) / 🟡 Medium (embeddings) | 🟡 Medium | 🔴 High | 🟢 Low (already exists) |
| **Query speed (100 docs)** | 🟢 <50 ms | 🟢 <15 ms | 🟢 <5 ms | 🟢 <100 ms |
| **Query speed (10K docs)** | 🟡 ~200 ms | 🟢 ~50 ms | 🟢 ~10 ms | 🟡 ~500 ms |
| **Query speed (1M docs)** | 🔴 Slow/degraded | 🟡 Moderate | 🟢 Fast with HNSW | 🔴 Not feasible |
| **Semantic search** | 🟢 Native | 🟢 Native | 🟢 Native | 🔴 Not native |
| **Structured queries** | 🔴 None | 🟢 SQL | 🟢 SQL | 🔴 None |
| **Concurrent access** | 🟡 File-locking | 🟡 WAL mode (readers fine) | 🟢 Full ACID | 🔴 No locking |
| **Human readability** | 🟢 Plain markdown | 🔴 Binary | 🔴 Binary | 🟢 Plain markdown |
| **Backup simplicity** | 🟢 `cp`/`rsync` | 🟢 `cp` file | 🟡 `pg_dump` | 🟢 `cp`/`git` |
| **Infrastructure** | 🟢 None | 🟢 Single file | 🔴 Server + service | 🟢 None |
| **Migration cost** | 🟢 None | 🟡 Medium | 🔴 High | 🟢 None |
| **Obsidian graph** | 🔴 No | 🔴 No | 🔴 No | 🟢 Yes |
| **Long-term scalability** | 🟡 Moderate | 🟡 Moderate | 🟢 Excellent | 🔴 Limited |
| **Ecosystem maturity** | 🟢 High | 🟡 New (sqlite-vec 2024) | 🟢 Very high | 🟢 High (Obsidian) |
| **Offline capability** | 🟢 Yes | 🟢 Yes | 🟡 Needs server up | 🟢 Yes |

### Weighted Score (for PAOS today)

Weighting assumptions for current PAOS (mid-2026, ~50 files, 13 agents, single VPS):

| Criterion | Weight | A: RAG-FS | B: SQLite-vec | C: PG-pgvector | D: Obsidian |
|-----------|--------|-----------|--------------|--------------|-------------|
| Setup effort | 15% | 9 (1.35) | 7 (1.05) | 4 (0.60) | 10 (1.50) |
| Query performance (current scale) | 15% | 8 (1.20) | 9 (1.35) | 9 (1.35) | 7 (1.05) |
| Semantic retrieval quality | 20% | 7 (1.40) | 8 (1.60) | 9 (1.80) | 4 (0.80) |
| Multi-agent concurrency | 15% | 5 (0.75) | 7 (1.05) | 10 (1.50) | 4 (0.60) |
| Integration with existing PAOS | 15% | 9 (1.35) | 6 (0.90) | 4 (0.60) | 9 (1.35) |
| Long-term scalability | 10% | 5 (0.50) | 6 (0.60) | 10 (1.00) | 3 (0.30) |
| Migration cost | 10% | 10 (1.00) | 6 (0.60) | 3 (0.30) | 10 (1.00) |
| **Total** | **100%** | **7.55** | **7.15** | **7.15** | **6.60** |

> **Note:** Scores are close because all approaches have real tradeoffs. The best choice depends on where PAOS is headed, not where it is today.

---

## 7. Recommendation

### Short-term (Now — 3 months): **Hybrid: Filesystem + Obsidian + Lightweight RAG**

**Do NOT jump to SQLite or PostgreSQL yet.** PAOS currently has ~50 memory files. A full database migration is premature optimization.

Instead:

1. **Keep the file-based system as-is.** Inboxes, pipelines, HANDOFF, ledger — all continue as markdown files. Zero disruption.
2. **Deepen Obsidian integration.** Teach all 13 agents to use `[[wikilinks]]`, `#tags`, and structured frontmatter in their knowledge docs. This costs nothing and immediately improves the human-observable knowledge graph.
3. **Add a lightweight TF-IDF RAG layer** as a simple MCP tool. Index `knowledge/docs/` and `memory/` files. Use `scikit-learn`'s `TfidfVectorizer` in a Python subprocess or a Node.js port. This gives basic semantic retrieval without embedding models or infrastructure.
4. **Optional embedding upgrade:** If TF-IDF proves too weak, add Ollama embeddings as an optional upgrade path (same RAG tool, swap the vectorizer).

This approach:
- Costs **zero infrastructure** (no new services, no databases)
- Has **zero migration cost**
- Can be built in **2–4 hours**
- Gives immediate semantic search capability
- Keeps the Obsidian graph valuable for human operators

### Medium-term (3–12 months): **Migrate to SQLite + sqlite-vec**

Once PAOS grows beyond ~1,000 documents and concurrency becomes a bottleneck:

1. **Migrate the structured memory** (global_ledger, events, queue) into SQLite tables with proper schema.
2. **Keep the knowledge docs as files** for human readability and Obsidian integration, but index them in sqlite-vec for vector search.
3. **Expose via the shared-memory MCP server** — add sqlite3 bindings to the existing Node.js MCP server.

Why SQLite over PostgreSQL for PAOS:
- **Single-binary deployment** — no server process to manage. Critical for a VPS-hosted system.
- **Backs up with `cp`** — trivial disaster recovery.
- **Good enough concurrency** — WAL mode supports many readers + one writer. 13 agents is well within SQLite's sweet spot.
- **sqlite-vec** is maturing fast and is sufficient for the mid-scale (10K–50K documents) PAOS will likely hit.
- **Lower memory footprint** than PostgreSQL — important on a 98 GB disk VPS sharing resources with Tailscale, Next.js dashboard, and agent processes.

### Long-term (12+ months): **Consider PostgreSQL + pgvector**

If PAOS reaches:
- 100K+ documents
- 50+ concurrent agents
- Requires point-in-time recovery and replication
- Needs full-text search alongside vector search (PostgreSQL `tsvector`)

...then invest in PostgreSQL + pgvector. By then, the migration path from SQLite is well-understood (pgloader or custom ETL), and the infrastructure cost is justified by scale.

### What NOT to do

| Don't do this | Why |
|---------------|-----|
| Jump straight to PostgreSQL | Infrastructure overhead not justified at current scale |
| Replace files entirely with a DB | You lose human readability, git diff, Obsidian integration |
| Rely solely on full-text search | Misses semantic relationships (e.g., "agent crash" won't match "runtime failure") |
| Add a dedicated vector DB (Pinecone, Qdrant) | Overkill, adds cost, adds network dependency, locks in a vendor |
| Use Obsidian as the sole knowledge system | No programmatic graph API, no ACID, no concurrent write support |

---

## 8. Implementation Roadmap

### Phase 1 — Immediate (This week)

```
[ ] 1. Update the shared-memory MCP server (or create a sidecar) with a /search MCP tool
[ ] 2. Implement TF-IDF search over knowledge/docs/ and memory/
[ ] 3. Document [[wikilink]] and #tag conventions for all agents in knowledge/docs/
[ ] 4. Add a `h-search` command that wraps the search tool for CLI agents
```

**Deliverable:** Agents can query `h-search "concept"` and get relevant document snippets ranked by relevance.

### Phase 2 — Short-term (Next 1–2 months)

```
[ ] 1. Evaluate if TF-IDF is sufficient or if Ollama embeddings are needed
[ ] 2. If embeddings: write a small Python service (uv-managed) that generates + caches embeddings
[ ] 3. Add chunking strategy (e.g., 512-token chunks with overlap)
[ ] 4. Create an Obsidian graph parser that generates a machine-readable knowledge graph
[ ] 5. Add a `h-graph` command: "What documents are linked to this one?"
```

**Deliverable:** Agent memory retrieval is semantic, not just keyword. Agents can traverse knowledge graph links.

### Phase 3 — Medium-term (3–6 months)

```
[ ] 1. Design SQLite schema for memory tables (events, ledger, queue, sessions)
[ ] 2. Add sqlite-vec vector table for document embeddings
[ ] 3. Build a migration script: flat-file → SQLite
[ ] 4. Update shared-memory MCP server to use SQLite backend
[ ] 5. Keep file-based writes working during transition (dual-write mode)
[ ] 6. Benchmark: verify sqlite-vec meets latency requirements
```

**Deliverable:** Structured + vector memory in a single SQLite file. Files still readable. Obsidian still works.

### Phase 4 — Long-term (12+ months, if needed)

```
[ ] 1. If scale demands it: provision PostgreSQL + pgvector
[ ] 2. Migrate from SQLite using pgloader
[ ] 3. Set up connection pooling (pgbouncer) for agents
[ ] 4. Add WAL archiving and point-in-time recovery
[ ] 5. Benchmark against SQLite — verify the upgrade is justified
```

**Deliverable:** Production-grade memory system ready for 1M+ documents.

---

## Appendix: Key Technology References

| Technology | URL | License | Maturity |
|-----------|-----|---------|----------|
| sqlite-vec | https://github.com/asg017/sqlite-vec | Apache 2.0 | Stable (v0.1+) |
| pgvector | https://github.com/pgvector/pgvector | PostgreSQL | Stable (v0.8+) |
| sentence-transformers | https://www.sbert.net/ | Apache 2.0 | Very mature |
| Ollama embeddings | https://ollama.com/blog/embedding-models | MIT | Mature |
| scikit-learn TfidfVectorizer | https://scikit-learn.org/ | BSD-3-Clause | Extremely mature |
| Obsidian | https://obsidian.md/ | Proprietary (free tier) | Very mature |
| Hermes Agent (Nous) | https://hermes-agent.nousresearch.com/ | Apache 2.0 | Active development |

---

## Appendix: Quick Decision Flowchart

```
Is PAOS at <100 documents currently?
  ├── YES → Phase 1: TF-IDF RAG + Obsidian wikilinks. No DB change.
  └── NO  → ↓

Is PAOS at 100–10K documents?
  ├── YES → Phase 2–3: Add embeddings, migrate to SQLite + sqlite-vec.
  └── NO  → ↓

Is PAOS at 10K–1M documents?
  ├── YES → Phase 4: PostgreSQL + pgvector.
  └── NO  → You have a 1M+ doc PAOS. 
           Use PostgreSQL + pgvector + read replicas + sharded agent memories.
```
