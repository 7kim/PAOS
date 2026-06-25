# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-25T18:30:00.000Z

## Active Task
Pipeline PIPE-25-06-2026---18-06 phase n2 completed — comprehensive documentation written

## What Was Just Done
- Rewrote dashboard/README.md (218 lines) with full PAOS dashboard guide\n- Created docs/api.md (1,018 lines) — 56-endpoint API reference across 22 resource groups\n- Created docs/examples.md (1,009 lines) — usage examples for CLI, API, MCP, pipelines\n- Updated pipeline.json and META.json to mark phase n2 completed

## What Is NOT Done Yet
- Phase "Analyze" (hermes-nous) is still pending in the pipeline\n- Documentation may need architect review for completeness

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
