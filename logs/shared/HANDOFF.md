# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: opencode-developer
- **Timestamp**: 2026-05-21T01:32:01.277Z

## Active Task
Implement /h-pipeline Cross-Agent Plan-Then-Execute Pipeline

## What Was Just Done
- Created `bin/h-pipeline` CLI script with `submit`, `status`, `list` subcommands
- Created `config/pipeline-defaults.yaml` with executor defaults and per-agent overrides
- Added `submit_pipeline` MCP tool to `mcp/shared-memory-server/index.js` (generates pipeline dir, task card, inbox message, ledger entry)
- Updated all 6 planner agent configs with Pipeline Settings + /h-pipeline command docs: CLAUDE.md, GEMINI.md, agents/gemini/soul.md, agents/antigravity/soul.md, config/codex/instructions.md, agents/openclaw/soul.md
- Added Section 6.6 — /h-pipeline Command to workflow.md constitution
- Created `memory/pipelines/` directory structure for pipeline artifacts
- Verified end-to-end: submit creates pipeline dir, task card, inbox message (registry-aware alias resolution), ledger entry
- Inbox resolution fixes: CLI + MCP both use agent registry to resolve correct inbox directory (e.g. opencode-developer → developer)

## What Is NOT Done Yet
- Pipeline completion workflow: executor WALKTHROUGH.md and META.json update on completion
- Notification back to planner on pipeline completion
- Optional sliding window truncation for sync-chat.py

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
