# Reasoning — Execute (n1)

## What I understand about this task

Phase n0 (hermes-nous) completed the analysis of Coding-Principles.md and Coding-Principles-Benchmark.md, identified 10 fixed gaps and 7 remaining gaps from Benchmark 1. Now phase n1 (opencode-developer) must execute the full 110-question strict audit, scoring every question with concrete evidence.

## Execution Strategy

1. **Automated first, manual second** — Run bulk grep searches to collect evidence, then score each question using that evidence. Manual judgment for partial-credit decisions.
2. **Consistency with Benchmark 1** — Use the same scoring criteria. A "2" requires verifiable file:line evidence, not just "looks right."
3. **Be strict** — This is an exam, not a code review. Every `any` type is a point deduction. Every hardcoded path is a violation.

## Key Output

- Score and grade that can be directly compared with Benchmark 1 (67/100, C)
- Gap plans the user can trigger with "work on gap N"
- Audit artifacts at `benchmarks/Benchmark_2_<ts>/`

## What to Watch For

- The middleware.ts file packs 5 security features — verify they're all properly scoped
- similarity.ts is new since Benchmark 1 — verify it's used, not dead code
- 34 `any` types will heavily penalize Code Quality scores
- 10 hardcoded paths all have `process.env.* || "/home/dev/..."` pattern — verify they're configurable
