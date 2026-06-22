# HANDOFF — Current PAOS State

> This file is **rewritten** each session. It is the first thing every agent reads.
> Always current. Max 60 lines.

---

## Last Agent
- **Agent**: paos-init
- **Tool**: bin/init-paos.sh
- **Timestamp**: 2026-06-22T14:39:00Z
- **Session**: PAOS Fresh Start

## Active Task
PAOS has been freshly initialized. All old session data cleared. The current focus is enhancing PAOS itself.

## What Was Just Done
- Cleared all old memory data (global_ledger, tasks, pipelines, inboxes, shared context)
- Cleared all agent event logs
- Initialized vault for first use
- Installed MCP server dependencies
- Installed dashboard dependencies
- Updated projects.md — only PAOS is active

## What Is NOT Done Yet
- Configure API keys in config/secrets/.env (if not done)
- Install agent CLIs (Claude Code, Codex, Hermes, etc.) — run install scripts as needed
- Configure agent MCP connections
- This is a fresh start — no previous work to continue

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS | `~/AI_Workflow/` | Multi-Agent AI Orchestration | Active — fresh start |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (14 tools) + `scaffold` (2 tools) + `gitkraken` (read-only)
- Every agent reads HANDOFF.md as Step 0 — universal cold-start
- **dashboard/ port**: 3333
- **Vault Symlinks**: `vault/knowledge` and `vault/memory` are critical symlinks mapping to root folders. NEVER delete them.
- **Documentation**: All new documentation goes in `knowledge/docs/` (NEVER `knowledge/` root)

## How to Pick Up
1. Read this file (done)
2. Read `vault/memory/global_ledger.md` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from fresh PAOS — what's next?"
