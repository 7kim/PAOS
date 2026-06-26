# Implementation Plan: Benchmark 2 — Coding Principles Audit

**Phase**: n0 (Plan) → n1 (Execute)
**Agent**: hermes-nous → opencode-developer
**Prompt**: Run a benchmark: node 1 analyzes the coding principles, node 2 runs the tests

---

## 1. Objective

Run a comprehensive benchmark (Benchmark 2) against the PAOS AI_Workflow codebase using the `Coding-Principles-Benchmark.md` v2.0 strict audit framework. The goal is to produce an updated score that reflects the significant infrastructure improvements made since Benchmark 1 (25 June 2026).

## 2. Current State Analysis

### Benchmark 1 Results (25 June 2026)
- **Raw**: 148/220 → **Normalized**: 67/100 → **Grade**: C
- **Gaps**: 17 (3 Critical, 11 High, 3 Medium)
- **Weakest areas**: Security (33%), Calculus (40%), Database (62%)

### What's Been Fixed Since Benchmark 1

| Gap | Source | Status | Evidence |
|-----|--------|--------|----------|
| 01 — No cycle detection | Q21 | ✅ FIXED | `dashboard/app/api/pipelines/route.ts:297-302` — topo sort cycle check |
| 04 — No file caching | Q56 | ✅ FIXED | `dashboard/lib/cache.ts` — FileCache singleton with 5s TTL |
| 09 — No rate limiting | Q81 | ✅ FIXED | `dashboard/middleware.ts:27-58` — 100 req/min per IP in-memory |
| 10 — No CORS | Q82 | ✅ FIXED | `dashboard/middleware.ts:157-168` — allow-list based |
| 11 — No authentication | Q85 | ✅ FIXED | `dashboard/middleware.ts:104-115` — Bearer token auth |
| 12 — No CSRF | Q87 | ✅ FIXED | `dashboard/middleware.ts:117-126` + `/api/csrf-token` route |
| 13 — No HTTPS/HSTS | Q90 | ✅ FIXED | `dashboard/middleware.ts:145-155` — security headers |
| 14 — No pagination | Q96 | ✅ FIXED | `pipelines/route.ts:101-141` — page/limit support |

### Remaining Gaps to Re-assess

| Gap | Source | Current Status |
|-----|--------|----------------|
| 02 — No DAG validation on read | Q27 | ⚠️ Partial — cycle detection exists on POST save, not on GET read |
| 03 — No similarity metrics | Q37 | ❌ No evidence of cosine/embedding similarity |
| 05 — No concurrent write prevention | Q59 | ⚠️ Comment only in execute-flow/route.ts:8 — no actual lock |
| 06 — No velocity tracking | Q62 | ❌ No tasks/second measurement |
| 07 — No moving averages | Q64 | ❌ No progress smoothing |
| 08 — No multi-variable optimization | Q65 | ❌ No resource optimization |
| 15 — `any` types | Q102 | ❌ 34 occurrences still present |
| 16 — Hardcoded paths | Q108 | ❌ 9 occurrences of `/home/dev/` |
| 17 — No React.memo | Q110 | ❌ Zero memo usage |

## 3. Scope

### Files/Systems Affected
- **Full codebase scan**: `dashboard/` (app/, lib/, components/)
- **Targeted re-scoring**: 110 questions from Coding-Principles-Benchmark.md v2.0
- **Output**: `benchmarks/Benchmark_2_<timestamp>/` directory

### Deliverables
1. **full-audit.md** — Complete 110-question audit with evidence per question
2. **gaps/index.md** — Aggregate of all remaining gaps with severity
3. **gaps/gap-*.md** — Individual implementation plan files for each sub-2 score
4. **SRS-as-is.md** — Updated system requirements (current state)
5. **README.md** — Summary card with normalized score and grade

## 4. Technical Approach

### Phase n1 Tasks (for opencode-developer)

**Step 1: Tooling Setup**
```bash
# Run the audit searches from the benchmark spec
grep -rn ': any' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn '\.then(' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn 'readFile\|writeFile\|fs\.' dashboard/app/ --include='*.tsx'
# ... etc, per Step 1 of the audit procedure
```

**Step 2: Score Each Question (110 questions)**
For each question in Coding-Principles-Benchmark.md:
1. Read the "Check" column for what to search
2. Run the grep/command
3. Score: 2 = ✅ found with evidence, 1 = ⚠️ partial, 0 = ❌ not found
4. Document evidence with file:line references

**Step 3: Grade Calculation**
```
raw = sum(all 110 scores)
normalized = round((raw / 220) * 100)
grade = F → D → C → B → A at thresholds 25/50/75/90
auto-penalty: any ★ question at 0 drops grade one letter
```

**Step 4: Gap Generation**
For every score < 2, generate a gap implementation plan at:
- `benchmarks/Benchmark_2_<ts>/gaps/gap-N-<title>.md`

**Step 5: Report Assembly**
Write all output artifacts to `benchmarks/Benchmark_2_<ts>/`.

### Scoring Guidelines
- Be strict — "teacher grading an exam" mindset
- Back every score with concrete evidence (file:line)
- Partial credit only for genuine understanding with minor slip
- Flag all `any` types, hardcoded paths, missing abstractions

## 5. Risks & Rollback

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Benchmark takes too long (110 questions) | Medium | High | Timebox at 2 hours; automated grep first, manual review second |
| Score drops due to stricter grading | Medium | Low | Benchmark 1 was also strict; consistency maintained |
| Audit finds new issues not in gap list | Low | Medium | Add them to gap register with appropriate severity |
| Codebase changes during audit | Low | Low | Snapshot state at start; note any mid-audit changes |

**Rollback**: No code changes during this phase — it's read-only analysis. No rollback needed.

## 6. Design Rationale

### Why Run Benchmark 2 Now?
1. Significant infrastructure improvements since Benchmark 1 (8 of 17 gaps fixed)
2. Need to verify fixes are properly implemented and scorable
3. Updated score will reflect true codebase health after security hardening
4. Remaining gaps need fresh verification for prioritization

### Why Use Same Framework (v2.0)?
- Direct comparison with Benchmark 1 results
- Consistency across audits
- Benchmark already well-designed with strict scoring criteria

### Anticipated Score Improvement
- **Estimated**: 67 → 78-85/100 (low B to mid B)
- **Reasoning**: 8 fixes × avg 2 points each = ~16 pts raw gain; remaining 9 gaps still pull score down
- **Ceiling**: ~190/220 raw = 86/100 if all remaining gaps also fixed
