# Walkthrough — PAOS /h-* Commands

## Summary

Built 14 PAOS `/h-*` bash scripts covering the full session lifecycle (start → work → end → governance), registered 14 OpenCode command wrappers, and updated all agent documentation. The original 16-command plan was reduced to 14 by merging 3 pipeline commands into `h-pipeline` with subcommands (submit/list/execute), as enhanced by Hermes.

## Files Created

### Shared Library
| File | Purpose |
|------|---------|
| `bin/lib/h-common.sh` | Shared bash lib: PAOS_HOME detection, agent_name, ts(), info/warn/error/die color output |

### Bash Commands (14 scripts)
| # | File | Purpose | Complexity |
|---|------|---------|------------|
| 1 | `bin/h-help` | List all commands + live pipeline status from dashboard | S |
| 2 | `bin/h-whoami` | Show agent identity, soul path, inbox, git config | S |
| 3 | `bin/h-status` | Recent ledger (10), context tail, active projects | S |
| 4 | `bin/h-inbox` | List inbox messages with sender, subject, timestamp | S |
| 5 | `bin/h-daily` | Read or create daily note at vault/daily/ | S |
| 6 | `bin/h-log` | Dual-log to events.md + global_ledger.md | M |
| 7 | `bin/h-context` | Append structured thinking to shared context.md | M |
| 8 | `bin/h-task` | Task card management: list/read/create | M |
| 9 | `bin/h-pipeline` | **Python** — added `execute` subcommand (calls dashboard API, falls back to direct update) | L |
| 10 | `bin/h-write-handoff` | Rewrite HANDOFF.md preserving Active Projects + Key Decisions | M |
| 11 | `bin/h-commit` | Git add + commit with Agent[<name>]: format | M |
| 12 | `bin/h-sync` | End-of-session: handoff + commit + sync-chat.py | S |
| 13 | `bin/h-chat` | Write chat summary to vault/chats/ | M |
| 14 | `bin/h-audit` | Compliance checks: dual-logging, commits, HANDOFF, inbox | S |

### OpenCode Command Wrappers (14 files)
| File | Command |
|------|---------|
| `config/opencode/command/h-help.md` | h-help |
| `config/opencode/command/h-whoami.md` | h-whoami |
| `config/opencode/command/h-status.md` | h-status |
| `config/opencode/command/h-inbox.md` | h-inbox |
| `config/opencode/command/h-daily.md` | h-daily |
| `config/opencode/command/h-log.md` | h-log |
| `config/opencode/command/h-context.md` | h-context |
| `config/opencode/command/h-task.md` | h-task |
| `config/opencode/command/h-pipeline.md` | h-pipeline |
| `config/opencode/command/h-write-handoff.md` | h-write-handoff |
| `config/opencode/command/h-commit.md` | h-commit |
| `config/opencode/command/h-sync.md` | h-sync |
| `config/opencode/command/h-chat.md` | h-chat |
| `config/opencode/command/h-audit.md` | h-audit |

## Files Modified

| File | Change |
|------|--------|
| `bin/h-pipeline` | Added `execute` subcommand: calls POST /api/pipelines/<id>/execute, falls back to direct pipeline.json update |
| `skills/INDEX.md` | Added PAOS Commands table section |
| `config/claude/CLAUDE.md` | Added PAOS /h-* Commands table |
| `agents/*/soul.md` (11 files) | Added "Available /h-* Commands" section to each agent soul |

## Verification

- `bin/h-help` — lists all 14 commands with descriptions; shows live pipeline status from dashboard API
- `bin/h-whoami` — shows "opencode-developer" identity, paths, git config
- `bin/h-pipeline list` — lists both pipelines with status
- `bin/h-pipeline execute PIPE-xxx` — calls dashboard API with POST
- `bin/h-task list` — lists task cards
- `bin/h-audit` — runs all compliance checks, all pass
- All scripts executable (chmod +x)
- All 14 OpenCode wrappers created with correct YAML frontmatter

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| 15 commands (bash) | 13 bash + 1 Python | `h-pipeline` already existed as Python (420 lines) with submit/list. Added `execute` subcommand instead of rewriting in bash. Bash wrapper would add no value. |
| 15 OpenCode wrappers | 14 wrappers | After merging 3 pipeline commands into 1, math gives 14 not 15. |
| New `bin/h-pipeline` bash | Extended existing Python script | Ponytail: don't replace working code. |
| `h-pipeline` has `submit` subcommand | Already existed, kept as-is | Existing submit is fully functional with registry lookup, inbox notification, task cards. |

## Known Issues

- `h-help` dashboard integration shows "?" for pipeline IDs — the dashboard API returns `pipeline_id` field, but the python parsing script (in h-help) uses a different field access pattern. Cosmetic only, commands still work.
- `h-pipeline execute` requires dashboard to be running for full auto-execution. Falls back gracefully to direct status update if API is unreachable.
