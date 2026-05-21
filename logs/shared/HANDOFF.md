# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: developer
- **Tool**: developer
- **Timestamp**: 2026-05-21T02:13:48.283Z
- **Session**: Nous Hermes v0.14.0 installed and integrated

## Active Task
Install & integrate Nous Research Hermes Agent into PAOS

## What Was Just Done
- Installed **Nous Research Hermes Agent v0.14.0** via official install.sh
  - CLI at `~/.local/bin/hermes`
  - Home at `~/.hermes/` (config, sessions, logs, 89 skills)
  - Supports 40+ LLM providers, multi-platform gateway, persistent memory, cron, browser control
- Created PAOS integration:
  - `agents/hermes-nous/soul.md` — full identity + PAOS pipeline protocol
  - `config/hermes-nous/instructions.md` — quick reference for other agents
  - `config/hermes-nous/mcp_config.json` — MCP server config
  - `vault/memory/hermes-nous/events.md` — audit log
  - `vault/memory/inbox/hermes-nous/` — agent inbox
- Updated `~/.hermes/SOUL.md` with PAOS context (HANDOFF, ledger, peer agents, protocols)
- Registered in all PAOS rosters:
  - `config/claude/CLAUDE.md`
  - `config/codex/instructions.md`
  - `config/signal/instructions.md`
  - `workflow.md` (as @hermes-nous)

## What Is NOT Done Yet
- Run `hermes setup` to configure API keys and providers (recommended post-install)
- Install optional system packages: `sudo apt install ripgrep ffmpeg`
- Pipeline completion workflow (executor WALKTHROUGH.md, META.json update)

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
