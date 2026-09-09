# PAOS — Ultimate Brainstorm Document

> **Source**: Synthesized from all markdown files in `~/AI_Workflow/` (Constitution, agent souls, benchmarks, research, knowledge, skills, MCP, pipelines, logs, projects). Books excluded per request.
> **Generated**: 2026-09-04
> **Purpose**: Single canonical reference of the entire PAOS ecosystem — no duplication, every concept present once at its authoritative location.
> **Scope**: AI_Workflow only. No prior project data, no books, no chat history.

---

## Table of Contents

1. [What PAOS Is](#1-what-paos-is)
2. [The Constitution (H-Factor Protocol)](#2-the-constitution-h-factor-protocol)
3. [The Agent Roster](#3-the-agent-roster)
4. [Session Protocol (Article IX)](#4-session-protocol-article-ix)
5. [Shared Memory Architecture](#5-shared-memory-architecture)
6. [Pipeline System (DAG Orchestration)](#6-pipeline-system-dag-orchestration)
7. [MCP Server Infrastructure](#7-mcp-server-infrastructure)
8. [Skills Registry](#8-skills-registry)
9. [The Dashboard (Next.js)](#9-the-dashboard-nextjs)
10. [Coding Principles & Benchmark Audit](#10-coding-principles--benchmark-audit)
11. [Benchmarks (Code Quality Runs)](#11-benchmarks-code-quality-runs)
12. [Research & Strategic Documents](#12-research--strategic-documents)
13. [Project Structure & Active Project](#13-project-structure--active-project)
14. [The Operator Profile](#14-the-operator-profile)
15. [Slash Commands & Scripts](#15-slash-commands--scripts)
16. [OpenClaw Channel Layer](#16-openclaw-channel-layer)
17. [Auto-Execution Infrastructure (systemd)](#17-auto-execution-infrastructure-systemd)
18. [Tailscale Networking](#18-tailscale-networking)
19. [Anti-Over-Engineering Philosophy (Ponytail)](#19-anti-over-engineering-philosophy-ponytail)
20. [Strategic Roadmap & Gaps](#20-strategic-roadmap--gaps)

---

## 1. What PAOS Is

**PAOS = Personal Agent Operating System** — a locally-hosted, file-system-native, Git-anchored multi-agent orchestration harness built and operated by **Abdullah Abdul Hakim** at **NodeAlgo** (nodealgo.com).

**Core characteristics:**
- **Multi-agent** — coordinates 13+ AI agents (Hermes, Claude Code, OpenCode, Codex, Gemini, Antigravity, OpenClaw, Ollama, Signal, etc.) around one shared memory hub
- **Constitutional governance** — every action passes H-Factor invariants I1–I4 before, during, and after
- **File-system-as-database** — no SQL/Postgres. Markdown + JSON files in `memory/`, `vault/`, `knowledge/`
- **Git-as-memory** — every change auto-committed via `bin/agent-commit.sh`
- **Obsidian vault** — `~/AI_Workflow/vault/` is the shared persistent memory hub (symlinks make `vault/memory/` and `vault/knowledge/` aliases of root `memory/` and `knowledge/`)
- **Visual DAG pipelines** — Next.js dashboard (port 3333) for pipeline orchestration, agent health, token tracking, terminal control
- **MCP-native** — `mcp/mcp-config.json` is the unified registry; all agents symlink to it

**Versioning:** H-Factor v2.2.0, Coding-Principles v1.0, Coding-Principles-Benchmark v2.0, all dated 2026-06-22 "fresh start."

**Why it exists:** No existing tool combines (1) constitutional separation of planning/review/execution, (2) Obsidian-integrated shared memory, (3) per-agent git identity for audit, (4) MCP-based cross-tool agent communication, (5) plan-then-execute pipelines across heterogeneous agents.

---

## 2. The Constitution (H-Factor Protocol)

The single governance document is `workflow.md` (PAOS Constitution). All agent `soul.md` files and `CLAUDE.md`/`GEMINI.md` etc. derive from it. H-Factor = **H**yper-Structured Factor.

### The Four Invariants (I1–I4)

| ID | Invariant | Meaning |
|----|-----------|---------|
| **I1** | Separation of Powers | Planner (PM) ≠ Reviewer (Architect) ≠ Executor (Developer) ≠ Orchestrator (Coordinator). No single agent controls more than one phase. |
| **I2** | Audit Immutability | `global_ledger.md` is append-only. Past entries never edited or deleted. |
| **I3** | Identity First | Every action attributed to a known agent identity (`agents/<name>/soul.md`). |
| **I4** | Skill Boundary | Agents act only within capabilities declared in their `soul.md`. |

**Safety Gate (Article I §1.2):** No agent may execute a `bash` or `edit` command without a Peer Review token — a `## REVIEW [STATUS]` block appended to `IMPLEMENTATION_PLAN.md` by the Architect. Statuses: PASS, FAIL, CONDITIONAL.

### The Articles (Constitution Outline)

| Article | Subject | Key Rules |
|---------|---------|-----------|
| **I** | Governance Gates | H-Factor invariants; Safety Gate |
| **II** | 3-Phase Execution | Phase A: PM writes `IMPLEMENTATION_PLAN.md` (Objective, Scope, Steps, Risks, Knowledge Check). Phase B: Architect appends `## REVIEW [PASS/FAIL/CONDITIONAL]`. Phase C: Executor runs + dual-logs. |
| **III** | Structured Logging | Agent `log.md` schema `[TIMESTAMP] | AGENT | ACTION | THINKING | EXECUTION | IMPACT`. Global `ledger.md` tabular. Project `ledger.md` per project. **Dual-Logging Mandate**: every `log.md` entry MUST have a corresponding `global_ledger.md` summary. |
| **IV** | Git Integration | `Agent[<name>]: <present-tense description>` commit format. Branches: `feat/<desc>` and `exp/<hypothesis>`. Git IS the system memory. |
| **V** | Knowledge Retrieval (RAG-Lite) | Canonical KB at `~/AI_Workflow/knowledge/`. Before finalizing any plan: `find ~/AI_Workflow/knowledge/ -name "*.md"`, then `grep -ri`. Cite in plan's **Knowledge Check** section. |
| **VI** | Agent Communication | Coordinator delegation. Direct invocation shorthands: `@developer`, `@plan`, `@architect`, `@coordinator`, `@profiler`, `@openclaw`, `@gemini`, `@signal`, `@antigravity`, `@hermes-nous`. Pipeline routing: Developer → PM (Plan) → Architect + Coordinator (parallel) → PM (Handoff) → Developer → Coordinator (Verify). |
| **VII** | Amending the Constitution | Requires proposal in `IMPLEMENTATION_PLAN.md` + Architect `[PASS]` + ledger entry + commit `Agent[Coordinator]: Amended workflow.md`. |
| **VIII** | Antigravity Review Loop | Four-phase artifact workflow: Planning → User Review → Execution → Walkthrough. Three artifacts: `TASKS.md`, `IMPLEMENTATION_PLAN.md`, `WALKTHROUGH.md`. User feedback as `<!-- COMMENT: ... -->` or `> NOTE: ...` directly in artifacts. Approval via `## APPROVED` or "approved/proceed/go ahead". No fixed iteration limit. Quick-start fallback: produce artifacts with "Design Assumptions" appendix, 5s cancellation window. |
| **IX** | Obsidian Vault Protocol (Mandatory) | Vault at `~/AI_Workflow/vault/` is the shared memory. `vault/memory/` and `vault/knowledge/` are STRICT SYMLINKS to root — never delete or replace. Session start: read `HANDOFF.md` + `global_ledger.md` + `shared/context.md` + `inbox/<agent>/` + `daily/<YYYY-MM-DD>.md`. Session end: write `events.md` + `global_ledger.md` + `daily/<date>.md` + `chats/<date>-<slug>.md` + `shared/context.md`. |
| **X** | Shared Infrastructure Convention | MCP servers and skills are ALWAYS installed to PAOS shared infrastructure, usable by all agents. Canonical MCP registry: `~/AI_Workflow/mcp/mcp-config.json`. Canonical skills repo: `~/AI_Workflow/skills/`. Every agent configures via symlink to the unified file. Every new MCP/skill must be registered and logged. |
| **XI** | Project Workspace Architecture | PAOS organizes work into `.code-workspace` files at `workspaces/{name}.code-workspace`. Each project has isolated sandbox at `memory/pipelines/{project}/` (pipelines, ledger, events, handoff, shared-context, inbox, vault, secrets). Git identities are per-project via `settings.paos.gitIdentities`. |

### Cross-References
- Coding-Principles.md (per-language/architectural standards) and Coding-Principles-Benchmark.md (110-question strict audit) derive from Article V + the constitutional promise of quality.
- PIPELINES.md is the executable contract for `/h-pipeline` and Visualize rendering.

---

## 3. The Agent Roster

All agents share the Obsidian vault, the global ledger, and the MCP config. Each has a `soul.md` (deep identity) and typically a `<name>.md` with `mode:` frontmatter (OpenCode-compatible) for runtime discovery.

### Identity & Roles

| Agent | Agent ID | Role | Phase | Sub-Agent? | Notes |
|-------|----------|------|-------|------------|-------|
| **Developer** | `opencode-developer` (alias: `developer`) | Builder/Executor | C | No (primary) | Default executor. Model pinned: `opencode/deepseek-v4-flash-free`. Small model: `opencode/north-mini-code-free`. |
| **Architect** | `opencode-architect` | Peer Reviewer / System Designer / SRS author | B | Yes (`mode: subagent`, `edit: deny`, `temperature: 0.1`) | Issues PASS/FAIL/CONDITIONAL. Owns `system-analysis-and-design` skill. Never executes. |
| **Coordinator** | `opencode-coordinator` | Manager / Orchestrator | All | No (primary, `temperature: 0.3`) | Routes tasks between agents, verifies dual-logging. Entry point for multi-step work. |
| **Profiler** | `profiler` | Identity Elicitor | — | Yes (`mode: subagent`, restricted permissions) | Scans git/files to maintain `user.md`. Never touches deliverables. |
| **PM / Plan** | `@plan` (no separate soul) | Project Manager | A | — | Produces Antigravity artifacts (`IMPLEMENTATION_PLAN.md`, `TASKS.md`, `WALKTHROUGH.md`) and handoff prompts. |
| **Hermes (Nous)** | `hermes-nous` | Autonomous Multi-Platform Agent | C | No (primary) | Hermes Agent by Nous Research. v0.14.0+. 89+ skills, multi-platform gateway (Telegram/Discord/Slack), browser control, cron. Home: `~/AI_Workflow/hermes/` (symlinked from `~/.hermes`). |
| **Claude Code** | `claude` | Coding Agent | C | No | `~/.claude` → `config/claude/`. Powers via Anthropic API. |
| **Gemini** | `gemini` | Coding Executor | C | No | Google Gemini CLI v0.42.0+. Config: `~/.gemini/config/`. |
| **Codex** | `codex` | Coding Executor | C | No (OpenAI) | `~/.codex` → `config/codex/`. |
| **OpenClaw** | `openclaw` | Channel Agent — Human Interface | — | No | Connects Telegram/WhatsApp/Slack/Discord/etc. Routes user messages to PAOS pipeline. Never executes. |
| **Antigravity** | `antigravity` (CLI) / `antigravity-cli` (alias) | Coding Executor & Desktop IDE | C | No | VS Code-based IDE agent. `~/.gemini/antigravity-cli/`. |
| **Ollama** | `ollama` | Local LLM runtime | — | — | `~/.ollama` → `config/ollama/`. |
| **Signal** | `signal` | Messenger & Notification Router | D | No | Phase D (Notification & Delivery). Sends to Telegram/Slack/webhook/email. |

### Default Executor Model
- **OpenCode-developer** runs `opencode/deepseek-v4-flash-free` permanently pinned
- **small_model** = `opencode/north-mini-code-free` for lightweight tasks
- Pinned in 5 layers: `opencode.json`, `AGENTS.md`, `agents/registry.json`, `soul.md`, `config/pipeline-defaults.yaml`
- Pipeline default executor = `opencode-developer`

### H-Factor Binding (universal across all agents)
- **I1**: Each agent acts in exactly one role. No role overlap.
- **I2**: All actions logged to `events.md` AND `global_ledger.md` (Dual-Logging Mandate).
- **I3**: Every log entry carries the agent stamp (`hermes-nous`, `opencode-developer`, etc.).
- **I4**: Each agent respects its declared boundary in `soul.md`.

### Available `/h-*` Commands (Universal to All Agents)
All 16 commands are bash scripts in `bin/`. They work without MCP running.

| Command | Purpose |
|---------|---------|
| `h-help` | List all commands |
| `h-whoami` | Show agent identity |
| `h-status` | Show recent ledger, context, projects |
| `h-inbox` | List inbox messages |
| `h-daily` | Read/create daily note |
| `h-log` | Dual-log to events.md + global_ledger.md |
| `h-context` | Append to shared context.md |
| `h-task` | Manage task cards (list/read/create) |
| `h-pipeline` | Pipeline lifecycle (submit/list/execute) |
| `h-write-handoff` | Rewrite HANDOFF.md |
| `h-commit` | Git commit with agent identity |
| `h-sync` | End-of-session: handoff + commit + sync-chat |
| `h-chat` | Write chat summary |
| `h-audit` | Run compliance checks |
| `h-workspace` | Workspace management |

### Agent Inboxes
Each agent has an inbox at `memory/inbox/<agent-id>/` (or `vault/memory/inbox/<agent-id>/`). Messages sent via `shared-memory: send_message` MCP tool or filesystem write.

### Per-Agent Commits
Standard pattern: `~/AI_Workflow/bin/agent-commit.sh <agent-id> "Agent[<agent-id>]: <description>"`. Agent identities in git: `claude@paos.nodealgo.com`, `codex@paos.nodealgo.com`, `developer@paos.nodealgo.com`, etc.

---

## 4. Session Protocol (Article IX)

Canonical doc: `knowledge/docs/session-protocol.md` (v3.0.0). All 13 PAOS agents must follow.

### SESSION START — 3 Steps
1. **Read HANDOFF**: `~/AI_Workflow/vault/memory/shared/HANDOFF.md` (always first)
2. **Load shared state in parallel**:
   - `shared-memory: read_ledger` → last 20 rows
   - `shared-memory: read_inbox` → `agent="<your-id>"`
   - If MCP unavailable: read files directly
3. **Synthesize + start** — surface anything in-progress or blocked before proceeding

### PROJECT START (when opening a project)
1. Read `<project>/notes.md` → execute each item → call `shared-memory: process_notes`
2. Read `<project>/user-questions.md` → answer each → call `shared-memory: process_questions`
3. Unanswerable: leave with `<!-- TODO: needs investigation -->`

### DURING WORK
- After every significant action: `shared-memory: append_ledger` (Action, File, Description required; Task column = real task ID, never `-` for real work)
- After any key decision: `shared-memory: write_context`
- Also append to `vault/memory/<agent-id>/events.md` per Article III §3.1 format

### SESSION END — 2 Steps
1. **Rewrite HANDOFF.md** (most critical) — update Last Agent, Active Task, What Was Just Done, What Is NOT Done Yet. Keep under 60 lines.
2. **Log + commit**:
   - `shared-memory: append_ledger` (one summary row)
   - `~/AI_Workflow/bin/agent-commit.sh <agent-id> "Agent[<agent-id>]: <description>"`

### Ledger Row Rules
```
| Timestamp (UTC) | Agent | Action | File | Description | Task | Commit |
```
- `Action` = short uppercase: `READ`, `WRITE`, `EXEC`, `EDIT`, `REVIEW`, `INSTALL`, `FIX`
- `Task` = task ID for real work, `-` only for admin/meta
- `Commit` = git short SHA after committing
- **Do NOT log** `START`/`END`/session lifecycle — those belong in events.md only

### Daily Note Format
`vault/daily/<YYYY-MM-DD>.md`:
```markdown
# <YYYY-MM-DD>

## Today's Focus
- <one-line focus>

## Activity
| Action | Agent | Project | Files | Ref |
| ------ | ----- | ------- | ----- | --- |

## Linked Memory
- [[memory/global_ledger.md]]
- [[memory/shared/context.md]]
```

### Chat Summary Format
`vault/chats/<YYYY-MM-DD>-<slug>.md`:
```markdown
---
date: <YYYY-MM-DD>
agent: <agent-id>
focus: <one-line>
---

# <Session Title>

## Decisions
| # | Decision | Rationale |

## Files Created
| File | Purpose |

## Files Modified
| File | Change |

## Open Questions
-
```

---

## 5. Shared Memory Architecture

PAOS uses the **filesystem as its database** — every directory is a table, every file is a row. Single source of truth is `~/AI_Workflow/memory/` (symlinked from `~/AI_Workflow/logs/` AND `~/AI_Workflow/vault/memory/`). All three are aliases of the same location.

### Three Tiers of Shared State

| Tier | Path | Purpose | Access |
|------|------|---------|--------|
| **A — Shared Context** | `vault/memory/shared/context.md` | Append-only thinking document. Each agent writes structured entry on start/finish. | Read: any agent on session start. Write: append-only. |
| **B — Task Board** | `memory/tasks/<task-id>.md` | Per-task markdown with YAML frontmatter. Status flow: `proposed → needs_planning → planning → needs_review → approved → ready_for_execution → executing → done → blocked`. | Read: any. Write: owner + coordinator. |
| **C — Agent Inboxes** | `memory/inbox/<agent-id>/*.md` | Async messaging. Sent via `shared-memory: send_message` MCP tool. | Read: recipient only. Write: sender. |

### Cross-Cutting State Files

| File | Purpose |
|------|---------|
| `vault/memory/global_ledger.md` | Unified append-only audit trail — `\| TIMESTAMP \| AGENT \| ACTION \| FILE \| DESCRIPTION \|` |
| `vault/memory/shared/HANDOFF.md` | Current state (rewritten each session, max 60 lines) |
| `vault/memory/shared/context.md` | Tier A: shared thinking |
| `vault/memory/tasks/<task-id>.md` | Tier B: task cards with YAML frontmatter |
| `vault/memory/prompts/<task-id>-handoff.md` | PM's handoff prompts for Developer |
| `vault/memory/pm-logs/` | PM's Antigravity artifacts (IMPLEMENTATION_PLAN, TASKS, WALKTHROUGH) |
| `vault/memory/inbox/<agent>/` | Tier C: per-agent messaging |
| `vault/memory/<agent>/events.md` | Per-agent Article III §3.1 log |
| `vault/memory/queue/queue.json` | `{pending:[], running:null\|{id}, done:[]}` — pipeline queue |
| `vault/memory/pipelines/<PIPE-ID>/` | Pipeline artifacts (META, pipeline.json, PLAN, TASKS, WALKTHROUGH, phases/, builder-layout.json, pipeline-flow.json) |
| `vault/memory/projects/<project>/` | Per-project workspace (pipelines, ledger, events, handoff, shared-context, inbox, vault, secrets) |
| `vault/memory/global_ledger.md` | Aggregated cross-project audit |
| `vault/daily/<YYYY-MM-DD>.md` | Daily notes |
| `vault/chats/<YYYY-MM-DD>-<slug>.md` | Chat summaries per session |
| `vault/knowledge/` | STRICT SYMLINK to `~/AI_Workflow/knowledge/` — never delete |
| `vault/dashboard.md` | Obsidian entry point with `[[wikilinks]]` |

### Single Source of Truth Rules
- **Projects Registry**: `projects.md` is canonical — NEVER duplicate in `vault/` or `knowledge/`. Use symlinks if Obsidian visibility needed.
- **Active Project Documentation**: lives in `~/AI_Workflow/knowledge/docs/<ProjectName>.md`. NEVER in `vault/projects/` or `knowledge/previous-projects/`.
- **The Vault**: `vault/knowledge` and `vault/memory` are STRICT SYMLINKS to root folders. NEVER delete or replace with actual directories.
- **Dashboard**: `vault/dashboard.md` is Obsidian entry point, uses `[[links]]` to canonical docs in `knowledge/docs/`.

### Knowledge Format
- All artifacts are `.md` files
- Shared knowledge: `~/AI_Workflow/knowledge/`
- Agent-specific knowledge: `~/AI_Workflow/agents/<name>/docs/`

### Required Frontmatter (per `_agent-conventions.md`)
```yaml
---
title: "Short, Descriptive Title"
description: "One-line summary"
tags: [paos, relevant-category, ...]
related: ["[[related-doc-1]]", "[[related-doc-2]]"]
status: active | draft | review | archived | deprecated
version: 1.0.0
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### Vault Tagging
- **Required**: `#paos` on every doc
- **Categories**: `#architecture`, `#pipeline`, `#agent`, `#security`, `#protocol`, `#infrastructure`, `#reference`, `#tutorial`, `#meta`, `#template`
- **Qualifiers**: `#review`, `#wip`, `#needs-update`, `#automated`
- **Format**: lowercase only, hyphens for multi-word, no spaces, no special chars

### Daily Activity Log Format
| Action | Agent | Project | Files | Ref |

---

## 6. Pipeline System (DAG Orchestration)

The **executable contract** is `PIPELINES.md` — "single source of truth" for pipeline file layout. If Visualize is blank, this file was skipped.

### What Makes a Pipeline Show in Visualize

Every pipeline at `memory/pipelines/PAOS/<PIPE-ID>/` (also mirrored to `logs/pipelines/PAOS/<PIPE-ID>/`) MUST contain:

```
<PIPE-ID>/
├── META.json                    # required — phases with `id`, status, artifacts
├── pipeline.json                # required — {status, progress:"x/y", currentTask, startedAt, completedAt}
├── PLAN.md                      # required — copy of IMPLEMENTATION_PLAN.md
├── IMPLEMENTATION_PLAN.md       # required — Antigravity Plan (aliased as PLAN.md)
├── TASKS.md                     # required — [ ]/[~]/[x] with [S/M/L]
├── WALKTHROUGH.md               # required — summary, files, commands, verification
├── VERIFICATION.md              # required if Verify phase exists
├── pipeline-flow.json           # required for flower graph — {order:["planner","executor","verifier"], phases:{<id>:{...}}}
├── builder-layout.json          # required for flower graph — {nodes:[...], edges:[...]}
└── phases/
    ├── planner/                 # id must match META.json phases[].id
    │   ├── IMPLEMENTATION.md
    │   ├── REASONING.md         # required — thinking per node
    │   ├── TASKS.md
    │   └── WALKTHROUGH.md
    ├── executor/
    │   └── ... (same 4 files)
    └── verifier/
        └── ... (same 4 files)
```

**Why it was blank before:** manual `mkdir` + `paos-pipe-id` only created root `PLAN.md`/`TASKS.md` — no `phases/*/REASONING.md`, no `pipeline-flow.json`/`builder-layout.json`, `META.json` phases had no `id`.

### Status & Queue Contract
- `META.json` phases: `[{id:"planner"|"executor"|"verifier"|"n0"|"n1", agent, role, label, status:"pending|executing|completed", artifacts:["..."]}]` — `id` MUST equal `phases/<id>/` dir name
- `pipeline.json`: `{"status":"executing"|"completed", "progress":"x/y", "currentTask":"...", "startedAt","completedAt"}` — dashboard derives % from this AND from `TASKS.md` `[x]` count
- Queue: `memory/queue/queue.json` `{pending:[], running:null|{id}, done:[]}` — `GET /api/queue` auto-cleans stale entries. `DELETE /api/pipelines/[id]` must purge queue.

### FSM Node States
```
PENDING → READY → RUNNING → COMPLETED
                  ↘ FAILED → (retry → RUNNING)
                          ↘ SKIPPED
```

### Pipeline Creation Workflow (Never manual mkdir)
```bash
# 1. Generate ID
bin/paos-pipe-id                          # → {Project}-PIPE_{counter}-{DD-MM-YYYY}---{HH-MM}

# 2. Submit via h-pipeline
bin/h-pipeline submit --planner opencode-developer --prompt "..." --plan ./IMPLEMENTATION_PLAN.md --tasks ./TASKS.md
# OR dashboard: POST /api/pipelines {project:"PAOS", prompt, planMd, tasksMd}

# 3. Handler creates all required files automatically

# 4. Execute
curl -X POST http://localhost:3333/api/pipelines/<PIPE-ID>/execute -d '{"prompt":"..."}'
# OR dashboard Play ▶️ — queue pending→running

# 5. Per phase, agent writes phases/<id>/REASONING.md, updates pipeline.json live, then WALKTHROUGH.md

# 6. On done
curl -X POST http://localhost:3333/api/queue -d '{"action":"done","status":"completed"}'
```

### Pre-Execute Checklist (agent MUST verify)
- [ ] `META.json` phases each have `id` and `artifacts` includes REASONING.md
- [ ] `phases/<id>/REASONING.md` exists and non-empty
- [ ] `pipeline-flow.json` order matches `META.json` phases order
- [ ] `builder-layout.json` nodes x=0,250,500 linear (or Flow Builder layout), edges chain
- [ ] `TASKS.md` markers `[ ]` pending, `[x]` done
- [ ] `pipeline.json` `status:executing` `progress:0/y` at start

### Visualize Contract
`dashboard/app/api/pipelines/[id]/route.ts`:
- Reads `META.json` phases → builds `phases[]` with artifacts + fallback `readdir *.md` + `phases/<id>/REASONING.md|TASKS.md|WALKTHROUGH.md`
- Reads `pipeline-flow.json` for DAG order; if missing, synthesizes from `META.json` phases (fallback: linear builder-layout)
- `versionedArtifacts` groups `PLAN.md` vs `IMPLEMENTATION_PLAN.md` (both must be present)

### Auto-Naming Pattern
`{Project}-PIPE_{counter}-{DD-MM-YYYY}---{HH-MM}`

### Pipeline Routing (Standard Multi-Agent)
```
Developer → PM (Plan) → Architect + Coordinator (parallel review) → PM (Handoff) → Developer (Execute) → Coordinator (Verify)
```

### Agent Instructions (Per Pipeline Role)
- **Planner** (`@plan`, `opencode-developer` as planner, `hermes-nous`): Read `workflow.md` + `PIPELINES.md` + `skills/antigravity-review-loop/SKILL.md` before writing plan. Then `bin/h-pipeline submit` — never `mkdir` manually.
- **Executor** (`opencode-developer`): Read `META.json` + `PLAN.md` + `TASKS.md` + `phases/<id>/IMPLEMENTATION.md` → execute → write `phases/<id>/REASONING.md` (THINKING per Article III), update TASKS.md `[~]→[x]` and `pipeline.json` live, then WALKTHROUGH.md.
- **Verifier** (2nd opencode): Read `PIPELINES.md` checklist → `grep` per task + `npm --prefix dashboard run build -- --webpack` + `curl /api/queue` → write `VERIFICATION.md`.
- **Coordinator**: Verifies dual-log + PIPELINES.md file completeness before marking `META.json` `completed`.

### Visualize UI Behavior
- 3-panel layout: Prompt + DAG canvas + Phase cards (artifacts toggleable)
- Branching & joins: parallel execution paths with sync points
- Live status: per-node spinner, PID, progress bar, output preview
- Smart animation: edges animate only between completed source and pending target
- 8 template presets: Quick Dev, Analyze-Implement, PR Review, Bug Fix, etc.
- Phase cards: clickable .md artifacts per node

---

## 7. MCP Server Infrastructure

**Canonical registry**: `~/AI_Workflow/mcp/mcp-config.json` — single source of truth for all PAOS agents. Every agent references it via symlink.

### Agent Wiring (Article X §10.4)

| Agent | MCP Config | Skills Access |
|-------|-----------|---------------|
| Hermes | `~/.hermes/config.yaml` (mcp_servers) | `~/.hermes/skills/` + external_dirs |
| Claude Code | `config/claude/mcp.json` → `mcp/mcp-config.json` (symlink) | via `CLAUDE.md` |
| Gemini | `config/gemini/config/mcp_config.json` → `mcp/mcp-config.json` (symlink) | via `soul.md` |
| Codex | `config/codex/mcp_config.json` → `mcp/mcp-config.json` (symlink) | via `instructions.md` |
| OpenCode | `opencode.json` (mcp section) | via `AGENTS.md` |
| OpenClaw | `config/openclaw/mcp_config.json` → `mcp/mcp-config.json` (symlink) | via `soul.md` |
| Antigravity | `config/antigravity2/mcp_config.json` → `mcp/mcp-config.json` (symlink) | via `soul.md` |
| Signal | `config/signal/mcp_config.json` → `mcp/mcp-config.json` (symlink) | — |

### Active MCP Servers

| Server | Tools | Purpose | Transport |
|--------|-------|---------|-----------|
| **shared-memory** | 14 | PAOS memory ops: ledger, inbox, context, tasks, pipelines, handoff, agent_commit, process_notes, process_questions, submit_pipeline | stdio (Node) |
| **scaffold** | 2 | Project scaffolding: `scaffold_project`, `list_templates` | stdio (Node) |
| **gitkraken** | read-only | Git context via `gk mcp --readonly`: PRs, issues, repos, commits | stdio (gk) |
| **context7** | 2 | Library docs: `resolve-library-id`, `query-docs` | HTTP |
| **hostinger-domains** | 18 | Domain + DNS verification (DNS auth): check, purchase, WHOIS, forwarding, lock, privacy, nameservers | stdio (npx) |
| **hostinger-dns** | 9 | DNS zone management: records, snapshots, validation | stdio (npx) |
| **agent-browser** | 20+ | Browser automation: open, snapshot, click, fill, screenshot, JS eval, tabs, navigation | stdio |

### Adding a New MCP Server
1. Write server implementation in `~/AI_Workflow/mcp/<server-name>/` with `package.json` and `@modelcontextprotocol/sdk` dep
2. Add server definition to `mcp/mcp-config.json`
3. `npm install` in server dir
4. Verify all agents can discover the new tools (via their symlink)
5. Append entry to `global_ledger.md`

### Implementation Guidelines
- Node.js with `@modelcontextprotocol/sdk` (stdio transport)
- Use `MEMORY_DIR`, `KNOWLEDGE_DIR`, `REPO_ROOT` env vars for path resolution
- One server = one domain
- Tests in `<server-name>/tests/`

---

## 8. Skills Registry

**Canonical location**: `~/AI_Workflow/skills/` (PAOS shared skills, usable by all agents). Every agent also has its own skills directory: Hermes (`~/.hermes/skills/`), Claude (`config/claude/skills/`), etc.

### Core Workflow Skills

| Skill | Description | Trigger |
|-------|-------------|---------|
| **antigravity-review-loop** | Artifact-driven review: Plan → Review → Execute → Walkthrough. User reviews .md artifacts inline. | Any non-trivial task |
| **system-analysis-and-design** | Structured system analysis: elicitation, SRS authoring, UML diagrams, architecture design. Code audit framework v2.0. | "SRS", "system design", "architecture", "UML", "audit", "benchmark" |
| **skill-creator-elicitation** | Identity elicitation via Profiler agent. | "create skill", "new skill", `@profiler` |
| **project-scaffolder** | Full-stack scaffolding from templates with SRS, MCP, governance baked in. | "scaffold", "new project" |

### Documentation Skills

| Skill | Trigger |
|-------|---------|
| **context7-mcp** | Fetch current library docs via Context7 MCP. Activates for React/Next.js/Prisma/Supabase/etc. questions. |

### Infrastructure Skills

| Skill | Trigger |
|-------|---------|
| **vps-kit** | AWS EC2 VPS connection (13.233.237.221, Ubuntu 26.04, ap-south-1). SSH, server info. |
| **tailscale** | Tailscale Serve + Funnel setup for exposing local services. |

### Anti-Over-Engineering

| Skill | Description |
|-------|-------------|
| **ponytail** | "He says nothing. He writes one line. It works." Minimal-essential coding. ~54% less code, 100% safe. 6-rung ladder: YAGNI → stdlib → native → installed dep → one line → minimum. |

### Software-Development Skills (Hermes-side)

| Skill | Description |
|-------|-------------|
| **autonomous-ai-agents/hermes-agent** | Use, configure, theme, extend, orchestrate Hermes Agent. |
| **merge-reconciler** | Multi-agent merge conflict resolution. |
| **plan** | Plan mode: write actionable markdown plan to `.hermes/p...` |
| **spike** | Throwaway experiments to validate ideas. |
| **systematic-debugging** | 4-phase root cause debugging. |
| **test-driven-development** | TDD: RED-GREEN-REFACTOR. |
| **simplify-code** | Parallel 4-agent cleanup. |
| **requesting-code-review** | Pre-commit review: security, quality, auto-fix. |
| **pipeline-builder** | Build visual pipeline/flow/DAG editors. |
| **paos-code-benchmark** | Coding principles audits + gap closure. |
| **paos-dashboard-dev** | Build PAOS Dashboard (Next.js 16). |
| **project-enhancement** | Batch multi-gap, multi-phase project enhancement. |
| **benchmark-audit** | Strict evidence-based code audits. |
| **hermes-agent-skill-authoring** | Author in-repo SKILL.md with frontmatter + validator. |
| **mcp-server-dev** | Create, test, register MCP servers. |
| **inspecting-hermes-desktop-dom** | Read live Hermes desktop DOM/CSS via CDP. |
| **node-inspect-debugger** | Debug Node.js via --inspect + CDP. |
| **python-debugpy** | Debug Python: pdb REPL + debugpy remote. |
| **ui-ux-pro-max** | UI/UX design with 67 styles, 96 colors. |
| **codebase-inspection** | Inspect codebases with pygount. |
| **github** | GitHub via gh CLI. |
| **architecture-diagram** | Dark-themed SVG diagrams. |
| **diagram-comparison** | Render same diagram in multiple formats. |
| **drawio-skill** | Create draw.io diagrams. |
| **github-issue-to-pr** | Carry issue to verified PR. |
| **github-pr-workflow** | PR lifecycle: branch, commit, CI, merge. |
| **github-code-review** | Review PRs: diffs, inline comments. |
| **github-issues** | Create, triage, label, assign issues. |
| **github-repo-management** | Clone/create/fork repos. |
| **github-auth** | Auth setup: HTTPS, SSH, gh. |
| **telegram-messaging** | Send files as Telegram attachments via python-telegram-bot. |
| **llama-cpp** | llama.cpp local GGUF inference. |
| **segment-anything-model** | SAM zero-shot segmentation. |
| **session-librarian** | Organize sessions by prompt. |
| **skills-audit** | Audit + categorize + prune skills + MCPs. |
| **xlsx** | Create/read/edit Excel workbooks. |
| **notion** | Notion API + ntn CLI. |
| **document-to-action-items** | Extract obligations, deadlines, tasks. |
| **llm-wiki** | Karpathy's LLM Wiki. |
| **paos-tasks** | PAOS task system — lifecycle, queue. |
| **paos-pipelines** | PAOS pipeline protocol. |
| **paos-dashboard-backend** | Next.js API patterns for PAOS. |
| **paos-agent-lifecycle** | Install, enable/disable, manage PAOS agents. |
| **paos-agent-management** | Agent lifecycle. |
| **paos-pipeline-commands** | Telegram pipeline commands. |
| **docker-troubleshooting** | Docker disk usage / build cache. |
| **sdlc-review** | SDLC review. |
| **paos-pipeline-protocol** | Submit work to other agents. |

### Adding a New Skill
1. Create `~/AI_Workflow/skills/<skill-name>/SKILL.md` with YAML frontmatter
2. Add supporting files in `references/`, `templates/`, `scripts/`, `assets/`
3. Register in `~/AI_Workflow/skills/INDEX.md`
4. Append entry to `global_ledger.md`

### SKILL.md Frontmatter (Required)
```yaml
---
name: skill-name
description: "First 57 chars self-contained trigger. Use when X. One-line behavior."
---
```

### Anti-Over-Engineering Rules (Ponytail)
- No abstractions not explicitly requested
- No new deps if avoidable
- No boilerplate nobody asked for
- Deletion over addition
- Mark shortcuts with `ponytail:` comment naming ceiling + upgrade path
- Non-lazy about: input validation at trust boundaries, error handling preventing data loss, security, accessibility

### Auto-Execution Infrastructure
| System | Location | Purpose |
|--------|----------|---------|
| systemd path unit | `~/.config/systemd/user/paos-pipeline.path` | Watches `memory/pipelines/` |
| systemd service | `~/.config/systemd/user/paos-pipeline.service` | Runs handler on path event |
| Handler script | `bin/paos-pipeline-handler.sh` | Routes with 6 guardrails (lock, whitelist, rate limit, kill switch, task cap, timeout) |
| Fallback watcher | `bin/paos-pipeline-watch.sh` | inotifywait for containers/WSL |
| Whitelist | `~/.config/paos/pipeline-whitelist.txt` | Allowed planner agents |
| Kill switch | `~/.config/paos/auto-execute.off` | File-based disable |

---

## 9. The Dashboard (Next.js)

**Live at**: `http://localhost:3333` (Tailscale serve: `https://dev.anaconda-notothen.ts.net/`).
**Stack**: Next.js 16 App Router (file-system based routing), TypeScript strict mode, shadcn/Tailwind dark theme.

### Start Command
```bash
cd ~/AI_Workflow/dashboard
npm run dev -- --webpack --port 3333
# OR via systemd: paos-dashboard.service
```

### Project Structure
```
dashboard/
├── app/                         # Pages + API routes (50+)
│   ├── api/                     # 50+ REST endpoints
│   ├── overview/                # At-a-glance system status
│   ├── pipelines/               # DAG list + builder + visualize
│   ├── agents/                  # Agent roster + health
│   ├── tasks/                   # Task board (per-project filtering)
│   ├── plans/                   # Implementation plans
│   ├── inbox/                   # Cross-agent messaging
│   ├── terminals/               # Running processes with Startup Boot tab
│   ├── docker/                  # Container management
│   ├── events/                  # Real-time event log
│   ├── ledger/                  # Audit trail
│   ├── secrets/                 # Project-scoped
│   ├── mcp-servers/             # MCP config CRUD
│   ├── skills/                  # Skills CRUD
│   ├── settings/                # Global config + theme
│   ├── code-srs/                # Code-SRS platform
│   ├── gitview/                 # Git visualization
│   ├── graph/                   # Entity graph view
│   ├── workspaces/              # Workspace management
│   ├── vault/                   # Obsidian vault browser
│   ├── system/doctor/           # Health checks
│   ├── benchmarks/              # Benchmark kanban
│   ├── handoff/                 # Live HANDOFF.md viewer
│   ├── api-playground/          # Interactive API tester
│   └── projects/                # Project workspace
├── components/                  # shadcn + custom
│   └── ui/                      # shadcn primitives
└── lib/                         # shared utilities
```

### 30 Pages · 63 API Routes · 26 UI Components · 21 Libraries

### Major Dashboard Pages
| Page | Purpose |
|------|---------|
| **Overview** (`/`) | At-a-glance: stats, agent health, recent activity, quick actions |
| **Pipelines** (`/pipelines`) | Visual DAG of all pipeline executions with git-graph nodes, status badges, queue panel, creation dialog |
| **Pipeline Builder** (`/pipelines/builder`) | n8n-style drag-and-drop flow editor (3-panel @xyflow/react v12) |
| **Pipeline Visualize** (`/pipelines/[id]/visualize`) | Deep-dive: prompt, DAG canvas, phase cards with artifacts, intervention panel, task summary |
| **Pipeline Analytics** (`/pipelines/analytics`) | Success rates, duration histograms, phase bottlenecks |
| **Agents** (`/agents`) | Health, inbox counts, MCP servers, install/uninstall/toggle |
| **Agent Replay** (`/agents/replay`) | Replay chat sessions and execution logs |
| **Agent Explorer** (`/agents/explorer`) | Deep-dive single agent files/history |
| **Agent Stats** (`/agents/stats`) | Aggregated performance metrics |
| **Projects** (`/projects`) | Browse/manage PAOS projects as scoped workspaces |
| **Tasks** (`/tasks`) | Task board with per-project filtering, real-time progress |
| **Inbox** (`/inbox`) | Cross-agent messaging hub |
| **Plans** (`/plans`) | Implementation plans with batch download |
| **Handoff** (`/handoff`) | Live HANDOFF.md reader (auto-refresh 10s) |
| **Vault** (`/vault`) | Daily notes and chat transcripts browser |
| **Terminals** (`/terminals`) | Running processes with PID, CPU/MEM/IO/GPU, kill controls |
| **Docker** (`/docker`) | Container management (start/stop/pause/restart/kill/remove) |
| **Node Processes** (`/node-processes`) | All Node.js/npm/next/webpack/vite/tsc processes |
| **Events** (`/events`) | Real-time event log with filtering |
| **Audit Ledger** (`/ledger`) | Full audit trail with search, row expansion |
| **System Doctor** (`/system/doctor`) | Automated diagnostics |
| **Benchmarks** (`/benchmarks`) | Codebase benchmark suite with kanban |
| **Tokens** (`/tokens`) | Per-agent token tracking with calendar histogram, cost calc, model comparison |
| **MCP Servers** (`/mcp-servers`) | Configure, enable/disable, manage connections |
| **Skills** (`/skills`) | Browse/manage installed skills |
| **Settings** (`/settings`) | Theme, timezone, auto-refresh, global secrets |
| **Code-SRS** (`/settings/code-srs`) | Code-SRS platform configuration |
| **Git View** (`/gitview`) | Git activity with diff viewer |
| **Graph** (`/graph`) | Visual graph of entities + relationships |
| **Workspaces** (`/workspaces`) | Multi-workspace management |
| **API Playground** (`/api-playground`) | Interactive API browser |

### Major API Route Groups
| Resource | Endpoints |
|----------|-----------|
| **Pipelines** | `GET/POST /api/pipelines`, `GET /api/pipelines/[id]`, `DELETE /api/pipelines/[id]`, `POST /api/pipelines/[id]/execute`, `POST /api/pipelines/[id]/execute-flow`, `GET /api/pipelines/[id]/flow-status`, `POST /api/pipelines/[id]/intervene` (GET/POST/PUT/DELETE), `POST /api/pipelines/[id]/phases/[nodeId]/retry|skip`, `GET /api/pipelines/[id]/phases/[nodeId]/log|files/[file]`, `POST /api/pipelines/[id]/phases-to-layout`, `GET /api/pipelines/analytics|cost|generate-name|schedule` |
| **Projects** | `GET/POST /api/projects`, `GET /api/projects/[name]`, `GET /api/projects/[name]/tree`, `POST /api/projects/[name]/integrate`, `POST /api/projects/import` |
| **Agents** | `GET /api/agents`, `GET /api/agents/[id]/health`, `POST /api/agents/[id]/install|toggle`, `GET /api/agents/[id]/files`, `GET /api/agents/scoped|stats|available|installable|explorer` |
| **Benchmarks** | `GET /api/benchmarks`, `GET /api/benchmarks/[id]`, `GET /api/benchmarks/[id]/gaps/[n]`, `POST /api/benchmarks/[id]/gaps/[n]/create-pipeline` |
| **Tokens** | `GET/POST /api/tokens` |
| **Terminals** | `GET/POST /api/terminals`, `GET /api/terminals/[pid]/log` |
| **Settings** | `GET /api/settings`, `PATCH /api/settings/reset`, `GET/PATCH /api/preferences` |
| **Templates** | `GET/POST /api/templates`, `GET /api/templates/[id]|suggestions` |
| **Workspaces** | `GET /api/workspaces`, `GET /api/workspaces/[name]` |
| **Tasks** | `GET/POST/PATCH/DELETE /api/tasks` |
| **Inbox** | `GET/POST/DELETE /api/inbox`, `POST /api/send-message`, `GET/POST/DELETE /api/queue` |
| **Secrets** | `GET/POST/PATCH/DELETE /api/secrets`, `GET/POST/PATCH/DELETE /api/global-secrets`, `GET /api/csrf-token` |
| **MCP/Skills** | `GET/POST/PATCH/DELETE /api/mcp-servers`, `GET/POST/PATCH/DELETE /api/skills` |
| **Plans** | `GET/POST/DELETE /api/plans` |
| **Vault** | `GET /api/vault`, `GET /api/knowledge/health` |
| **Handoff** | `GET /api/handoff`, `GET /api/planner` |
| **Events/Ledger** | `GET /api/events`, `GET /api/ledger` |
| **System** | `GET /api/overview`, `GET /api/docker`, `GET /api/node-processes`, `GET /api/system/doctor`, `GET /api/system/services` |
| **Dev** | `GET /api/search`, `GET /api/gitview`, `GET/POST /api/admin/code-srs` |

### UI Components (26)
- **shadcn primitives**: Sidebar, Badge, Button, Card, Chart (Recharts), CodeEditor (CodeMirror), Command (cmdk), Dialog, DropdownMenu, Input/InputGroup, Label, Progress, ScrollArea, Select, Separator, Sheet, Skeleton, Sonner (toasts), Switch, Table (sortable + expandable rows), Tabs, Textarea, Tooltip, WebTerminal (xterm.js)
- **Custom**: Sidebar (primary navigation, collapsible sections, agent status strip, mobile responsive)

### Color System
- **Gold primary**: `#f0b90b` (Binance-inspired)
- **Dark background** with `--foreground` text, NEVER `--muted` for body text
- **Secrets**: masked by default with reveal toggle
- **Delete pattern**: type `{name}_Delete` to confirm

### Responsive Design
- Must work 390px phones to 3840px 4K TVs
- Sidebar collapses on mobile
- Sliders support wheel-scroll (passive: false)

### Security Features
- TypeScript strict mode
- All API inputs validated
- File path traversal protection
- No secrets in `config.yaml` (only `.env`)
- `.env` gitignored
- Process killing requires confirmation
- CSRF token endpoint `/api/csrf-token`
- Secrets redacted from logs

---

## 10. Coding Principles & Benchmark Audit

**`Coding-Principles.md`** (v1.0) is the architectural constitution grounding every engineering decision in CS, math, and design principles.

### The 10 Principle Areas

| # | Area | Key Application |
|---|------|-----------------|
| 1 | **OOP** | Encapsulation (PipelineNode hides `nodeColor`, `flowStatus`), Inheritance (AgentNode → ReadOnlyNode/AgentNode hierarchy), Polymorphism (AgentProvider interface for hermes/opencode/codex/claude), Abstraction (Phase is a unit of work, not a path), SOLID |
| 2 | **Data Structures** | DAG (Kahn's BFS topological sort, O(V+E)), Queue (enqueue/dequeue/complete), Linked List (phase chains), Hash Map (agent lookup, phase status), Tree (FileTreeExplorer recursive), Set (uniqueness, visited tracking) |
| 3 | **Graph Theory & Discrete Math** | Topological sort with cycle detection, FSM (PENDING→READY→RUNNING→COMPLETED, FAILED→retry/skip), Set operations (selectedSkills ⊆ availableSkills), Combinatorics (8 templates × 10 roles = 80 configs) |
| 4 | **Linear Algebra** | Agent capability vectors, React Flow viewport transforms (affine), distance metrics (Manhattan/Euclidean/Cosine similarity for template matching) |
| 5 | **Digital Logic & Design** | FSM again, Combinatorial logic (canExecute checks, button visibility), Sequential logic (pipeline cascade with stored state), Register transfer (META.json as state register) |
| 6 | **Numerical Analysis** | Floating-point precision (epsilon comparisons, slider Math.round(value/step)*step), Error bounds, Convergence criteria |
| 7 | **System Analysis & Design** | DFD (top-level: User→Builder→API→FS→Agent→Visualize), ERD (Project 1—* Pipeline 1—* Phase), Patterns (Event-Driven, Layered, Repository, Strategy, Factory, Observer, DI) |
| 8 | **Database (File-as-DB)** | `memory/pipelines/PAOS/` = database, `<PIPE-ID>/` = row, META.json = PK, pipeline-flow.json = index, builder-layout.json = column, TASKS.md = join table, phases/ = foreign table, queue.json = queue table |
| 9 | **Calculus I–III** | Progress as absolute counter ("3/5"), velocity tracking (timestamps + task counts), cumulative totals, moving averages, multi-variable resource optimization |
| 10 | **Human Error & UX/UI** | System status visible, ≥3 error recovery paths (retry/skip/cancel), dangerous actions confirmed, responsive 390px-3840px, scroll-wheel on sliders, specific error messages, consistent color system, progressive disclosure, clear affordances |

### Coding-Principles-Benchmark (v2.0)
Strict, evidence-based scoring system — 110 questions, raw max 220, normalized to 100.

### Scoring
- Per question: 0 = violated/missing, 1 = partial, 2 = fully correct
- Final score: `(raw / 220) × 100`

### Weight Tiers
| Tier | Weight | Categories | Q Count |
|------|--------|-----------|---------|
| Heavy | 48% | OOP, Data Structures, System Analysis, Digital Logic, Security | 53 |
| Medium | 25% | Code Quality, API Endpoints, Database | 28 |
| Moderate | 18% | UX/UI, Linear Algebra | 14 |
| Supporting | 9% | Graph Theory, Calculus, Numerical Analysis | 15 |

### Grade Thresholds
| Score | Grade | Meaning |
|-------|-------|---------|
| 90–100 | **A** | <10 infractions across codebase |
| 75–89 | **B** | Correctable patterns, no systemic failures |
| 50–74 | **C** | Systemic issues in 1+ categories |
| 25–49 | **D** | Major refactoring needed |
| 0–24 | **F** | Architectural rewrite required |
| Any ★ 0 | **Auto -1 grade** | Must fix before next audit |

**Floor rule**: 89 = B (not A). No rounding. First ★-question 0 drops grade by one full letter.

### 13 Audit Categories (110 Questions)
1. **OOP** (36 pts) — Q1-18: Encapsulation (5), Inheritance (3), Polymorphism (3), Abstraction (2), SOLID (5)
2. **Data Structures** (18 pts) — Q19-27: DAG, Kahn's, cycle detection, queue, hash maps, sets, trees, validation
3. **Graph Theory & Discrete Math** (12 pts) — Q28-33: Branching, join nodes, FSM, deterministic execution
4. **Linear Algebra** (8 pts) — Q34-37: Viewport transforms, DAG coords preserved, layout consistency, similarity
5. **Digital Logic & Design** (8 pts) — Q38-41: Button logic, sequential circuit, side-effect-free checks, crash recovery
6. **Numerical Analysis** (8 pts) — Q42-45: Epsilon comparisons, slider rounding, monotonic progress, div/0
7. **System Analysis & Design** (14 pts) — Q46-52: Frontend no FS, layered arch, low coupling, high cohesion, UI/business separation, queue/pipeline separation
8. **Database (File-as-DB)** (16 pts) — Q53-60: Atomic writes, crash recovery, schema validation, caching, directory indexing, try/catch+defaults, concurrent write prevention, write order
9. **Calculus I–III** (10 pts) — Q61-65: Progress counter, velocity tracking, cumulative totals, moving averages, multi-variable optimization
10. **UX/UI** (20 pts) — Q66-75: Status visibility, error recovery, confirmations, responsive (390px + 3840px), scroll-wheel sliders, specific errors, color system, progressive disclosure, affordances
11. **Security** (20 pts) — Q76-90: .env vs config.yaml, .env gitignored, shell injection, path traversal, input validation, rate limiting, CORS, secret redaction, least privilege, auth, XSS, CSRF, npm audit, token management, secure defaults
12. **API Endpoints** (20 pts) — Q91-100: No duplicate endpoints, HTTP method consistency, response envelope, status codes, no redundant CRUD, pagination, naming convention, no orphans, surface size, missing CRUD
13. **Code Quality** (20 pts) — Q101-110: TS strict mode, no `any`, try/catch, no raw .then, no barrel exports, kebab-case, single source of truth, centralized config, React hooks rules, React.memo

### Audit Template
Every question follows:
```
## Q{N} — {Question}
Score: {0|1|2}/2
Evidence:
✅ `path/file.ts:15-20` — quoted evidence
❌ `path/file.ts:88` — quoted gap
```

### Critical Rule — NEVER AUTO-EXECUTE
🚫 Auditor MUST NOT execute plans, start work, fix code, or trigger dependents.
✅ ONLY user can trigger via: "work on gap {N}", "work on implementation plan benchmark-gap-{N}", "implement benchmark-gap-{N}".

### Gap → Pipeline Conversion
Only create pipeline for a gap when user explicitly says "create pipeline for gap {N}". Pipeline opens in builder with pre-filled prompts referencing SRS-to-be.md, gaps.md, implementation.md, and individual gap file. Small gaps (5–10 min) show alert with direct fix instead.

### Gap Files Required Format
- Source question + category
- Severity (Critical/High/Medium)
- Score + evidence
- The Fix (concrete code steps)
- Files to modify
- Acceptance criteria
- Estimated effort
- Status (`⏳ Pending` / `🔄 In Progress` / `✅ Fixed` / `🚫 Won't Fix`)

### Benchmark Directory Structure
```
benchmarks/
└── Benchmark_{N}_{DD-MM-YYYY}---{HH-MM}/
    ├── README.md                  # Overview + scores + tier breakdown
    ├── full-audit.md              # Complete audit report
    ├── SRS-as-is.md              # Current state
    ├── SRS-to-be.md              # Target state
    ├── gaps.md                    # All gaps combined
    ├── implementation.md          # Full spec with code
    ├── implementation-plan.md     # Prioritized fix plan
    ├── SWOT-Benchmark.md          # Strategic eval
    └── gaps/
        ├── gap-01-{title}.md
        └── ...
```

### Kanban Status (4 Columns)
**Pending ↔ Won't Fix** (click to toggle) | **In Progress** (set by pipeline) | **Fixed** (set by pipeline). Won't Fix auto-removed from gaps.md + implementation.md.

### Audit Tooling
```bash
grep -rn ': any' src/ --include='*.ts' --include='*.tsx'
grep -rn '\.then(' src/ --include='*.ts' --include='*.tsx'
grep -rn 'readFile\|writeFile\|fs\.' app/ --include='*.tsx'
grep -rn 'extends' src/ --include='*.ts' --include='*.tsx'
grep -rn 'agentId\|agent.*===' execute-flow/
find . -name '*[A-Z]*' -not -path '*/node_modules/*' -not -path '*/.next/*'
```

---

## 11. Benchmarks (Code Quality Runs)

### Benchmark 1 — 25 June 2026 21:00
- **Grade**: C (67/100) — 148/220 raw
- **Gaps**: 17 total
- **Auditor**: Hermes Agent (automated)
- **★ failures**: 3 (Q56 caching, Q81 rate limit, Q85 auth)
- **Tier performance**:
  - Heavy (48%): 77/106 = 73%
  - Medium (25%): 41/56 = 73%
  - Moderate (18%): 26/28 = 93%
  - Supporting (9%): 22/30 = 73%
- **Main weaknesses**: security (no auth, no rate limiting, no CSRF), performance (no caching, no memo), analytics (no velocity tracking, no moving averages)
- **17 individual gaps** at `benchmarks/Benchmark_1_25-06-2026---21-00/gaps/`

### Benchmark 2 — 26 June 2026 12:49
- **Grade**: B (87/100) — 192/220 raw
- **Gaps**: 4 zero-score + 17 partial (1-score)
- **Auditor**: opencode-developer
- **★ failures**: 0 — no auto-penalty
- **Improvement**: C → B (+1 letter, +20 points)
- **Fixed since B1** (11 items):
  | Gap | B1 → B2 | Evidence |
  |-----|---------|----------|
  | Q21 cycle detection | 0 → 2 | `pipelines/route.ts:297-302` |
  | Q56 caching | 0 → 2 | `lib/cache.ts:19-84` |
  | Q81 rate limiting | 0 → 2 | `middleware.ts:128-137` |
  | Q82 CORS | 0 → 2 | `middleware.ts:157-167` |
  | Q85 auth | 0 → 2 | `middleware.ts:70-78` |
  | Q87 CSRF | 0 → 2 | `middleware.ts:117-122` |
  | Q90 HSTS | 0 → 2 | `middleware.ts:145-152` |
  | Q96 pagination | 0 → 2 | `pipelines/route.ts:101-141` |
  | Q37 similarity | 0 → 2 | `lib/similarity.ts` |
  | Q65 resource planner | 0 → 2 | `lib/resource-planner.ts` |
  | Q110 React.memo | 0 → 1 | 3 components memo'd |
- **Remaining 0-Score Gaps** (4):
  - Q102: 47 `any` types (High, 30 min)
  - Q27: No DAG validation on read (High, 5 min)
  - Q26: selectedSkills as Array, not Set (Medium, 5 min)
  - Q64: No moving averages (Medium, 20 min)
- **Tier performance**:
  - Heavy (48%): 91/106 = 86%
  - Medium (25%): 48/56 = 86%
  - Moderate (18%): 28/28 = 100%
  - Supporting (9%): 25/30 = 83%
- **Path to A**: Fix 4 remaining gaps (~60 min) → 198/220 = 90/100 = A
- **Files at `benchmarks/Benchmark_2_26-06-2026---12-49/`**

### Security Transformation
- B1: 33% (weakest category)
- B2: 87% (competitive)

---

## 12. Research & Strategic Documents

### Storage Comparison (`research/storage-comparison.md`)
Comprehensive analysis of 4 storage approaches for PAOS agent memory. Recommendation: phased hybrid.

| Approach | Setup | 100 docs | 10K docs | 1M docs | Concurrency | Human Readable | Backup |
|----------|-------|----------|----------|---------|-------------|----------------|--------|
| A: RAG on FS | Low (TF-IDF) / Medium (embeddings) | <50ms | ~200ms | Slow/degraded | File-locking | ✅ Plain md | `cp` |
| B: SQLite + sqlite-vec | Medium | <15ms | ~50ms | Moderate | WAL mode (readers fine) | ❌ Binary | `cp` file |
| C: PostgreSQL + pgvector | High | <5ms | ~10ms | Fast with HNSW | ✅ Full ACID | ❌ Binary | `pg_dump` |
| D: Obsidian Vault | Low (already exists) | <100ms | ~500ms | Not feasible | No locking | ✅ Plain md | `cp`/`git` |

**Weighted score for PAOS today (mid-2026, ~50 files, 13 agents, single VPS)**:
- A: 7.55
- B: 7.15
- C: 7.15
- D: 6.60

**Recommendation Phases**:
- **Short-term (0–3mo)**: Filesystem + Obsidian + TF-IDF RAG. Zero infrastructure, zero migration. 2–4 hours.
- **Medium-term (3–12mo)**: SQLite + sqlite-vec. Single-binary, cp-backup, good enough concurrency.
- **Long-term (12+mo)**: PostgreSQL + pgvector if 100K+ docs, 50+ concurrent agents, point-in-time recovery needed.

**DON'Ts**: Jump straight to PostgreSQL, replace files entirely with DB, rely solely on full-text search, add dedicated vector DB (Pinecone/Qdrant), use Obsidian as sole knowledge system.

### LangChain/LangGraph Integration Study (`research/langchain-integration.md`)
Feasibility study with concrete recommendation: **adopt nothing directly, adapt typed state model only, skip the rest as YAGNI.**

| Component | Decision | Rationale |
|-----------|----------|-----------|
| LangGraph StateGraph | ✅ Adapt (state schema only) | Typed shared state useful; PAOS doesn't need in-process execution |
| LangGraph conditional edges | ⏸ Defer | YAGNI for current linear pipeline patterns |
| LangGraph checkpointing | ✅ Adapt (lightweight) | Add checkpoint snapshots, not full SqliteSaver |
| LangGraph cycles | ❌ Skip | PAOS pipelines are DAGs by design |
| LangChain `create_agent` | ❌ Skip | PAOS already has Hermes + opencode |
| LangChain `@tool` | ❌ Skip | `/h-*` bash scripts superior |
| LangChain MCP adapters | ❌ Skip | PAOS MCP config more flexible |
| LangChain middleware | ❌ Skip | PAOS MCP server pattern already handles |

**Key finding**: PAOS pipeline system is _architecturally better suited_ to multi-agent orchestration than LangGraph. PAOS is multi-process (each agent is its own process), language-independent, has visual editing, real-time execution via systemd, and cross-machine scalability via file inboxes.

**StateGraph vs PAOS DAG**:
| Dimension | LangGraph | PAOS |
|-----------|-----------|------|
| Graph type | Cyclic | Acyclic (DAG) |
| State model | Single typed dict | File-based per phase |
| Node type | Python functions | Full agent sessions |
| Granularity | Fine | Coarse |
| Execution | In-process | Multi-process |
| Persistence | SqliteSaver/PostgresSaver | Filesystem |
| Human-in-loop | Built-in (`interrupt_before`) | Custom (`/intervene` API) |
| Conditional routing | First-class | Manual linear |
| Language | Python/TS | Bash/TS |

**Effort comparison**:
- Full LangGraph adoption: 2-4 weeks + HIGH risk (architectural mismatch)
- Adapt State Schema only: 2-3 days + LOW risk
- Stay with PAOS: 0 effort + no risk

### Multi-Machine PAOS Architecture (`research/multi-machine-paos.md`)
Design for scaling PAOS across multiple VPS machines via Tailscale.

**Current Topology**: Single VPS, 2nd machine online (`developer` at 100.103.28.56), 1 offline (`p30-pro`).

**4 Architecture Options Evaluated**:

| Option | Code Changes | Single Point of Failure | Data Consistency | Agent Mod | Latency | Rollback |
|--------|--------------|------------------------|-----------------|----------|---------|----------|
| A: NFS Shared | Minimal | NFS server | ✅ Strong | None | Medium | ✅ Easy |
| B: Funnel + Dist | Significant | No single point | ❌ Weak | Significant | Low | ❌ Hard |
| C: MCP Gateway | Moderate | Primary machine | ✅ Strong | Shim only | Medium | ✅ Easy |
| D: Hybrid/Relay | Moderate | Primary (for merge) | ⚠️ Eventually | None | Low | ✅ Easy |

**Recommendation**: Option C (MCP Gateway) + Option D (Hybrid Relay) — tiered hybrid.

**Tier 1 (Primary)**: Dashboard, Pipeline Engine, MCP Gateway (TCP :3100), PAOS Relay, Filesystem (source of truth), Hermes, Tailscale Funnel.

**Tier 2 (Executors)**: Local FS, MCP Proxy Shim (stdio→HTTP to Gateway), PAOS Relay Daemon, agents, ~/.local/bin/.

**Data Flow** (cross-machine pipeline):
1. User submits pipeline on Dashboard (Machine A)
2. Pipeline Engine writes files (local FS on A)
3. Engine spawns local agents directly
4. For remote agents: PAOS Relay syncs via Tailscale rsync
5. On Machine B, relay detects new phase, spawns agent
6. Agent reads IMPLEMENTATION.md, executes, writes output
7. Relay syncs output back to Machine A

**Data Flow** (inbox communication):
- Agent A (A) → MCP Gateway serializes write → Relay syncs to B (5s interval) → Agent B picks up
- Agent B (B) → MCP Proxy Shim forwards to Gateway (real-time) → Gateway writes to FS on A

**What MUST be Local**: MCP server binaries (stdio), agent binaries (`~/.local/bin/`), agent CLIs, pipeline phase cache, agent configs.

### SWOT-Benchmark
Strategic evaluation of PAOS as an "investment" — 31 sub-questions across Strengths, Weaknesses, Opportunities, Threats. Located at `SWOT-Benchmark.md` (referenced in Benchmark 1).

### SRS Documents
- **`knowledge/srs/SRS-1-PAOS-Current-State.md`** (1046 lines) — Full academic-grade SRS covering Introduction, Literature Review, SWOT/PESTLE, Planning, Methodology, Functional + NFR, Process & Data Modelling, System Design, UML Diagrams, MVP Design, Testing, Deployment, Maintenance, References. Includes 14-section template, 13 UML diagram types, MVP/Scalable tiering, RTM, design rationale.
- **`knowledge/srs/SRS-2-Enterprise-Agentic-AI-Harness.md`** — Reference for future expansion

### Existing Solutions Comparison (from SRS-1)
| Tool | Strengths | Weaknesses (vs PAOS) |
|------|-----------|----------------------|
| LangChain Agents | Rich ecosystem, Python-native, many integrations | No file-system memory, no git audit, no cross-tool agent identity |
| AutoGen (Microsoft) | Multi-agent conversations, code execution | No persistent vault, no constitutional governance |
| CrewAI | Role-based agents, task flows | SaaS-centric, no local-first memory, no MCP |
| Cursor / Windsurf | IDE-native AI coding | Single-agent, no orchestration |
| Claude Code (standalone) | Excellent reasoning, MCP support | No multi-agent coordination, no audit ledger |
| OpenDevin / SWE-Agent | GitHub issue resolution | Narrow scope, no governance |
| Zapier AI Agents | Workflow automation | Cloud-only, no shared memory |

### PAOS PESTLE (from SRS-1)
- **Political**: EU AI Act, US EO 14110 require audit trails — PAOS ledger is compliance asset
- **Economic**: Multiple AI subs; local models reduce spend
- **Social**: Developer appetite for AI workflows, privacy concerns favor local-first
- **Technological**: MCP adoption accelerating, VS Code extension ecosystem expanding, LLM context windows growing
- **Legal**: Operator owns artifacts (no SaaS TOS), git commits clarify IP provenance
- **Environmental**: Local inference has hardware energy cost; API externalizes to cloud

### PAOS Milestones
- v0.1: Initial agent roster + shared memory
- v0.2: H-Factor constitution
- v1.0: MCP servers operational
- v1.5: Antigravity Review Loop
- v2.0: /h-pipeline + dashboard
- v2.1: Agent registry, session protocol, dual-logging
- v2.2.0: Shared Infrastructure Convention (Article X) + Project Workspaces (Article XI)

---

## 13. Project Structure & Active Project

### Top-Level Structure
```
AI_Workflow/
├── workflow.md                       # PAOS Constitution (H-Factor)
├── CLAUDE.md                         # Claude Code instructions
├── AGENTS.md                         # Auto-injected identity for Hermes
├── ANTIGRAVITY.md                    # Antigravity CLI config
├── GEMINI.md                         # Gemini config
├── README.md                         # Project overview
├── TASKS.md                          # 6-note batch pipeline
├── PIPELINES.md                      # Pipeline executable contract
├── user.md                           # Operator identity
├── projects.md                       # Active project registry
├── walkthrough.md                    # Architecture walkthrough
├── user-questions.md                 # Q&A tracking (empty)
├── Coding-Principles.md              # Architectural constitution
├── Coding-Principles-Benchmark.md    # 110-question strict audit
├── SWOT-Benchmark.md                 # Strategic eval
├── Dockerfile / docker-compose.yml   # Container deployment
├── install.sh / install.ps1          # Cross-platform installers
├── PAOS-Entities.md                  # Entity reference
├── PAOS-ULTIMATE-BRAINSTORM.md       # This file
├── agents/                           # 11 agent souls + log.md
├── benchmarks/                       # Benchmark runs (Benchmark_1, Benchmark_2)
├── bin/                              # h-* commands, paos-pipeline-handler.sh
├── config/                           # Per-agent config (claude/, codex/, opencode/, etc.)
├── dashboard/                        # Next.js app (port 3333)
├── docker/                           # Docker secrets + compose
├── docs/                             # api.md, examples.md, README.md
├── frontend → ~/Documents/Dev/PAOS-WEB
├── hermes/                           # Hermes Agent home (symlinked from ~/.hermes)
├── install-*.sh / *.ps1              # Installers
├── knowledge/                        # Obsidian vault root
├── lib/                              # Shared libraries
├── logs/ → memory/                   # Per-agent event logs (symlink)
├── mcp/                              # MCP server implementations
├── memory → logs/                    # Shared memory (symlink)
├── opencode.json                     # OpenCode config
├── package.json / package-lock.json  # Node deps
├── projects/                         # Per-project workspaces
│   └── PAOS/                         # Active project
├── research/                         # Research docs (langchain, multi-machine, storage)
├── screenshots/                      # Dashboard screenshots + SVG diagrams
├── setup.sh                          # Initial setup
├── skills/                           # Shared skills (antigravity-review-loop, etc.)
├── user-questions.md                 # Q&A
├── vault/                            # Obsidian vault (knowledge/ + memory/ symlinks)
├── walkthrough.md                    # Architecture walkthrough
├── workflow.md                       # Constitution
├── workflows/                        # Workflow definitions
└── workspaces/                       # VS Code workspace files
```

### Active Project: PAOS
`projects.md` declares: **PAOS is the only active project. Focus: evolve the framework, skills, MCP tools, and agent ecosystem.**

| Project | Path | Stack | Status |
|---------|------|-------|--------|
| PAOS | `~/AI_Workflow/` | Multi-Agent AI Orchestration Framework | Active — fresh start |

### PAOS Project Sandbox (`projects/PAOS/`)
- `ledger.md` — Per-project audit trail
- `events.md` — Per-project event log
- `handoff.md` — Per-project session handoff
- `shared-context.md` — Per-project agent thinking context
- `tasks/<task-id>.md` — Per-project task cards

### Agent Souls Directory (`agents/`)
11 agents, each with `soul.md` and optionally `<name>.md` for runtime + a `log.md` for execution history:
- `developer/soul.md` + `developer.md` — Builder/Executor (deep + OpenCode-compatible)
- `architect/soul.md` + `architect.md` + `architect/log.md` — Peer Reviewer
- `coordinator/soul.md` + `coordinator.md` + `coordinator/log.md` — Manager
- `profiler/soul.md` + `profiler.md` + `profiler/log.md` — Identity Elicitor
- `codex/soul.md` + `codex.md` — Coding Executor
- `gemini/soul.md` + `gemini.md` — Coding Executor
- `hermes-nous/soul.md` — Hermes Nous
- `openclaw/soul.md` — Channel Agent
- `antigravity/soul.md` + `antigravity-cli/soul.md` — Desktop IDE Agent (two souls)
- `signal/soul.md` — Messenger

### Skills Directory (`skills/`)
- `INDEX.md` — Central skills catalog
- `antigravity-review-loop/SKILL.md` — Workflow skill
- `context7-mcp/SKILL.md` — Library docs
- `ponytail/SKILL.md` + `ponytail-repo/` — Anti-over-engineering
- `system-analysis-and-design/SKILL.md` + references/ — SRS authoring + benchmark audit
- `drawio-skill/` — draw.io diagrams

### Knowledge Directory (`knowledge/`)
- `docs/_agent-conventions.md` — Vault markdown conventions
- `docs/session-protocol.md` — v3.0.0 session rules
- `docs/notes.md` / `docs/notes-done.md` — Project notes
- `docs/user-questions.md` / `docs/user-questions-answered.md` — Q&A
- `docs/repos.md` — Repository collection + Redis/PostgreSQL storage patterns
- `docs/Tradingview.md` — Reference project doc
- `paos/constitution.md` — Duplicate of workflow.md (H-Factor)
- `previous-projects/README.md` — Archive
- `questions/index.md` + `PAOS.md` + `test-project.md` — Q&A per project
- `references/books.md` — Books (per user, ignored in this brainstorm)
- `srs/SRS-1-PAOS-Current-State.md` + `SRS-2-Enterprise-Agentic-AI-Harness.md` — System requirements
- `templates/fullstack-monorepo/` — Project template with SRS, architecture, docs
- `Models and AI subs.md` — Subscription tracker
- `my brain.md` — Personal notes
- `questions/index.md` — Question index

### Hermes Skills (`hermes/skills/`)
88+ skills for Hermes Agent. Categories: `autonomous-ai-agents/`, `creative/`, `data-science/`, `devops/`, `drawio-skill/`, `email/`, `github/`, `media/`, `messaging/`, `mlops/`, `note-taking/`, `paos/`, `paos-pipeline-protocol/`, `productivity/`, `research/`, `smart-home/`, `social-media/`, `software-development/`, `system-analysis-and-design/`, `vps-kit/`, `web/`.

### Config Directory (`config/`)
Per-AI-tool configs (all symlinked or referenced by agents):
- `antigravity/` + `antigravity2/` — Antigravity IDE
- `claude/` — Claude Code (~/.claude symlink)
- `codex/` — Codex CLI
- `gemini/` — Gemini CLI
- `hermes-nous/` — Hermes config
- `opencode/` — OpenCode CLI
- `openclaw/` — OpenClaw (reserved)
- `ollama/` — Ollama local LLM
- `signal/` — Signal messenger
- `th-client/` — Tailscale client
- `templates/`, `copilot/`, `git/`, `node/` — Supporting
- `secrets/.env` — API keys (gitignored)

### Docker
- `Dockerfile` — Production image
- `docker-compose.yml` — Multi-service orchestration
- `docker/docker-compose.yaml` — Alternative
- `docker/secrets.env.template` — Secret template

### Installers
- `install.sh` (Ubuntu), `install-mac.sh`, `install-ubuntu.sh`, `install-windows.ps1`, `install.ps1`, `install.cmd` — Cross-platform
- `setup.sh` — Initial setup
- `bin/install-paos.sh` — Idempotent bootstrap for fresh VPS (Ubuntu 24.04+): Node 22+ via nvm/nodesource, Python 3.14+, structure clone, npm deps for dashboard + 3 MCP servers, API token via `openssl rand -hex 32`, `.env` from template, systemd user services (paos-pipeline.path + .service), Tailscale serve, vault symlinks. Flags: `--yes`, `--no-systemd`, `--no-tailscale`, `--no-deps`, `--repo=`.

### bin/ Scripts (h-* commands + supporting)
- 14 bash scripts: h-help, h-whoami, h-status, h-inbox, h-daily, h-log, h-context, h-task, h-pipeline, h-write-handoff, h-commit, h-sync, h-chat, h-audit
- Python h-pipeline (with `submit` subcommand)
- 14 OpenCode wrappers in `config/opencode/command/`
- `agent-commit.sh` — Per-agent git commit helper
- `paos-pipeline-handler.sh` — Auto-execute handler
- `paos-pipeline-watch.sh` — Fallback inotify watcher
- `paos-pipe-id` — Generate pipeline ID
- `init-paos.sh` — Fresh-start initializer
- `sync-chat.py` — Sync active chat transcript
- `h-pipeline` (Python) — Submit/list/execute pipelines
- `lib/h-common.sh` — Shared utilities

---

## 14. The Operator Profile

**`user.md` + memory** establishes:

### Identity
- **Name**: Abdullah Abdul Hakim
- **Organization**: NodeAlgo (nodealgo.com)
- **Role**: Full-stack developer & infrastructure tooling engineer
- **Profile**: 2026-05-15, fresh-start 2026-06-22

### Field of Expertise
- **VPS & Infrastructure**: SSH automation, Tailscale, WireGuard, security hardening (UFW, Fail2ban, SSH key-only), system monitoring
- **AI/LLM Orchestration**: Multi-provider layers (Claude, Gemini, OpenAI, Ollama, LM Studio, Copilot) — unified abstractions
- **Trading & Financial UI**: Real-time candlestick charts (lightweight-charts), Binance/US design, WebSocket pipelines, mock market data
- **Developer Tooling**: CLI (Commander.js, Inquirer), VS Code extensions, MCP servers, pnpm monorepos
- **Video/Media Processing**: Playwright downloaders, WebP→MP4 (imageio), ffmpeg

### Languages (ranked by frequency)
1. **Python** (primary)
2. **JavaScript / TypeScript** (dashboard, CLI)
3. **Bash / PowerShell** (cross-platform, VPS automation)

### Coding Style Vector
- **Commit Convention**: `Agent[<name>]: <present-tense description>`
- **Module System**: ESM (`"type": "module"`)
- **Line Endings**: LF (Linux/WSL native)
- **Indentation**: 2-space (TS/JS/JSON), 4-space (Python)
- **Naming**: camelCase (JS/TS), snake_case (Python), kebab-case (files/dirs)
- **Type Safety**: Full TypeScript with strict types
- **Documentation**: **Heavy** — SRS, DESIGN specs, AGENTS.md
- **Testing**: Node built-in test runner (`node --test`), pytest
- **License**: MIT

### Environment
- **OS**: Linux (Ubuntu 26.04)
- **Runtime**: Node.js >=18, Python 3
- **AI Tools**: Claude Code, OpenCode, Gemini, Codex, Hermes, Ollama
- **Knowledge Base**: `~/AI_Workflow/knowledge/`
- **Network**: Tailscale mesh VPN, multi-VPS fleet

### PAOS Preferences
- **Workflow**: Full H-Factor 3-Phase (Plan → Review → Execute → Log)
- **Communication**: Structured summaries. Professional. No emojis.
- **Git Discipline**: Auto-commit after every successful task via `bin/agent-commit.sh`
- **Risk Tolerance**: Conservative. Architect review mandatory before execution.
- **Knowledge Priority**: Consult `~/AI_Workflow/knowledge/` before designing solutions.
- **Active Focus**: Enhancing PAOS itself.

### AI Subscriptions
1. Google AI Pro main
2. Google AI Pro Jasonbourne16
3. Claude Jasonbourne16
4. Deepseek $99

### Dev Tools Used
Claude Code, Antigravity, Google AI Studio, Cursor, Hermes, Openclaw, Ollama/LMstudio, Opencode

### Personal Notes (`knowledge/my brain.md`)
- database
- tradingview prompt
- api binance fast quick trade tp sl exit market limit futures
- gym
- dubibet world cup usdt
- Tailscale Server (hermes + AI workflow)
- Install tmux from github star for Agenti AI OS PAOS AI Workflow and build on top of that
- Build a calculator app on tauri to check it

### Active Project (Post-Fresh-Start)
Only **PAOS** is active. All previous projects archived for fresh start.

---

## 15. Slash Commands & Scripts

### Universal `/h-*` Bash Commands (work without MCP)
| Command | Purpose |
|---------|---------|
| `h-help` | List all commands |
| `h-whoami` | Show agent identity |
| `h-status` | Show recent ledger, context, projects |
| `h-inbox` | List inbox messages |
| `h-daily` | Read/create daily note |
| `h-log` | Dual-log to events.md + global_ledger.md |
| `h-context` | Append to shared context.md |
| `h-task` | Manage task cards (list/read/create) |
| `h-pipeline` | Pipeline lifecycle (submit/list/execute) |
| `h-write-handoff` | Rewrite HANDOFF.md |
| `h-commit` | Git commit with agent identity |
| `h-sync` | End-of-session: handoff + commit + sync-chat |
| `h-chat` | Write chat summary |
| `h-audit` | Run compliance checks |
| `h-workspace` | Workspace management |

### `/h-pipeline` Cross-Agent Command
- **Planner Agents** (can invoke): Claude Code, Gemini, Antigravity IDE, Antigravity 2.0 CLI, Codex, OpenClaw
- **Executor Agents** (receive plans): Default = `opencode-developer`, Fallback = `hermes`
- **Configurable per pipeline** via `config/pipeline-defaults.yaml`:
  ```yaml
  pipeline:
    executor: opencode-developer
    review_mode: auto
    plan_format: antigravity
    auto_commit: true
    notify_on_complete: true
  ```
- **Flow**:
  1. User types `/h-pipeline <prompt>` in any planner
  2. Planner MUST `Read PIPELINES.md` first
  3. Planner produces `IMPLEMENTATION_PLAN.md` + `TASKS.md`
  4. Planner calls `shared-memory: submit_pipeline` MCP tool or `bin/h-pipeline submit`
  5. System creates pipeline dir with all required files
  6. Executor picks up from inbox

### `/H-Continue` Command
When user invokes `/H-Continue`: read last 100 lines of `vault/chats/active_chat_transcript.md` and print session summary.

### Ponytail Commands (Claude Code / OpenCode)
| Command | Purpose |
|---------|---------|
| `/ponytail [lite \| full \| ultra \| off]` | Set intensity or turn off |
| `/ponytail-review` | Review current diff for over-engineering |
| `/ponytail-audit` | Audit whole repo for over-engineering |
| `/ponytail-debt` | Harvest shortcuts deferred into a ledger |
| `/ponytail-gain` | Show measured impact scoreboard |
| `/ponytail-help` | Quick reference |

### GitHub Workflow Commands
- `github-auth` — GitHub auth setup: HTTPS tokens, SSH keys, gh CLI login
- `github-code-review` — Review PRs: diffs, inline comments via gh or REST
- `github-issue-to-pr` — Carry issue to verified PR with honest CI state
- `github-issues` — Create, triage, label, assign issues via gh or REST
- `github-pr-workflow` — PR lifecycle: branch, commit, open, CI, merge
- `github-repo-management` — Clone/create/fork repos, manage remotes, releases

### Claude Code Slash Commands (`config/claude/commands/`)
- `antigravity.md` — Antigravity workflow entry
- `PAOS-start.md` — PAOS startup sequence
- `pipeline-execute.md` — Execute pipeline
- `pipelines-view.md` — View pipelines
- `skill-creator.md` — Create new skill
- `srs.md` — SRS generation

### Install Script
`bin/install-paos.sh` — Idempotent PAOS bootstrap for Ubuntu 24.04+:
- OS detection
- Node.js 22+ via nvm (with nodesource fallback)
- Python 3.14+ check
- Clone/setup `~/AI_Workflow/`
- npm deps for dashboard + 3 MCP servers
- API token via `openssl rand -hex 32`
- `config/secrets/.env` from template
- systemd user services (paos-pipeline.path + .service)
- Tailscale serve setup
- Dashboard dev server on port 3333
- Vault symlinks
- Global ledger logging
- Flags: `--yes`, `--no-systemd`, `--no-tailscale`, `--no-deps`, `--repo=`

---

## 16. OpenClaw Channel Layer

OpenClaw = the **human-facing channel agent**. Connects users via Telegram, WhatsApp, Slack, Discord, and 20+ other channels. Routes requests to PAOS pipeline and reports back.

### Channels Supported
Telegram, WhatsApp, Slack, Discord, Signal, Google Chat, Microsoft Teams, Matrix, iMessage (macOS), IRC, Mattermost, Nostr, WebChat (browser), Voice (macOS/iOS/Android).

### Classification Rules
When user sends message:
1. Read `vault/memory/shared/context.md`
2. Read `vault/memory/inbox/openclaw/`
3. Classify:
   - **Coding task** → `memory/inbox/developer/` via MCP `send_message`
   - **Architecture/design** → `memory/inbox/architect/`
   - **Orchestration** → `memory/inbox/coordinator/`
   - **Question about PAOS state** → read ledger + context, respond directly
4. Create task card via MCP `create_task` with `assigned_to: <agent>`
5. Tell user: "Delegated to @developer — task #TASK-XXX"
6. When result arrives in inbox: relay to user channel

### Boundaries
- Never execute code directly
- Never modify `workflow.md` (amendment process required)
- Never bypass the PM→Architect→Coordinator pipeline
- Always create a task card before delegating

---

## 17. Auto-Execution Infrastructure (systemd)

When a pipeline is submitted to `memory/pipelines/`, the systemd path unit `paos-pipeline.path` detects it and runs `bin/paos-pipeline-handler.sh`. The handler:
1. Reads META.json
2. Determines the executor
3. Checks guardrails: whitelist, rate limit, kill switch, task count
4. Writes inbox notification to executor
5. Optionally spawns executor directly

### 6 Guardrails
1. **Lock** — prevents duplicate concurrent execution of same pipeline
2. **Whitelist** — allowed planner agents
3. **Rate limit** — max submissions per minute
4. **Kill switch** — file-based disable (`~/.config/paos/auto-execute.off`)
5. **Task cap** — max 20 tasks
6. **Timeout** — per-task timeout

### Components
- `~/.config/systemd/user/paos-pipeline.path` — systemd path unit
- `~/.config/systemd/user/paos-pipeline.service` — systemd service
- `bin/paos-pipeline-handler.sh` — handler script
- `bin/paos-pipeline-watch.sh` — fallback inotifywait (for containers/WSL)
- `~/.config/paos/pipeline-whitelist.txt` — whitelist
- `~/.config/paos/auto-execute.off` — kill switch

### Notifications
Systemd PathChanged is non-recursive — new directory creation triggers it, but deep file updates don't. Acceptable for pipeline submission use case.

### PM Pipeline Service
`paos-dashboard.service` — systemd user service running Next.js dev server, exposed via Tailscale serve on `dev.anaconda-notothen.ts.net`.

---

## 18. Tailscale Networking

### Setup
- Tailscale mesh VPN for all machines
- Dashboard exposed via Tailscale serve at `https://dev.anaconda-notothen.ts.net/`
- No public internet exposure
- Tailnet devices: iPad, phone, Fedora, Windows can all access

### Current Topology
| Machine | Tailscale IP | Status |
|---------|--------------|--------|
| `dev` | 100.87.116.120 | Online |
| `developer` | 100.103.28.56 | Online |
| `p30-pro` | 100.96.219.9 | Offline |

### Next.js Tailscale Integration
`next.config.ts` — standalone output, custom webpack source-map, allowed dev origin for Tailscale.

---

## 19. Anti-Over-Engineering Philosophy (Ponytail)

**Ponytail** = "He says nothing. He writes one line. It works." DietrichGebert/ponytail — lazy senior dev mode. ~54% less code, ~20% cheaper, ~27% faster, 100% safe.

### The 6-Rung Ladder
Before writing any code, stop at the first rung that holds:
1. **Does this need to exist?** → no: skip it (YAGNI)
2. **Stdlib does it?** → use it
3. **Native platform feature?** → use it
4. **Installed dependency?** → use it
5. **One line?** → one line
6. **Only then:** the minimum that works

### Rules
- No abstractions not explicitly requested
- No new dependency if avoidable
- No boilerplate nobody asked for
- Deletion over addition
- Boring over clever
- Fewest files possible
- Pick edge-case-correct option when two stdlib approaches are same size — lazy means less code, not flimsier algorithm
- Mark intentional simplifications with `ponytail:` comment naming ceiling + upgrade path

### NOT Lazy About
- Input validation at trust boundaries
- Error handling that prevents data loss
- Security
- Accessibility
- Calibration real hardware needs
- Anything explicitly requested

### Verification
Non-trivial logic leaves ONE runnable check behind — smallest thing that fails if the logic breaks. Assert-based demo/self-check or one small test file. No frameworks, no fixtures. Trivial one-liners need no test.

### Installation Across Agents
| Agent | Method | Status |
|-------|--------|--------|
| Claude Code | `claude plugin marketplace add DietrichGebert/ponytail` + `claude plugin install ponytail@ponytail` | ✅ Installed & enabled |
| OpenCode | Plugin in `~/.config/opencode/opencode.json` + command links | ✅ Configured |
| All PAOS agents (via AGENTS.md) | Ruleset in `skills/ponytail-repo/AGENTS.md` | ✅ Available |

Default mode: **full** (overridable via `PONYTAIL_DEFAULT_MODE` env var or `~/.config/ponytail/config.json`).

---

## 20. Strategic Roadmap & Gaps

### Completed (v2.0–v2.2.0)
- ✅ Agent roster + H-Factor constitution
- ✅ MCP servers operational (shared-memory, scaffold, gitkraken, context7, hostinger, agent-browser)
- ✅ Antigravity Review Loop
- ✅ /h-pipeline cross-agent command
- ✅ Next.js dashboard
- ✅ Per-agent git identity
- ✅ Agent registry + session protocol v3.0.0
- ✅ Dual-Logging Mandate
- ✅ Article X: Shared Infrastructure
- ✅ Article XI: Project Workspaces
- ✅ Obsidian vault conventions
- ✅ Ponytail integration (all agents)
- ✅ Auto-execution via systemd
- ✅ Tailscale serve
- ✅ Multi-machine architecture designed
- ✅ Storage strategy research (short/medium/long-term)
- ✅ LangChain feasibility study (decision: skip most, adapt state schema)
- ✅ Coding-Principles Benchmark v2.0
- ✅ Benchmark 1 (C 67%) → Benchmark 2 (B 87%)

### Remaining 0-Score Benchmark Gaps (4)
- Q102: 47 `any` types (High, 30 min)
- Q27: No DAG validation on read (High, 5 min)
- Q26: selectedSkills as Array, not Set (Medium, 5 min)
- Q64: No moving averages (Medium, 20 min)
- **Total effort to A**: ~60 minutes

### Recommended Next Steps
1. Fix 4 remaining B2 gaps → A grade (90/100)
2. Implement Phase 1 storage roadmap: TF-IDF RAG MCP tool + Obsidian wikilink enforcement
3. Adapt StateGraph typed state schema in `pipeline-flow.json` (2-3 days effort)
4. Multi-machine rollout: Tier 1 Primary + Tier 2 Executor, MCP Gateway on port 3100
5. Conditional DAG edges (LangGraph-inspired) — YAGNI until real use case
6. Skills audit complete (116 → 57 skills); batch delete pending user approval

### Open Questions / Deferred
- Conditional DAG branching (skip for now)
- SQLite migration (medium-term 3-12mo)
- PostgreSQL migration (long-term 12+mo)
- OpenClaw fully wired (config reserved)
- Real-time chat protocol beyond file inboxes (YAGNI)

### Active Project State (from HANDOFF.md, 2026-09-04)
- **Last Agent**: hermes-nous
- **Active Task**: Skills Audit discussion
- **Skills audit verdict**: 38 KEEP, 42 DELETE (least used), 36 DELETE (unnecessary) = 78 total delete
- **Pending**: User explicit approval to batch-delete flagged skills
- **Key Decisions** (permanent):
  - `bin/agent-commit.sh` is the only way to commit
  - Hermes home: `~/AI_Workflow/hermes/` (symlinked from `~/.hermes`)
  - Dashboard: `npm run dev -- --webpack --port 3333`, Tailscale serve for tailnet
  - Systemd `paos-dashboard` manages dashboard on boot
  - Tasks per-project: `projects/{name}/tasks/`, filtered via `?project=` query param
  - Real-time task progress: PATCH `/api/tasks?id=X&progress=...` updates progress bar live
  - Default executor is Hermes — only dispatch to other agents when explicitly told
  - Skills audit: 78 total delete candidates

### TODO/Deferred Items (from 2026-05-17 notes-done)
- Gap 8: left unsettled (no action)
- Pipeline smoke test (Gap 1) — still pending
- Git-last-5-commits task: removed during 2026-09-03 cleanup
- systemctl-tab-in-terminals task: completed

### Strategic Direction
PAOS continues evolving as a **first-class agent operating system**. Focus areas:
1. **Framework hardening** — reach A-grade via Benchmark 3
2. **Memory scaling** — Phase 1 RAG + Phase 2 SQLite roadmap
3. **Multi-machine distribution** — Tiered hybrid (MCP Gateway + Relay)
4. **Skill library curation** — 116 → ~57 high-quality skills
5. **Dashboard maturity** — all 30 pages, 63 API routes, responsive 390px–3840px
6. **Anti-over-engineering** — Ponytail enforcement across all agents
7. **Constitutional governance** — H-Factor I1–I4 universal compliance

---

## Appendix A — Directory Aliases & Symlinks

| Alias | Real Path |
|-------|-----------|
| `~/AI_Workflow/memory/` | symlink to `~/AI_Workflow/logs/` |
| `~/AI_Workflow/logs/` | actual |
| `~/AI_Workflow/vault/memory/` | symlink to `~/AI_Workflow/memory/` |
| `~/AI_Workflow/vault/knowledge/` | symlink to `~/AI_Workflow/knowledge/` |
| `~/.hermes/` | symlink to `~/AI_Workflow/hermes/` |
| `~/.claude/` | symlink to `~/AI_Workflow/config/claude/` |
| `~/.config/opencode/` | symlink to `~/AI_Workflow/config/opencode/` |
| `~/.codex/` | symlink to `~/AI_Workflow/config/codex/` |
| `~/.ollama/` | symlink to `~/AI_Workflow/config/ollama/` |
| `~/AI_Workflow/frontend/` | symlink to `~/Documents/Dev/PAOS-WEB` |
| `~/AI_Workflow/.claude.md` | symlink to `~/AI_Workflow/CLAUDE.md` |

**NEVER delete `vault/memory` or `vault/knowledge` symlinks** — they are the bridge to all PAOS memory.

## Appendix B — MCP Server Implementation Locations

| Server | Source | Type |
|--------|--------|------|
| shared-memory | `mcp/shared-memory-server/` | stdio (Node) |
| scaffold | `mcp/scaffold-server/` | stdio (Node) |
| gitkraken | external (`gk mcp --readonly`) | stdio (gk) |
| context7 | external (`mcp.context7.com`) | HTTP |
| hostinger-domains | external (npx) | stdio (npx) |
| hostinger-dns | external (npx) | stdio (npx) |
| agent-browser | external (Vercel Labs) | stdio |

## Appendix C — Agent Identity Mappings

| Agent ID | Git Identity | Inbox | Events Log |
|----------|--------------|-------|------------|
| `hermes-nous` | `hermes-nous@paos.nodealgo.com` | `vault/memory/inbox/hermes-nous/` | `vault/memory/hermes-nous/events.md` |
| `claude` | `claude@paos.nodealgo.com` | `memory/inbox/claude/` | `logs/claude/events.md` |
| `codex` | `codex@paos.nodealgo.com` | `memory/inbox/codex/` | `logs/codex/events.md` |
| `opencode-developer` | `developer@paos.nodealgo.com` | `memory/inbox/developer/` | `logs/developer/events.md` |
| `opencode-architect` | `architect@paos.nodealgo.com` | `memory/inbox/architect/` | `logs/architect/events.md` |
| `opencode-coordinator` | `coordinator@paos.nodealgo.com` | `memory/inbox/coordinator/` | `logs/coordinator/events.md` |
| `gemini` | `gemini@paos.nodealgo.com` | `memory/inbox/gemini/` | `logs/gemini/events.md` |
| `antigravity` | `antigravity@paos.nodealgo.com` | `memory/inbox/antigravity/` | `logs/antigravity/events.md` |
| `openclaw` | `openclaw@paos.nodealgo.com` | `memory/inbox/openclaw/` | `logs/openclaw/events.md` |
| `ollama` | `ollama@paos.nodealgo.com` | `memory/inbox/ollama/` | `logs/ollama/events.md` |
| `signal` | `signal@paos.nodealgo.com` | `memory/inbox/signal/` | `logs/signal/events.md` |

---

*PAOS Ultimate Brainstorm v1.0 — Single canonical reference of the entire AI_Workflow ecosystem. Synthesized from Constitution (workflow.md), agent souls, benchmarks, research, knowledge, skills, MCP, pipelines, logs, and projects. Books excluded per operator request. No files outside this document were edited or deleted.*
