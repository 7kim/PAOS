# Pipeline Tasks — PIPE-26-06-2026---12-48

> **Phase n1 (Execute) — Benchmark 2 Audit**
> Last updated: 2026-06-26T12:55:00Z

## Phase n1 — Execute

- `[ ]` Task 1 — Tooling setup: run initial grep evidence searches [S]
- `[ ]` Task 2 — Load and parse Coding-Principles-Benchmark.md v2.0 (110 questions) [M]
- `[ ]` Task 3 — Score all 110 questions with file:line evidence [XL]
- `[ ]` Task 4 — Calculate raw score, normalized %, and letter grade [S]
- `[ ]` Task 5 — Apply auto-penalty for ★ questions at score 0 [S]
- `[ ]` Task 6 — Generate gap implementation plans for each score < 2 [L]
- `[ ]` Task 7 — Write `full-audit.md` (110-question complete audit) [M]
- `[ ]` Task 8 — Write `SRS-as-is.md` (current system requirements) [M]
- `[ ]` Task 9 — Write `gaps/index.md` (aggregate gap register) [S]
- `[ ]` Task 10 — Write `gaps/gap-*.md` for each open gap [M]
- `[ ]` Task 11 — Write `README.md` (score card with summary) [S]
- `[ ]` Task 12 — Update pipeline tracking files (pipeline.json, META.json, root TASKS.md) [S]
- `[ ]` Task 13 — Write WALKTHROUGH.md for phase n1 [S]
- `[ ]` Task 14 — Commit all changes via shared-memory_agent_commit [S]

### Status Key
`[ ]` pending · `[~]` in progress · `[x]` completed

### Complexity
S = small (< 10 min) · M = medium (10-30 min) · L = large (30-60 min) · XL = extra large (60+ min)

### Dependencies
- Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Tasks 7-11 → Task 12 → Task 13 → Task 14
- Tasks 7-11 are independent (parallelizable after Task 6)
