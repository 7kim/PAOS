# Implementation Plan: Benchmark 2 — Coding Principles Audit

**Phase**: n0 (Plan) → n1 (Execute)
**Agent**: hermes-nous → opencode-developer
**Pipeline**: PIPE-26-06-2026---12-48
**Prompt**: Run benchmark module: node 1 analyzes the rules, node 2 executes the tests

---

## 1. Objective

Execute a comprehensive benchmark (Benchmark 2) against the PAOS AI_Workflow codebase using the `Coding-Principles-Benchmark.md` v2.0 strict audit framework. This is a re-audit following significant infrastructure improvements since Benchmark 1 (25 June 2026).

## 2. Current State Analysis

### Benchmark 1 Results (25 June 2026)
- **Raw**: 148/220 → **Normalized**: 67/100 → **Grade**: C
- **Gaps**: 17 (3 Critical, 11 High, 3 Medium)
- **Weakest areas**: Security (33%), Calculus (40%), Database (62%)

### What's Been Fixed Since Benchmark 1 (10 gaps resolved)

| # | Gap | Source | Status | Evidence |
|---|-----|--------|--------|----------|
| 01 | No cycle detection | Q21 | ✅ FIXED | `dashboard/app/api/pipelines/route.ts:252-300` — topo sort cycle check with `sortedSet` |
| 02 | No DAG validation on read | Q27 | ✅ FIXED | `dashboard/app/api/pipelines/route.ts:252` — DAG validation on POST save (edge source/target must exist) |
| 03 | No similarity metrics | Q37 | ✅ FIXED | `dashboard/lib/similarity.ts` — `cosineSimilarity()` + `rankBySimilarity()`, used in `/api/templates/suggestions` and `/api/search` |
| 04 | No file caching | Q56 | ✅ FIXED | `dashboard/lib/cache.ts` — `FileCache` singleton with 5s TTL, `wrap()`, `readFile()`, `readJSON()` methods |
| 05 | No rate limiting | Q81 | ✅ FIXED | `dashboard/middleware.ts:27-58` — in-memory rate map, 100 req/min per IP configurable |
| 06 | No CORS | Q82 | ✅ FIXED | `dashboard/middleware.ts:157-167` — allow-list based, configurable `CORS_ORIGIN` |
| 07 | No authentication | Q85 | ✅ FIXED | `dashboard/middleware.ts:76-107` — Bearer token auth, `API_TOKEN` env var |
| 08 | No CSRF | Q87 | ✅ FIXED | `dashboard/middleware.ts:117-126` + `lib/csrf.ts` + `/api/csrf-token` — opt-in via `CSRF_PROTECTION=true` |
| 09 | No HTTPS/HSTS | Q90 | ✅ FIXED | `dashboard/middleware.ts:145-155` — `Strict-Transport-Security` + security headers |
| 10 | No pagination | Q96 | ✅ FIXED | `pipelines/route.ts:141` — `page`/`limit`/`total`/`totalPages` in response |

### Remaining Gaps to Re-assess (7 gaps open)

| # | Gap | Source | Current Status |
|---|-----|--------|----------------|
| 11 | No concurrent write prevention | Q59 | ⚠️ Partial — comment at `execute-flow/route.ts:8` mentions atomic writes but no actual lock/mutex |
| 12 | No velocity tracking | Q62 | ❌ No `tasksPerSecond` or timestamp-diff tracking found |
| 13 | No moving averages | Q64 | ❌ No progress smoothing or rolling averages |
| 14 | No multi-variable optimization | Q65 | ❌ No resource optimization (agent count, parallelism, tokens) |
| 15 | `any` types | Q102 | ❌ **34 occurrences** across 15 files — heaviest in `execute-flow/route.ts` (14+) and `pipelines/route.ts` (6+) |
| 16 | Hardcoded paths | Q108 | ❌ **10 occurrences** — 9× `/home/dev/` paths in lib/*.ts and routes; 1× hardcoded `OPENCODE_BIN` |
| 17 | No React.memo | Q110 | ❌ Zero `React.memo` or `.memo()` usage across all components |

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
# Required searches for evidence collection
grep -rn ': any' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn '\.then(' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn 'readFile\|writeFile\|fs\.' dashboard/app/ --include='*.tsx'
grep -rn 'extends' dashboard/ --include='*.ts' --include='*.tsx'
grep -rn 'agentId\|agent.*===' dashboard/app/api/pipelines/
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
| Score drops due to stricter grading | Medium | Low | Consistency with Benchmark 1 framework maintained |
| Audit finds new issues not in gap list | Low | Medium | Add them to gap register with appropriate severity |
| Codebase changes during audit | Low | Low | Snapshot state at start; note any mid-audit changes |

**Rollback**: No code changes during this phase — it's read-only analysis. No rollback needed.

## 6. Design Rationale

### Why Run Benchmark 2 Now?
1. **10 of 17 gaps fixed** since Benchmark 1 — significant infrastructure hardening
2. **New features added** (similarity metrics, DAG validation, CSRF) need scoring
3. **Updated score** will reflect true codebase health after security improvements
4. **Remaining 7 gaps** need fresh verification for prioritization

### Why Use Same Framework (v2.0)?
- Direct comparison with Benchmark 1 results
- Consistency across audits
- Framework is well-designed with strict scoring criteria

### Anticipated Score Improvement
- **Estimated**: 67 → **82-88/100** (low B to high B)
- **Reasoning**: 10 fixes × avg 2 pts each = ~20 pts raw gain (148→168+); remaining 7 gaps still pull score down
- **Ceiling**: ~196/220 raw = 89/100 if all remaining gaps also fixed
