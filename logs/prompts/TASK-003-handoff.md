# Handoff — TASK-003
**To**: @developer  
**From**: @plan  
**Date**: 2026-05-17

## Task
Create Gemini agent soul file and register in PAOS.

## Artifacts
- Plan: `memory/pm-logs/TASK-003-IMPLEMENTATION_PLAN.md`
- Tasks: `memory/pm-logs/TASK-003-TASKS.md`

## Steps (execute in order)

1. Create `agents/gemini/soul.md` — model on `agents/codex/soul.md`, adapt for Gemini identity
2. Create `agents/gemini.md` — model on `agents/codex.md`
3. Add `@gemini` line to `workflow.md` Section 6.2 after `@openclaw`
4. Log to `logs/gemini/events.md` + `logs/global_ledger.md`
5. Commit: `bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: TASK-003 create Gemini soul file"`

## Key Refs
- `agents/codex/soul.md` — structure template
- `GEMINI.md` (root) — Gemini-specific identity details
- `workflow.md` — where to add roster entry

## Constraints
- Do NOT modify `GEMINI.md` root file
- Follow Article III §3.1 structured log format exactly
