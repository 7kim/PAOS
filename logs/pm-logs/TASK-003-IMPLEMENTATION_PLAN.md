# IMPLEMENTATION PLAN — TASK-003
# Create Gemini Agent Soul File

**Task**: TASK-003  
**PM**: plan (OpenCode)  
**Date**: 2026-05-17  
**Status**: ready_for_architect_review

---

## Objective

Create the complete Gemini agent identity in PAOS. Gemini CLI is installed and wired with MCP but has no `soul.md`, no `agents/gemini.md` overview, and is absent from `workflow.md`.

## Scope

### Files to Create
- `agents/gemini/soul.md` — full soul file (identity, pipeline, Article IX vault protocol)
- `agents/gemini.md` — overview file

### Files to Modify
- `workflow.md` — add `@gemini` to Section 6.2 direct invocation roster

### Files NOT touched
- `GEMINI.md` (root) — standalone config, coexists
- `.gemini/settings.json` — already correct

## Technical Approach

### Task 1 — agents/gemini/soul.md
Model on `agents/codex/soul.md` (closest equivalent — both CLI coding agents).
Must include in order:
1. YAML frontmatter (name, role, description, stamp)
2. Identity section with Gemini-specific personality (Google Gemini API, code-first, methodical)
3. Capabilities (read/write files, bash, MCP tools, vault writes)
4. Pipeline Protocol (read HANDOFF → check inbox → plan → execute → log → commit)
5. H-Factor Binding I1–I4
6. Boundaries (what Gemini won't do)
7. Full Article IX vault protocol (Steps 0–4, MCP tool table, structured log format §3.1)

### Task 2 — agents/gemini.md
Briefer overview. Model on `agents/codex.md`. YAML frontmatter + abbreviated protocol.

### Task 3 — workflow.md
In Section 6.2 (Direct Invocation), after the `@openclaw` line, add:
```
- `@gemini <request>` — Google Gemini AI coding agent (config: `~/AI_Workflow/config/gemini/`)
```

## Risks
- Low. Pure file creation with no system changes or migrations.

## Rollback
- Delete `agents/gemini/soul.md`, `agents/gemini.md`, revert `workflow.md` line.

## Design Rationale
Gemini is the only configured agent without a soul file. Without it, Gemini operates without PAOS identity, ignores vault protocol, and doesn't write to the ledger. The soul file enforces H-Factor I3 (Identity First).

## REVIEW [CONDITIONAL]

| Field | Value |
|-------|-------|
| **Reviewer** | Architect (OpenCode) |
| **Timestamp** | 2026-05-17T16:00:00Z |
| **Verdict** | `[CONDITIONAL]` — approved once 4 issues are resolved |
| **H-Factor Binding** | I1 · I2 · I3 · I4 |

### Summary
The plan correctly identifies the need (Gemini has no soul file), targets the right files (`agents/gemini/soul.md`, `agents/gemini.md`, `workflow.md`), and models the soul on the correct reference (`agents/codex/soul.md`). Scope matches TASK-003 acceptance criteria. The design is fundamentally sound.

### Blocking Issues (resolve before execution)

**1. Missing TASKS.md artifact** — Article VIII Phase 1 requires **TASKS.md + IMPLEMENTATION_PLAN.md** as companion artifacts (workflow.md §6.5, line 203). Only the plan exists. Produce `TASK-003-TASKS.md` with numbered tasks, status markers, and dependency graph.

**2. No executing agent identified** — The plan does not name who executes Tasks 1–3. The task notes specify the pipeline: `@developer`. Without an explicit executor, the I1 Separation of Powers boundary between planner and executor is ambiguous. Add an `**Executor**: @developer` field to the plan header.

**3. No logging step in execution tasks** — I2 (Audit Immutability) requires every execution step to produce a log entry. The plan's three tasks include no "log to `global_ledger.md` and `events.md`" step. Add a Task 4: "Log execution: append to `global_ledger.md`, write summary to `memory/gemini/events.md`, and rewrite HANDOFF.md."

**4. Risk analysis too thin** — "Low. Pure file creation" is not a proper risk enumeration. Identify at least three specific failure modes and their mitigations (e.g., soul.md YAML syntax errors, workflow.md section drift, missing `agents/` directory).

### Non-Blocking Recommendations

- **Produce a handoff prompt** in `memory/prompts/` for the executor (workflow.md §6.2, line 173). The executor needs to know: what files to create, what reference files to read, and what to do on completion.
- **Add dependency ordering** to the task list. Tasks 1 and 2 are parallel; Task 3 (workflow.md edit) should explicitly depend on Tasks 1 and 2 so the agent names are confirmed before the roster is updated.

### H-Factor Compliance

| Invariant | Status | Evidence |
|-----------|--------|----------|
| **I1 — Separation of Powers** | ⚠️ Conditional | Plan correctly separates planner (plan) from reviewer (architect). But no executor is named, blurring the planner/executor boundary. |
| **I2 — Audit Immutability** | ⚠️ Conditional | Soul file references vault protocol, but the plan has no execution logging step. Without it, the executor has no task-level trigger to write to the ledger. |
| **I3 — Identity First** | ✅ Compliant | Soul file creation is explicitly about establishing Gemini's identity in PAOS. Plan models on existing agent soul files. |
| **I4 — Skill Boundary** | ✅ Compliant | Creating soul files, overview files, and editing workflow.md are within PM's design scope and Developer's execution scope. No boundary violations. |

### Verdict Rationale
I issue `[CONDITIONAL]` rather than `[FAIL]` because the plan's core design is correct and the issues are additive (missing artifacts, missing fields) rather than structural. Resolve blocking issues 1–4 above, then proceed to execution.
