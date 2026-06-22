# Claude Code — User-Level Configuration
# PAOS H-Factor Protocol v2.1.0

> **Config home**: `~/AI_Workflow/config/claude/` — fully integrated into PAOS.
> `~/.claude/` → `config/claude/` (symlink). CLI at `~/.local/bin/claude`.

This file applies to **every project and every session**. Project-specific rules live in each project's own CLAUDE.md.

## Identity

- **Operator**: Abdullah Abdul Hakim — NodeAlgo (nodealgo.com)
- **Hub**: `~/AI_Workflow/` — shared orchestration hub for all AI agents
- **Constitution**: `~/AI_Workflow/workflow.md` — read before acting on any non-trivial task
- **Agent stamp**: `claude` / `claude@paos.nodealgo.com`

---

## Article IX — Obsidian Vault Protocol (Mandatory — Every Session)

> Canonical protocol: `~/AI_Workflow/knowledge/docs/session-protocol.md`
> Vault writes are non-negotiable — skipping violates H-Factor §I2 and §I3.

### SESSION START — 3 steps

1. **Read HANDOFF** — `~/AI_Workflow/vault/memory/shared/HANDOFF.md` (live state, always first)
2. **Load shared state** (call in parallel):
   ```
   shared-memory: read_ledger    → last 20 rows
   shared-memory: read_inbox     → agent="claude"
   ```
3. **Start working** — surface anything in-progress or blocked to the user before proceeding

### PROJECT START — when opening a project

If working inside a project directory after session start:
1. Read `knowledge/docs/notes.md` (hub) or `<project>/notes.md` → execute items → call `shared-memory: process_notes`
2. Read `knowledge/docs/user-questions.md` (hub) or `<project>/user-questions.md` → answer → call `shared-memory: process_questions`

### DURING work

After every significant action: `shared-memory: append_ledger`
After any key decision: `shared-memory: write_context`
Also write to `~/AI_Workflow/vault/memory/claude/events.md` (Article III §3.1 format).

For non-trivial tasks: Antigravity Review Loop — TASKS.md + IMPLEMENTATION_PLAN.md → wait for review → execute → WALKTHROUGH.md.

### SESSION END — 2 steps

1. **Rewrite HANDOFF** — `~/AI_Workflow/vault/memory/shared/HANDOFF.md` (most critical step)
2. **Log + commit**:
   ```bash
   # append_ledger one summary row, then:
   ~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"
   ```
   **Never use plain `git commit`** — always `agent-commit.sh`.

---

## MCP Servers (Always Available)

Both servers are registered in `~/.claude/mcp.json`. They are available in every session.

### `shared-memory` — 12 tools

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
| `submit_pipeline` | After producing PLAN.md + TASKS.md — submits to executor via /h-pipeline |

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
| **Ponytail** | `skills/ponytail/SKILL.md` | Active by default — lazy senior dev mode. Before writing code: YAGNI → stdlib → native → installed dep → one line → minimum. Cuts ~54% code safely. Also installed as a Claude Code plugin. |

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

| Agent | Tool / Binary | Config Home | Inbox |
|-------|--------------|-------------|-------|
| Claude Code | `~/.local/bin/claude` | `~/.claude` → `config/claude/` ✅ integrated | `memory/inbox/claude/` |
| OpenCode developer | `~/.opencode/bin/opencode` | `~/.config/opencode/` → `config/opencode/` ✅ integrated | `memory/inbox/developer/` |
| OpenCode plan (PM) | same | same | `memory/inbox/developer/` |
| OpenCode architect | same | same | `memory/inbox/architect/` |
| OpenCode coordinator | same | same | `memory/inbox/coordinator/` |
| Codex | `~/.codex` → `config/codex/` | `config/codex/instructions.md` | `memory/inbox/codex/` |
| Antigravity | VS Code extension | `config/antigravity/` | `memory/inbox/antigravity/` |
| OpenClaw | `~/.openclaw` → `config/openclaw/` | `config/openclaw/README.md` | `memory/inbox/openclaw/` |
| Ollama | `~/.ollama` | `config/ollama/` | `memory/inbox/ollama/` |
| Gemini | `~/.gemini` | `agents/gemini/soul.md` | `memory/inbox/gemini/` |
| Signal | `~/.local/bin/signal` | `config/signal/instructions.md` | `memory/inbox/signal/` |
| Hermes Nous | `~/.local/bin/hermes` | `agents/hermes-nous/soul.md` | `memory/inbox/hermes-nous/` |
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

---

## /h-pipeline Command — Cross-Agent Plan-Then-Execute

When the user types `/h-pipeline <prompt>`, follow this protocol:

1. **Plan**: Read the prompt and produce:
   - `IMPLEMENTATION_PLAN.md` — full technical plan
   - `TASKS.md` — numbered task breakdown
2. **Submit**: Call `shared-memory: submit_pipeline` with:
   - `planner_agent`: "claude"
   - `prompt`: the original user prompt
   - `plan_content`: the full IMPLEMENTATION_PLAN.md text
   - `tasks_content`: the full TASKS.md text
   - `executor`: "opencode-developer" (or override via `/h-pipeline --executor <id> <prompt>`)
3. **Inform**: Tell the user: "Pipeline submitted. Executor will pick it up from their inbox."

The MCP tool handles: creating `memory/pipelines/PIPE-xxx/` with PLAN.md + TASKS.md + META.json, creating a task card, sending the plan to the executor's inbox, and logging to the global ledger.

**Pipeline naming convention**: `AI_Workflow-PIPE_N-DD-MM-YYYY---HH-MM` (sequential number, date, 24hr time). Use `bin/paos-pipe-id` to generate the next ID.

### Pipeline Execution Protocol (when acting as executor)

When you receive a pipeline task (your inbox says "pipeline PIPE-xxx"):

1. **Write pipeline.json** at `memory/pipelines/<PIPE-ID>/pipeline.json` with live status:
   - On start: `{"status": "executing", "currentTask": "...", "progress": "0/N"}`
   - Per task: update `currentTask` and `progress` (`"3/8"`)  
   - On error: `{"status": "failed", "error": "..."}`
   - On complete: `{"status": "completed", "completedAt": "UTC timestamp"}

2. **Write WALKTHROUGH.md** at `memory/pipelines/<PIPE-ID>/WALKTHROUGH.md` after finishing all tasks:
   - Summary, files changed, commands run, verification steps

3. **Update TASKS.md** markers: `[ ]` → `[~]` → `[x]` as you progress

4. **Update META.json**: set `status: "completed"` and `completed_at`

### Auto-Execution (systemd Path Unit)

PAOS supports real-time cross-agent execution: when a pipeline is submitted, the executor is automatically notified (and optionally spawned) without polling.

**Mechanism**: systemd path unit `paos-pipeline.path` watches `memory/pipelines/` for new submissions.

| Component | Path | Purpose |
|-----------|------|---------|
| `.path` unit | `~/.config/systemd/user/paos-pipeline.path` | Watches `memory/pipelines/` with `PathChanged` |
| `.service` unit | `~/.config/systemd/user/paos-pipeline.service` | Runs handler script |
| Handler | `bin/paos-pipeline-handler.sh` | Routes pipeline to executor, checks guardrails |
| Fallback | `bin/paos-pipeline-watch.sh` | Inotifywait loop for containers/WSL |
| Whitelist | `~/.config/paos/pipeline-whitelist.txt` | Auto-execute only from trusted planners |
| Kill switch | `~/.config/paos/auto-execute.off` | File-based disable of all auto-execution |

**Guardrails**: Lock file → whitelist → rate limit (300s/agent) → task count cap (≤20 auto) → 30m execution timeout → kill switch.

**When a pipeline is submitted**:
1. systemd fires → handler runs
2. Handler reads META.json → determines executor agent
3. Checks guardrails (whitelist, rate, kill switch, task count)
4. Writes notification to executor's inbox
5. Updates pipeline.json status to `"executing"`
6. If auto-execute enabled: spawns `opencode` or `claude` in background

Check status: `systemctl --user status paos-pipeline.path`

### Pipeline Settings (default — override in config/pipeline-defaults.yaml)

```yaml
pipeline:
  executor: opencode-developer
  review_mode: auto
  plan_format: antigravity
  auto_commit: true
  notify_on_complete: true
```

## PAOS /h-* Commands (Available to All Agents)

Bash scripts in `~/AI_Workflow/bin/h-*`. Run directly from terminal — work without MCP.

| Command | Usage | Purpose |
|---------|-------|---------|
| `h-help` | `h-help` | List all commands + live pipeline status |
| `h-whoami` | `h-whoami` | Show agent identity, soul, inbox, git config |
| `h-status` | `h-status` | Recent ledger (10), context tail, active projects |
| `h-inbox` | `h-inbox [agent]` | List inbox messages with sender/subject |
| `h-daily` | `h-daily [date]` | Read or create today's daily note |
| `h-log` | `h-log <action> <file> <desc>` | Dual-log to events.md + global_ledger.md |
| `h-context` | `h-context <thinking> [decisions] [handoff]` | Append to shared context.md |
| `h-task` | `h-task list\|read\|create` | Manage task cards |
| `h-pipeline` | `h-pipeline submit\|list\|execute` | Pipeline lifecycle |
| `h-write-handoff` | `h-write-handoff <active> <done> <pending>` | Rewrite HANDOFF.md |
| `h-commit` | `h-commit <message>` | Git add + commit with Agent[<name>]: |
| `h-sync` | `h-sync <active> <done> <pending>` | End-of-session: handoff + commit + sync |
| `h-chat` | `h-chat <title> [summary]` | Write chat summary to vault/chats/ |
| `h-audit` | `h-audit` | Run compliance checks |

## Dialogue Context Recovery Command
- **/H-Continue**: When the user invokes `/H-Continue`, you MUST immediately read the last 100 lines of `vault/chats/active_chat_transcript.md` (or the entire file if it is shorter) to load the exact previous dialogue history and context of the chat, and print a summary of your understanding to the operator.

