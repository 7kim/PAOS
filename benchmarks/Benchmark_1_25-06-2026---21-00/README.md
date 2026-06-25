# Benchmark 1 — 25 June 2026 21:00

**Grade:** C (67/100) — 148/220 raw  
**Gaps found:** 17  
**Auditor:** Hermes Agent (automated)

## Run Details

| Field | Value |
|-------|-------|
| Date | 25 June 2026 |
| Benchmark version | Coding-Principles-Benchmark v2.0 |
| Total questions | 110 |
| Raw max | 220 |
| Normalized | 67/100 |
| ★ questions failed | 3 (Q56 caching, Q81 rate limit, Q85 auth) |
| Auto-grade penalty | -1 (3 ★ failures → C→D avoided because C already) |

## Weight Tier Performance

| Tier | Weight | Raw | Max | % |
|------|--------|----:|----:|---:|
| Heavy (OOP, DS, Sys Analysis, Dig Logic, Security) | 48% | 77 | 106 | 73% |
| Medium (Code Quality, API, Database) | 25% | 41 | 56 | 73% |
| Moderate (UX/UI, Linear Algebra) | 18% | 26 | 28 | 93% |
| Supporting (Graph Theory, Calc, Num Analysis) | 9% | 22 | 30 | 73% |

## Overall Assessment

The codebase is solid in user experience, system architecture, and digital logic.
The main weaknesses are in **security** (no auth, no rate limiting, no CSRF),
**performance optimization** (no caching, no memo), and **analytics** (no velocity tracking,
no moving averages). The grade C reflects a project that works well but needs hardening
before production deployment.

## Files in this Benchmark

- `full-audit.md` — complete 110-question audit with evidence
- `gaps/index.md` — all 17 gaps combined
- `gaps/gap-*.md` — individual gap files with implementation plans
- `implementation-plan.md` — prioritized work plan
