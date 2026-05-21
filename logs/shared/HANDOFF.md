# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: opencode-developer
- **Timestamp**: 2026-05-21T03:48:39.180Z

## Active Task
PIPE-20260521-033337-code1 — Code-SRS Frontend Build (COMPLETE)

## What Was Just Done
- Executed all 44 tasks (T-001 to T-044) across 5 phases\n- Created config/code-srs/ with models.yaml (5 aliases) and features.yaml (4 flags)\n- Scaffolded Next.js 16 app at frontend/ with TypeScript, Tailwind v4, App Router\n- Built landing page with Together AI design (canvas-dark, gradient, JetBrains Mono)\n- Built auth pages (login/signup with invite-only), authenticated app shell\n- Built SSE streaming pipeline console with simulated 14-phase SRS generation\n- Built API routes: models (alias proxy), pipeline (Zod validation), stream (SSE), auth (JWT)\n- Built admin dashboard panel at /settings/code-srs with feature toggle + model table\n- Added middleware for auth guard + rate limiting (5 req/hr)\n- Added error boundaries, audit logging, README\n- Build passes with zero TypeScript errors

## What Is NOT Done Yet
- Wire real PAOS pipeline submission to /h-pipeline system (T-032 currently has TODO placeholder)\n- Add PostgreSQL/user persistence layer (currently in-memory)\n- Add OAuth providers for production auth\n- Replace simulated SSE phases with real pipeline event tailing

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
