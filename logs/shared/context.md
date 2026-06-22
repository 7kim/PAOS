# Shared Context — AI Workflow

This is the append-only thinking context shared by all agents. Each agent writes a structured entry when they begin or end work.

**Format:**
```
## [YYYY-MM-DD HH:MM] @agent — Task: <task-id>
**Thinking**: <key ideas, decisions, rationale>
**Decisions Made**: <list>
**Handoff Notes**: <for next agent in pipeline>
```

---

## 2026-06-22 14:45 @hermes-nous — Task: PAOS-FRESH-START

**Thinking**: Created bin/init-paos.sh — a fresh-start initializer for PAOS. It clears all old memory, resets agent logs, creates a fresh .env from template (never keeps old secrets), installs deps, and prepares the system. Ran it live to reset this PAOS instance. Old session data, pipelines, inboxes, and chat history are all cleared. The only active project is PAOS itself.

**Decisions**:
- init-paos.sh always overwrites .env from template — no stale secrets kept
- Script moves SED_CMD detection to top so secrets section can use it
- Saved as `paos-fresh-start` skill for agent discoverability
- PAOS is now the sole active project (projects.md updated)

**Handoff Notes**: PAOS is fresh and clean. Next session starts with HANDOFF.md, global_ledger.md showing only the init entry, and an empty pipeline/task board. Focus is enhancing PAOS itself.

## INIT @paos-init — Task: PAOS-FRESH-START

**Thinking**: PAOS was freshly initialized via bin/init-paos.sh. All old session data has been cleared. The system is starting clean with only PAOS itself as the active project.

**Decisions**:
- All previous session data, ledger entries, task cards, pipelines, inbox messages, and event logs have been reset
- The only active project is PAOS itself — enhancing the PAOS framework
- See HANDOFF.md for the current state

**Handoff Notes**: Welcome to a fresh PAOS. Read HANDOFF.md first, then pick up where you like.
