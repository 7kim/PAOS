# PAOS — Personal Agent Operating System

> **Config home**: `~/AI_Workflow/config/opencode/` — fully integrated into PAOS.
> `~/.config/opencode/` → `config/opencode/` (symlink). CLI at `~/.opencode/bin/opencode`.

## Identity First (H-Factor §I3)

**Operator**: Abdullah Abdul Hakim — NodeAlgo (nodealgo.com)
**Role**: Full-stack developer & infrastructure tooling engineer
**Profile**: See `.opencode/user.md` for full Field of Expertise and Coding Style Vector.

### Default Agent & Model
- **Agent**: `@developer` (opencode-developer) — always the default, never overridden
- **Model**: `opencode/deepseek-v4-flash-free` — pinned globally and per-agent in `opencode.json`
- **Small model**: `opencode/north-mini-code-free` — lightweight tasks
- **Enforcement**: The `developer` agent config in `opencode.json` sets `"model": "opencode/deepseek-v4-flash-free"` at both the root level and agent level. Pipeline delegation from Hermes or other agents routes to `opencode-developer` per `config/pipeline-defaults.yaml`, which inherits the same pinned model. The model is never changed regardless of how a task arrives — CLI, TUI, pipeline, or inbox delegation.

## Constitution Mandate

**Before ANY work begins, you MUST read `.opencode/workflow.md`.** This is the PAOS Constitution (H-Factor Protocol v2.0.0) and it governs all actions. It is not optional. It defines:

- **4 Invariants** (I1–I4): Separation of Powers, Audit Immutability, Identity First, Skill Boundary
- **3-Phase Execution**: Strategic Planning → Peer Review → Execution & Logging
- **Dual-Logging Mandate**: Every `log.md` entry must have a corresponding `global_ledger.md` row
- **Antigravity Review Loop** (Article VIII): 4-phase artifact-driven workflow

## How to Work With This Operator

### Communication
- Structured summaries. Professional. No emojis.
- Give clear, specific answers. Cite file paths and line numbers.

### Git Discipline
- Auto-commit after every successful task: `Agent[<name>]: <present-tense description>`
- Feature branches: `feat/<brief-description>`
- Experiment branches: `exp/<hypothesis>`

### Risk Tolerance
- Conservative. Architect review is mandatory before execution.
- Consult `~/AI_Workflow/knowledge/` and `docs/` folders before designing solutions.

## Agent Roster

| Agent | How to Invoke | Role |
|-------|--------------|------|
| `@developer` | `@developer <request>` | **Default agent.** Builder/Executor — executes approved plans, writes code, runs commands. Delegates planning to PM via `task()`. |
| `@plan` | `@plan <request>` | **Project Manager** — thinks, plans, produces Antigravity artifacts and handoff prompts for `@developer`. Routes to architect + coordinator in parallel. |
| `@coordinator` | `@coordinator <request>` | Manager — delegates tasks, orchestrates workforce, verifies log compliance |
| `@architect` | `@architect review` or `@architect design <request>` | Peer Reviewer & System Designer — enforces H-Factor compliance, reviews plans, owns the `system-analysis-and-design` and `project-scaffolder` skills |
| `@profiler` | `@profiler` | Identity Elicitor — maintains `user.md` by running the elicitation skill |

### Default Workflow
1. For multi-step work: `@developer` delegates to `@plan` (PM) → PM produces artifacts and delegates parallel review to `@architect` + `@coordinator` → PM writes handoff → `@developer` executes → `@coordinator` verifies
2. For single-step work: `@developer` executes directly
3. For identity updates: use `@profiler`

## Skills Available

| Skill | When to Use |
|-------|------------|
| `project-scaffolder` | **Initializing new projects.** Triggers on "new project", "scaffold", "project init", "project setup". Conducts a 10-point discovery survey, scaffolds a complete AI-optimized production-grade project with full configuration, governance, and documentation. |
| `skill-creator-elicitation` | Bootstrapping operator identity from git history, file headers, directory tree |
| `system-analysis-and-design` | Writing SRS documents, system design docs, UML diagrams, technical specs |
| `antigravity-review-loop` | Any multi-step feature work requiring structured user review via .md artifacts |
| `ponytail` | **Active by default** — lazy senior dev mode. Before writing code: YAGNI → stdlib → native → installed dep → one line → minimum. Cuts ~54% code while keeping 100% safety. |

## Knowledge Base

- **Canonical**: `~/AI_Workflow/knowledge/` — all reference docs, ebooks, design patterns
- **Agent-specific**: `~/AI_Workflow/agents/<name>/docs/`
- **Identity**: `~/AI_Workflow/user.md`
- **Constitution**: `~/AI_Workflow/workflow.md`
- **Audit trail**: `~/AI_Workflow/logs/global_ledger.md`

## Critical Rules

1. **Never skip the Architect review.** No execution without a `## REVIEW [PASS|FAIL|CONDITIONAL]` block from `@architect`.
2. **Never skip dual-logging.** Every action in an agent's `log.md` must also appear in `global_ledger.md`.
3. **Never invent facts.** If the brief doesn't specify a detail, elicit it or flag it as an assumption.
4. **Never auto-proceed in the Antigravity loop.** Wait for explicit user approval (`## APPROVED` or verbal).
5. **Read `workflow.md` first.** It is the source of truth for all PAOS behavior.

## Pipeline Protocol (Mandatory for Inbox Tasks)

When you receive a task via inbox that references a pipeline directory (`memory/pipelines/PIPE-*`):

### 1. Pipeline Status File
Write a `pipeline.json` file inside the pipeline directory to report live status:
```json
{ "status": "executing", "currentTask": "Task 1 description", "progress": "1/8", "startedAt": "..." }
```

Update this file whenever you:
- Start a new task → change `currentTask`
- Complete a task → update `progress`
- Hit an error → set `status: "failed"` with `error` field
- Finish all → set `status: "completed"`, `completedAt: "..."`

Path: `memory/pipelines/<PIPE-ID>/pipeline.json`

### 2. Walkthrough.md
After completing ALL tasks, write `WALKTHROUGH.md` in the same pipeline directory with:
- Summary of what was built/changed
- Files created/modified (with paths)
- Commands run
- Verification steps taken
- Any known issues or deviations from plan

Path: `memory/pipelines/<PIPE-ID>/WALKTHROUGH.md`

### 3. Update META.json
Read `memory/pipelines/<PIPE-ID>/META.json`, update `status` and `completed_at`, then write it back.

### 4. Progress Markers in TASKS.md
Keep TASKS.md task markers up to date as you work:
- `[ ]` pending → `[~]` in progress → `[x]` completed

This powers the dashboard's progress bar and visualization.
