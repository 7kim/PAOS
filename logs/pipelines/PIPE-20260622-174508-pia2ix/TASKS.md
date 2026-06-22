# PAOS Commands — Task Breakdown

## Status Key
[ ] pending | [~] in progress | [x] done

## Tasks

### Task 1 — Create shared utility library
**File**: `bin/lib/h-common.sh` | **Complexity**: S | **Deps**: None
Bash library with PAOS_HOME detection, agent_name from git config/$PAOS_AGENT, ts() for ISO-8601 timestamp, info/warn/error color helpers, die() for fatal exit.

### Task 2 — Create h-help
**File**: `bin/h-help` | **Complexity**: S | **Deps**: Task 1
List all available /h-* commands. Read bin/h-* files, extract description from comment header.

### Task 3 — Create h-whoami
**File**: `bin/h-whoami` | **Complexity**: S | **Deps**: Task 1
Show agent identity: name, soul.md path, inbox path, git config, today's date.

### Task 4 — Create h-status
**File**: `bin/h-status` | **Complexity**: S | **Deps**: Task 1
Show recent ledger (last 10), shared context tail (last 20), active projects, today's date.

### Task 5 — Create h-inbox
**File**: `bin/h-inbox` | **Complexity**: S | **Deps**: Task 1
List messages in memory/inbox/<agent>/. Show sender, subject, timestamp. Count unread.

### Task 6 — Create h-daily
**File**: `bin/h-daily` | **Complexity**: S | **Deps**: Task 1
Read or create vault/daily/<YYYY-MM-DD>.md from template per §9.3.

### Task 7 — Create h-log
**File**: `bin/h-log` | **Complexity**: M | **Deps**: Task 1
Dual-log: append to memory/<agent>/events.md (§3.1) AND global_ledger.md (§3.2). Usage: h-log <action> <file> <description>

### Task 8 — Create h-context
**File**: `bin/h-context` | **Complexity**: M | **Deps**: Task 1
Append structured thinking entry to memory/shared/context.md per §6.4. Reads args or prompts interactively.

### Task 9 — Create h-task
**File**: `bin/h-task` | **Complexity**: M | **Deps**: Task 1
Subcommands: list, read <id>, create <title>. Task card management.

### Task 10 — Create h-pipeline
**File**: `bin/h-pipeline` | **Complexity**: M | **Deps**: Task 1
Wrapper around submit_pipeline. Subcommands: submit, list, status <id>.

### Task 11 — Create h-show-pipelines
**File**: `bin/h-show-pipelines` | **Complexity**: S | **Deps**: Task 1
List all pipelines at memory/pipelines/. Reads pipeline.json from each dir.

### Task 12 — Create h-execute-pipeline
**File**: `bin/h-execute-pipeline` | **Complexity**: M | **Deps**: Task 1
Execute a pipeline by ID or "all". Updates pipeline.json status, notifies executor inbox.

### Task 13 — Create h-write-handoff
**File**: `bin/h-write-handoff` | **Complexity**: M | **Deps**: Task 1
Rewrite memory/shared/HANDOFF.md. Preserves Active Projects, Key Decisions sections.

### Task 14 — Create h-commit
**File**: `bin/h-commit` | **Complexity**: M | **Deps**: Task 1
Git add -A + commit with Agent[<name>]: <description> format.

### Task 15 — Create h-sync
**File**: `bin/h-sync` | **Complexity**: S | **Deps**: Tasks 13, 14
End-of-session: write-handoff + commit + python3 bin/sync-chat.py.

### Task 16 — Create h-chat
**File**: `bin/h-chat` | **Complexity**: M | **Deps**: Task 1
Write chat summary to vault/chats/<YYYY-MM-DD>-<slug>.md per §9.4.

### Task 17 — Create h-audit
**File**: `bin/h-audit` | **Complexity**: S | **Deps**: Task 1
Check: dual-logging compliance, last commit time, HANDOFF.md freshness, stale inbox messages.

### Task 18 — Register OpenCode wrappers
**Files**: `config/opencode/commands/h-*.md` (16 files) | **Complexity**: M | **Deps**: Tasks 2-17
Create .md wrappers: description + "bin/h-<name> \$ARGUMENTS".

### Task 19 — Update agent documentation
**Files**: config/claude/CLAUDE.md, skills/INDEX.md, agent soul.md files | **Complexity**: S | **Deps**: Tasks 2-17
Add PAOS Commands section to INDEX.md and CLAUDE.md. Add Available Commands note to soul.md files.

## Key
- S: < 30 lines, M: 30-100 lines
- All in ~/AI_Workflow/bin/, chmod +x, source h-common.sh
