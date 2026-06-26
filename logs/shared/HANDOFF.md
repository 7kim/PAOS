# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: hermes
- **Tool**: hermes
- **Timestamp**: 2026-06-26T13:07:50.117Z
- **Session**: Final session — comprehensive PAOS enhancement

## Active Task
PAOS development cycle complete — all roadmap items built and tested

## What Was Just Done
- All 16 benchmark gaps closed (auth, rate limiting, cache, cycle detection, DAG validation, concurrent writes, pagination, hardcoded paths, any types, React.memo, similarity metrics, velocity tracking, resource planner, CORS, CSRF, HSTS)
- 25 dashboard pages built: overview, projects, vault, graph, events, handoff, ledger, agents, agent explorer, agent stats, agent replay, tasks, pipelines, pipeline analytics, pipeline builder, pipeline visualize, benchmarks, tokens, terminals, gitview, plans, inbox, mcp-servers, api-playground, settings, settings/code-srs, system/doctor
- Agent lifecycle: enable/disable toggle, self-contained installer at agents/<name>/, registry management, health checks
- Pipeline system: create, schedule (cron), execute, visualize (MiniDagView), analytics, cost tracking, auto-scaling via resource planner, blueprint sharing (export/import JSON)
- Knowledge: RAG search via TF-IDF + Ollama embeddings, knowledge graph page, health check scanner, Obsidian wikilink conventions across 5 docs
- Cross-platform: paos-pipeline-commands skill for Telegram/CLI/Discord, inline keyboard Telegram bot (paos-telegram-bot.py) with 6 commands + systemd service
- Infrastructure: bin/install-paos.sh (706 lines, idempotent Ubuntu bootstrap), systemd services for pipeline watcher + Telegram bot
- Multi-machine architecture: research/multi-machine-paos.md (1069 lines, 4 options)
- Bug fixes: phase status sync on completion, task count accuracy, pipeline.json enrichment (completedAt, velocity, per-phase status/duration), auth bypass for Tailscale hostname
- Navigation: sidebar links added for graph, agent replay, mcp-servers. Navigation buttons for analytics, explorer, stats, system health
- QA audit: all 20 pages tested, 1 crash fixed (tokens page)
- MCP servers: search-server (Ollama + TF-IDF), shared-memory, scaffold, browser
- CLI: bin/h-search, bin/paos-telegram-bot.py

## What Is NOT Done Yet
- Test bin/install-paos.sh on a fresh VPS
- Any gaps discovered through real-world use

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
