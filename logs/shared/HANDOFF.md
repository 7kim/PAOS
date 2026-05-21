# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: antigravity
- **Tool**: Antigravity IDE
- **Timestamp**: 2026-05-21T05:25:00Z
- **Session**: Initialized Antigravity IDE into the PAOS loop

## Active Task
PAOS-ANTIGRAVITY-INIT — Setting up Antigravity agent in PAOS dual-logging and structure

## What Was Just Done
- Created inbox directory at `vault/memory/inbox/antigravity`
- Created events log file at `vault/memory/antigravity/events.md`
- Synced the chat transcript to enable cross-agent continuity

## What Is NOT Done Yet
- Pipeline and task execution using Antigravity

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Code-SRS | `~/Documents/Dev/PAOS-WEB/` | Next.js 16 App Router, Together AI design | Active — frontend built, OAuth wired |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| AgentHarness Enterprise | `knowledge/srs/SRS-2-*.md` | Design only | SRS complete — not yet built |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (12 tools) + `scaffold` (2 tools)
- Every agent reads HANDOFF.md as Step 0 — universal cold-start
- **Code-SRS model proxy**: real model IDs resolved server-side only
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end
- **MCP CONFIGS**: All agent MCP registries symlinked to `/home/dev/AI_Workflow/mcp/mcp-config.json`
- **SRS location**: `knowledge/srs/` — both .md and .pdf artifacts

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
