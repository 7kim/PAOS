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

### Session START — execute in order

**Step 0 — Read HANDOFF first**
```
~/AI_Workflow/vault/memory/shared/HANDOFF.md   ← live state, always current
```

**Step 1 — MCP tools (call these first)**
```
shared-memory: read_ledger        → last 20 rows of global_ledger.md
shared-memory: read_context       → full shared/context.md
shared-memory: read_inbox         → agent="claude"
```

**Step 2 — Cross-agent continuity (read files)**
```
vault/chats/<YYYY-MM-DD>-*.md     → most recent chat summary (any agent)
vault/daily/<YYYY-MM-DD>.md       → today's focus
user.md                           → operator profile
```

**Step 3 — Synthesize** — what did the last agent stop at? Surface to user if relevant.

### Project START — when opening a project

After session start, if working inside a project:

1. **Read `<project>/notes.md`** — execute each item, then call `process_notes` with completed items.
   Items are removed from `notes.md` and archived in `notes-done.md`.
2. **Read `<project>/user-questions.md`** — answer each question, then call `process_questions` with Q&A pairs.
   Answered questions are removed from `user-questions.md` and archived in `knowledge/questions/<project-name>.md`.
   Unanswerable questions stay with `<!-- TODO: needs investigation -->`.

### During work

1. Call `shared-memory: append_ledger` after every significant action.
2. Call `shared-memory: write_context` after every key decision.
3. Write to `vault/memory/claude/events.md` using structured format (Article III §3.1):
   ```
   [TIMESTAMP] | AGENT: claude | ACTION: <Read|Write|Exec|Edit|Test>
   THINKING: "<why this approach>"
   EXECUTION: "<what was done>"
   IMPACT: "<what changed, which files>"
   ```
4. Use Antigravity Review Loop for non-trivial tasks — TASKS.md + IMPLEMENTATION_PLAN.md → wait for review → execute → WALKTHROUGH.md.

### Session END

1. Call `shared-memory: write_context` — handoff notes for next agent.
2. Update `vault/daily/<YYYY-MM-DD>.md` — add activity rows.
3. Write `vault/chats/<YYYY-MM-DD>-<slug>.md` — decisions, files, open questions.
4. Commit: `~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"`

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
