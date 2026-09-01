# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-08-30T17:14:55.101Z
- **Session**: hermes-agent venv 3.11 restore

## Active Task
Hermes venv recovery — awaiting user 'restore' on next Hermes chat

## What Was Just Done
- Diagnosed deleted Python/venv: repo requires >=3.11,<3.14 (.python-version=3.11), broken venv pointed to 3.15.0rc1
- Verified snapshots: state-snapshots/20260826-230251-pre-update (135MB, 43 sessions/19191 msgs), skills/.curator_backups/2026-08-26T23-03-27Z (2.4MB)
- Verified live DB intact: ~/.hermes/state.db 136MB, 44 sessions/19194 msgs, MEMORY.md/USER.md + 25 skill dirs present
- Recreated venv: rm -rf venv; uv venv --python 3.11 -> .venv (3.11.16); ln -s .venv venv; uv sync --python 3.11; verified hermes --version and sessions list

## What Is NOT Done Yet
- User will exit and next talk to Hermes directly, saying 'do restore' — next agent should verify venv still 3.11 and re-run checks if needed
- If user asks 'restore': re-check .venv/bin/python --version (must be 3.11.x), run hermes sessions list + sqlite counts, confirm snapshots unchanged, offer hermes update (749 behind)
- No snapshot restore needed — live DB is 3 msgs ahead of snapshot; only restore from snapshot if live DB corrupted

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS | `~/AI_Workflow/` | Multi-Agent AI Orchestration | Active |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit
- **Hermes home**: `~/AI_Workflow/hermes/` (symlinked from `~/.hermes`)
- MCP config: `mcp/mcp-config.json` — unified, all 7 agents symlinked
- Article X: "install MCP server" / "install skill" = shared PAOS infrastructure
- Dashboard: host `npm run dev -- --webpack --port 3333`, Tailscale serve for tailnet
- Systemd service `paos-hub` manages dashboard + Tailscale serve on boot
- PIPELINES.md is single contract for pipeline files (required: pipeline-flow.json, builder-layout.json, phases/*/REASONING.md)

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
