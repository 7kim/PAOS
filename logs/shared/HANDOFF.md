# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent

- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-26T02:22:49Z
- **Session**: Full PAOS agent integration — Claude, Antigravity, Gemini, Hermes

## Active Task

PAOS-INTEGRATION — All four agents fully integrated into PAOS shared memory hub

## What Was Just Done

- **Claude** (`~/.claude/settings.json`): Added 13 new PAOS permissions (agent-commit.sh, hermes, gemini, git add/status/log/diff) + `Stop` hook to auto-commit on session end
- **Gemini** (`GEMINI.md`): Updated roster with Hermes entry + corrected MCP config path to `~/.gemini/config/mcp_config.json`
- **Hermes** (`~/.hermes/config.yaml`): Fixed stale `provider: ollama` root key and flat `model:` string → nested dict; `hermes doctor` now clean
- **Antigravity** (`antigravity-ide/mcp_config.json`, `antigravity-backup/mcp_config.json`): Added missing `gitkraken` MCP server to match `antigravity/mcp_config.json`
- **Registry** (`agents/registry.json`): Added gitkraken to root mcpServers; fixed claude/gemini/antigravity configPaths; corrected `hermes` → `hermes-nous` id with correct paths, inbox, log, role

## What Is NOT Done Yet

- Hermes model is `ollama/llama3` — add an API key in `~/.hermes/.env` to switch to a cloud model (e.g. `anthropic/claude-sonnet-4-6` via OpenRouter)
- Hermes optional platform logins (Nous Portal, Gemini OAuth, Telegram, Discord) not configured

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| Code-SRS | `~/Documents/Dev/PAOS-WEB/` | Next.js 16 App Router, Together AI design | Active — frontend built, OAuth wired |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| AgentHarness Enterprise | `knowledge/srs/SRS-2-*.md` | Design only | SRS complete — not yet built |

## Key Decisions (permanent)

- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (12 tools) + `scaffold` (2 tools) + `gitkraken` (read-only)
- Every agent reads HANDOFF.md as Step 0 — universal cold-start
- **Code-SRS model proxy**: real model IDs resolved server-side only
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end
- **SRS location**: `knowledge/srs/` — both .md and .pdf artifacts

## How to Pick Up

1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
