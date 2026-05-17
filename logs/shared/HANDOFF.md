# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-17T14:01:09.221Z
- **Session**: TASK-001: write_handoff MCP tool implementation

## Active Task
Pipeline test — adding write_handoff tool to shared-memory MCP server (TASK-001)

## What Was Just Done
- Added write_handoff tool definition to ListToolsRequestSchema
- Added write_handoff call handler with stable-section preservation
- Added gemini to KNOWN_AGENTS roster
- Bumped server version to 1.1.0
- Added HANDOFF_FILE constant

## What Is NOT Done Yet
- Smoke test verification
- Commit and WALKTHROUGH.md
- Pipeline end-to-end test still unrun on a real project

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active — scalping bot + real-time dashboard |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| project-gpt | `~/Documents/Dev/project-gpt/` | Markdown only | GPT archive |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (10 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode
- Every agent reads HANDOFF.md before anything else — universal cold-start
- HANDOFF.md is rewritten (not appended) — always current, max 60 lines

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
