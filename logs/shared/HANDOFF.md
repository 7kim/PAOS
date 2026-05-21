# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: antigravity
- **Tool**: Antigravity (VS Code extension)
- **Timestamp**: 2026-05-21T04:08:00Z

## Active Task
PAOS-AUDIT — SWOT Audit & Cross-Agent Chat Continuity

## What Was Just Done
- Completed comprehensive SWOT Audit of PAOS system and Ubuntu setup: saved to `vault/memory/shared/swot_audit.md`.
- Formalized Antigravity agent integration by creating `agents/antigravity/soul.md`.
- Implemented **PAOS Cross-Agent Chat Continuity Protocol**:
  - Developed `bin/sync-chat.py` to parse JSONL logs and generate a clean, readable Markdown transcript in `vault/chats/active_chat_transcript.md` with smart tool output truncation.
  - Updated configuration & soul files of Claude, Gemini, Codex, OpenClaw, and OpenCode to read this transcript at start and sync it at end.
- Synchronized the active session transcript to `vault/chats/active_chat_transcript.md`.

## What Is NOT Done Yet
- Integrate Hermes agent into PAOS (create soul file, add to roster, map configuration).
- Configure systemd daemon/PM2 to auto-start Next.js dashboard at `http://localhost:3333`.

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

## How to Pick Up
1. Read this file (done)
2. Read `vault/chats/active_chat_transcript.md` for full chat continuity context.
3. Call `shared-memory: read_ledger` — last 20 rows.
