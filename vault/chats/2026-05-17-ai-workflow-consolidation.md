---
date: 2026-05-17
agent: claude
focus: AI_Workflow hub consolidation — OpenCode, dashboard, vault enforcement, OpenClaw
---

# 2026-05-17 — AI Workflow Hub Consolidation

## Decisions

| # | Decision | Rationale |
| - | -------- | --------- |
| 1 | Renamed `mcpServers` → `mcp` in opencode.json with `type/enabled` fields | OpenCode v1.15.3 schema requires this format |
| 2 | Baked Antigravity Review Loop into OpenCode developer agent prompt | User wants PAOS to inherit artifact-driven review pattern without manual skill invocation |
| 3 | Created openclaw slot in config/, memory/inbox/, logs/ before install | Future-proof; avoids restructuring when OpenClaw arrives |
| 4 | Built Next.js dashboard at localhost:3333 not a generic port | Avoids conflict with common dev ports (3000, 8000) |
| 5 | Removed self-referential symlinks in config/claude/ (mcp.json, settings.json, projects/) | They caused ELOOP errors preventing Claude from reading its own config |
| 6 | Added Article IX (Obsidian Vault Protocol) to both workflow.md and knowledge/paos/constitution.md | Constitution had no vault mandate — agents were not writing to shared memory |
| 7 | Vault writes are now mandatory per H-Factor §I2 and §I3 — skipping is a protocol violation | User wants all agents sharing memory through Obsidian vault |

## Files Created

| File | Purpose |
| ---- | ------- |
| `dashboard/` (full Next.js app) | Orchestration UI — ledger, agents, tasks, plans, inbox, send messages |
| `dashboard/app/api/ledger/route.ts` | API: parse global_ledger.md → JSON |
| `dashboard/app/api/agents/route.ts` | API: agent status, inbox count, last activity |
| `dashboard/app/api/tasks/route.ts` | API: task cards from memory/tasks/ |
| `dashboard/app/api/inbox/route.ts` | API: read all agent inboxes |
| `dashboard/app/api/plans/route.ts` | API: IMPLEMENTATION_PLAN + TASKS + WALKTHROUGH from pm-logs/ |
| `dashboard/app/api/send-message/route.ts` | API: POST to send message to any agent inbox |
| `dashboard/app/api/overview/route.ts` | API: summary stats + recent ledger entries |
| `config/openclaw/README.md` | OpenClaw setup instructions for when it is installed |
| `memory/inbox/openclaw/` | OpenClaw inbox — ready for when it connects |
| `logs/openclaw/` | OpenClaw events log dir |
| `config/claude/mcp.json` | Real file replacing circular symlink — shared-memory + scaffold servers |
| `config/claude/settings.json` | Real file replacing circular symlink |
| `vault/chats/2026-05-17-ai-workflow-consolidation.md` | This file |

## Files Modified

| File | Change |
| ---- | ------ |
| `config/opencode/opencode.json` | Fixed mcp format, added env vars, added developer review loop prompt, added openclaw agent slot |
| `CLAUDE.md` | Added full active agent table, mandatory vault conventions (START/DURING/END), OpenClaw |
| `user.md` | Added OpenClaw to AI Tools and PAOS Preferences |
| `walkthrough.md` | Rewrote architecture tree to reflect current full structure |
| `workflow.md` | Added @openclaw invocation, added Article IX (Obsidian Vault Protocol) |
| `knowledge/paos/constitution.md` | Added Article IX (Obsidian Vault Protocol) |
| `vault/dashboard.md` | Added dashboard link, OpenClaw entries, full agent status table |
| `vault/daily/2026-05-17.md` | Filled in today's full activity |
| `agents/developer.md` | Added Article IX vault protocol (SESSION START/DURING/END) |
| `agents/developer/soul.md` | Added Article IX vault protocol |
| `agents/coordinator/soul.md` | Added Article IX vault protocol |
| `agents/architect/soul.md` | Added Article IX vault protocol |

## Open Questions

- OpenClaw: no install date known — slot is ready whenever it arrives
- Dashboard: no authentication — localhost only, acceptable for now
- Antigravity: still needs Article IX enforcement in its config (no vault protocol yet)
