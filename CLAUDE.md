# PAOS — Personal Agent Operating System

This project is governed by the **PAOS Constitution** (`~/AI_Workflow/workflow.md`). You must read it before acting.

## Identity

- **Operator**: Abdullah Abdul Hakim — NodeAlgo (nodealgo.com)
- **Full Profile**: `~/AI_Workflow/user.md`

## Architecture

```text
~/AI_Workflow/
├── agents/         — Agent souls (developer, architect, coordinator, profiler)
├── skills/         — Shareable skills (antigravity-review-loop, project-scaffolder, ...)
├── knowledge/      — Canonical knowledge base (PAOS, references, templates)
├── logs/           — Per-agent audit ledgers
│   ├── global_ledger.md
│   ├── developer/events.md
│   ├── claude/events.md
│   │   └── auto-memory/      — Claude Code auto-memory (symlink → config/claude/projects/-home-dev/memory/)
│   ├── codex/events.md
│   ├── openclaw/events.md
│   └── ...
├── memory/         — Shared memory (symlink → logs/)
│   ├── shared/context.md     — Tier A: shared thinking context
│   ├── tasks/                — Tier B: task board with YAML status
│   ├── prompts/              — PM's handoff prompts for developer
│   ├── pm-logs/              — PM's Antigravity artifacts (IMPLEMENTATION_PLAN, TASKS, WALKTHROUGH)
│   ├── inbox/                — Tier C: agent messaging
│   │   ├── developer/
│   │   ├── architect/
│   │   ├── coordinator/
│   │   ├── claude/
│   │   ├── codex/
│   │   ├── openclaw/         — Reserved for OpenClaw AI
│   │   └── ollama/
│   └── global_ledger.md
├── config/         — All AI tool configs (claude/, codex/, opencode/, antigravity/, openclaw/, ollama/, copilot/)
├── mcp/            — MCP servers (shared-memory: send_message/read_inbox/append_ledger, scaffold)
├── dashboard/      — Next.js orchestration dashboard (localhost:3333)
├── vault/          — Obsidian vault (symlinked knowledge/ and memory/) ← SHARED MEMORY HUB
└── workflows/      — PAOS workflow definitions
```

## Agent Pipeline

```text
Developer → @plan (PM) → @architect + @coordinator (parallel review) → PM → Developer → Coordinator
```

## Active AI Agents

| Agent | Tool | Config | Inbox |
| ----- | ---- | ------ | ----- |
| Claude Code | `~/.claude` → `config/claude/` | `config/claude/CLAUDE.md` | `memory/inbox/claude/` |
| OpenCode developer/plan | `~/.opencode` → `AI_Workflow/` | `config/opencode/opencode.json` | `memory/inbox/developer/` |
| Codex | `~/.codex` → `config/codex/` | `config/codex/instructions.md` | `memory/inbox/codex/` |
| Antigravity | `~/.antigravity` → `config/antigravity/` | VS Code extension | `memory/inbox/antigravity/` |
| OpenClaw | `config/openclaw/` (reserved) | `config/openclaw/README.md` | `memory/inbox/openclaw/` |
| Ollama | `~/.ollama` → `config/ollama/` | Local LLM runtime | `memory/inbox/ollama/` |
| Copilot | `config/copilot/` | VS Code extension | — |

## Shared Resources

- **Obsidian Vault** → `~/AI_Workflow/vault/` — shared memory hub for all agents (MANDATORY — see Conventions)
- **Shared Context** → `vault/memory/shared/context.md` (append-only thinking)
- **Task Board** → `vault/memory/tasks/` (status-tracked task cards)
- **Handoff Prompts** → `vault/memory/prompts/` (PM → Developer)
- **Agent Inbox** → `vault/memory/inbox/<agent>/` (via MCP `send_message` / `read_inbox`)
- **Audit Ledger** → `vault/memory/global_ledger.md` (append-only, all agents)
- **Knowledge Base** → `vault/knowledge/` and all `.md` files under `knowledge/`
- **MCP Tools** → `shared-memory` (ledger + knowledge + inbox), `scaffold` (project templates)
- **Dashboard** → `http://localhost:3333` (run: `cd ~/AI_Workflow/dashboard && npm run dev`)

## Claude Code Conventions

> Full session protocol: `~/AI_Workflow/knowledge/docs/session-protocol.md`
> Skipping vault writes violates H-Factor §I2 and §I3.

### Session START — 3 steps

1. Read `~/AI_Workflow/vault/memory/shared/HANDOFF.md`
2. Call `shared-memory: read_ledger` + `shared-memory: read_inbox` (agent="claude") in parallel
3. Synthesize — surface anything in-progress or blocked before responding

### Project START

If working inside a project: read `knowledge/docs/notes.md` → call `process_notes`; read `knowledge/docs/user-questions.md` → call `process_questions`.

### During work

- `shared-memory: append_ledger` after every significant action
- `shared-memory: write_context` after any key decision
- Write to `vault/memory/claude/events.md` (Article III §3.1 format)
- Non-trivial tasks: Antigravity Review Loop (TASKS.md + IMPLEMENTATION_PLAN.md → review → execute → WALKTHROUGH.md)

### Session END — 2 steps

1. Rewrite `~/AI_Workflow/vault/memory/shared/HANDOFF.md`
2. `shared-memory: append_ledger` → `~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"`

## MCP Servers

| Server | Tools | Purpose |
|--------|-------|---------|
| `shared-memory` | read_ledger, read_context, read_inbox, append_ledger, write_context, send_message, create_task, read_task, list_agents, agent_commit | Shared state across all agents |
| `scaffold` | list_templates, scaffold_project | Generate new projects from templates |

## Skills Registry

| Skill | Trigger | Path |
|-------|---------|------|
| Antigravity Review Loop | Any non-trivial task | `skills/antigravity-review-loop/SKILL.md` |
| System Analysis & Design | "SRS", "system design", "architecture", `@architect design` | `skills/system-analysis-and-design/SKILL.md` |
| Project Scaffolder | "scaffold", "new project", `@scaffold` | `skills/project-scaffolder/SKILL.md` |
| Skill Creator | "create skill", "new skill" | `skills/skill-creator-elicitation/SKILL.md` |

## Git Identity (Per-Agent Commits)

Every agent commits with its own identity — visible as separate authors in gitgraph.

```bash
# Standard commit for Claude:
~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"

# Other agents:
~/AI_Workflow/bin/agent-commit.sh codex "Agent[codex]: <description>"
~/AI_Workflow/bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: <description>"
```

Agent identities: `claude@paos.nodealgo.com`, `codex@paos.nodealgo.com`, `developer@paos.nodealgo.com`, etc.

## Secrets Management

API keys live in `config/secrets/.env` (gitignored). Template: `config/secrets/.env.template`.

```bash
cp config/secrets/.env.template config/secrets/.env
nano config/secrets/.env   # fill in OPENAI_API_KEY, etc.
```

## Docker Deployment

```bash
cp docker/secrets.env.template docker/secrets.env
nano docker/secrets.env
docker compose -f docker/docker-compose.yaml up -d
# Dashboard: http://localhost:3333
```

## GitHub

```bash
# First time only (interactive browser auth):
~/AI_Workflow/bin/github-setup.sh

# Subsequent pushes:
git push
```

## H-Factor Invariants

- **I1** Separation of Powers — Planner ≠ Reviewer ≠ Executor ≠ Orchestrator
- **I2** Audit Immutability — `global_ledger.md` is append-only, never edited
- **I3** Identity First — every action attributed to a known agent (claude, opencode-developer, codex, openclaw, ollama, antigravity)
- **I4** Skill Boundary — agents act only within declared capabilities
