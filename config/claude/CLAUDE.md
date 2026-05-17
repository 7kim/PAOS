# Claude Code — User-Level Configuration

PAOS (Personal Agent Operating System) — H-Factor Protocol v2.0.0

This file is the **user-level** CLAUDE.md. It applies to every project and every session.
Project-specific rules live in each project's own CLAUDE.md.

## Identity

- **Operator**: Abdullah Abdul Hakim — NodeAlgo (nodealgo.com)
- **Hub**: `~/AI_Workflow/` — shared orchestration hub for all AI agents
- **Constitution**: `~/AI_Workflow/workflow.md` — read before acting on any non-trivial task

## Article IX — Obsidian Vault Protocol (Mandatory — Every Session)

The Obsidian vault at `~/AI_Workflow/vault/` is the **shared persistent memory** of the PAOS.
Writing to it every session is non-negotiable — skipping violates H-Factor §I2 and §I3.
The vault is how Claude shares state with OpenCode, Codex, Antigravity, OpenClaw, Copilot, Ollama.

### SESSION START — read before any work

1. Read `~/AI_Workflow/vault/memory/global_ledger.md` — what have other agents done?
2. Read `~/AI_Workflow/vault/memory/shared/context.md` — load shared thinking context.
3. Read `~/AI_Workflow/vault/memory/inbox/claude/` — check messages from other agents.
4. Read `~/AI_Workflow/vault/daily/<YYYY-MM-DD>.md` — today's focus.
5. Read `~/AI_Workflow/user.md` — operator profile.

### DURING work

1. Append every significant action to `~/AI_Workflow/vault/memory/claude/events.md`:

   ```text
   [TIMESTAMP] | ACTION | file | description
   ```

2. Append summary rows to `~/AI_Workflow/vault/memory/global_ledger.md` after each significant action.
3. For non-trivial tasks: use the Antigravity Review Loop (TASKS.md → IMPLEMENTATION_PLAN.md → WALKTHROUGH.md).

### SESSION END — write before closing

1. Update `~/AI_Workflow/vault/daily/<YYYY-MM-DD>.md` — add activity rows.
2. Write `~/AI_Workflow/vault/chats/<YYYY-MM-DD>-<slug>.md` — decisions, files created/modified, open questions.
3. Append to `~/AI_Workflow/vault/memory/shared/context.md` — key decisions and handoff notes for next agent.
4. Git commit using agent identity script:

   ```bash
   ~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"
   ```

   This commits under `Claude Code [PAOS] <claude@paos.nodealgo.com>` — visible as a distinct author in gitgraph.
   Never use plain `git commit` — always use `bin/agent-commit.sh` so all agents appear separately in git history.

## H-Factor Invariants

| ID | Invariant | Rule |
| -- | --------- | ---- |
| I1 | Separation of Powers | Planner ≠ Reviewer ≠ Executor — never control more than one phase |
| I2 | Audit Immutability | `global_ledger.md` is append-only — never edit past entries |
| I3 | Identity First | Every action attributed to `claude` agent stamp |
| I4 | Skill Boundary | Act only within declared capabilities |

## Active AI Agents (PAOS Roster)

| Agent | Tool | Config | Inbox |
| ----- | ---- | ------ | ----- |
| Claude Code | `~/.claude` → `config/claude/` | This file | `memory/inbox/claude/` |
| OpenCode developer | `~/.opencode` → `AI_Workflow/` | `config/opencode/opencode.json` | `memory/inbox/developer/` |
| Codex | `~/.codex` → `config/codex/` | `config/codex/instructions.md` | `memory/inbox/codex/` |
| Antigravity | `~/.antigravity` → `config/antigravity/` | VS Code extension | `memory/inbox/antigravity/` |
| OpenClaw | `~/.openclaw` → `config/openclaw/` | `config/openclaw/README.md` | `memory/inbox/openclaw/` |
| Ollama | `~/.ollama` → `config/ollama/` | Local LLM runtime | `memory/inbox/ollama/` |
| Copilot | `config/copilot/` | VS Code extension | — |

## Shared Memory Paths

| Resource | Path |
| -------- | ---- |
| Vault | `~/AI_Workflow/vault/` |
| Global Ledger | `~/AI_Workflow/vault/memory/global_ledger.md` |
| Shared Context | `~/AI_Workflow/vault/memory/shared/context.md` |
| Claude Events | `~/AI_Workflow/vault/memory/claude/events.md` |
| Claude Auto-Memory | `~/AI_Workflow/config/claude/projects/-home-dev/memory/MEMORY.md` |
| Task Board | `~/AI_Workflow/vault/memory/tasks/` |
| Agent Inboxes | `~/AI_Workflow/vault/memory/inbox/<agent>/` |
| Daily Notes | `~/AI_Workflow/vault/daily/<YYYY-MM-DD>.md` |
| Chat Summaries | `~/AI_Workflow/vault/chats/` |
