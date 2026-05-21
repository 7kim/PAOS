# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-05-21T05:42:05.918Z

## Active Task
PAOS-DASHBOARD — GitKraken MCP integration, gitview rebrand, pipeline gitgraph

## What Was Just Done
- Installed GitKraken CLI v3.1.64 from GitHub releases (gk_3.1.64_linux_amd64.deb)
- Registered GitKraken MCP server in mcp/mcp-config.json (command: gk mcp --readonly)
- Added gitkraken as registered PAOS agent in agents/registry.json with 29 MCP tools
- Created bin/setup-gitkraken.sh — auto-downloads, installs, and verifies GitKraken MCP
- Rebranded dashboard Git View page with GitKraken identity (teal #289473 theme, MCP tools header, links to docs)
- Git View shows agent-filtered commits, diff view, file view — powered by GitKraken MCP metadata

## What Is NOT Done Yet
- `gk auth login` still needs to be run interactively to unlock issue/PR/AI features (read-only git tools work without auth)
- GitHub/GitLab/Bitbucket integrations need provider tokens configured for issue and PR tools

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Code-SRS | `~/Documents/Dev/PAOS-WEB/` | Next.js 16 App Router, Together AI design | Active — frontend built, OAuth wired |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| AgentHarness Enterprise | `knowledge/srs/SRS-2-*.md` | Design only | SRS complete — not yet built |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (12 tools) + `scaffold` (2 tools)
- Every agent reads HANDOFF.md as Step 0 — universal cold-start
- **Code-SRS model proxy**: real model IDs resolved server-side only
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end
- **MCP CONFIGS**: All agent MCP registries symlinked to `/home/dev/AI_Workflow/mcp/mcp-config.json`
- **SRS location**: `knowledge/srs/` — both .md and .pdf artifacts

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
