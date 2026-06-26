# Benchmark 2 — 26 June 2026

**Grade:** B (87/100) — 192/220 raw  
**Gaps found:** 4 (score = 0) + 17 (partial score = 1)  
**Auditor:** opencode-developer (automated)

## Run Details

| Field | Value |
|-------|-------|
| Date | 26 June 2026 |
| Benchmark version | Coding-Principles-Benchmark v2.0 |
| Total questions | 110 |
| Raw max | 220 |
| Raw score | 192 |
| Normalized | 87/100 |
| Grade | B |
| ★ questions failed | 0 |
| Auto-grade penalty | None |

## Improvement Over Benchmark 1

| Metric | B1 (25 Jun) | B2 (26 Jun) | Change |
|--------|-------------|-------------|--------|
| Grade | C | **B** | **+1 letter** |
| Score | 67/100 | **87/100** | **+20** |
| Critical gaps | 3 | 0 | -3 |
| High gaps | 11 | 2 | -9 |
| Medium gaps | 3 | 3 | — |
| Total gaps (0-score) | 10 | 4 | -6 |

## What Was Fixed Since Benchmark 1

| Gap | B1 Score | B2 Score | Evidence |
|-----|----------|----------|----------|
| Cycle detection (Q21) | 0 | **2** | `pipelines/route.ts:297-302` |
| Caching (Q56) | 0 | **2** | `lib/cache.ts:19-84` |
| Rate limiting (Q81) | 0 | **2** | `middleware.ts:128-137` |
| CORS (Q82) | 0 | **2** | `middleware.ts:157-167` |
| Auth (Q85) | 0 | **2** | `middleware.ts:70-78` |
| CSRF (Q87) | 0 | **2** | `middleware.ts:117-122` |
| HSTS (Q90) | 0 | **2** | `middleware.ts:145-152` |
| Pagination (Q96) | 0 | **2** | `pipelines/route.ts:101-141` |
| Similarity (Q37) | 0 | **2** | `lib/similarity.ts` |
| Resource planner (Q65) | 0 | **2** | `lib/resource-planner.ts` |
| React.memo (Q110) | 0 | **1** | 3 components memo'd |

## Remaining 0-Score Gaps

| Q | Gap | Severity | Effort |
|---|-----|----------|--------|
| Q102 | 47 `any` types | High | 30 min |
| Q27 | No DAG validation on read | High | 5 min |
| Q26 | selectedSkills as Array, not Set | Medium | 5 min |
| Q64 | No moving averages | Medium | 20 min |

## Weight Tier Performance

| Tier | Weight | Raw | Max | % |
|------|--------|----:|----:|---:|
| Heavy (OOP, DS, Sys Analysis, Dig Logic, Security) | 48% | 91 | 106 | 86% |
| Medium (Code Quality, API, Database) | 25% | 48 | 56 | 86% |
| Moderate (UX/UI, Linear Algebra) | 18% | 28 | 28 | 100% |
| Supporting (Graph Theory, Calc, Num Analysis) | 9% | 25 | 30 | 83% |

## Overall Assessment

The codebase has matured significantly since Benchmark 1. Security has been transformed from the weakest category (33%) to a competitive 87%. All critical infrastructure gaps are closed. The remaining work is primarily code quality (47 `any` types, `.then` chains, partial memo coverage) and a few correctness items (DAG validation on read).

The grade B at 87/100 places the codebase on the cusp of A-grade. With the 4 remaining 0-score gaps fixed (estimated ~60 minutes effort), the codebase would reach 198/220 = 90/100 = A.

## Files in this Benchmark

- `full-audit.md` — complete 110-question audit with evidence
- `gaps/index.md` — all 21 partial/zero-score gaps
- `gaps/gap-*.md` — individual gap files with implementation plans
- `SRS-as-is.md` — system requirements specification (current state)
