# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes (Nous Research)
- **Timestamp**: 2026-06-23T01:10:41.362Z
- **Session**: Session 2026-06-22 — Full PAOS architecture implementation

## Active Task
PAOS architecture completion — all core features built and tested

## What Was Just Done
- Complete dark theme overhaul (gold primary, proper contrast, all text-xs fixed)
- Pipeline data mapping fixed (phase names, task parsing)
- GitView clickable tree view with scroll-to-diff
- Kanban board for plans with bulk download mode
- Project-scoped architecture: projects/, workspaces/, memory/pipelines/
- Workspace file system (.code-workspace) with PAOS settings extension
- Vault (daily + chats) per project
- Events, handoff, ledger, context, inbox per project
- Scoped git identities per project (stored in workspace file)
- Delete confirmation with text verification
- Active project state with View All toggle across all pages
- Server-side filtering for plans, tasks, pipelines APIs
- Refresh buttons on events, handoff, ledger pages
- GitHub import with git clone
- Project secrets UI with masked values
- Constitution (workflow.md) updated with Article XI

## What Is NOT Done Yet
- Events page only showing 1 entry instead of full content (needs investigation)
- Intervene: restrict to read/write only intervene.md file
- Delete pipelines from pipelines page with queue cleanup
- Pipeline builder UI (n8n-style layers)
- PID tracking + terminal view per pipeline execution
- Sort inbox by date/time
- Clean Setup in Settings
- Tokens usage page with calendar histogram
- Additional themes (Claude, Supabase, Clickhouse)

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
