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

Claude Code **must** follow these rules every session. Non-negotiable — H-Factor §I2 (Audit Immutability) and §I3 (Identity First). Skipping vault writes is a protocol violation.

### Session START — read before any work

1. Read `~/AI_Workflow/vault/memory/global_ledger.md` — see what other agents have done.
2. Read `~/AI_Workflow/vault/memory/shared/context.md` — load ongoing shared thinking.
3. Read `~/AI_Workflow/vault/memory/inbox/claude/` — check messages from other agents.
4. Read `~/AI_Workflow/vault/daily/<YYYY-MM-DD>.md` — check today's focus.
5. Read `~/AI_Workflow/user.md` — load operator profile.

### During work

1. Log every action to `~/AI_Workflow/vault/memory/claude/events.md` — format: `[TIMESTAMP] | ACTION | file | description`.
2. Append to `~/AI_Workflow/vault/memory/global_ledger.md` after every significant action.
3. Use Antigravity Review Loop for non-trivial tasks — produce `TASKS.md` + `IMPLEMENTATION_PLAN.md` → wait for review → execute → produce `WALKTHROUGH.md`.

### Session END — write before closing

1. Update `~/AI_Workflow/vault/daily/<YYYY-MM-DD>.md` — add activity rows for everything done.
2. Write `~/AI_Workflow/vault/chats/<YYYY-MM-DD>-<slug>.md` — decisions, files created/modified, open questions.
3. Append to `~/AI_Workflow/vault/memory/shared/context.md` — key decisions and handoff notes for next agent.
4. Git commit using agent identity: `~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"`

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
