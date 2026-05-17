# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-17T14:35:00Z
- **Session**: T20+T21 — notes/questions protocol wired into all agents + smoke tested

## Active Task
All agents now wire Project Start protocol (notes.md + user-questions.md processing). MCP tools verified.

## What Was Just Done
- Added Step 4 (project files protocol) to 4 remaining soul files: architect, coordinator, codex, openclaw
- Added Step 4 to GEMINI.md, .github/copilot-instructions.md, config/codex/instructions.md
- Confirmed opencode.json agents inherit via soul.md files (no change needed to agent descriptions)
- Smoke tested process_notes: strips completed items, archives to notes-done.md — PASS
- Smoke tested process_questions: removes answered Q, archives to knowledge/questions/<name>.md — PASS
- MCP server version: 1.2.0 (process_notes + process_questions + write_handoff = 13 tools)

## What Is NOT Done Yet
- Fix Claude MCP config: `config/claude/mcp.json` missing `REPO_ROOT` env var (agent_commit tool broken)
- Fill knowledge gaps: skills/system-analysis-and-design references srs-template.md, elicitation-workflow.md — files don't exist
- Wire real projects (claude-vps, vps-kit, tv-clone, downloader) to PAOS — zero wiring currently
- Verify OpenCode vault writes in a real session (test @developer reads HANDOFF and writes ledger)

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active — scalping bot + real-time dashboard |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| project-gpt | `~/Documents/Dev/project-gpt/` | Markdown only | GPT archive |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (13 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode
- Every agent reads HANDOFF.md as Step 0 — universal cold-start (all agents configured)
- process_notes + process_questions called at PROJECT START — archives completed work automatically
- HANDOFF.md is rewritten (not appended) — always current, max 60 lines

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
