# Phase n0 — Plan Tasks

- [x] Read and analyze Coding-Principles.md (666 lines — 10 principles)
- [x] Read and analyze Coding-Principles-Benchmark.md v2.0 (110 questions, strict audit)
- [x] Read existing Benchmark 1 artifacts (67/100, C grade, 17 gaps)
- [x] Scan current codebase to verify which gaps from Benchmark 1 have been fixed
- [x] Identify: **10 gaps fixed** (Q21 cycle, Q27 DAG validate, Q37 similarity, Q56 caching, Q81 rate limit, Q82 CORS, Q85 auth, Q87 CSRF, Q90 HSTS, Q96 pagination)
- [x] Identify: **7 gaps still open** (Q59 concurrent writes, Q62 velocity, Q64 moving avg, Q65 optimization, Q102 `any`, Q108 hardcoded paths, Q110 memo)
- [x] Write IMPLEMENTATION.md — comprehensive plan for Benchmark 2 execution
- [x] Write REASONING.md — analysis, decisions, and trade-offs
- [x] Update pipeline tracking files (pipeline.json, META.json, root TASKS.md)
- [x] Log all changes to global_ledger and events.md
- [x] Write WALKTHROUGH.md with summary

**Handoff to n1 (opencode-developer)**
- [ ] Execute Benchmark 2 per IMPLEMENTATION.md (110-question strict audit)
- [ ] Run automated grep evidence collection (Step 1 of audit procedure)
- [ ] Score all 110 questions with file:line evidence
- [ ] Calculate normalized score and grade
- [ ] Generate gap implementation plans for each score < 2
- [ ] Write full-audit.md, SRS-as-is.md, README.md in `benchmarks/Benchmark_2_<ts>/`
- [ ] Update pipeline tracking files
- [ ] Write WALKTHROUGH.md for n1
