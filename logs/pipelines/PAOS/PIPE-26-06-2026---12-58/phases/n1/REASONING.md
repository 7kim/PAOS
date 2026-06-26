# Reasoning — Execute (n1)

## What I understand about this task
Execute 4 automated test tasks to verify the PAOS pipeline tracking infrastructure correctly manages phase status transitions, progress counting, task markers, and pipeline completion detection.

## Key decisions I made
- Used dedicated fixture files in `phases/n1/fixtures/` so tests don't mutate live pipeline tracking files
- All 4 test scripts are self-contained Python 3 stdlib — no external dependencies
- Tests use `sys.exit(0)` / `sys.exit(1)` for shell-verifiable pass/fail

## Trade-offs considered
- The deprecation warning for `datetime.utcnow()` in test_01 is cosmetic and doesn't affect correctness; left as-is to match the originally provided script verbatim
- Tests run sequentially because they share no fixture state conflicts (each test writes to its own fixtures subdirectory)

## Why this approach
- Isolated fixture files ensure tests are deterministic and don't interfere with each other
- Fixtures reset on each run since tests overwrite them
- Sub-check counting gives granular pass/fail visibility beyond a single binary result

## What could go wrong
- Fixture files could be accidentally committed to the live pipeline if paths get confused — the `fixtures/` prefix makes this unlikely
- Timezone handling in test 4 uses `timezone.utc` which is correct, but test 1 uses deprecated `utcnow()` — both produce valid ISO 8601 timestamps
