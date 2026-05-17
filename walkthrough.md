# PAOS — Personal Agent Operating System Walkthrough

## Architecture

```
~/AI_Workflow/
├── workflow.md              ← PAOS Constitution (H-Factor I1–I4)
├── user.md                  ← Operator identity (elicited by @profiler)
├── projects.md              ← Active project registry
├── CLAUDE.md                ← Claude Code instructions + conventions
├── agents/                  ← Cellular workforce
│   ├── developer/soul.md    ← Executor (Phase C)
│   ├── architect/soul.md    ← Peer reviewer (Phase B)
│   ├── coordinator/soul.md  ← Orchestrator
│   └── profiler/soul.md     ← Identity elicitor
├── skills/
│   ├── antigravity-review-loop/SKILL.md  ← Review loop (Plan→Review→Execute→Walkthrough)
│   └── project-scaffolder/
├── knowledge/               ← Shared RAG-ready knowledge base (.md)
├── memory/                  ← Shared memory (symlink → logs/)
│   ├── global_ledger.md     ← Unified append-only audit trail (all agents)
│   ├── shared/context.md    ← Tier A: shared thinking
│   ├── tasks/               ← Tier B: task cards
│   ├── pm-logs/             ← Antigravity artifacts (IMPLEMENTATION_PLAN, TASKS, WALKTHROUGH)
│   └── inbox/               ← Tier C: agent messaging
│       ├── claude/          ← Claude Code inbox
│       ├── developer/       ← OpenCode developer inbox
│       ├── openclaw/        ← OpenClaw inbox (reserved)
│       └── ollama/          ← Ollama inbox
├── config/
│   ├── claude/              ← Claude Code config (symlinked ← ~/.claude)
│   ├── opencode/            ← OpenCode config (symlinked ← ~/.config/opencode)
│   ├── antigravity/         ← Antigravity config (symlinked ← ~/.antigravity)
│   ├── openclaw/            ← OpenClaw config (reserved slot)
│   └── ollama/              ← Ollama config
├── mcp/
│   ├── shared-memory-server/ ← MCP: send_message, read_inbox, append_ledger
│   └── scaffold-server/      ← MCP: scaffold_project from templates
├── dashboard/               ← Next.js orchestration UI (localhost:3333)
└── vault/                   ← Obsidian vault (symlinked knowledge/ and memory/)
```

## The H-Factor Flow

```
Phase A:  Lead Agent writes IMPLEMENTATION_PLAN.md
            ↓
Phase B:  @architect reviews → appends ## REVIEW [PASS|FAIL|CONDITIONAL]
            ↓ (FAIL → back to Phase A)
Phase C:  Execute → log to agent's log.md + global_ledger.md → git commit
```

## How to Use

| Command | What it does |
| ------- | ------------ |
| `@coordinator <request>` | Full orchestration — Manager delegates and verifies |
| `@architect review` | Peer-review current `IMPLEMENTATION_PLAN.md` |
| `@architect design <request>` | Create a system design plan |
| `@profiler` | Re-elicit identity, update `user.md` and `projects.md` |
| `@openclaw <request>` | OpenClaw agent (reserved — install openclaw first) |

### Quick Start
1. Tell the Coordinator what you want: `@coordinator build the auth module for vps-kit`
2. The Coordinator reads `soul.md` files, picks the right agent, delegates Phase A
3. The Architect reviews in Phase B — if `[PASS]`, execution begins
4. Every action is logged to `log.md` + `global_ledger.md` with THINKING/EXECUTION/IMPACT
5. Changes are committed with the format: `Agent[<name>]: <description>`

## Git as Memory
After every successful task, the agent commits. To restore context after a reset:
```bash
git log --oneline -10
git diff HEAD~1 -- .opencode/
```

*PAOS initialized 2026-05-15 — H-Factor v2.0.0 — Cellular workforce active.*
