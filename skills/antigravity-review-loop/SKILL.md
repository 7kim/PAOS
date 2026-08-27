---
name: antigravity-review-loop
description: Implements the Google Antigravity artifact-driven review workflow: Task List → Implementation Plan → Execution → Walkthrough. The user reviews and comments on .md artifacts before approving. On approval or comments, the agent re-reads the files and re-executes. Use this skill for any multi-step feature work, refactoring, or system changes where the user wants structured oversight with inline feedback on markdown artifacts.
---

# Antigravity Review Loop

A skill that reproduces Google Antigravity's artifact-driven review workflow inside the PAOS. Instead of silently executing, the agent produces three structured `.md` artifacts that the user reviews, comments on, and approves before any code is written.

## Artifacts Produced

1. **TASKS.md** — A numbered task list with status markers (`[ ]`, `[~]`, `[x]`)
2. **IMPLEMENTATION_PLAN.md** — Technical architecture, files affected, approach rationale
3. **WALKTHROUGH.md** — Post-execution summary of what was done, what changed, and verification results

## The Non-Negotiable Workflow

### Phase 1 — Planning (No code changes yet)

0. Read `PIPELINES.md` — single contract for pipeline file layout (`META.json` phases `id`, `pipeline-flow.json`, `builder-layout.json`, `phases/<id>/REASONING.md`). Never manual `mkdir` a pipeline; use `bin/h-pipeline submit`.
1. Read the user's request.
2. Produce `TASKS.md` at the project root with:
   - Numbered tasks, each with a clear deliverable
   - Estimated complexity (S / M / L)
   - Dependencies between tasks
3. Produce `IMPLEMENTATION_PLAN.md` at the project root with:
   - Objective (one-line)
   - Scope (files, systems, APIs affected)
   - Technical approach per task
   - Risks and rollback strategy
   - Design rationale (why this approach over alternatives)
4. Present both files to the user. **Stop and wait.**

### Phase 2 — User Review Loop

The user reviews the artifacts by:
- Reading `TASKS.md` and `IMPLEMENTATION_PLAN.md`
- Adding inline comments directly into the `.md` files (using `<!-- COMMENT: ... -->` or `> NOTE: ...` blocks)
- Editing task descriptions or plan sections directly
- Clicking/telling the agent to "review" or "proceed"

**On re-execution trigger** (user says "review", "proceed", or "go"):
1. Re-read both `TASKS.md` and `IMPLEMENTATION_PLAN.md`
2. Scan for any user comments, edits, or status changes
3. If comments exist:
   - Address each comment explicitly
   - Update the artifacts accordingly
   - Present the revised artifacts back to the user
   - **Stop and wait again** for approval
4. If no comments and the user has approved (e.g., wrote `## APPROVED` or said "approved"):
   - Proceed to Phase 3

### Phase 3 — Execution

1. Execute tasks in order from `TASKS.md`
2. Update task status in `TASKS.md` as `[~]` (in progress) then `[x]` (done)
3. Log each action to the agent's `log.md` AND `global_ledger.md`
4. After all tasks complete, produce `WALKTHROUGH.md`

### Phase 4 — Walkthrough

`WALKTHROUGH.md` must contain:
- Summary of all changes made
- Files modified (with line references)
- Commands executed and their output summaries
- Verification steps taken (tests run, manual checks)
- Any deviations from the original plan and why
- Known issues or follow-up items
- Git commit reference(s)

Present `WALKTHROUGH.md` to the user. The user can comment on it the same way — if they flag issues, re-enter Phase 3 for fixes.

## Approval Signals

The agent recognizes these as approval to proceed:
- `## APPROVED` written in either artifact
- User says "approved", "proceed", "go ahead", "looks good"
- User removes all `<!-- COMMENT: ... -->` blocks and says "review"

The agent recognizes these as feedback requiring revision:
- Any `<!-- COMMENT: ... -->` block in the artifacts
- Any `> NOTE: ...` block with feedback
- Direct edits to task descriptions or plan sections
- User says "change X", "fix Y", "use Z instead"

## Rework Loop Rules

- The rework loop is **not bounded by a fixed number of iterations**. The agent continues revising until the user explicitly approves.
- Each revision cycle must present a **diff summary** of what changed in the artifacts since the last version.
- If the user is silent for an extended period, the agent does NOT proceed — it waits.
- If the user says "just do it" or "skip review", use the Quick Start fallback below.

## Quick Start Fallback

If the user declines the review process:
1. Produce `TASKS.md` and `IMPLEMENTATION_PLAN.md` as normal
2. Flag all decisions as assumptions in a "Design Assumptions" appendix
3. Proceed to execution after a brief pause (5 seconds) to allow cancellation
4. Still produce `WALKTHROUGH.md` at the end

## H-Factor Integration

This skill maps to the PAOS Constitution as follows:
- **Phase 1 (Planning)** = Article II, Phase A (Strategic Planning)
- **Phase 2 (Review)** = Article II, Phase B (Peer Review) — the Architect reviews the plan; the user also reviews artifacts
- **Phase 3 (Execution)** = Article II, Phase C (Execution & Logging)
- **Phase 4 (Walkthrough)** = Article III (Structured Logging) — the walkthrough is a user-facing log summary

The `IMPLEMENTATION_PLAN.md` produced in Phase 1 serves dual purpose: it is both the Antigravity artifact AND the H-Factor plan that the Architect must review.

## Common Mistakes to Avoid

- **Skipping Phase 2.** The entire value of this workflow is the review loop. Never auto-proceed unless the user explicitly says to skip.
- **Ignoring user comments.** Every `<!-- COMMENT: ... -->` must be addressed. If unclear, ask the user for clarification.
- **Not updating TASKS.md during execution.** The task file is a live document. Status markers must reflect real-time progress.
- **Producing a generic walkthrough.** The walkthrough must reference specific files, lines, commands, and outcomes. No vague summaries.
- **Forgetting dual-logging.** Every action logged to `log.md` must also appear in `global_ledger.md` (Article III §3.3).
