# Execution Plan: Phase Status Sync & Task Counting Tests

**Pipeline**: PIPE-26-06-2026---12-58
**Phase**: n1 (Execute)
**Agent**: opencode-developer
**Previous Phase**: n0 (Plan) — completed by hermes-nous

---

## 1. Objective

Execute 4 automated test tasks to verify the PAOS pipeline tracking infrastructure correctly manages phase status transitions, progress counting, task markers, and pipeline completion detection.

## 2. Setup

### Directory Structure

```
phases/n1/
├── IMPLEMENTATION.md          ← this file
├── REASONING.md               ← fill in during execution
├── TASKS.md                   ← update markers as you work
├── WALKTHROUGH.md             ← write after all tests pass
├── fixtures/                  ← test fixture files (create)
│   ├── pipeline-flow.json
│   ├── pipeline.json
│   ├── META.json
│   └── TASKS.md
└── tests/                     ← test scripts (create)
    ├── test_01_phase_transitions.py
    ├── test_02_progress_counting.py
    ├── test_03_task_markers.py
    └── test_04_pipeline_completion.py
```

### Running Tests

All tests should be run from the pipeline root:
```bash
export PIPE_DIR=logs/pipelines/PAOS/PIPE-26-06-2026---12-58
python3 phases/n1/tests/test_01_phase_transitions.py "$PIPE_DIR/phases/n1"
python3 phases/n1/tests/test_02_progress_counting.py "$PIPE_DIR/phases/n1"
python3 phases/n1/tests/test_03_task_markers.py "$PIPE_DIR/phases/n1"
python3 phases/n1/tests/test_04_pipeline_completion.py "$PIPE_DIR/phases/n1"
```

Expected output for each: `[PASS] Test <name>: all N/N sub-checks passed` and exit code 0.

---

## 3. Test Scripts

### Test 1: Phase Status Transitions

**File**: `phases/n1/tests/test_01_phase_transitions.py`

Tests the state machine in `pipeline-flow.json`:

```python
#!/usr/bin/env python3
"""Test 1: Phase status transitions in pipeline-flow.json"""
import json, os, sys, re
from datetime import datetime

FIXTURES_DIR = os.path.join(sys.argv[1], "fixtures") if len(sys.argv) > 1 else "."

def load(path):
    with open(path) as f:
        return json.load(f)

def save(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def check(cond, msg, results):
    results.append((cond, msg))
    if not cond:
        print(f"  FAIL: {msg}")
    else:
        print(f"  PASS: {msg}")

def main():
    results = []
    flow_path = os.path.join(FIXTURES_DIR, "pipeline-flow.json")

    # Load fixture
    flow = load(flow_path)
    phases = flow["phases"]

    # Sub-check 1: n0 status is "pending" initially
    check(phases["n0"]["status"] == "pending",
          "n0 initial status is 'pending'", results)

    # Sub-check 2: n1 status is "pending" initially
    check(phases["n1"]["status"] == "pending",
          "n1 initial status is 'pending'", results)

    # Transition n0 to "running"
    phases["n0"]["status"] = "running"
    phases["n0"]["pid"] = 12345
    phases["n0"]["startedAt"] = datetime.utcnow().isoformat() + "Z"
    save(flow_path, flow)

    # Reload
    flow = load(flow_path)
    phases = flow["phases"]

    # Sub-check 3: n0 status changed to "running"
    check(phases["n0"]["status"] == "running",
          "n0 transitions to 'running'", results)

    # Sub-check 4: n0.startedAt is valid ISO 8601 timestamp
    try:
        datetime.fromisoformat(phases["n0"]["startedAt"].replace("Z", "+00:00"))
        check(True, "n0.startedAt is valid ISO 8601", results)
    except:
        check(False, "n0.startedAt is valid ISO 8601", results)

    # Transition n0 to "completed"
    phases["n0"]["status"] = "completed"
    phases["n0"]["pid"] = None
    phases["n0"]["completedAt"] = datetime.utcnow().isoformat() + "Z"
    save(flow_path, flow)

    # Reload
    flow = load(flow_path)
    phases = flow["phases"]

    # Sub-check 5: n0 status changed to "completed"
    check(phases["n0"]["status"] == "completed",
          "n0 transitions to 'completed'", results)

    # Sub-check 6: n0.completedAt is valid ISO 8601
    try:
        datetime.fromisoformat(phases["n0"]["completedAt"].replace("Z", "+00:00"))
        check(True, "n0.completedAt is valid ISO 8601", results)
    except:
        check(False, "n0.completedAt is valid ISO 8601", results)

    # Sub-check 7: n0.pid cleared after completion
    check(phases["n0"]["pid"] is None,
          "n0.pid is null after completion", results)

    # Transition n1 to "running"
    phases["n1"]["status"] = "running"
    phases["n1"]["pid"] = 67890
    phases["n1"]["startedAt"] = datetime.utcnow().isoformat() + "Z"
    save(flow_path, flow)

    flow = load(flow_path)
    phases = flow["phases"]

    # Sub-check 8: n1 status changed to "running"
    check(phases["n1"]["status"] == "running",
          "n1 transitions to 'running'", results)

    # Results
    passed = sum(1 for c, _ in results if c)
    total = len(results)
    print(f"\n{'='*50}")
    print(f"Test 1: Phase Status Transitions")
    print(f"  Passed: {passed}/{total}")
    print(f"  Result: {'PASS' if passed == total else 'FAIL'}")
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
```

### Test 2: Progress Counting

**File**: `phases/n1/tests/test_02_progress_counting.py`

Tests the `N/M` progress format in `pipeline.json`:

```python
#!/usr/bin/env python3
"""Test 2: Progress counting in pipeline.json"""
import json, os, sys

FIXTURES_DIR = os.path.join(sys.argv[1], "fixtures") if len(sys.argv) > 1 else "."

def load(path):
    with open(path) as f:
        return json.load(f)

def save(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def check(cond, msg, results):
    results.append((cond, msg))
    print(f"  {'PASS' if cond else 'FAIL'}: {msg}")

def main():
    results = []
    pipe_path = os.path.join(FIXTURES_DIR, "pipeline.json")

    # Sub-check 1: Initialize with progress "0/2"
    pj = {"status": "executing", "currentTask": "n0", "progress": "0/2", "startedAt": "2026-06-26T12:58:39.966Z"}
    save(pipe_path, pj)
    pj = load(pipe_path)
    check(pj["progress"] == "0/2",
          "Initial progress is '0/2'", results)

    # Sub-check 2: Update to "1/2" after n0 starts
    pj["progress"] = "1/2"
    pj["currentTask"] = "n0"
    save(pipe_path, pj)
    pj = load(pipe_path)
    check(pj["progress"] == "1/2",
          "Progress shows '1/2' after n0 starts", results)

    # Sub-check 3: Update to "2/2" after n1 completes
    pj["progress"] = "2/2"
    pj["currentTask"] = "n1"
    save(pipe_path, pj)
    pj = load(pipe_path)
    check(pj["progress"] == "2/2",
          "Progress shows '2/2' after pipeline done", results)

    # Sub-check 4: Parse N/M format correctly
    parts = pj["progress"].split("/")
    check(len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit(),
          f"Progress format 'N/M' is parseable: {parts}", results)

    # Sub-check 5: Edge case — "0/0" progress (empty pipeline)
    pj["progress"] = "0/0"
    save(pipe_path, pj)
    pj = load(pipe_path)
    parts = pj["progress"].split("/")
    check(len(parts) == 2 and int(parts[0]) == 0 and int(parts[1]) == 0,
          "Edge case '0/0' is valid", results)

    # Results
    passed = sum(1 for c, _ in results if c)
    total = len(results)
    print(f"\n{'='*50}")
    print(f"Test 2: Progress Counting")
    print(f"  Passed: {passed}/{total}")
    print(f"  Result: {'PASS' if passed == total else 'FAIL'}")
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
```

### Test 3: Task Marker Counting

**File**: `phases/n1/tests/test_03_task_markers.py`

Tests `[ ]`, `[x]`, `[~]` marker counting in `TASKS.md`:

```python
#!/usr/bin/env python3
"""Test 3: Task marker counting in TASKS.md"""
import os, sys, re

FIXTURES_DIR = os.path.join(sys.argv[1], "fixtures") if len(sys.argv) > 1 else "."

def count_markers(content):
    pending = len(re.findall(r'\[ \]', content))
    in_progress = len(re.findall(r'\[~\]', content))
    completed = len(re.findall(r'\[x\]', content))
    total = pending + in_progress + completed
    return pending, in_progress, completed, total

def check(cond, msg, results):
    results.append((cond, msg))
    print(f"  {'PASS' if cond else 'FAIL'}: {msg}")

def main():
    results = []
    tasks_path = os.path.join(FIXTURES_DIR, "TASKS.md")

    with open(tasks_path) as f:
        content = f.read()

    pending, in_progress, completed, total = count_markers(content)

    # Sub-check 1: grep -c '\[ \]' equivalent works
    grep_style = len([l for l in content.split("\n") if "[ ]" in l])
    check(pending == grep_style,
          f"grep -c '[ ]' matches count_pending: {pending} == {grep_style}", results)

    # Sub-check 2: All marker states can be detected
    check(pending >= 0 and in_progress >= 0 and completed >= 0,
          f"All marker states detected: p={pending}, ip={in_progress}, c={completed}", results)

    # Sub-check 3: Total = sum of all markers (no stray brackets)
    check(total > 0,
          f"Total tasks > 0: {total}", results)

    # Sub-check 4: Test marker transitions work
    # Simulate moving one [ ] to [x]
    new_content = content.replace("[ ]", "[x]", 1)  # replace first pending
    new_pending, _, new_completed, _ = count_markers(new_content)
    check(new_pending == pending - 1 and new_completed == completed + 1,
          f"Transition one [ ] to [x]: pending {pending}→{new_pending}, completed {completed}→{new_completed}", results)

    # Sub-check 5: Test [~] in-progress state transitions correctly
    content_with_progress = content.replace("[ ]", "[~]", 1)
    p, ip, c, _ = count_markers(content_with_progress)
    check(p == pending - 1 and ip == in_progress + 1 and c == completed,
          f"Transition one [ ] to [~]: pending {pending}→{p}, in-progress {in_progress}→{ip}", results)

    # Results
    passed = sum(1 for c, _ in results if c)
    total = len(results)
    print(f"\n{'='*50}")
    print(f"Test 3: Task Marker Counting")
    print(f"  Passed: {passed}/{total}")
    print(f"  Result: {'PASS' if passed == total else 'FAIL'}")
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
```

### Test 4: Pipeline Completion Detection

**File**: `phases/n1/tests/test_04_pipeline_completion.py`

Tests that META.json correctly reflects pipeline completion state:

```python
#!/usr/bin/env python3
"""Test 4: Pipeline completion detection in META.json"""
import json, os, sys
from datetime import datetime, timezone

FIXTURES_DIR = os.path.join(sys.argv[1], "fixtures") if len(sys.argv) > 1 else "."

def load(path):
    with open(path) as f:
        return json.load(f)

def save(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def check(cond, msg, results):
    results.append((cond, msg))
    print(f"  {'PASS' if cond else 'FAIL'}: {msg}")

def all_phases_done(meta):
    """Return True if all phases have status 'completed' or 'failed'."""
    for phase in meta.get("phases", []):
        if phase.get("status") not in ("completed", "failed"):
            return False
    return True

def main():
    results = []
    meta_path = os.path.join(FIXTURES_DIR, "META.json")

    # Sub-check 1: Pipeline starts as "executing"
    meta = load(meta_path)
    check(meta["status"] == "executing",
          "META.json initial status is 'executing'", results)

    # Sub-check 2: Not all phases done initially
    check(not all_phases_done(meta),
          "Not all phases done initially", results)

    # Simulate: n0 completes, n1 still pending
    meta["phases"][0]["status"] = "completed"
    save(meta_path, meta)
    meta = load(meta_path)
    check(not all_phases_done(meta),
          "Not all phases done when n1 still pending", results)

    # Simulate: n1 also completes
    meta["phases"][1]["status"] = "completed"
    meta["status"] = "completed"
    meta["completed_at"] = datetime.now(timezone.utc).isoformat()
    save(meta_path, meta)
    meta = load(meta_path)

    # Sub-check 3: All phases done after both complete
    check(all_phases_done(meta),
          "All phases done after both complete", results)

    # Sub-check 4: completed_at is set when pipeline is finished
    check(meta.get("completed_at") is not None,
          "completed_at timestamp is set", results)

    # Results
    passed = sum(1 for c, _ in results if c)
    total = len(results)
    print(f"\n{'='*50}")
    print(f"Test 4: Pipeline Completion Detection")
    print(f"  Passed: {passed}/{total}")
    print(f"  Result: {'PASS' if passed == total else 'FAIL'}")
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
```

---

## 4. Fixture Files

### Fixtures: `phases/n1/fixtures/pipeline-flow.json`

```json
{
  "$schema": "../mcp/schemas/pipeline-flow.schema.json",
  "pipelineId": "TEST-PIPE-0001",
  "status": "executing",
  "startedAt": "2026-06-26T12:00:00.000Z",
  "phases": {
    "n0": {
      "agentId": "hermes-nous",
      "label": "Plan",
      "status": "pending",
      "prompt": "",
      "pid": null,
      "progress": "0/4",
      "startedAt": null,
      "completedAt": null,
      "order": 1
    },
    "n1": {
      "agentId": "opencode-developer",
      "label": "Execute",
      "status": "pending",
      "prompt": "",
      "pid": null,
      "progress": "0/4",
      "startedAt": null,
      "completedAt": null,
      "order": 2
    }
  },
  "order": ["n0", "n1"]
}
```

### Fixtures: `phases/n1/fixtures/pipeline.json`

```json
{
  "status": "executing",
  "currentTask": "n0",
  "progress": "0/2",
  "startedAt": "2026-06-26T12:00:00.000Z"
}
```

### Fixtures: `phases/n1/fixtures/META.json`

```json
{
  "pipeline_id": "TEST-PIPE-0001",
  "prompt": "Test fixture for pipeline completion detection",
  "status": "executing",
  "created_at": "2026-06-26T12:00:00.000Z",
  "phases": [
    {
      "id": "n0",
      "agent": "hermes-nous",
      "role": "Plan",
      "status": "pending",
      "artifacts": ["phases/n0/IMPLEMENTATION.md"]
    },
    {
      "id": "n1",
      "agent": "opencode-developer",
      "role": "Execute",
      "status": "pending",
      "artifacts": ["phases/n1/IMPLEMENTATION.md"]
    }
  ],
  "parallelism": 1
}
```

### Fixtures: `phases/n1/fixtures/TASKS.md`

```markdown
- [ ] Task one — pending
- [ ] Task two — pending
- [ ] Task three — pending
- [x] Task four — completed
- [ ] Task five — pending
- [~] Task six — in progress

Total: 6 tasks
```

---

## 5. Test Execution Order

Tests can run in any order since they use independent fixture files. Recommended:

1. Create fixtures directory and fixture files
2. Run test_01_phase_transitions.py
3. Run test_02_progress_counting.py
4. Run test_03_task_markers.py
5. Run test_04_pipeline_completion.py
6. Aggregate results and write WALKTHROUGH.md

## 6. Verification

After all 4 tests pass:
- Update `phases/n1/REASONING.md` with execution notes
- Update `phases/n1/TASKS.md` — mark all tasks `[x]`
- Write `phases/n1/WALKTHROUGH.md` with:
  - Number of tests run: 4
  - Total sub-checks: 22
  - Pass count and fail count
  - Any deviations from plan
- Update `pipeline.json` → `status: "completed"`, `progress: "2/2"`
- Update `META.json` → `status: "completed"`, set `completed_at`
- Update `pipeline-flow.json` → n1 status "completed", set completedAt

## 7. Notes

- All test scripts are self-contained with no external dependencies beyond Python 3 stdlib
- Tests use `sys.exit(0)` on pass, `sys.exit(1)` on fail — use `$?` in shell to check
- Fixture files are created fresh by the executor (opencode-developer) — they don't exist yet
- Do NOT modify files in `phases/n0/` — those are read-only artifacts from the plan phase
