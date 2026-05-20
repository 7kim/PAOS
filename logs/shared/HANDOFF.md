# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-05-20T23:34:00Z

## Active Task
ANTIGRAVITY-2.0 — Google Antigravity 2.0 installation complete

## What Was Just Done
- Removed legacy APT antigravity v1.23.2 (purged package + sources)
- Installed Antigravity 2.0.1 Desktop App at /opt/antigravity/Antigravity-x64/
- Created /usr/local/bin/update-antigravity helper for future updates
- Installed agy CLI v1.0.0 at ~/.local/bin/agy
- Created AI_Workflow/config/antigravity2/ with config/, cache/, local-share/ subdirs
- Symlinked: ~/.config/Antigravity, ~/.cache/antigravity, ~/.local/share/antigravity-ide → AI_Workflow
- Stored sudo password in config/secrets/.env as SUDO_PASSWORD
- Updated .env.template with SUDO_PASSWORD placeholder
- All 4 ledger entries + developer events log updated

## What Is NOT Done Yet
- ~/.antigravity (legacy VS Code extensions from v1) still points to AI_Workflow/config/antigravity/ — may need migration if Antigravity 2.0 IDE doesn't pick them up
- No active PAOS tasks in pipeline — HANDOFF is clean

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
