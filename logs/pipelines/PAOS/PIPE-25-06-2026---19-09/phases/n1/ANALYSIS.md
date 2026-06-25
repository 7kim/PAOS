# PAOS Documentation Gap Analysis

> **Phase**: n1 (hermes-nous, "Analyze")  
> **Pipeline**: PIPE-25-06-2026---19-09  
> **Date**: 2026-06-25

---

## 1. What's Well-Documented

| Area | File(s) | Lines | Assessment |
|------|---------|-------|------------|
| Project overview | `README.md` | 819 | Comprehensive — ecosystem, architecture, setup, agents, troubleshooting |
| REST API reference | `docs/api.md` | 1,018 | Complete — 56 endpoints across 22 resource groups |
| Usage examples | `docs/examples.md` | 1,009 | Complete — 9 sections covering CLI, API, MCP, pipeline workflows |
| Architecture | `docs/architecture.md` | 183 | Complete — 2-layer system model |
| Workspace format | `docs/workspace-format.md` | 80 | Complete — `.code-workspace` schema |
| Dashboard UI | `dashboard/README.md` | 218 | Complete — all 15 pages, 22 API groups |
| MCP server guide | `mcp/README.md` | 47 | Clear — wiring diagram, add instructions |
| Docker deployment | `docker/README.md` | 74 | Complete — quick start, architecture, env vars |
| Constitution | `workflow.md` | 522 | Exhaustive — 11 Articles, H-Factor governance |
| Documentation hub | `docs/README.md` | 42 | Good — index linking to all doc files |
| Skills index | `skills/INDEX.md` | 83 | Good — all skills listed with descriptions |
| Screenshots guide | `docs/screenshots/README.md` | 28 | Complete — 8 views documented |
| License | `LICENSE` | 21 | MIT — matches README declaration |
| Agent config docs | `config/gemini/README.md`, `config/antigravity2/README.md` | ~30 each | Good — per-agent config guides |

**Total documented**: ~4,200 lines across 14+ files.

---

## 2. Genuine Documentation Gaps (should document)

These are gaps that would cause real confusion or friction:

| # | Gap | Location | Why It Matters |
|---|-----|----------|----------------|
| 1 | **Secrets/env schema** | `config/secrets/.env` (no doc) | Setup requires knowing what env vars are expected; currently only `.env.template` files exist with no explanation of each var. |
| 2 | **Pipeline template schema** | `config/templates/*.json` (8 files) | Pipeline builder UI uses these; no documentation of the JSON schema, how to create new templates, or how fields map to pipeline behavior. |
| 3 | **`memory/` vs `logs/` dual structure** | Both directories have near-identical subdirectory trees (~25 subdirs each) | Causes confusion about where to find what; no explanation of why both exist or usage conventions. |
| 4 | **`bin/h-*` command consolidated reference** | Docs are split across `README.md`, `skills/INDEX.md`, `config/opencode/command/*.md` | No single authoritative reference with all commands, options, and usage patterns. |

---

## 3. Minor / Speculative Gaps (YAGNI — skip unless needed)

| # | Gap | Why Skipped |
|---|-----|-------------|
| 5 | `lib/paos-registry.mjs` JSDoc | Internal library, one consumer; code is self-documenting |
| 6 | `config/code-srs/features.yaml` + `models.yaml` | Not actively used; document when code-srs is active |
| 7 | `dashboard/lib/paos.ts` separate doc | Already discoverable via code + dashboard/README.md |
| 8 | `dashboard/clickhouse/` + `dashboard/supabase/` integration docs | Clickhouse has DESIGN.md; Supabase is unused |
| 9 | Per-script `--help` for bin/ wrappers | Shell scripts are already simple; `h-help` covers the surface |
| 10 | CONTRIBUTING.md | Personal project — YAGNI (confirmed by n2 ponytail) |
| 11 | CHANGELOG.md | Personal project — YAGNI (confirmed by n2 ponytail) |

---

## 4. Documentation Quality Assessment

| Quality Metric | Score | Notes |
|----------------|-------|-------|
| Coverage breadth | 9/10 | All major systems documented |
| Coverage depth | 8/10 | API docs are thorough; env/template schema missing |
| Navigability | 7/10 | docs/README.md hub helps, but command ref is fragmented |
| Freshness | 9/10 | All docs reflect current state |
| Code/doc alignment | 8/10 | API routes match api.md; minor drift possible |

---

## 5. Recommended Actions (priority order)

1. **Create `docs/env-reference.md`** — document all env vars in `config/secrets/.env` with descriptions, defaults, and source
2. **Create `docs/pipeline-templates.md`** — document template JSON schema, field mapping, and creation guide
3. **Add `docs/memory-vs-logs.md`** — brief explanation of why both `memory/` and `logs/` exist, what goes where
4. **Create `docs/commands.md`** — consolidated `h-*` command reference with all flags and examples

**Ponytail note**: Items 3-4 are lower priority. Item 1 is the most impactful — a new user cannot configure PAOS without knowing the env vars.
