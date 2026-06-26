# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-26T13:06:30.000Z

## Active Task
Pipeline PIPE-26-06-2026---12-58 fully complete

## What Was Just Done
- Created fixtures/ and tests/ directories under phases/n1/
- Created 4 fixture files (pipeline-flow.json, pipeline.json, META.json, TASKS.md)
- Created 4 test scripts (test_01_phase_transitions, test_02_progress_counting, test_03_task_markers, test_04_pipeline_completion)
- Ran all 4 tests: ALL PASS (23/23 sub-checks, all exit code 0)
- Updated REASONING.md with execution notes and decisions
- Marked all 7 tasks in TASKS.md as [x]
- Wrote WALKTHROUGH.md with full results summary
- Updated pipeline.json, META.json, pipeline-flow.json, and top-level TASKS.md for pipeline completion

## What Is NOT Done Yet
- Nothing — pipeline is fully complete. All phases (n0, n1) done.

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
