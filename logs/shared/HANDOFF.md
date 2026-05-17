# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-17T15:09:34Z
- **Session**: Notes audit batch — gaps 2/3/4/5/6/7 fixed + Gemini wired + OpenCode MCP fully resolved

## Active Task
All PAOS gaps from notes.md audit resolved. System is now fully wired.

## What Was Just Done
- **Gap 2 FIXED**: OpenCode MCP was silently stripping config due to schema `additionalProperties: false`. Root cause: `"command"` must be an array `["node", "path"]` (not separate command+args), and env vars key is `"environment"` not `"env"`. Fetched live schema from `https://opencode.ai/config.json` to confirm. Both MCP servers now connect: `shared-memory (13 tools)` + `scaffold (2 tools)`.
- **Gap 3 FIXED**: `projects.md` rewritten — only `~/Documents/Dev/` projects listed.
- **Gap 4 FIXED**: `knowledge/books/` restructured — `books.md` is now a wikilink index, `knowledge/books/pdfs/` created.
- **Gap 5 FIXED** (partial): Dashboard — added Gemini/Codex to agent color map, added `/handoff` page (live HANDOFF.md viewer, auto-refreshes 10s).
- **Gap 6 FIXED**: `config/claude/mcp.json` now has `REPO_ROOT` env var.
- **Gap 7 FIXED**: All soul files + CLAUDE.md updated to Article III §3.1 structured log format.
- **Gemini CLI installed**: `~/.local/bin/gemini` (v0.42.0), `shared-memory` MCP wired via `.gemini/settings.json`.
- **Previous projects KB**: Added `knowledge/previous-projects/` files for tradingview, project-gemini, claude-vps, vps-kit.

## What Is NOT Done Yet
- **Gap 1** (pipeline smoke test): Full end-to-end PM→Architect→Developer→Coordinator run never completed. Now unblocked since MCP works.
- **Gap 8** (Codex auth / OpenClaw channels): Deferred — left unsettled per notes.
- **System readiness assessment**: Not yet given to user.
- **Gemini** not yet added to dashboard agent list (only routes and color map updated for Codex/Gemini).

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active — scalping bot + real-time dashboard |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (13 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode + Gemini
- OpenCode MCP format: `"command": [array]`, `"environment": {}` (not `env`/`args`) — confirmed from live schema
- Every agent reads HANDOFF.md as Step 0 — universal cold-start (all agents configured)
- HANDOFF.md is rewritten (not appended) — always current, max 60 lines

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Run pipeline smoke test: `opencode run --agent plan "Run pipeline test for TASK-002"`
4. Ask operator: "Gap 1 pipeline test — ready to run?"
