# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-17T19:00:00Z
- **Session**: Gap closure + force continuity across all agents

## Active Task
Wiring universal continuity: every agent (Claude, OpenCode, Codex, Gemini, Antigravity, Copilot, Ollama) now reads this file first. Ensures any agent can pick up where any other agent stopped.

## What Was Just Done
- config/claude/CLAUDE.md v2.1.0 — mandatory MCP tool calls, skills registry, cross-agent continuity
- All 5 OpenCode agent soul files — MCP-first SESSION START + vault/chats/ reading
- .gitignore fixed — vault plugins, codex sessions, claude tasks now excluded
- bin/start-dashboard.sh created — dashboard is built and ready at localhost:3333
- GitHub push confirmed — github.com/7kim/AI_Workflow.git is up to date
- Scaffold server confirmed — responds to list_templates (fullstack-monorepo available)
- HANDOFF.md created — this file — universal cold-start document for all agents
- GEMINI.md, .github/copilot-instructions.md, Ollama system prompt — in progress

## What Is NOT Done Yet
- Pipeline end-to-end test — PM→Architect→Developer never run on a real task
- OpenClaw channels — `openclaw onboard` not run (user skipped for now)
- Docker deployment — Dockerfile built, never deployed

## Active Projects (operator's codebases)
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active — scalping bot + real-time dashboard |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| project-gpt | `~/Documents/Dev/project-gpt/` | Markdown only | GPT archive |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- All agents read vault first, write vault last — H-Factor §I2/§I3
- MCP servers: `shared-memory` (10 tools) + `scaffold` (2 tools) — both registered in Claude + OpenCode
- Tasks/prompts system exists but unused — first real task will exercise it

## How to Pick Up This Session
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/2026-05-17-gap-closure-continuity.md` — full session summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
