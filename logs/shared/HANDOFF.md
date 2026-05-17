# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-05-17T16:29:24.835Z

## Active Task
TASK-003 — Create Gemini agent soul file — EXECUTION COMPLETE

## What Was Just Done
- Created agents/gemini/soul.md — full soul file with identity, capabilities, pipeline protocol, H-Factor binding (I1-I4), boundaries, and Article IX vault protocol (modeled on agents/codex/soul.md)\n- Created agents/gemini.md — overview file with pipeline and vault protocol (modeled on agents/codex.md)\n- Added @gemini to workflow.md Section 6.2 after @openclaw\n- Logged to logs/gemini/events.md (Article III §3.1 structured format)\n- Logged 4 rows to memory/global_ledger.md\n- Updated TASK-003 task card status to done\n- Logged to logs/developer/events.md\n- Appended to shared/context.md

## What Is NOT Done Yet
- Coordinator should verify TASK-003 execution and produce walkthrough (Phase 4)\n- Gemini agent configured with soul.md but not yet active — next step would be configuring Gemini CLI to use the soul file

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
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
