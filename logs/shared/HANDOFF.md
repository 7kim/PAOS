# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: opencode
- **Timestamp**: 2026-08-27T00:10:00.000Z
- **Session**: 6-note batch + pipeline-delete fixes + PIPELINES.md contract

## Active Task
PAOS pipeline AI_Workflow-PIPE_1-26-08-2026---23-34 completed (7/7 verified) — 6 notes + live fixes

## What Was Just Done
- 6-note batch: env export Blob (settings+projects), MCP CRUD (POST/DELETE+toggle/edit/repoint), Skills CRUD (scan+CRUD+repoint), Terminals enriched (PID·app·CWD·CPU/MEM/IO/GPU·category), Delete inbox/plans/tasks (DELETE+ledger), Agents files (view/edit/delete per-file + full delete with binary mapping)
- Pipeline-delete fixes: DELETE now purges queue pending/running/done + typed ${id}_Delete dialog + single-only isolation; queue GET auto-cleans stale running (fallback flat+project scan)
- PIPELINES.md contract at root + docs/PIPELINES.md symlink + workflow.md §6.6 + skill Phase1-0 now Read PIPELINES.md; dashboard visualize fallback synthesizes builder-layout linear DAG
- Pipeline AI_Workflow-PIPE_1: backfilled phases/planner|executor|verifier/REASONING.md + pipeline-flow.json + builder-layout.json + META id; queue ghosts 7→0, running cleared, build PASS (--webpack)
- Verification: 14 grep PASS + build PASS + WALKTHROUGH.md + VERIFICATION.md, pipeline 7/7 completed, queue done

## What Is NOT Done Yet
- Test bin/install-paos.sh on fresh VPS (carry-over)
- Optional: patch bin/h-pipeline to auto-create placeholder REASONING.md per phase
- Any gaps from real-world use of new CRUD pages (skills view needs SKILL.md fetch path fix)

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
