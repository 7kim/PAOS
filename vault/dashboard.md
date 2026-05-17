# AI Workflow Dashboard

Welcome to your PAOS hub. Everything links from here.

## Live Dashboard

`http://localhost:3333` — Run: `cd ~/AI_Workflow/dashboard && npm run dev`

Sections: Overview · Audit Ledger · Agents · Tasks · Plans · Inbox

## Active Projects

- [[projects/Tradingview]] — Binance scalping bot (Live)
- [[projects/project-gemini]] — Scaffold template
- [[projects/project-gpt]] — GPT session archive

## Knowledge Base

- [[knowledge/paos/constitution.md]] — PAOS Constitution (H-Factor)
- [[knowledge/templates/fullstack-monorepo/docs/SRS.md]] — SRS template
- [[knowledge/templates/fullstack-monorepo/README.md]] — Fullstack scaffold template
- [[knowledge/templates/fullstack-monorepo/docs/setup.md]] — Setup guide

## Audit Trail

- [[memory/global_ledger.md]] — Aggregated ledger (all agents)
- [[memory/claude/events.md]] — Claude Code activity
- [[memory/opencode/events.md]] — OpenCode activity
- [[memory/openclaw/events.md]] — OpenClaw activity (reserved)
- [[memory/antigravity/events.md]] — Antigravity activity
- [[memory/ollama/events.md]] — Ollama activity

## Agent Pipeline

```
@developer → @plan (PM) → @architect + @coordinator (parallel) → @plan → @developer → @coordinator
@openclaw  → reserved slot (install OpenClaw to activate)
```

## Agent Inboxes (Tier C)

- [[memory/inbox/developer/]] — OpenCode developer
- [[memory/inbox/architect/]] — Architect
- [[memory/inbox/coordinator/]] — Coordinator
- [[memory/inbox/claude/]] — Claude Code
- [[memory/inbox/openclaw/]] — OpenClaw (reserved)
- [[memory/inbox/ollama/]] — Ollama

## Shared Context

- [[memory/shared/context.md]] — Ongoing thinking (Tier A)
- [[memory/tasks/]] — Task board (Tier B)
- [[memory/prompts/]] — PM handoff prompts
- [[memory/pm-logs/]] — PM Antigravity artifacts (IMPLEMENTATION_PLAN, TASKS, WALKTHROUGH)

## Project Ledgers

- [[memory/projects/Tradingview/ledger.md]] — Tradingview audit trail
- [[memory/projects/project-gemini/ledger.md]] — project-gemini audit trail
- [[memory/projects/project-gpt/ledger.md]] — project-gpt audit trail
- [[memory/projects/index.md]] — All project ledgers registry

## Active AI Agents

| Agent | Status | Config |
| ----- | ------ | ------ |
| Claude Code | Active | `config/claude/` → `~/.claude` |
| OpenCode | Active | `config/opencode/` → `~/.config/opencode` |
| Antigravity | Active | `config/antigravity/` → `~/.antigravity` |
| OpenClaw | Reserved | `config/openclaw/` — install to activate |
| Ollama | Active | `config/ollama/` |
| Copilot | Active | `config/copilot/` |

## Skills

| Skill | File |
| ----- | ---- |
| Antigravity Review Loop | `skills/antigravity-review-loop/SKILL.md` |
| System Analysis & Design | `skills/system-analysis-and-design/SKILL.md` |
| Project Scaffolder | `skills/project-scaffolder/SKILL.md` |
| Identity Elicitation | `skills/skill-creator-elicitation/SKILL.md` |

## Chat History

- [[chats/2026-05-17-paos-pipeline]] — PAOS universal pipeline session
- [[chats/_template]] — Template for new chat summaries

> **Tip**: The [[projects/projects]] registry has the full project table. The Graph View shows backlinks between all notes.
