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
