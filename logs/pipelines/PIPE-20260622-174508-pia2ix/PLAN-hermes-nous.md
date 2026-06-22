# PAOS Commands — Implementation Plan (Hermes Enhancements)

> **Enhancement of**: PLAN.md by opencode-developer
> **Reviewer**: hermes-nous
> **Enhancements**: Pipeline integration, dashboard updates, execution hook

## Changes from Original Plan

### 1. Merge Pipeline Tasks (10-12 → 10)
The original has 3 separate tasks for pipeline commands (`h-pipeline`, `h-show-pipelines`, `h-execute-pipeline`). Merge into one `h-pipeline` with subcommands:
```
h-pipeline submit    — submit plan+task (calls submit_pipeline)
h-pipeline list      — list all pipelines (was h-show-pipelines)
h-pipeline execute   — execute a pipeline (was h-execute-pipeline)
```

This reduces 3 scripts to 1, following ponytail philosophy.

### 2. h-execute-pipeline Should Hit the Dashboard API
Instead of directly updating pipeline.json, `h-pipeline execute <id>` should:
1. Call `POST /api/pipelines/<id>/execute` (the dashboard API we built)
2. The API spawns `opencode run` in background
3. This keeps the pipeline execution logic centralized

### 3. h-pipeline submit Should Use New phases[] Format
When submitting a pipeline, `h-pipeline submit` should create META.json with the `phases` array format (not the legacy planner/executor fields):
```json
{
  "phases": [
    {"agent": "<agent>", "role": "planner", "label": "Plan", "status": "completed", "artifacts": ["PLAN.md", "TASKS.md"]},
    {"agent": "<executor>", "role": "executor", "label": "Execute", "status": "submitted", "artifacts": []}
  ]
}
```

### 4. h-help Should List Commands via Dashboard API
`h-help` should attempt `curl -s http://localhost:3333/api/pipelines` (if dashboard is running) and show pipeline status, falling back to `ls bin/h-*` if dashboard is not available.

### 5. OpenCode Wrappers — Add pipeline-execute
In addition to the 16 `h-*` wrappers, create:
- `config/opencode/command/pipeline-execute.md` — already exists ✅
- `config/opencode/command/pipelines-view.md` — already exists ✅

No new wrappers needed beyond the ones planned.

## Updated Build Order

1. **Infrastructure**: `h-common.sh`, `h-help`, `h-whoami`
2. **Session start**: `h-status`, `h-inbox`, `h-daily`  
3. **During work**: `h-log`, `h-context`, `h-task`, `h-pipeline` (merged, with submit/list/execute subcommands)
4. **Session end**: `h-write-handoff`, `h-commit`, `h-sync`, `h-chat`
5. **Governance**: `h-audit`
6. **Registration**: OpenCode wrappers, documentation updates

## Total Tasks: 15 (reduced from 17 by merging pipeline commands)

## Deliverable Verification
After implementation, verify:
- `bin/h-pipeline list` returns the active pipelines with correct status
- `bin/h-pipeline execute PIPE-xxx` triggers opencode and updates pipeline.json
- `bin/h-help` shows all 15 commands
- OpenCode `/pipelines-view` and `/pipeline-execute` still work
