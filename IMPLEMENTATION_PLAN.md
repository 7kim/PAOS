# Implementation Plan — Benchmark 2 Audit Execution

**Pipeline**: PIPE-26-06-2026---12-48
**Phase**: n1 (Execute)
**Agent**: opencode-developer
**Handoff from**: hermes-nous (phase n0)

---

## Objective

Execute the full 110-question strict audit (`Coding-Principles-Benchmark.md` v2.0) against the PAOS AI_Workflow codebase. Score each question with concrete file:line evidence, calculate normalized score and grade, and generate gap implementation plans for every score < 2.

## Scope

### Files Affected (Read)
- `Coding-Principles-Benchmark.md` v2.0 — source benchmark (110 questions)
- Entire `dashboard/`, `bin/`, `memory/`, `config/`, `agents/`, `docs/` trees — codebase under audit

### Files Created (Write)
All output written to `benchmarks/Benchmark_2_<YYYY-MM-DD---HH-MM>/`:
- `README.md` — Score summary card (score, grade, comparison to Benchmark 1)
- `full-audit.md` — Complete 110-question audit with evidence per question
- `SRS-as-is.md` — Current system requirements extracted from codebase
- `gaps/index.md` — Aggregate gap register with severity
- `gaps/gap-N-<title>.md` — Individual gap implementation plans

### Files Modified (Update)
- `logs/pipelines/PAOS/PIPE-26-06-2026---12-48/phases/n1/TASKS.md` — real-time status
- `logs/pipelines/PAOS/PIPE-26-06-2026---12-48/TASKS.md` — top-level status
- `logs/pipelines/PAOS/PIPE-26-06-2026---12-48/pipeline.json` — progress
- `logs/pipelines/PAOS/PIPE-26-06-2026---12-48/META.json` — completion
- `logs/pipelines/PAOS/PIPE-26-06-2026---12-48/phases/n1/WALKTHROUGH.md` — n1 summary
- `memory/global_ledger.md` — audit log
- `memory/shared/context.md` — shared state
- `memory/shared/HANDOFF.md` — handoff

## Technical Approach

### Step 1 — Tooling Setup
Run breadth-first grep evidence searches across codebase. Results cached for reference scoring.

### Step 2 — Question Scoring (110 questions)
Parse benchmark into in-memory Q&A table. For each question:
1. Read the `Check` column (automated grep command or manual check)
2. Execute search against the codebase
3. Assign score: **2** = strong evidence found, **1** = partial/weak evidence, **0** = not found / violated
4. Record evidence with `file:line` references

### Step 3 — Grade Calculation
```
raw_score = sum(all 110 scores)
max_score = 110 × 2 = 220
normalized = round((raw_score / 220) × 100)
grade_letter:
  normalized >= 90 → A
  normalized >= 75 → B
  normalized >= 50 → C
  normalized >= 25 → D
  else → F
auto-penalty: any ★ question at score 0 → drop one letter grade
```

### Step 4 — Gap Generation
For every question with score < 2:
- Create individual gap plan at `gaps/gap-N-title.md`
- Each gap plan includes: description, location, severity, implementation guidance

### Step 5 — Report Assembly
Write all artifacts, update tracking files, write WALKTHROUGH.md, commit.

## Known State (from Phase n0 Analysis)

| Gap Status | Count | Questions |
|-----------|-------|-----------|
| Already fixed (expect 2/2) | 10 | Q21 (cycle), Q27 (DAG), Q37 (sim), Q56 (cache), Q81 (rate), Q82 (CORS), Q85 (auth), Q87 (CSRF), Q90 (HSTS), Q96 (pagination) |
| Still open (expect 0/2) | 7 | Q59 (concurrent writes), Q62 (velocity), Q64 (moving avg), Q65 (multi-var), Q102 (any types), Q108 (hardcoded paths), Q110 (React.memo) |
| Unknown (full audit) | 93 | All other questions — may reveal new gaps |

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| 110 questions time-consuming | High | Group by category; use parallel explore agent for evidence collection |
| Codebase changes mid-audit | Low | Snapshot initial state; note any mid-audit changes |
| New gaps found beyond 7 | Low | Add to gap register; note in WALKTHROUGH |
| g/ Any type search returns too many results | Medium | Prioritize by severity; aggregate into single gap plan |
| Inbox messages interfere | Low | Check once, then ignore until done |

## Design Rationale

- **Read-only audit**: No code changes during phase n1. Ensures accurate snapshot.
- **Full 110-question audit** (not delta): Enables apples-to-apples comparison with Benchmark 1.
- **Same output structure** as Benchmark 1 (`benchmarks/Benchmark_1_<ts>/`): Consistent naming enables dashboard comparison.
- **Gap plans in subdirectory**: Keeps `full-audit.md` readable; detailed plans are separate.
- **Dual-logging**: Every action logged to both agent events.md and global_ledger.md per PAOS Constitution.
