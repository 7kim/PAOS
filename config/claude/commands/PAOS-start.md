---
description: Start a PAOS session — reads HANDOFF, ledger, and claude inbox, then surfaces active work and blockers.
---

You are starting a PAOS session. Execute the following steps in order:

## Step 1 — Read HANDOFF (sequential, always first)

Read the file at `~/AI_Workflow/vault/memory/shared/HANDOFF.md` in full.

## Step 2 — Load shared state (run in parallel)

Call both MCP tools at the same time:
- `shared-memory: read_ledger` — last 20 rows
- `shared-memory: read_inbox` — agent="claude"

## Step 3 — Synthesize and report

Print a structured session brief in this format:

```
## PAOS Session Active — <date>

### In Progress
<list any tasks or work marked in-progress from HANDOFF or ledger>

### Blocked / Needs Attention
<anything flagged as blocked, waiting, or requiring user input>

### Inbox (claude)
<messages from other agents, or "empty">

### Last 5 Ledger Entries
<last 5 rows from the ledger>

### Ready
Session loaded. What are we working on?
```

## Ongoing session rules (remind yourself)

From this point forward in the session:
- Call `shared-memory: append_ledger` after every significant action
- Call `shared-memory: write_context` after any key decision
- Write to `~/AI_Workflow/vault/memory/claude/events.md` for significant events (Article III §3.1 format)
- On session end: rewrite HANDOFF.md, append ledger summary, run `~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: <description>"`
- Never use plain `git commit` — always `agent-commit.sh`
