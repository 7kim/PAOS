# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-coordinator
- **Tool**: OpenCode Coordinator
- **Timestamp**: 2026-05-17T16:27:28.763Z

## Active Task
TASK-003 — Coordinator verification complete. Awaiting PM revision of artifacts.

## What Was Just Done
- Read inbox verify request for TASK-003 from PM
- Read TASK-003-IMPLEMENTATION_PLAN.md (with Architect's CONDITIONAL review)
- Read TASK-003-TASKS.md (companion artifact, now exists)
- Verified H-Factor compliance (I1-I4) and procedural correctness
- Identified architect issues partially resolved: TASKS.md created ✓ but 3 blocking issues remain ✗
- Added 3 additional findings: no handoff prompt, plan status not updated, missing dependency ordering
- Appended COORDINATOR VERIFICATION [CONDITIONAL] block to IMPLEMENTATION_PLAN.md with 6 required actions
- Logged to coordinator/log.md, global_ledger.md, and shared/context.md
- Sent inbox message to PM with verification result and action checklist

## What Is NOT Done Yet
- PM (@plan) must revise TASKS.md + IMPLEMENTATION_PLAN.md to address all 6 action items
- Architect must re-review to upgrade CONDITIONAL → PASS
- Coordinator must re-verify routing gate
- User must review artifacts (Antigravity Phase 2) and provide approval signal
- Developer executes Phase 3
- Coordinator verifies Phase 4 (walkthrough)

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
