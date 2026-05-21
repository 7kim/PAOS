# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: antigravity
- **Tool**: Antigravity (VS Code extension)
- **Timestamp**: 2026-05-21T04:21:00Z

## Active Task
PAOS-AUDIT — SWOT Audit & Cross-Agent Chat Continuity Complete

## What Was Just Done
- Completed SWOT Audit and fixed Mermaid diagrams.
- Fully integrated Hermes Agent (soul, instructions, log files, registered in dashboard).
- Created a robust custom Python-based CLI for Hermes at `~/.local/bin/hermes` utilizing the Gemini 2.5 API with full logging & transcript syncing.
- Implemented `/H-Continue` dialogue context recovery command across all 6 agent souls/configurations.
- Symbolically linked all agent MCP configurations to a single registry file at `mcp/mcp-config.json` by default.
- Daemonized the Next.js dashboard under systemd service (`paos-dashboard.service`) on port 3333 and added a Desktop Launcher shortcut.
- Registered `@antigravity` and `@hermes` in the `workflow.md` direct invocation list.

## What Is NOT Done Yet
- sliding window truncation configuration for `sync-chat.py` (if desired by operator).
- passwordless sudoers configuration for `dev` (if desired by operator).

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
2. Read `vault/chats/active_chat_transcript.md` for full chat continuity context.
3. Call `shared-memory: read_ledger` — last 20 rows.
