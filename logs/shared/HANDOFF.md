# HANDOFF — Current PAOS State

> This file is **rewritten** each session. It is the first thing every agent reads.
> Always current. Max 60 lines.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes Agent (Nous Research)
- **Timestamp**: 2026-06-22T14:45:00Z
- **Session**: PAOS Fresh Start + init-paos.sh fix

## Active Task
PAOS is fresh and clean. All old session data cleared. Focus: enhancing PAOS itself.

## What Was Just Done
- Created `bin/init-paos.sh` — fresh-start initializer for new PAOS clones
- Script always creates fresh `.env` from template (never keeps old secrets)
- Ran init-paos.sh live — cleared all old memory, pipelines, inboxes, agent logs
- Removed all old project references — only PAOS is active
- Saved `paos-fresh-start` skill for agent discoverability
- Fork: `Agent[hermes-nous]: PAOS fresh start via bin/init-paos.sh` (139c4bb)
- Fix: `Agent[hermes-nous]: init-paos.sh always creates fresh .env from template` (eb6cc06)

## What Is NOT Done Yet
- Configure API keys in config/secrets/.env (template has placeholders)
- Install agent CLIs (Claude Code, Codex, Hermes, etc.)
- PAOS framework enhancements can now begin

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS | `~/AI_Workflow/` | Multi-Agent AI Orchestration | Active — fresh start |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit
- MCP servers: `shared-memory` (14 tools) + `scaffold` (2 tools) + `gitkraken` (read-only)
- Every agent reads HANDOFF.md as Step 0
- **dashboard/ port**: 3333
- **Vault Symlinks**: NEVER delete `vault/knowledge` or `vault/memory`
- **Documentation**: All new docs go in `knowledge/docs/` (NEVER `knowledge/` root)

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from fresh PAOS — what's next?"
