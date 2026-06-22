# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: hermes-nous
- **Tool**: Hermes (Nous Research)
- **Timestamp**: 2026-06-22T16:25:06.747Z

## Active Task
Full PAOS integration of Claude Code and OpenCode

## What Was Just Done
- Claude Code: merged ~/.claude/ runtime data into AI_Workflow/config/claude/ (plugins, skills, rules, sessions, projects, backups, settings)\n- Claude Code: symlinked ~/.claude/ → config/claude/ ✅\n- Claude Code: ponytail plugin survives the move (v4.7.0, enabled)\n- OpenCode: installed CLI (v1.17.9 via install script, binary at ~/.opencode/bin/opencode)\n- OpenCode: merged global ~/.config/opencode/ into AI_Workflow/config/opencode/ (incl context7 MCP, ponytail commands)\n- OpenCode: symlinked ~/.config/opencode/ → config/opencode/ ✅\n- Updated CLAUDE.md agent roster with integration status\n- Updated AGENTS.md with integration banner\n- Cleaned up backup dirs

## What Is NOT Done Yet
- Codex could also be integrated into PAOS if desired

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
