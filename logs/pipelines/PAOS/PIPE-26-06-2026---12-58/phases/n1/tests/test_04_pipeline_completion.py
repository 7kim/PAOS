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
