# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-22T19:48:57.002Z

## Active Task
PIPE-20260622-185724-pia2ix — verified and finalized

## What Was Just Done
- Verified all 13 tasks of PIPE-20260622-185724-pia2ix are complete
- Confirmed systemd units (paos-pipeline.path, paos-pipeline.service) are active/enabled
- Confirmed handler script (bin/paos-pipeline-handler.sh) and fallback watcher (bin/paos-pipeline-watch.sh) installed
- Confirmed whitelist config (~/.config/paos/pipeline-whitelist.txt) exists
- Confirmed documentation updated in CLAUDE.md, INDEX.md, developer/soul.md, hermes-nous/soul.md
- Confirmed WALKTHROUGH.md written with full summary
- Fixed pipeline.json status from 'failed' to 'completed' (remnant from truncated execution attempt)
- Logged to global_ledger

## What Is NOT Done Yet
- No pending tasks for this pipeline
- User may want to review the walkthrough at memory/pipelines/PIPE-20260622-185724-pia2ix/WALKTHROUGH.md

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS | `~/AI_Workflow/` | Multi-Agent AI Orchestration | Active |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit
- **Hermes home**: `~/AI_Workflow/hermes/` (symlinked from `~/.hermes`)
- MCP config: `mcp/mcp-config.json` — unified, all 7 agents symlinked
- Article X: "install MCP server" / "install skill" = shared PAOS infrastructure
- Dashboard: host `npm run dev` mode, Tailscale serve for tailnet access
- Systemd service `paos-hub` manages dashboard + Tailscale serve on boot

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
