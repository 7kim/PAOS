# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: claude
- **Tool**: Claude Code
- **Timestamp**: 2026-05-21T09:15:00Z
- **Session**: Produced two SRS documents (PAOS current state + Enterprise AgentHarness product design) and exported as PDFs

## Active Task
SRS-PAOS — System Requirements Specification for PAOS current state and Enterprise product vision

## What Was Just Done
- Read AI_Workflow PAOS in full: workflow.md, CLAUDE.md, agents/registry.json, developer.md, skills/system-analysis-and-design/SKILL.md, dashboard layout, mcp structure, config/code-srs/models.yaml
- Produced **SRS-1-PAOS-Current-State.md** (1,046 lines, 495 KB PDF) — full 14-section SRS documenting PAOS v2.0.0 as-is: H-Factor governance, agent roster, shared memory tiers, MCP servers, pipeline architecture, dashboard, skills registry. Includes 9 Mermaid diagrams.
- Produced **SRS-2-Enterprise-Agentic-AI-Harness.md** (1,556 lines, 719 KB PDF) — full 14-section SRS for the commercial "AgentHarness Enterprise" product: BYOA multi-agent harness, Cross-Continuity Engine, PostgreSQL-backed shared memory, visual pipeline builder, Pipeline Marketplace, RBAC/SSO, REST API, WebSocket real-time feed, Docker self-host + managed cloud. Business model: Open Core → Team → Enterprise → SaaS. Includes 7 Mermaid architecture diagrams, full DB schema, REST API table.
- Both files exported to PDF via md-to-pdf + system Chrome (--no-sandbox)
- All artifacts saved to `knowledge/srs/`
- Committed as Agent[claude] (SHA: 62b68d6)

## What Is NOT Done Yet
- Mermaid diagrams render as code blocks in the PDF (mermaid-cli not installed) — diagrams are correct in the .md files and render in VS Code preview
- PDF could be improved with pandoc + xelatex if LaTeX is installed later
- SRS-2 enterprise product has not been scoped/estimated for build — it is a design document only
- PAOS-VPS is still an empty scaffold — needs agent daemon, memory sync, and tunnel implementation

## Active Projects
| Project | Path | Stack | Status |
|---------|------|-------|--------|
| Code-SRS | `~/Documents/Dev/PAOS-WEB/` | Next.js 16 App Router, Together AI design | Active — frontend built, OAuth wired |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| project-gemini | `~/Documents/Dev/project-gemini/` | Next.js 16, FastAPI, PostgreSQL | Scaffold exists, mostly empty |
| AgentHarness Enterprise | `knowledge/srs/SRS-2-*.md` | Design only | SRS complete — not yet built |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (12 tools) + `scaffold` (2 tools) — registered in Claude + OpenCode + Gemini
- Every agent reads HANDOFF.md as Step 0 — universal cold-start (all agents configured)
- **Code-SRS model proxy**: real model IDs resolved server-side only; alias names via `config/code-srs/models.yaml`
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end
- **MCP CONFIGS**: All agent MCP registries symlinked to `/home/dev/AI_Workflow/mcp/mcp-config.json`
- **SRS location**: `knowledge/srs/` — both .md and .pdf artifacts

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
