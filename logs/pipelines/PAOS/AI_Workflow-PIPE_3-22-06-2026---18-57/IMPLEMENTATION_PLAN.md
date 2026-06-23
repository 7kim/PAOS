# Implementation Plan: Real-time Cross-Agent Execution

## Objective

Enable real-time cross-agent execution in PAOS: when Hermes (or any agent) submits a pipeline, the executor agent is automatically notified and optionally spawned — without Kafka, without a custom daemon, and with security guardrails.

## Scope

### Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `~/.config/systemd/user/paos-pipeline.path` | systemd path unit — watches `memory/pipelines/*/pipeline.json` for changes |
| 2 | `~/.config/systemd/user/paos-pipeline.service` | systemd service — triggered by .path, runs handler script |
| 3 | `bin/paos-pipeline-handler.sh` | Bash script: routing, guardrails, logging, execution dispatch |
| 4 | `bin/paos-pipeline-watch.sh` | Fallback inotifywait loop for containers/WSL |

### Files to Modify

| # | File | Change |
|---|------|--------|
| 5 | Hermes config | If Hermes polls dashboard, add check for new pipelines (optional enhancement) |

### Files Affected (indirectly)

- `memory/pipelines/<id>/pipeline.json` — handler updates status during execution
- `memory/global_ledger.md` — handler logs every auto-execution
- `memory/inbox/<executor>/` — handler writes notification messages

## Technical Approach

### Architecture

```
Filesystem event (pipeline.json written)
    │
    ▼
systemd paos-pipeline.path (PathChanged)
    │
    ▼
systemd paos-pipeline.service
    │
    ▼
bin/paos-pipeline-handler.sh
    ├── 1. Read pipeline.json + META.json
    ├── 2. Check guardrails (lock, rate limit, whitelist)
    ├── 3. Determine executor from META.json phases
    ├── 4. Write notification to executor inbox
    ├── 5. Log to global_ledger.md
    ├── 6. If auto-execute enabled: spawn executor
    └── 7. Update pipeline.json status
```

### Guardrails

1. **Lock file**: `/tmp/paos-pipeline.lock` — prevents concurrent handler execution
2. **Rate limit**: `/tmp/paos-pipeline-ratelimit` — max 1 auto-execution per 300s per executor
3. **Whitelist**: `~/.config/paos/pipeline-whitelist.txt` — only auto-execute pipelines from listed planner agents
4. **Task count check**: If pipeline has > 20 tasks, skip auto-execution (require manual)
5. **Timeout**: Handler has 30s max; spawned execution has 30m max
6. **Kill switch**: `~/.config/paos/auto-execute.off` — if exists, skip auto-execution
7. **Logging**: Every action goes to `global_ledger.md`

### systemd Unit Design

```ini
# paos-pipeline.path
[Unit]
Description=Watch PAOS pipeline submissions
[Path]
PathChanged=/home/dev/AI_Workflow/memory/pipelines
Unit=paos-pipeline.service
[Install]
WantedBy=default.target
```

`PathChanged` fires when a file is **closed after write** — avoids race conditions from partial writes. Watching the `pipelines/` directory catches new pipeline directories and updates to existing `pipeline.json` files.

### Handler Script Flow

1. Acquire lock (`flock /tmp/paos-pipeline.lock`)
2. Scan `memory/pipelines/*/pipeline.json` for entries with `status: "submitted"` or `status: "executing"` (new submissions)
3. For each new submission:
   a. Read META.json → find the current pending phase's agent
   b. Check whitelist (planner must be in whitelist)
   c. Check rate limit (last execution for this agent > 300s ago)
   d. Check kill switch
   e. Check task count
   f. Write notification to executor inbox (sender, subject, pipeline ID)
   g. Append to global_ledger.md
   h. If auto-execute allowed: spawn `opencode run` or `claude --execute`
   i. Update pipeline.json status
4. Release lock

### Fallback (no systemd)

`bin/paos-pipeline-watch.sh` — simple inotifywait loop:
```bash
while inotifywait -e close_write -r "$PAOS_HOME/memory/pipelines/"; do
    bin/paos-pipeline-handler.sh
done
```

### Notification Format

When handler detects a new pipeline, it writes to the executor's inbox:
```
---
from: paos-auto-executor
to: <executor>
subject: Pipeline Execution: <PIPE-ID>
priority: normal
timestamp: <ISO-8601>
pipeline_id: <PIPE-ID>
---

# Auto-Triggered Pipeline: <PIPE-ID>

Pipeline <PIPE-ID> was auto-detected. Read memory/pipelines/<PIPE-ID>/PLAN.md and TASKS.md to start working.
```

## Tasks

See TASKS.md for the numbered task breakdown.

## Risks and Rollback

| Risk | Mitigation |
|------|-----------|
| systemd not available (container/WSL) | Fallback inotifywait script provided |
| systemd path unit fires on partial write | Use `PathChanged` not `PathModified` — fires after close |
| Handler crashes mid-execution | Lock file auto-releases on process exit |
| Auto-execution spawns too many processes | Rate limit + lock file prevents concurrent runs |
| User doesn't want auto-execution | Kill switch file disables all auto-execution |

**Rollback**: `systemctl --user stop paos-pipeline.path` to disable. Delete the .path and .service files to remove. `killall inotifywait` for fallback.

## Design Rationale

1. **systemd over Hermes polling**: Systemd is instant (kernel event), zero-poll, zero-resource when idle. Hermes polling would consume CPU every 5s.
2. **Handler script over inline service**: Systemd `.service` can only run one command. Putting logic in a bash script keeps it maintainable and testable independently of systemd.
3. **PathChanged over PathModified**: `PathModified` fires during writes (partial data). `PathChanged` fires after close (complete data).
4. **Lock file over systemd's DefaultDependencies**: Lock is simpler to understand and debug. `flock` is atomic on Linux.
5. **Guardrails in the script, not systemd**: Systemd has no concept of "only if planner is whitelisted." Keeping logic in bash makes it flexible.
6. **Inotifywait fallback**: Handles the common non-systemd cases (Docker, WSL) without adding dependencies.
