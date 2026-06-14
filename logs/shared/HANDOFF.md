# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-14T04:10:52.863Z
- **Session**: Default admin seed for PAOS-WEB frontend

## Active Task
Created default admin user for PAOS-WEB frontend

## What Was Just Done
- Created db/seed-admin.ts — idempotent seed script for default admin user
- Generated strong 32-char random password (q/nwGo46akhKIvtikL4Cxul3qMnvWUd0)
- Updated .env.local and .env.local.template with DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD
- Generated JWT_SECRET and wrote to .env.local
- Ran seed script — inserted admin@paos.nodealgo.com with admin role into PostgreSQL
- All PAOS audit logs updated (events.md, global_ledger.md, context.md)

## What Is NOT Done Yet
- Manage dashboard at port 3333 (no auth — local-only read-only UI)
- PAOS-WEB frontend at port 3334 now has admin@paos.nodealgo.com ready to log in

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS-WEB (Code-SRS) | `~/Documents/Dev/PAOS-WEB/` | Next.js 16 App Router, Together AI design | Active — frontend built, OAuth wired |
| PAOS-VPS | `~/Documents/Dev/PAOS-VPS/` | Shell script | Active |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| AgentHarness Enterprise | `knowledge/srs/SRS-2-*.md` | Design only | SRS complete — not yet built |

## Key Decisions (permanent)

- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (12 tools) + `scaffold` (2 tools) + `gitkraken` (read-only)
- Every agent reads HANDOFF.md as Step 0 — universal cold-start
- **Code-SRS model proxy**: real model IDs resolved server-side only
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end
- **SRS location**: `knowledge/srs/` — both .md and .pdf artifacts
- **Documentation**: All new documentation MUST be created in `knowledge/docs/` (NEVER in `knowledge/` root) to prevent duplicates.
- **Vault Symlinks**: `vault/knowledge` and `vault/memory` are critical symlinks mapping to root folders. NEVER delete them.

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
