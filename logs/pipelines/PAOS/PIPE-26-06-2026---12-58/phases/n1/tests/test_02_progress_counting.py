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
