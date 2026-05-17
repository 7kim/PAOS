# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-architect
- **Tool**: OpenCode Architect
- **Timestamp**: 2026-05-17T16:25:43.478Z
- **Session**: Architect review — TASK-003 Gemini soul file

## Active Task
TASK-003 — Gemini soul file creation (Architect review complete — CONDITIONAL)

## What Was Just Done
- Read inbox review request for TASK-003-IMPLEMENTATION_PLAN.md
- Read and analyzed the implementation plan against all 7 review checklist checks and H-Factor I1-I4
- Read the companion task card TASK-003 for scope alignment
- Compared against workflow.md Antigravity requirements (Article VIII)
- Read agents/codex/soul.md as reference model
- Appended ## REVIEW [CONDITIONAL] block with 4 blocking issues and H-Factor compliance matrix
- Logged review to global_ledger.md and shared context

## What Is NOT Done Yet
- PM must resolve 4 blocking issues before execution: produce TASKS.md, name executing agent, add logging step, expand risk analysis
- On PM resolution, re-review can upgrade to PASS
- Then @developer executes, @coordinator verifies

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
