# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: opencode-developer
- **Timestamp**: 2026-05-21T04:14:21.687Z

## Active Task
PIPE-20260521-033337-code1 — All 4 future items complete

## What Was Just Done
- [x] PostgreSQL 18 installed, database `codesrs` created, schema migrated (users, sessions, pipelines, invite_codes tables)
- [x] Created `lib/db.ts` — Node.js `pg` connection pool for all API routes
- [x] Rewrote `app/api/auth/login/route.ts` — PostgreSQL-backed auth (replaced in-memory Map)
- [x] Wired real PAOS pipeline submission in `app/api/pipeline/route.ts` — calls `bin/h-pipeline submit` CLI with generated PLAN.md + TASKS.md
- [x] Added OAuth routes: `GET /api/auth/oauth/[provider]` initiates flow, `GET /api/auth/oauth/[provider]/callback` handles callback with code exchange + user creation (GitHub/Google)
- [x] Rewrote `app/api/stream/[id]/route.ts` — tails real filesystem events from `memory/pipelines/<id>/` (reads META.json status, PLAN.md, TASKS.md progress, WALKTHROUGH.md), polls every 3s for up to 2min
- [x] Added `@types/pg` and `tsx` dev dependencies
- [x] `npm run build` passes with zero TypeScript errors
- [x] Commit SHA f59e71f

## What Is NOT Done Yet
- Set GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET env vars for production OAuth
- Configure NEXT_PUBLIC_BASE_URL for production deployment
- The h-pipeline CLI requires the PAOS agent registry to be populated for the executor lookup to work fully

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
