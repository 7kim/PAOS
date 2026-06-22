# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-22T17:45:22.177Z
- **Session**: PAOS Commands pipeline designed and submitted

## Active Task
Pipeline PIPE-20260622-174508-pia2ix — PAOS Commands (16 /h-* scripts)

## What Was Just Done
- Designed 16 PAOS /h-* commands covering full session lifecycle (start → work → end → governance)
- Produced IMPLEMENTATION_PLAN.md + TASKS.md with 19 tasks
- Submitted pipeline to opencode-developer's inbox via submit_pipeline
- Sent notification to Hermes inbox about the new pipeline
- Cleaned up stray artifact files from AI_Workflow root

## What Is NOT Done Yet
- Pipeline needs an executor to pick it up and execute the 19 tasks
- Each script needs writing, testing, chmod +x
- OpenCode wrappers (16 .md files) need creation
- Agent documentation (CLAUDE.md, INDEX.md, soul.md) needs updating

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
