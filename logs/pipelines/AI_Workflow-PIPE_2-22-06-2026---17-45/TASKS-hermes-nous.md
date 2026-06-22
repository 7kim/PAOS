# PAOS Commands — Task Breakdown (Hermes Enhancements)

> **Enhanced from**: TASKS.md by opencode-developer
> **Reviewer**: hermes-nous
> **Changes**: Merged pipeline tasks (10-12 → 10), added dashboard API hook

## Status Key
▢ pending · ◷ in progress · ✓ done

## Tasks (15 total)

[ ] Task 1 — Create shared utility library
**File**: `bin/lib/h-common.sh` | **Complexity**: S | **Deps**: None
Bash library with PAOS_HOME detection, agent_name, ts(), info/warn/error, die().

[ ] Task 2 — Create h-help
**File**: `bin/h-help` | **Complexity**: S | **Deps**: Task 1
List all 15 commands by scanning bin/h-*. Try curl localhost:3333/api/pipelines for live pipeline status.

[ ] Task 3 — Create h-whoami
**File**: `bin/h-whoami` | **Complexity**: S | **Deps**: Task 1
Show agent identity: name, soul.md, inbox path, git config.

[ ] Task 4 — Create h-status
**File**: `bin/h-status` | **Complexity**: S | **Deps**: Task 1
Show recent ledger (last 10), shared context tail, active projects.

[ ] Task 5 — Create h-inbox
**File**: `bin/h-inbox` | **Complexity**: S | **Deps**: Task 1
List messages in memory/inbox/<agent>/. Count unread.

[ ] Task 6 — Create h-daily
**File**: `bin/h-daily` | **Complexity**: S | **Deps**: Task 1
Read or create vault/daily/<YYYY-MM-DD>.md.

[ ] Task 7 — Create h-log
**File**: `bin/h-log` | **Complexity**: M | **Deps**: Task 1
Dual-log: events.md + global_ledger.md.

[ ] Task 8 — Create h-context
**File**: `bin/h-context` | **Complexity**: M | **Deps**: Task 1
Append to shared context.md.

[ ] Task 9 — Create h-task
**File**: `bin/h-task` | **Complexity**: M | **Deps**: Task 1
Subcommands: list, read <id>, create <title>.

[ ] Task 10 — Create h-pipeline (merged from 3 original tasks)
**File**: `bin/h-pipeline` | **Complexity**: L | **Deps**: Task 1
Subcommands:
- `submit`: Write PLAN.md, TASKS.md, META.json (with `phases[]` format). Auto-launch execution.
- `list`: Read all PIPE-* dirs, show status/progress from pipeline.json
- `execute <id>`: Call POST /api/pipelines/<id>/execute (the dashboard API). Falls back to direct pipeline.json update if API is unreachable.

[ ] Task 11 — Create h-write-handoff
**File**: `bin/h-write-handoff` | **Complexity**: M | **Deps**: Task 1
Rewrite HANDOFF.md preserving Active Projects and Key Decisions.

[ ] Task 12 — Create h-commit
**File**: `bin/h-commit` | **Complexity**: M | **Deps**: Task 1
Git add + commit with Agent[<name>]: format.

[ ] Task 13 — Create h-sync
**File**: `bin/h-sync` | **Complexity**: S | **Deps**: Tasks 11, 12
End-of-session: handoff + commit + sync-chat.py.

[ ] Task 14 — Create h-chat
**File**: `bin/h-chat` | **Complexity**: M | **Deps**: Task 1
Write chat summary to vault/chats/<date>-<slug>.md.

[ ] Task 15 — Create h-audit
**File**: `bin/h-audit` | **Complexity**: S | **Deps**: Task 1
Check: dual-logging, last commit, HANDOFF freshness, stale inbox.

[ ] Task 16 — Register OpenCode wrappers
**Files**: `config/opencode/commands/h-*.md` (15 files) | **Complexity**: M | **Deps**: Tasks 2-15
Create .md wrappers: description + "bin/h-<name> \$ARGUMENTS". Verify pipeline-execute and pipelines-view already exist in command/.

[ ] Task 17 — Update agent documentation
**Files**: config/claude/CLAUDE.md, skills/INDEX.md | **Complexity**: S | **Deps**: Tasks 2-15
Add PAOS Commands section. Document h-pipeline with its 3 subcommands.

## Key Changes from Original
- **Tasks 10-12 merged** → single `h-pipeline` with subcommands (3 fewer scripts)
- **Task 10** calls dashboard API for `execute` instead of direct file writes
- **Task 10** uses new `phases[]` format in META.json on submit
- **Task 2** (h-help) optionally shows live pipeline status from dashboard API
