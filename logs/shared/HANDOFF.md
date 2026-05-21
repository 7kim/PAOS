# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: opencode-developer
- **Timestamp**: 2026-05-21T02:38:15.302Z

## Active Task
Session wrap-up — agent MCP/skills audit complete, all agents integrated

## What Was Just Done
- Diagnosed and fully recovered Antigravity IDE after 2.0 upgrade (40 extensions migrated, SUID sandbox fixed, official tar.gz installed)\n- Completed PAOS SWOT audit saved to vault/memory/shared/swot_audit.md\n- Built Cross-Agent Chat Continuity: bin/sync-chat.py + /H-Continue command across all agents\n- Renamed PAOS Hermes → Signal to avoid name collision\n- Installed and fully integrated Nous Research Hermes Agent v0.14.0 (25 skills, MCP servers, PAOS skill, SOUL.md)\n- Stripped proprietary API keys from Hermes .env, set model to ollama/llama3 placeholder\n- Audited MCP + skills for all 8 agents; fixed Signal mcp_config.json symlink, registered MCP servers in OpenClaw\n- Disabled dashboard autostart (on-demand via desktop launcher only)

## What Is NOT Done Yet
- Antigravity IDE has no MCP servers configured (VS Code — only matters if using Continue.dev or Claude Code extension)\n- Codex skills/ directory is empty (Codex doesn't use PAOS skills natively)\n- User to configure free/open-source LLM for Nous Hermes later

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
