# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-17T19:30:00Z
- **Session**: Universal continuity — all agents forced to read HANDOFF.md

## What Was Just Done
- `vault/memory/shared/HANDOFF.md` — this file — universal live context primer for ALL agents
- `GEMINI.md` — Gemini CLI reads this automatically (like CLAUDE.md). Full vault protocol + HANDOFF Step 0.
- `.github/copilot-instructions.md` — Antigravity + Copilot both read this. Vault protocol + operator profile.
- `config/ollama/system-prompt.md` — Ollama system prompt with vault protocol
- `config/opencode/opencode.json` — HANDOFF.md added to instructions array (auto-loaded every OpenCode session)
- `config/codex/instructions.md` — HANDOFF Step 0 + vault/chats/ reading added
- All agent soul files (developer, architect, coordinator, codex, openclaw) — HANDOFF Step 0 + SESSION END rewrite mandate
- `bin/agent-commit.sh` — gemini identity added
- `.gitignore` — fixed (vault plugins, codex sessions, claude tasks excluded)
- `bin/start-dashboard.sh` — dashboard launcher created
- GitHub: already pushed to github.com/7kim/AI_Workflow.git (completed last session)

## What Is NOT Done Yet
- **Pipeline end-to-end test** — PM→Architect→Developer never run on a real task — THIS IS NEXT
- OpenClaw channels — `openclaw onboard` not run (user chose to skip)
- Docker deployment — Dockerfile built, never deployed
- Gemini CLI not yet installed — GEMINI.md is ready for when it is

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active — scalping bot + real-time dashboard |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| project-gpt | `~/Documents/Dev/project-gpt/` | Markdown only | GPT archive |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (10 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode
- Every agent reads HANDOFF.md before anything else — universal cold-start
- HANDOFF.md is rewritten (not appended) — always current, max 60 lines

## How to Pick Up
1. Read this file (done)
2. Read `vault/chats/2026-05-17-universal-continuity.md` for full session summary
3. Next action: run first real task through PM→Architect→Developer pipeline
