# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes (Nous Research)
- **Timestamp**: 2026-06-22T16:20:07.649Z

## Active Task
Installed ponytail (DietrichGebert/ponytail) — lazy senior dev coding philosophy for PAOS agents

## What Was Just Done
- Installed Claude Code CLI (npm -g to ~/.local/bin)\n- Installed ponytail plugin for Claude Code via marketplace (v4.7.0, enabled)\n- Configured ponytail for OpenCode: plugin ref in global + PAOS-level opencode.json, 6 command symlinks in ~/.config/opencode/command/\n- Created PAOS shared skill at skills/ponytail/SKILL.md with full ladder, rules, and not-lazy-about section\n- Registered ponytail in skills/INDEX.md under new Software Development Skills section\n- Referenced in config/claude/CLAUDE.md and config/opencode/AGENTS.md\n- Set defaultMode=full in ~/.config/ponytail/config.json\n- Fixed pre-existing trailing comma + missing root close-brace in PAOS opencode.json\n- Cloned repo to skills/ponytail-repo/ for reference

## What Is NOT Done Yet
- OpenClaw: can install via `clawhub install ponytail` if ClawHub is configured

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
