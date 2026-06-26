# Implementation Plan: Benchmark 2 Execution

**Phase**: n1 (Execute)
**Agent**: opencode-developer
**Pipeline**: PIPE-26-06-2026---12-48
**Handoff from**: hermes-nous (phase n0)

---

## 1. Objective

Execute the full 110-question strict audit (`Coding-Principles-Benchmark.md` v2.0) against the PAOS AI_Workflow codebase. Score each question with concrete file:line evidence, calculate the normalized score and grade, and generate gap implementation plans for every score < 2.

## 2. Execution Steps

### Step 1 — Tooling Setup
Run the initial evidence-gathering searches:
```bash
grep -rn ': any' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn '\.then(' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn 'readFile\|writeFile\|fs\.' dashboard/app/ --include='*.tsx'
grep -rn 'extends' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn 'agentId\|agent.*===' dashboard/app/api/pipelines/
```

### Step 2 — Score All 110 Questions
For each question in `Coding-Principles-Benchmark.md`:
1. Read the "Check" column
2. Run the grep/command
3. Score: **2** = evidence found, **1** = partial, **0** = not found/violated
4. Record evidence with `file:line` references

### Step 3 — Grade Calculation
```
raw = sum(all 110 scores)
normalized = round((raw / 220) * 100)
grade = F → D → C → B → A at thresholds 25/50/75/90
auto-penalty: any ★ question at 0 drops grade one letter
```

### Step 4 — Gap Generation
For every score < 2, create an individual gap implementation plan at:
- `benchmarks/Benchmark_2_<ts>/gaps/gap-N-<title>.md`

### Step 5 — Report Assembly
Write all artifacts to `benchmarks/Benchmark_2_<timestamp>/`:
- `full-audit.md` — Complete 110-question audit
- `gaps/index.md` — All gaps with severity
- `gaps/gap-*.md` — Individual gap plans
- `SRS-as-is.md` — Current system requirements
- `README.md` — Score summary card

## 3. Known State from Phase n0 Analysis

### 10 Gaps Already Fixed (expect 2/2)
Q21 (cycle detection), Q27 (DAG validation), Q37 (similarity metrics), Q56 (caching), Q81 (rate limiting), Q82 (CORS), Q85 (auth), Q87 (CSRF), Q90 (HSTS), Q96 (pagination)

### 7 Gaps Still Open (expect 0/2)
Q59 (concurrent writes), Q62 (velocity tracking), Q64 (moving averages), Q65 (multi-variable optimization), Q102 (`any` types — 34 occurrences), Q108 (hardcoded paths — 10 occurrences), Q110 (React.memo — 0 usage)

## 4. Output Directory Structure
```
benchmarks/Benchmark_2_<YYYY-MM-DD---HH-MM>/
├── README.md              # Score card
├── full-audit.md          # Complete 110-question audit
├── SRS-as-is.md           # Current system requirements
├── gaps/
│   ├── index.md           # Aggregate gap register
│   ├── gap-59-concurrent-writes.md
│   ├── gap-62-velocity-tracking.md
│   ├── gap-64-moving-averages.md
│   ├── gap-65-multi-variable-optimization.md
│   ├── gap-102-any-types.md
│   ├── gap-108-hardcoded-paths.md
│   └── gap-110-react-memo.md
```

## 5. Risks

| Risk | Mitigation |
|------|------------|
| 110 questions take too long | Group by category; timebox at 2 hours |
| Stale audit if codebase changes | Snapshot at start; note mid-audit changes |
| New gaps found beyond known 7 | Add to register with appropriate severity |
