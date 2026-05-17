# Claude Code — User-Level Configuration
# PAOS H-Factor Protocol v2.1.0

This file applies to **every project and every session**. Project-specific rules live in each project's own CLAUDE.md.

## Identity

- **Operator**: Abdullah Abdul Hakim — NodeAlgo (nodealgo.com)
- **Hub**: `~/AI_Workflow/` — shared orchestration hub for all AI agents
- **Constitution**: `~/AI_Workflow/workflow.md` — read before acting on any non-trivial task
- **Agent stamp**: `claude` / `claude@paos.nodealgo.com`

---

## Article IX — Obsidian Vault Protocol (Mandatory — Every Session)

The vault at `~/AI_Workflow/vault/` is the **shared persistent memory** of the PAOS.
Vault writes are non-negotiable — skipping violates H-Factor §I2 and §I3.

### SESSION START — execute in order before any work

**Step 0 — Read HANDOFF first (most important)**

```
~/AI_Workflow/vault/memory/shared/HANDOFF.md
```
This is the live state document. Always read this first — it tells you what the last agent stopped at, what's in-progress, and what decisions have been made. It is rewritten every session (not append-only).

**Step 1 — MCP: load shared state (call these tools)**

```
shared-memory: read_ledger        → last 20 rows of global_ledger.md
shared-memory: read_context       → full shared/context.md
shared-memory: read_inbox         → agent="claude" (check messages from other agents)
shared-memory: list_agents        → confirm roster is current
```

**Step 2 — Cross-agent continuity (read files)**

```
vault/chats/<YYYY-MM-DD>-*.md     → read the most recent chat summary (any agent)
vault/daily/<YYYY-MM-DD>.md       → today's focus and activity log
user.md                           → operator profile
```

**Step 3 — Context synthesis**

Before responding to the user, synthesize: what did the last agent stop at? What is in-progress? What is blocked? Surface this to the user if relevant.

### PROJECT START — when opening a project for the first time in a session

After completing SESSION START steps, if working inside a project directory:

1. **Read `<project>/notes.md`** — execute every item in order. After completing all items, call:
   ```
   shared-memory: process_notes
     project_path: "<absolute path to project>"
     agent: "claude"
     completed: ["<item text>", ...]
   ```
   Completed items will be removed from `notes.md` and archived in `notes-done.md`.

2. **Read `<project>/user-questions.md`** — answer every question fully. After answering, call:
   ```
   shared-memory: process_questions
     project_path: "<absolute path to project>"
     project_name: "<project name>"
     agent: "claude"
     qa_pairs: [{ question: "...", answer: "..." }, ...]
   ```
   Answered questions will be removed from `user-questions.md` and archived in `~/AI_Workflow/knowledge/questions/<project-name>.md`.
   If a question cannot be answered without deeper investigation, leave it with `<!-- TODO: needs investigation -->`.

### DURING work — mandatory per-action logging

**After every significant action**, call both MCP tools:

```
shared-memory: append_ledger   → log the action
shared-memory: write_context   → update shared thinking if a decision was made
```

Also write directly to `~/AI_Workflow/vault/memory/claude/events.md`:
```
[TIMESTAMP] | ACTION | file | description
```

For non-trivial tasks, use the Antigravity Review Loop:
1. Produce `TASKS.md` + `IMPLEMENTATION_PLAN.md` → stop, wait for user review
2. On approval → execute → produce `WALKTHROUGH.md`

### SESSION END — write before closing

1. **Rewrite `~/AI_Workflow/vault/memory/shared/HANDOFF.md`** — update Last Agent, Active Task, What Was Just Done, What Is NOT Done Yet. This is the most critical step.
2. Call `shared-memory: write_context` — key decisions and handoff notes for next agent
2. Update `vault/daily/<YYYY-MM-DD>.md` — add activity rows
3. Write `vault/chats/<YYYY-MM-DD>-<slug>.md` — decisions, files, open questions
4. Commit:
   ```bash
   ~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"
   ```
   **Never use plain `git commit`** — always `agent-commit.sh` so every agent appears separately in gitgraph.

---

## MCP Servers (Always Available)

Both servers are registered in `~/.claude/mcp.json`. They are available in every session.

### `shared-memory` — 10 tools

| Tool | When to call |
|------|-------------|
| `read_ledger` | Session start — what have all agents done? |
| `read_context` | Session start — load shared thinking |
| `read_inbox` | Session start — messages from other agents (`agent="claude"`) |
| `list_agents` | When checking PAOS roster |
| `append_ledger` | After every significant action |
| `write_context` | After any key decision or plan change |
| `send_message` | To send a task/message to another agent's inbox |
| `create_task` | To create a tracked task card in `memory/tasks/` |
| `read_task` | To read a specific task card |
| `agent_commit` | Alternative to shell agent-commit.sh |

### `scaffold` — 2 tools

| Tool | When to call |
|------|-------------|
| `list_templates` | When user asks to scaffold a new project |
| `scaffold_project` | To create a new project from a template (e.g. `fullstack-monorepo`) |

---

## Skills Registry

Invoke these when the trigger condition is met. Read the `SKILL.md` inside each skill dir first.

| Skill | Path | Trigger |
|-------|------|---------|
| **Antigravity Review Loop** | `skills/antigravity-review-loop/SKILL.md` | Any non-trivial implementation task — produces TASKS.md + IMPLEMENTATION_PLAN.md, waits for review, executes, produces WALKTHROUGH.md |
| **System Analysis & Design** | `skills/system-analysis-and-design/SKILL.md` | User says "SRS", "system design", "architecture document", "design X", or `@architect design` — runs 14-section SRS + Mermaid diagrams |
| **Project Scaffolder** | `skills/project-scaffolder/SKILL.md` | User says "scaffold", "new project", "initialize project", or `@scaffold` — runs 10-point discovery survey then generates project harness via `scaffold` MCP |
| **Skill Creator** | `skills/skill-creator-elicitation/SKILL.md` | User asks to create a new skill or agent capability |

---

## H-Factor Invariants

| ID | Invariant | Rule |
|----|-----------|------|
| I1 | Separation of Powers | Planner ≠ Reviewer ≠ Executor — never control more than one phase |
| I2 | Audit Immutability | `global_ledger.md` is append-only — never edit past entries |
| I3 | Identity First | Every action attributed to `claude` agent stamp |
| I4 | Skill Boundary | Act only within declared capabilities |

---

## Active AI Agents (PAOS Roster)

| Agent | Tool | Config | Inbox |
|-------|------|--------|-------|
| Claude Code | `~/.claude` → `config/claude/` | This file | `memory/inbox/claude/` |
| OpenCode developer | `~/.opencode` → `AI_Workflow/` | `config/opencode/opencode.json` | `memory/inbox/developer/` |
| OpenCode plan (PM) | same | same | `memory/inbox/developer/` |
| OpenCode architect | same | same | `memory/inbox/architect/` |
| OpenCode coordinator | same | same | `memory/inbox/coordinator/` |
| Codex | `~/.codex` → `config/codex/` | `config/codex/instructions.md` | `memory/inbox/codex/` |
| Antigravity | VS Code extension | `config/antigravity/` | `memory/inbox/antigravity/` |
| OpenClaw | `~/.openclaw` → `config/openclaw/` | `config/openclaw/README.md` | `memory/inbox/openclaw/` |
| Ollama | `~/.ollama` | `config/ollama/` | `memory/inbox/ollama/` |
| Copilot | VS Code extension | `config/copilot/` | — |

---

## Shared Memory Paths

| Resource | Path |
|----------|------|
| Vault | `~/AI_Workflow/vault/` |
| Global Ledger | `~/AI_Workflow/vault/memory/global_ledger.md` |
| Shared Context | `~/AI_Workflow/vault/memory/shared/context.md` |
| Claude Events | `~/AI_Workflow/vault/memory/claude/events.md` |
| Task Board | `~/AI_Workflow/vault/memory/tasks/` |
| Handoff Prompts | `~/AI_Workflow/vault/memory/prompts/` |
| Agent Inboxes | `~/AI_Workflow/vault/memory/inbox/<agent>/` |
| Daily Notes | `~/AI_Workflow/vault/daily/<YYYY-MM-DD>.md` |
| Chat Summaries | `~/AI_Workflow/vault/chats/` |
| PM Artifacts | `~/AI_Workflow/vault/memory/pm-logs/` |
| Project Ledgers | `~/AI_Workflow/vault/memory/projects/<name>/ledger.md` |
