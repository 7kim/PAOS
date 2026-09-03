# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes Agent (Nous Research)
- **Timestamp**: 2026-09-03T02:15:00.000Z
- **Session**: Telegram DM with Hakim

## Active Task
- `git-last-5-commits` (PAOS project) — awaiting approval, will read last 5 git commits and send to Telegram

## What Was Just Done
- Added **Startup Boot** tab to `/terminals` page — systemd services with Start/Stop/Restart/Enable/Disable
- Enable/Disable now also trigger immediate Start/Stop
- Added **real-time task progress tracking** — `progress` field with progress bars in UI
- Added **project filter bar** to `/tasks` page — filter by project or view all
- Tasks are now per-project: stored in `projects/{name}/tasks/`, filtered via `?project=` query param
- Moved existing task to `projects/PAOS/tasks/`
- Fixed `lib/settings.ts` Invalid Date crash
- Created test task `git-last-5-commits` for approval workflow testing

## What Is NOT Done Yet
- User needs to approve `git-last-5-commits` on dashboard to test the approval → execution flow
- Future roadmap: Tokens Usage, MCP Servers settings, Pipeline Builder, IDE Mode, built-in terminal, RAG vs DB research

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS | `~/AI_Workflow/` | Multi-Agent AI Orchestration | Active |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit
- **Hermes home**: `~/AI_Workflow/hermes/` (symlinked from `~/.hermes`)
- Dashboard: `npm run dev -- --webpack --port 3333`, Tailscale serve for tailnet
- Systemd service `paos-dashboard` manages dashboard on boot
- Tasks are per-project: `projects/{name}/tasks/`, filtered via `?project=` query param
- Task progress is real-time: PATCH `/api/tasks?id=X&progress=...` updates progress bar live
- Default executor is Hermes — only dispatch to other agents when explicitly told

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
