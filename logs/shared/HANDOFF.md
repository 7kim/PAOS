# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes (Nous Research)
- **Timestamp**: 2026-06-22T18:56:44.107Z

## Active Task
PAOS Dashboard and Pipeline System — fully operational

## What Was Just Done
- Dynamic pipeline visualization: N-node phase flow with expandable artifacts, diff view, live pipeline.json, task summary, and walkthrough\n- Execute API (POST /api/pipelines/[id]/execute) that spawns opencode run in background\n- Play button on pipelines list to trigger execution\n- Review & Enhance multi-agent pipeline flow (opencode → hermes → opencode)\n- Show diff toggle for enhanced plans inside phase headers\n- Slash commands for OpenCode and Claude Code: /pipelines-view, /pipeline-execute\n- Pipeline protocol instructions for both agents (AGENTS.md, CLAUDE.md)\n- Pipeline progress bars read from pipeline.json (live) instead of static TASKS.md markers\n- Polling stops and spinner stops when pipeline hits 100%\n- Pipeline phases use new dynamic phases[] format (not legacy planner/executor)\n- Task parsing uses LAST TASKS.md (latest phase) not first\n- API Playground updated with all 18 endpoints (pipelines detail, execute, projects, code-srs)\n- Projects page built with file explorer tree, current/previous tabs\n- Task stats use actual parsed task count, capped enrichment from pipeline.json\n- List API reads pipeline.json for live progress on all pipelines

## What Is NOT Done Yet
- Terminals page (view/kill running terminal sessions)\n- Enhance Projects page as full file explorer with file views\n- IDE Mode with CodeMirror 6\n- Built-in terminal (xterm.js)\n- Research Termux AI\n- PAOS web finalization/polish

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
