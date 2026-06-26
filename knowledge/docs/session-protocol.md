---
title: "PAOS Session Protocol v3.0.0"
description: "Canonical session start/end protocol for all PAOS agents — Article IX compliance, HANDOFF, logging, and commit rules"
tags:
  - paos
  - protocol
related:
  - "[[_agent-conventions]]"
  - "[[notes]]"
  - "[[user-questions]]"
status: active
version: 3.0.0
---

# PAOS Session Protocol v3.0.0

> Single source of truth for Article IX compliance across all agents.
> Agent-specific identity and capabilities live in each agent's `soul.md` (see [[_agent-conventions]] for vault standards).

---

## SESSION START — 3 steps

**Step 1 — Read HANDOFF** (always first)
```
~/AI_Workflow/vault/memory/shared/HANDOFF.md
```
Live state document. What the last agent stopped at, what's in-progress, what's blocked.

**Step 2 — Load shared state** (call in parallel)
```
shared-memory: read_ledger    → last 20 rows of global_ledger.md
shared-memory: read_inbox     → agent="<your-agent-id>"
```
If MCP unavailable, read directly:
- `vault/memory/global_ledger.md` (last 20 rows)
- `vault/memory/inbox/<your-agent-id>/`

**Step 3 — Start working**
Synthesize HANDOFF + ledger. If anything is in-progress or blocked, surface it to the operator before proceeding.

---

## PROJECT START — when opening a specific project

After session start, if working inside a project directory:

1. Read `<project>/[[notes|notes.md]]` → execute each item → call `shared-memory: process_notes`
2. Read `<project>/[[user-questions|user-questions.md]]` → answer each question → call `shared-memory: process_questions`
   - For AI_Workflow hub: use `knowledge/docs/[[notes]]` and `knowledge/docs/[[user-questions]]`
   - Unanswerable: leave with `<!-- TODO: needs investigation -->`

---

## DURING WORK — logging

After every significant action:
```
shared-memory: append_ledger
```
- Action, File, Description columns are required
- Task column: use task ID (e.g. `TASK-003`) — never `-` for real work entries

After any key decision or plan change:
```
shared-memory: write_context
```

Also append to `vault/memory/<agent-id>/events.md` (Article III §3.1 format):
```
[TIMESTAMP] | AGENT: <id> | ACTION: <Read|Write|Exec|Edit|Test>
THINKING: "<why this approach>"
EXECUTION: "<what was done>"
IMPACT: "<what changed, which files>"
```

---

## SESSION END — 2 steps

**Step 1 — Rewrite HANDOFF** (most critical)
```
~/AI_Workflow/vault/memory/shared/HANDOFF.md
```
Update: Last Agent, Active Task, What Was Just Done, What Is NOT Done Yet. Keep under 60 lines.

**Step 2 — Log + commit**
```
shared-memory: append_ledger   → one summary row for the session
```
Then commit:
```bash
~/AI_Workflow/bin/agent-commit.sh <agent-id> "Agent[<agent-id>]: <present-tense description>"
```

---

## Ledger Row Rules

Format: `| Timestamp (UTC) | Agent | Action | File | Description | Task | Commit |`

- `Action` = short uppercase: `READ`, `WRITE`, `EXEC`, `EDIT`, `REVIEW`, `INSTALL`, `FIX`
- `Task` = task ID for real work, `-` only for admin/meta entries
- `Commit` = git short SHA — fill in after committing
- **Do NOT log** `START`, `END`, or session lifecycle noise — those belong in events.md only

---

*PAOS Session Protocol v3.0.0 — Last updated: 2026-05-21 by claude.*
*Amendment requires: proposal + Architect PASS review + ledger entry per Article VII.*
