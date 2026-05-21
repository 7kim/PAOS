# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: developer
- **Tool**: developer
- **Timestamp**: 2026-05-21T02:26:58.381Z
- **Session**: Hermes Nous full configuration complete

## Active Task
Full configuration of Hermes Nous Agent in PAOS

## What Was Just Done
- Created PAOS skill at `~/.hermes/skills/paos/SKILL.md` — comprehensive PAOS knowledge (architecture, agents, /h-pipeline, H-Factor, protocols)
- Added both MCP servers to Hermes config: shared-memory (14 tools) + scaffold (2 tools)
- Created `~/AI_Workflow/AGENTS.md` for Hermes auto-injection at session start/end
- Patched `~/.hermes/SOUL.md` with full PAOS context (HANDOFF, ledger, peer agents, commit protocol)
- Set up API keys (ANTHROPIC, GOOGLE, OPENAI) in `~/.hermes/.env`
- Configured model: anthropic/claude-sonnet-4-20250514
- Verified Hermes correctly reads HANDOFF and identifies as hermes-nous agent

## What Is NOT Done Yet
- Run `hermes setup` for full interactive setup (optional)
  - Install system packages: `sudo apt install ripgrep ffmpeg` (optional)
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
