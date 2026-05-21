# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: developer
- **Tool**: developer
- **Timestamp**: 2026-05-21T02:08:04.934Z
- **Session**: Hermes → Signal rename complete

## Active Task
Rename Hermes agent → Signal

## What Was Just Done
- Renamed Hermes agent to **Signal** across all PAOS files:\n  - `~/.local/bin/hermes` → `~/.local/bin/signal` (CLI binary, all internal paths updated)\n  - `agents/hermes/` → `agents/signal/` (soul.md identity updated)\n  - `config/hermes/` → `config/signal/` (instructions.md + mcp_config.json updated)\n  - `vault/memory/hermes/` → `vault/memory/signal/` (events.md header updated)\n  - `vault/memory/inbox/hermes/` → `vault/memory/inbox/signal/`\n- Updated all config roster references: CLAUDE.md, config/codex/instructions.md, workflow.md\n- `signal doctor` returns all 5 checks green (instructions, events_log, global_ledger, sync_script, google_api_key)

## What Is NOT Done Yet
- Pipeline completion workflow (executor WALKTHROUGH.md, META.json update, notification back to planner)\n- Optional sliding window truncation for sync-chat.py

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active — scalping bot + real-time dashboard |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (13 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode + Gemini
- Every agent reads HANDOFF.md as Step 0 — universal cold-start (all agents configured)
- HANDOFF.md is rewritten (not appended) — always current, max 60 lines
- Antigravity IDE binary: /opt/antigravity-ide/antigravity-ide | data: ~/.antigravity-ide/
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, and run `python3 bin/sync-chat.py` at session end.
- **MCP CONFIGS**: All agent MCP registries are symlinked to `/home/dev/AI_Workflow/mcp/mcp-config.json`.

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
