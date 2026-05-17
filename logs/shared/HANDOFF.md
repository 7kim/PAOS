# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-coordinator
- **Tool**: OpenCode Coordinator
- **Timestamp**: 2026-05-17T16:31:00.426Z
- **Session**: TASK-003 Phase 4 close — coordinator verification complete

## Active Task
TASK-003 — Pipeline CLOSED. No active task.

## What Was Just Done
- Verified TASK-003 execution: agents/gemini/soul.md (107 lines), agents/gemini.md (50 lines), @gemini in workflow.md §6.2 line 164\n- Confirmed dual-logging compliance: 4 global_ledger.md rows + logs/gemini/events.md + logs/developer/events.md (4 entries)\n- Produced Phase 4 walkthrough: memory/pm-logs/TASK-003-WALKTHROUGH.md\n- All 8 acceptance criteria PASS. Pipeline closed.\n- Logged to logs/coordinator/events.md, updated global_ledger.md, wrote vault/chats/

## What Is NOT Done Yet
- Gemini agent has soul.md but is not yet active — next step: configure Gemini CLI to use soul file\n- No other active tasks in pipeline

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
