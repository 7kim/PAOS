# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-26T12:54:41.208Z
- **Session**: PIPE-26-06-2026---12-46 completed. Benchmark 2 output at benchmarks/Benchmark_2_26-06-2026---12-49/

## Active Task
PIPE-26-06-2026---12-46 fully complete — Benchmark 2 executed, score B (87/100)

## What Was Just Done
- Executed 110-question Benchmark 2 strict audit (Coding-Principles-Benchmark v2.0)\n- Scored all questions with grep evidence and file:line references\n- Calculated raw: 192/220, normalized: 87/100, grade: B\n- Identified 8 infrastructure fixes confirmed working from Benchmark 1\n- Found 4 remaining zero-score gaps: Q26 (Set), Q27 (DAG validation), Q64 (moving averages), Q102 (47 any types)\n- Created full output: full-audit.md, README.md, SRS-as-is.md, gaps/index.md + 4 gap plan files\n- Updated pipeline tracking: TASKS.md, pipeline.json, META.json\n- Wrote WALKTHROUGH.md for phase n1

## What Is NOT Done Yet
- No pending work — pipeline is fully complete\n- User may trigger gap work: \"work on gap 1-4\" via opencode

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
