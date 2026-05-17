# PAOS Screenshots

Screenshots are captured from a live PAOS instance running at `localhost:3333`.

## Dashboard Views

| File | View |
|------|------|
| `dashboard-overview.png` | Main overview — agent status, active tasks |
| `dashboard-ledger.png` | Global audit ledger — all agent actions |
| `dashboard-agents.png` | Agent roster with inbox counts |
| `dashboard-tasks.png` | Task board with YAML status cards |
| `dashboard-handoff.png` | HANDOFF.md — live cross-agent state |
| `gitgraph-agents.png` | GitHub gitgraph showing per-agent commits |

## Adding Screenshots

1. Start PAOS: `docker compose up -d` or `cd dashboard && npm run dev`
2. Open `http://localhost:3333`
3. Take a screenshot with your OS tool:
   - macOS: `Cmd+Shift+4`
   - Ubuntu: `gnome-screenshot -a`
   - Windows: `Win+Shift+S`
4. Save to this directory with the filename from the table above
5. They will be referenced automatically in `README.md`
