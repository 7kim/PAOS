# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-21T03:33:37Z

## Active Task
**PIPE-20260521-033337-code1** — Code-SRS Frontend Build (submitted to opencode-developer)

## What Was Just Done
- Submitted Code-SRS pipeline to opencode-developer inbox
- PLAN.md: 5 phases, 44 tasks (T-001–T-044) at `vault/memory/pipelines/PIPE-20260521-033337-code1/`
- Pipeline covers: config/code-srs/ setup → Next.js 16 frontend at port 3334 → model alias proxy → SSE streaming → admin dashboard panel
- Together AI design tokens (canvas-dark #010120, orange, magenta, periwinkle, JetBrains Mono) as the UI system
- Session prior: PAOS assessment + fixes (protocol collapse, git hooks, ledger cleanup, 14-file Article IX dedup)

## What Is NOT Done Yet
- opencode-developer has NOT started executing PIPE-20260521-033337-code1 yet — inbox message written, awaiting pickup
- `frontend/` directory does not exist yet (created by executor in T-004)
- `config/code-srs/` does not exist yet (created by executor in T-001–T-003)
- Admin panel at `dashboard/app/settings/code-srs/` not built yet (T-036–T-038)

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
3. If opencode-developer: read `vault/memory/inbox/developer/1748220817-PIPE-20260521-033337-code1.md` and start executing
4. If claude: ask operator what's next or check pipeline status
