# HANDOFF — Current PAOS State

> This file is **rewritten** each session. It is the first thing every agent reads.
> Always current. Max 60 lines.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes Agent (Nous Research)
- **Timestamp**: 2026-06-22T14:55:00Z
- **Session**: PAOS-INTEGRATION — Full Hermes integration

## Active Task
PAOS is fresh and clean. Hermes is fully integrated as a first-class PAOS agent with its home inside the repo.

## What Was Just Done
- **Moved** `~/.hermes/` → `~/AI_Workflow/hermes/` (2.0G — all runtime, skills, sessions, state)
- **Symlinked** `~/.hermes` → `~/AI_Workflow/hermes/` — binary still works
- **Wired MCP servers** to Hermes config.yaml: shared-memory (14 tools), scaffold (2 tools), gitkraken (read-only)
- **Updated** PAOS configs: soul.md, instructions.md, AGENTS.md, registry.json — all paths reflect new Hermes home
- **Restarted** Telegram gateway — connected through symlink
- **Cleaned up** backup `~/.hermes.orig`

## What Is NOT Done Yet
- Other agents (Claude, Gemini, Codex, OpenCode) may need similar home-in-PAOS treatment
- `init-paos.sh` could be extended to auto-setup Hermes after fresh clone

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS | `~/AI_Workflow/` | Multi-Agent AI Orchestration | Active — fresh start |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit
- **Hermes home**: `~/AI_Workflow/hermes/` (symlinked from `~/.hermes`)
- MCP servers: `shared-memory` (14 tools) + `scaffold` (2 tools) + `gitkraken` (read-only)
- Every agent reads HANDOFF.md as Step 0
- **dashboard/ port**: 3333
- **Vault Symlinks**: NEVER delete `vault/knowledge` or `vault/memory`

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from fresh PAOS — what's next?"
