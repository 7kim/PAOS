---
date: 2026-05-17
duration: long
agents: developer, architect, coordinator, profiler
focus: PAOS pipeline, infrastructure, agent config
---

# Chat 001 — PAOS Universal Pipeline

## Decisions
| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Created `@developer` as default agent | Need a dedicated executor — PM plans, architect reviews, developer builds |
| 2 | Overlaid `@plan` as Project Manager with PAOS prompt | Built-in `plan` mode gets PAOS pipeline via `prompt` field in opencode.json |
| 3 | `plan` mode set to `"all"` | Developer delegates to PM via `task(agent="plan",...)` |
| 4 | 3-tier inter-agent comms: shared context + task board + inbox | Enables async collaboration across agents |
| 5 | Per-project ledgers at `memory/projects/<name>/ledger.md` | Separate audit trail per project alongside agent logs + global ledger |
| 6 | MCP inbox: `send_message` + `read_inbox(agent="x")` | Explicit agent name passed as parameter (secure, no magic) |
| 7 | Chat summaries in vault | Restore context on new session without hallucination |

## Files Created
| File | Purpose |
|------|---------|
| `.opencode/agents/developer.md` | opencode agent def (mode: primary, default) |
| `agents/developer/soul.md` | PAOS soul — executor protocol |
| `logs/developer/events.md` | Per-agent audit log |
| `memory/shared/context.md` | Shared thinking (Tier A) |
| `memory/tasks/_template.md` | Task card YAML template (Tier B) |
| `memory/tasks/index.md` | Task registry |
| `memory/prompts/_template.md` | Handoff prompt template (PM → Developer) |
| `memory/prompts/index.md` | Prompt registry |
| `memory/inbox/{agent}/` | Per-agent inboxes (Tier C) |
| `memory/projects/{Tradingview,project-gemini,project-gpt}/ledger.md` | Per-project audit trails |
| `memory/projects/_template.md` | Project ledger template |
| `memory/projects/index.md` | Project ledger registry |
| `vault/chats/_template.md` | Chat summary template |

## Files Modified
| File | Change |
|------|--------|
| `config/opencode/opencode.json` | `default_agent: developer`, plan overlay as PM with PAOS prompt, `mode: all` |
| `workflow.md` | I1 expanded (4 roles), II.C named Developer, new VI.3/VI.4/VI.5, III.3 project-ledger |
| `agents/coordinator/soul.md` | Pipeline routing section added |
| `agents/architect/soul.md` | Handoff item added to review checklist |
| `.opencode/agents/coordinator.md` | Added developer, PM to roster |
| `.opencode/agents/architect.md` | `task: allow` so architect can update task cards |
| `user.md` | Added developer/PM to roster, default agent note |
| `AGENTS.md` | Added developer, PM to roster, updated workflow |
| `CLAUDE.md` | Pipeline diagram, shared resources updated |
| `vault/dashboard.md` | Pipeline diagram, project ledgers, shared context links |
| `mcp/shared-memory-server/index.js` | Added `send_message` + `read_inbox` tools (+40 lines) |

## Configs Validated
- `opencode.json` — fixed trailing comma (was breaking JSON parser, blocking `@developer`)
- Both configs (project + global) now parse clean

## Open Questions
- None — everything was built per plan with parallel architect+coordinator review model
