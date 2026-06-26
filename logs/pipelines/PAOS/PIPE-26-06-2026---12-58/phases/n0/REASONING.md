# Reasoning — Plan (n0)

## What I understand about this task

The pipeline prompt asks: **"Test that phase status sync and task counting work correctly."**

This is a meta-test — we're testing the pipeline infrastructure itself. The PAOS pipeline system has multiple tracking files that should stay in sync:
- `pipeline-flow.json` — detailed phase state machine
- `pipeline.json` — simplified dashboard progress
- `META.json` — canonical pipeline record
- `TASKS.md` — human-readable task markers

The system also has:
- `paos-pipeline-handler.sh` — auto-detects submitted pipelines (not tested — systemd/inotify dependent)
- `bin/h-pipeline status` — CLI status command
- `pipeline-analytics.ts` — reads META.json for dashboard

## Key decisions I made

1. **Test via Python scripts, not bash** — Python has `json` stdlib, no dependency risk, clearer assertions
2. **Fixture files, not mocks** — Test real file I/O with copies of tracking file schemas, not in-memory mocks
3. **4 standalone test tasks** — Each covers one concern (transitions, progress, markers, completion). Independence enables parallel execution
4. **Fail-fast assertions** — Each task exits immediately on first assertion failure, leaving a clear log
5. **Overall grade over percentage** — Since all tests are equal weight (25% each), a single pass/fail with sub-check counts is clearer

## Trade-offs considered

| Option | Pros | Cons | Chosen? |
|--------|------|------|---------|
| Single monolithic test | Fewer files | Hard to debug failures | No |
| 4 independent test scripts | Parallel, clear failure | More boilerplate | **Yes** |
| Test against live pipeline state | Most realistic | Risk of corruption | No |
| Test against fixture copies | Safe, isolated | Slightly less realistic | **Yes** |
| Use bash/grep for assertions | Zero setup | Hard to structure | No |
| Use Python for assertions | Clean assertions | Needs python3 (available) | **Yes** |

## Why this approach

1. **Read-only n0**: The plan phase creates the test design. No code changes to production files.
2. **Minimal dependencies**: Python stdlib only — `json`, `os`, `sys`, `datetime`.
3. **Clear handoff**: n1 knows exactly what to do — run 4 scripts, check exit codes, write report.
4. **PAOS protocol compliance**: Artifacts in `phases/n1/` with IMPLEMENTATION.md and TASKS.md as per META.json schema.

## What could go wrong

1. **`pipeline-flow.json` schema discrepancy**: The `$schema` field references `../mcp/schemas/pipeline-flow.schema.json` — if this file doesn't exist or differs, tests reading real files might fail. Mitigation: tests use their own fixture files matching the schema.
2. **Python not available in n1 environment**: Unlikely — n1 (opencode-developer) has it. Fallback: rewrite in bash.
3. **Race conditions in cascade logic**: The `execute-flow/route.ts:371-385` cascade checks predecessors. Our tests simulate this synchronously, so no actual race.
4. **grep -c edge cases**: `grep -c '\[ \]'` counts lines with unstruck tasks. If a task has `[x] completed [ ] wrong`, grep counts it. Our test handles this explicitly.
