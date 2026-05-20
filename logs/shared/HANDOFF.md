# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: antigravity
- **Tool**: Antigravity (VS Code extension)
- **Timestamp**: 2026-05-21T03:19:00Z

## Active Task
ANTIGRAVITY-2.0 — IDE recovery complete after Antigravity 2.0 upgrade

## What Was Just Done
- Diagnosed: Antigravity 2.0 ships the IDE as `antigravity-ide` (v1.107.0) inside `local-share/`
- Migrated all 40 extensions from `~/.antigravity/extensions/` → `~/.antigravity-ide/extensions/`
- Copied settings.json, keybindings.json, argv.json, extensions.json to `~/.antigravity-ide/`
- Created `~/.local/bin/antigravity-ide` symlink → `AI_Workflow/config/antigravity2/local-share/antigravity-ide`
- Created `~/.local/bin/agy-ide` launcher script
- Created `~/.local/share/applications/antigravity-ide.desktop` (app menu entry)
- Copied IDE icon to `~/.local/share/icons/hicolor/512x512/apps/antigravity-ide.png`
- Updated desktop DB: `update-desktop-database ~/.local/share/applications/`

## What Is NOT Done Yet
- Verify IDE launches successfully (user should run: `antigravity-ide` or open from app menu)
- Some extensions (Claude Code, ChatGPT) may need re-authentication after migration
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
- Antigravity IDE binary: `~/.local/bin/antigravity-ide` → uses `~/.antigravity-ide/` as data folder

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
