# Implementation Plan — Benchmark 1 Follow-up

**Goal:** Close all 17 gaps to reach Grade A (90+/100)

## Phase 1: Security Hardening (2 hours)
*Highest priority — 5 gaps, 3 critical*

| Order | Gap | Time | Trigger |
|-------|-----|------|---------|
| 1 | 11 — Add authentication | 20 min | "work on gap 11" |
| 2 | 09 — Add rate limiting | 30 min | "work on gap 9" |
| 3 | 10 — Configure CORS | 10 min | "work on gap 10" |
| 4 | 12 — Add CSRF protection | 15 min | "work on gap 12" |
| 5 | 13 — HTTPS/HSTS cookies | 10 min | "work on gap 13" |

## Phase 2: Data Integrity (30 min)
| Order | Gap | Time | Trigger |
|-------|-----|------|---------|
| 6 | 01 — Cycle detection | 5 min | "work on gap 1" |
| 7 | 02 — DAG validation | 5 min | "work on gap 2" |
| 8 | 05 — Concurrent write prevention | 15 min | "work on gap 5" |
| 9 | 04 — File caching | 20 min | "work on gap 4" |

## Phase 3: Code Quality (35 min)
| Order | Gap | Time | Trigger |
|-------|-----|------|---------|
| 10 | 15 — Replace `any` types | 15 min | "work on gap 15" |
| 11 | 16 — Hardcoded paths | 10 min | "work on gap 16" |
| 12 | 17 — Add React.memo | 10 min | "work on gap 17" |

## Phase 4: API & Analytics (2 hours)
| Order | Gap | Time | Trigger |
|-------|-----|------|---------|
| 13 | 14 — Add pagination | 15 min | "work on gap 14" |
| 14 | 06 — Velocity tracking | 20 min | "work on gap 6" |
| 15 | 07 — Moving averages | 15 min | "work on gap 7" |
| 16 | 03 — Similarity metrics | 30 min | "work on gap 3" |
| 17 | 08 — Multi-variable optimization | 60 min | "work on gap 8" |

## Expected Outcome
Closing all 17 gaps would raise the score from 148/220 (67%) to
approximately 208/220 (95%) — Grade A.

## How to Start
Say "work on gap {N}" to begin implementing any individual gap.
Each gap file in `gaps/` contains the exact fix steps.
