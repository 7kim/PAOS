---
date: 2026-05-17
agent: claude
focus: Gap closure — .gitignore, MCP mandate, cross-agent continuity, skills wiring
---

# 2026-05-17 — Gap Closure & Cross-Agent Continuity

## Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | config/claude/CLAUDE.md v2.1.0 — mandatory MCP tool calls at session start | Agents were not using MCP tools despite them being registered. Explicit mandate ensures read_ledger + read_context + read_inbox are always called first |
| 2 | Cross-agent continuity: read vault/chats/ at session start | Every agent now reads the most recent chat summary regardless of which tool wrote it — Claude can continue where OpenCode stopped and vice versa |
| 3 | Skills registry added to CLAUDE.md | Claude now knows which skills exist, their trigger conditions, and where the SKILL.md lives — reduces skill blindness |
| 4 | All 5 agent soul.md files updated | developer, architect, coordinator, codex, openclaw now all have the MCP-first SESSION START + vault/chats/ reading + synthesis step |
| 5 | .gitignore tightened | vault/.obsidian/plugins/ (compiled Obsidian binaries), config/codex/sessions/, config/codex/log/, config/openclaw/tui/, notes.md added |
| 6 | bin/start-dashboard.sh created | Simple launcher: cd dashboard && npm run dev at localhost:3333. Dashboard is already built |
| 7 | GitHub confirmed already done | Last session ended with successful git push to github.com/7kim/AI_Workflow.git |
| 8 | Scaffold server confirmed working | Node stdio MCP server, list_templates returns fullstack-monorepo |

## Files Modified

| File | Change |
|------|--------|
| `.gitignore` | Added vault/.obsidian/plugins, codex/sessions, codex/log, openclaw/tui, notes.md |
| `config/claude/CLAUDE.md` | Full rewrite v2.1.0 — MCP mandate, skills registry, cross-agent continuity, full roster |
| `CLAUDE.md` | Added MCP mandate section, skills registry table, updated session protocol |
| `agents/developer/soul.md` | SESSION START: MCP tools + vault/chats/ + synthesis step |
| `agents/architect/soul.md` | SESSION START: MCP tools + vault/chats/ + synthesis step |
| `agents/coordinator/soul.md` | SESSION START: MCP tools + vault/chats/ + synthesis step |
| `agents/codex/soul.md` | SESSION START: vault reads + vault/chats/ + synthesis step |
| `agents/openclaw/soul.md` | SESSION START: MCP tools + vault/chats/ + synthesis step |

## Files Created

| File | Purpose |
|------|---------|
| `bin/start-dashboard.sh` | One-command dashboard launcher |
| `knowledge/references/books.md` | Reading list — AI, architecture, TS/Node, PKM, product |

## Open Questions / Next Steps

- Pipeline still unexercised end-to-end — no real task has gone through PM→Architect→Developer→Coordinator
- OpenClaw channels: `openclaw onboard` still not run (user chose to skip for now)
- Docker: Dockerfile + docker-compose.yaml built, never deployed
- User's active projects: Tradingview (most active), project-gemini, project-gpt
