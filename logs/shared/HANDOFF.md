# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-25T19:11:46.385Z

## Active Task
Pipeline PIPE-25-06-2026---19-09 phase n2 completed — documentation audit and enhancement done

## What Was Just Done
- Audited all existing documentation: README (819 lines), docs/api.md (1,018 lines), docs/examples.md (1,009 lines), docs/architecture.md (183 lines), docs/workspace-format.md (80 lines), dashboard/README.md (218 lines)
- Created LICENSE (MIT) — matching the README's declared license
- Created docs/README.md — documentation hub index with links to all docs, screenshots, reference files
- Updated README.md with Documentation section, fixed Docker badge link, added docs badge
- Updated all pipeline tracking files (META.json, pipeline.json, TASKS.md) to mark phase n2 completed
- Wrote WALKTHROUGH.md with full audit summary
- Committed via agent-commit.sh (SHA: 80fc79a)

## What Is NOT Done Yet
- Phase "Analyze" (hermes-nous) is still pending in the pipeline — next phase
- The next agent should read memory/shared/HANDOFF.md and resume from the pipeline state

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
