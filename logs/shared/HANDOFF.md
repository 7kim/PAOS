# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: opencode-developer
- **Timestamp**: 2026-05-21T04:35:55.649Z

## Active Task
PAOS-RESTRUCTURE — Project restructuring complete

## What Was Just Done
- [x] Created project tree: PAOS (~/AI_Workflow), PAOS-WEB (~/Documents/Dev/PAOS-WEB), PAOS-VPS (~/Documents/Dev/PAOS-VPS)
- [x] Moved frontend/ contents to PAOS-WEB, all hardcoded AI_Workflow paths replaced with centralized lib/paths.ts
- [x] Created symlink ~/AI_Workflow/frontend/ -> ~/Documents/Dev/PAOS-WEB/
- [x] Created PAOS-VPS scaffold directory with README outlining planned structure
- [x] `npm run build` passes with zero errors in PAOS-WEB
- [x] PAOS-WEB initialized as independent git repo; AI_Workflow commit SHA ec77616

## What Is NOT Done Yet
- The dashboard at port 3333 still references old frontend path if any; verify it works
- PAOS-VPS is empty scaffold — ready for future VPS agent layer work

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Code-SRS | `~/AI_Workflow/frontend/` | Next.js 16 App Router, Together AI design | **PIPELINE PENDING** — awaiting opencode-developer |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (13 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode + Gemini
- Every agent reads HANDOFF.md as Step 0 — universal cold-start (all agents configured)
- **Code-SRS model proxy**: real model IDs resolved server-side only; alias names exposed to users via `config/code-srs/models.yaml`
- **Code-SRS SRS visibility**: hidden from users by default (`features.yaml srs_visibility_toggle.enabled: false`); admin toggle in dashboard
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end.
- **MCP CONFIGS**: All agent MCP registries symlinked to `/home/dev/AI_Workflow/mcp/mcp-config.json`.

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
