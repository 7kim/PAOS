# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: opencode-developer
- **Timestamp**: 2026-05-21T05:13:29.674Z
- **Session**: Setup files updated for three-tier ecosystem

## Active Task
PAOS-SETUP — Update setup files for three-tier ecosystem

## What Was Just Done
- Updated PAOS setup.sh banner to show three-tier ecosystem (PAOS, PAOS-WEB, PAOS-VPS)
- Updated PAOS setup.sh Docker mode outro with companion project references
- Updated PAOS setup.sh Native mode outro with ecosystem info section
- Updated PAOS install-ubuntu.sh Next Steps with companion projects (steps 8-9)
- Updated PAOS-WEB .env.local.template: replaced hardcoded /home/dev paths with $HOME-based PAOS_ROOT env var pattern, documented OAuth env vars
- Created PAOS-WEB setup.sh: checks Node >=20, auto-generates JWT secret, runs npm install, migrates DB, creates PAOS symlink
- Created PAOS-VPS setup.sh: scaffolds agent/, sync/, services/, config/ directories with placeholder files
- Created PAOS-VPS .gitignore
- Updated PAOS-VPS README with setup.sh usage and quick reference table
- Committed PAOS-WEB (b4ee384), PAOS-VPS (3bb9a0e) as independent git repos

## What Is NOT Done Yet
- PAOS-VPS is an empty scaffold — needs agent daemon, memory sync, and tunnel implementation
- PAOS-WEB setup.sh references ~/Documents/Dev/PAOS-WEB/ — works but assumes companion projects live in ~/Documents/Dev/

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Code-SRS | `~/AI_Workflow/frontend/` | Next.js 16 App Router, Together AI design | **PIPELINE PENDING** — awaiting opencode-developer |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (13 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode + Gemini
- Every agent reads HANDOFF.md as Step 0 — universal cold-start (all agents configured)
- **Code-SRS model proxy**: real model IDs resolved server-side only; alias names exposed to users via `config/code-srs/models.yaml`
- **Code-SRS SRS visibility**: hidden from users by default (`features.yaml srs_visibility_toggle.enabled: false`); admin toggle in dashboard
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end.
- **MCP CONFIGS**: All agent MCP registries symlinked to `/home/dev/AI_Workflow/mcp/mcp-config.json`.

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
