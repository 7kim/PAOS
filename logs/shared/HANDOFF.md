# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-25T19:49:05.867Z
- **Session**: PIPE-25-06-2026---19-42 fully completed (both phases)

## Active Task
PIPE-25-06-2026---19-42 fully completed — both phases done

## What Was Just Done
- Completed phase n2 (Document) for PIPE-25-06-2026---19-42\n- Created docs/pipelines.md (145 lines) — pipeline system reference: lifecycle, directory structure, DAG execution, Flow Builder UI, agent dispatch, known issues, CLI/API\n- Updated docs/README.md hub with link to new pipeline doc\n- Updated all pipeline tracking files: pipeline.json, META.json, pipeline-flow.json, TASKS.md, phase files\n- Filled in REASONING.md for phase n2 with full decision log\n- Wrote WALKTHROUGH.md for phase n2

## What Is NOT Done Yet
- No pending work — pipeline is fully completed\n- Identified issues from ANALYSIS.md (empty memory/, broken symlink, etc.) were documented but not fixed — optional future work

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
