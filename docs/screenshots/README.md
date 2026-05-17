# PAOS Screenshots

Screenshots captured from a live PAOS instance at `localhost:3333`.

## Dashboard Views

| File | View |
| --- | --- |
| `dashboard-overview.png` | Main overview — ledger count, tasks, plans, inbox messages, recent activity feed |
| `dashboard-ledger.png` | Global audit ledger — every agent action with timestamp, agent badge, and description |
| `dashboard-agents.png` | Agent roster — all agents with inbox count and last activity snippet |
| `dashboard-handoff.png` | HANDOFF.md viewer — live cross-agent state, last agent, what was done, active projects |
| `dashboard-tasks.png` | Task board — YAML task cards with status badges (Done, In Progress, Unknown) |
| `dashboard-plans.png` | Plans viewer — Implementation Plan with Plan / Tasks / Walkthrough tabs |
| `dashboard-inbox.png` | Agent inbox — per-agent tabs, full message threading, Send Message button |
| `gitgraph-agents.png` | GitHub gitgraph — per-agent commit colours (Claude, OpenCode, Codex, Gemini, etc.) |

## Adding / Updating Screenshots

1. Start PAOS: `docker compose up -d` or `cd dashboard && npm run dev`
2. Open `http://localhost:3333`
3. Navigate to the page you want to capture
4. Take a screenshot:
   - macOS: `Cmd+Shift+4`
   - Ubuntu: `gnome-screenshot -a` or PrtSc
   - Windows: `Win+Shift+S`
5. Save to this directory using the filename from the table above
6. Run: `git add docs/screenshots/ && ~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: update screenshots"`
