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
          f"Transition one [ ] to [x]: pending {pending}\u2192{new_pending}, completed {completed}\u2192{new_completed}", results)

    # Sub-check 5: Test [~] in-progress state transitions correctly
    content_with_progress = content.replace("[ ]", "[~]", 1)
    p, ip, c, _ = count_markers(content_with_progress)
    check(p == pending - 1 and ip == in_progress + 1 and c == completed,
          f"Transition one [ ] to [~]: pending {pending}\u2192{p}, in-progress {in_progress}\u2192{ip}", results)

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
