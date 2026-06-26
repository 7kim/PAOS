# Implementation Plan: Phase Status Sync & Task Counting Tests

**Pipeline**: PIPE-26-06-2026---12-58
**Phase**: n0 (Plan) → n1 (Execute)
**Agents**: hermes-nous → opencode-developer
**Prompt**: Test that phase status sync and task counting work correctly

---

## 1. Objective

Verify that the PAOS pipeline tracking infrastructure correctly syncs phase status across all tracking files (`pipeline-flow.json`, `pipeline.json`, `META.json`, `TASKS.md`) and that task counting (progress `N/M` format, `[ ]`/`[x]` markers) is accurate at every stage of pipeline execution.

## 2. System Under Test

### Files That Manage Phase Status

| File | Role | Key Fields |
|------|------|------------|
| `pipeline-flow.json` | Detailed per-phase state machine | `phases.<id>.status` (pending/running/completed/failed), `pid`, `progress`, `completedAt` |
| `pipeline.json` | Simplified live progress dashboard | `status`, `currentTask`, `progress` (`"N/M"`) |
| `META.json` | Canonical pipeline record | `status` (executing/completed), `phases[].status`, `phases[].artifacts`, `completed_at` |
| `TASKS.md` | Human-readable task markers | `[ ]`/`[~]`/`[x]` markers |

### How They Interact

1. **Phase spawn** (`execute-flow/route.ts:273-274`): Sets `pipeline.json` to `{ progress: "0/N", currentTask: firstPhase, status: "executing" }`.
2. **Phase starts** (`execute-flow/route.ts:307-319`): Sets `pipeline-flow.json` phase → `"running"`, updates `pipeline.json` progress to `runningCount/N`.
3. **Phase completes** (`execute-flow/route.ts:326-368`): Sets phase → `"completed"`, updates `pipeline.json` progress to `completedCount/N`. If agent process exit code is non-zero, phase → `"failed"`.
4. **Cascade** (`execute-flow/route.ts:371-385`): Checks all predecessors completed before setting next phase to `"ready"`.
5. **Pipeline analytics** (`pipeline-analytics.ts:33`): Reads `META.json` for dashboard display.

## 3. Scope

### Files/Systems Affected

- `logs/pipelines/PAOS/PIPE-26-06-2026---12-58/` — pipeline artifacts (phases n0 and n1)
- `bin/h-pipeline` — test that status command reads correctly
- `dashboard/lib/pipeline-analytics.ts` — test that count logic works
- `dashboard/app/api/pipelines/[id]/route.ts` — test that live progress merge works

### What Will NOT Be Tested (Out of Scope)
- Browser/UI rendering of pipeline status
- Systemd path watcher (`paos-pipeline-handler.sh`) — uses `inotifywait`, hard to automate
- Queue mechanism (localhost:3333/api/queue) — optional infra

## 4. Technical Approach

### Phase n1: Test Scenarios (4 tasks)

**Task 1: Phase status transitions — `pipeline-flow.json`**
- Create a test script that simulates the state machine:
  1. Create `pipeline-flow.json` with n0 → `running`, n1 → `pending`
  2. Verify n0 status is "running" string
  3. Transition n0 → "completed"
  4. Verify n0.completedAt is set and is valid ISO timestamp
  5. Transition n1 → "running"
  6. Verify n1.startedAt is set
  7. Transition n1 → "completed"
  8. Verify both phases "completed"
  9. **Pass criteria**: All phase transitions result in correct string values and timestamps are valid ISO 8601

**Task 2: Progress counting — `pipeline.json`**
- Create a test script that:
  1. Start with `progress: "0/2"`
  2. Update to `progress: "1/2"` (n0 started)
  3. Update to `progress: "2/2"` (both done)
  4. Test edge case: `progress: "0/0"` (empty pipeline)
  5. Test edge case: `progress: "5/3"` (overflow — should flag error)
  6. **Pass criteria**: Every write-read cycle returns correct N/M strings, edge cases handled gracefully

**Task 3: Task marker counting — `TASKS.md`**
- Create a test script that:
  1. Parse `TASKS.md` for `[ ]` count = pending
  2. Parse for `[x]` count = completed
  3. Parse for `[~]` count = in-progress
  4. Verify `grep -c '\[ \]'` matches expected count (same logic as handler.sh:188-189)
  5. Verify marker auto-count against declared total
  6. **Pass criteria**: grep-based counting matches expected values, all three marker states detected

**Task 4: Pipeline completion detection — `META.json`**
- Create a test script that:
  1. Start with `status: "executing"`, all phases "pending"
  2. Update n0 to "completed" — overall status should remain "executing"
  3. Update all phases to "completed" — overall status should become "completed"
  4. Verify `completed_at` is set when all phases done
  5. **Pass criteria**: Completion is correctly inferred from all-phases-completed, edge case with no phases handled

### Test Rig

Each test task produces a standalone Python script that:
1. Reads the tracking files from the pipeline directory
2. Performs mutations
3. Asserts expected values
4. Writes a log file and exits with code 0 (pass) or 1 (fail)

Scripts live at: `phases/n1/tests/test_*.py`

### Scoring

| Task | Pass | Fail | Weight |
|------|------|------|--------|
| Task 1 — Phase status transitions | All 8 sub-checks pass | Any sub-check fails | 25% |
| Task 2 — Progress counting | All 5 sub-checks pass | Any sub-check fails | 25% |
| Task 3 — Task marker counting | All 5 sub-checks pass | Any sub-check fails | 25% |
| Task 4 — Pipeline completion | All 4 sub-checks pass | Any sub-check fails | 25% |

**Overall grade**: Pass if all 4 tasks pass (22/22 sub-checks).

## 5. Risks & Rollback

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tests modify real pipeline tracking files | Low | Medium | Tests operate on copies in `phases/n1/fixtures/`, not live files |
| `pipeline-flow.json` schema differs from expectation | Low | Medium | Read actual schema file at `mcp/schemas/pipeline-flow.schema.json` |
| Hardcoded paths in test scripts | Medium | Low | Use `sys.argv[1]` or `PAOS_HOME` env var — don't hardcode `/home/dev/` |
| Test scripts have side effects on running pipelines | Low | High | Never write to `memory/pipelines/` — only write to `phases/n1/fixtures/` |

**Rollback**: Simply delete the `phases/n1/fixtures/` directory if tests leave stale fixture files. No production data affected.

## 6. Design Rationale

### Why Python for tests?
- Already available in the environment (`python3`)
- Rich JSON support in standard library
- Zero dependencies needed
- Matches the coding style of existing pipeline infrastructure

### Why fixture-based (not mock)?
- Tests actual file I/O paths that the real pipeline uses
- More realistic test of the sync mechanism
- Fixtures clean up after themselves

### Why staged handoff?
- n0 produces the plan and artifacts
- n1 executes all 4 test tasks
- n1 aggregates results and writes final report
- Clean separation of concerns per PAOS pipeline architecture

### Test isolation
Each test task is independent — can run in any order. Tests use copies of tracking files to avoid corrupting live pipeline state. Test fixtures use a unique `TEST-*` prefix to avoid collisions.
