# HANDOFF — Current PAOS State

> This file is **rewritten** each session. It is the first thing every agent reads.
> Always current. Max 60 lines.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes Agent (Nous Research)
- **Timestamp**: 2026-06-22T16:10:00Z
- **Session**: PAOS infrastructure setup + Docker → Host dev mode

## Active Task
PAOS is running in host dev mode. Dashboard accessible via Tailscale at `https://dev.anaconda-notothen.ts.net`.

## What Was Just Done
- Installed Hermes fully into PAOS (`~/AI_Workflow/hermes/`, symlinked from `~/.hermes`)
- Added Article X (Shared Infrastructure Convention) to constitution
- Wired all 7 agents to unified MCP config (`mcp/mcp-config.json`)
- Installed 3 shared MCP servers: Context7 (docs), Hostinger (domains + DNS), agent-browser (Vercel Labs)
- Built, ran PAOS Docker container, then switched to host dev mode for instant refresh
- Set up Tailscale Serve at `https://dev.anaconda-notothen.ts.net` (tailnet only)
- Created `paos-hub` systemd service for boot auto-start
- Changed user to docker group for non-sudo docker access
- Session focus: PAOS is the only active project

## What Is NOT Done Yet
- Dokploy setup on VPS + nodealgo.com domain (deferred)
- Dashboard health check needs fix (registry.json path in container build)
- Other agents may need home-in-PAOS treatment like Hermes

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
2. Dashboard: `https://dev.anaconda-notothen.ts.net`
3. Next operator: ask "Continuing from fresh PAOS — what's next?"
