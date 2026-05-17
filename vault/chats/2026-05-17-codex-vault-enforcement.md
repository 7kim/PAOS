---
date: 2026-05-17
agent: claude
focus: Article IX vault enforcement across all agents + Codex installation and PAOS integration
---

# 2026-05-17 — Codex Installation & Full Vault Enforcement

## Decisions

| # | Decision | Rationale |
| - | -------- | --------- |
| 1 | Created user-level `config/claude/CLAUDE.md` (= `~/.claude/CLAUDE.md`) with Article IX | Applies vault protocol globally to every Claude session, not just AI_Workflow project |
| 2 | Propagated Article IX to all 4 OpenCode agent soul files (developer, coordinator, architect + their soul.md) | All agents in the PAOS now have mandatory vault START/DURING/END protocol |
| 3 | Installed Codex CLI v0.130.0 at `~/.local/bin/codex` | Permission issues with global npm install; user-local prefix works without sudo |
| 4 | Symlinked `~/.codex` → `AI_Workflow/config/codex/` | Follows same pattern as all other agents (`.claude` → `config/claude/`, etc.) |
| 5 | Created `config/codex/instructions.md` as Codex's CLAUDE.md equivalent | Codex reads `~/.codex/instructions.md` as its persistent system prompt |
| 6 | Created full Codex soul: `agents/codex.md` + `agents/codex/soul.md` with Article IX | Codex is now a first-class PAOS agent with vault enforcement |
| 7 | Added Codex to dashboard agents API with color `#10b981` | Codex now visible in orchestration dashboard alongside all other agents |
| 8 | Symlinked Claude auto-memory at `memory/claude/auto-memory/` → `config/claude/projects/-home-dev/memory/` | Makes Claude's MEMORY.md visible in the main memory tree |

## Files Created

| File | Purpose |
| ---- | ------- |
| `config/claude/CLAUDE.md` | User-level Claude Code config — Article IX vault protocol, agent roster, all session rules |
| `config/codex/instructions.md` | Codex persistent system prompt — PAOS identity, H-Factor invariants, Article IX |
| `config/codex/config.yaml` | Codex CLI settings (model: o4-mini, approval-mode: suggest) |
| `agents/codex.md` | Codex agent descriptor for PAOS pipeline |
| `agents/codex/soul.md` | Codex soul — identity, capabilities, pipeline, H-Factor binding, Article IX |
| `logs/codex/events.md` | Codex events log (accessible via vault/memory/codex/events.md) |

## Files Modified

| File | Change |
| ---- | ------ |
| `agents/developer.md` | Added Article IX vault protocol |
| `agents/developer/soul.md` | Added Article IX vault protocol |
| `agents/coordinator/soul.md` | Added Article IX vault protocol |
| `agents/architect/soul.md` | Added Article IX vault protocol |
| `CLAUDE.md` | Added Codex to agent table, updated inbox column, updated I3 agent list |
| `dashboard/app/api/agents/route.ts` | Added Codex agent with color #10b981 |

## Open Questions

- Codex requires `OPENAI_API_KEY` env var to run — user needs to set this in shell or `config/codex/config.yaml`
- Antigravity: still no vault protocol in its config (VS Code extension, limited configurability)
- Codex approval-mode is set to `suggest` — user may want `auto-edit` or `full-auto` for autonomous work
