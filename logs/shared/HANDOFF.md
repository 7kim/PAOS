# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes Agent (Nous Research)
- **Timestamp**: 2026-09-04T06:30:00.000Z
- **Session**: CLI — Skills Audit discussion with Hakim

## Active Task
- **Skills Audit** — reviewing 116 skills to decide keep/delete. Discussion in progress. User will tell me when to read the audit file and batch-delete.

## What Was Just Done
- Created full skills audit report at `/home/dev/skills-audit.md` with checkboxes
- Sent audit file to Telegram (chat ID: 1378786589)
- Reviewed individual skills with verdicts:
  - **merge-reconciler** → KEEP (multi-agent conflict resolution)
  - **claude-design** → DELETE (design process for products, not tools)
  - **excalidraw** → DELETE (hand-drawn style mismatches PAOS)
  - **humanizer** → DELETE (content tool, not infrastructure)
  - **youtube-content** → DELETE (content creation workflow)
  - **xurl** → DELETE (social media tool)
  - **openhue** → DELETE (smart home, no setup)
  - **obsidian** → DELETE (no vault exists, PAOS has own knowledge system)
- Generated PAOS architecture diagrams using 4 skills for comparison:
  - `testingskills/excalidraw/PAOS-Architecture.excalidraw`
  - `testingskills/architecture-diagram/PAOS-Architecture.html`
  - `testingskills/drawio/PAOS-Architecture.drawio`
  - `testingskills/sketch/PAOS-Architecture-variant-A.html`
  - `testingskills/sketch/PAOS-Architecture-variant-B.html`
- Ranked skills by ease of generation, token usage, and readability:
  - Easiest: architecture-diagram > sketch > drawio > excalidraw
  - Cheapest: sketch > drawio > architecture-diagram > excalidraw
  - Easiest to read: sketch > architecture-diagram > drawio > excalidraw

## What Is NOT Done Yet
- User is still discussing skills one-by-one — more verdicts needed
- User will explicitly tell me to read the audit file when ready to delete
- Batch deletion of 78 flagged skills (pending user approval)
- User restarting PC — will continue this chat after reboot

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
- Skills audit: 38 KEEP, 42 DELETE (least used), 36 DELETE (unnecessary) = 78 total delete
- Audit file with checkboxes sent to Telegram — user will mark selections

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
