# System Requirements Specification — To-Be

**Benchmark:** Benchmark 1 (25 June 2026)  
**Version:** 1.0  
**Status:** Target state — all gaps closed

---

## 1. Purpose

This document describes the PAOS AI_Workflow system in its **target state**,
where all 17 gaps identified in Benchmark 1 have been closed. The target grade
is A (95+/100).

## 2. Target Grade

| Metric | Current | Target |
|--------|---------|--------|
| Overall | C (67%) | **A (95%)** |
| Raw score | 148/220 | **208/220** |
| Gaps | 17 | **0** |

| Category | Current | Target |
|----------|---------|--------|
| OOP | 92% | 100% |
| Data Structures | 67% | **100%** |
| Graph Theory | 92% | 100% |
| Linear Algebra | 75% | 100% |
| Digital Logic | 100% | 100% |
| Numerical Analysis | 88% | 100% |
| System Analysis | 100% | 100% |
| Database | 62% | **100%** |
| Calculus | 40% | **80%** |
| UX/UI | 100% | 100% |
| Security | 33% | **93%** |
| API Endpoints | 85% | **100%** |
| Code Quality | 70% | **100%** |

## 3. Target Requirements

### 3.1 Security (Requirement SEC-01 to SEC-05)

| ID | Requirement | Verification |
|----|-------------|-------------|
| SEC-01 | All API endpoints require authentication token | `curl -X DELETE /api/pipelines/...` without token returns 401 |
| SEC-02 | Rate limiting: max 100 requests/min per IP | Hammer `/api/pipelines` 101 times in 60s → 429 on 101st |
| SEC-03 | CORS restricts origins to known domains | `curl -H "Origin: https://evil.com"` returns no CORS headers |
| SEC-04 | CSRF tokens on all POST/PUT/DELETE | Automated test for missing CSRF = 0 |
| SEC-05 | Secure cookies with HttpOnly + SameSite | Cookie scan must show both flags |

### 3.2 Data Integrity (REQ-DI-01 to DI-04)

| ID | Requirement | Verification |
|----|-------------|-------------|
| DI-01 | Cyclic pipelines detected and rejected with error | `POST /api/pipelines` with A→B→A returns 400 |
| DI-02 | DAG validation: every edge target exists as a node | Missing node ID returns 400 |
| DI-03 | Concurrent write prevention: lockfile or atomic rename | 2 simultaneous saves → both succeed, no corruption |
| DI-04 | In-memory cache with 5s TTL for META.json reads | Same file read twice in 1s → second read is cached |

### 3.3 Code Quality (REQ-CQ-01 to CQ-03)

| ID | Requirement | Verification |
|----|-------------|-------------|
| CQ-01 | Zero `any` types in all source files | `grep -rn ': any' src/` = 0 |
| CQ-02 | All paths use global-config.ts imports | `grep -rn '/home/dev/'` = 0 |
| CQ-03 | All list-heavy components wrapped in React.memo | Performance audit shows no unnecessary re-renders |

### 3.4 API Design (REQ-API-01)

| ID | Requirement | Verification |
|----|-------------|-------------|
| API-01 | All list endpoints support `?page=N&limit=M` | `GET /api/pipelines?page=2&limit=50` returns page 2 |

### 3.5 Analytics (REQ-AN-01 to AN-04)

| ID | Requirement | Verification |
|----|-------------|-------------|
| AN-01 | Task completion rate tracked (tasks/sec) | Pipeline detail shows velocity metric |
| AN-02 | Moving average for progress smoothing | Progress bar doesn't jump 0→100% |
| AN-03 | Similarity metrics for template suggestions | Template matching uses cosine similarity |
| AN-04 | Resource planner considers agents, parallelism, tokens | Agent spawn respects parallelism limits |

## 4. Gap Closure Order

| Phase | Gaps | Effort |
|-------|------|--------|
| 1 — Security hardening | 09, 10, 11, 12, 13 | 1.5 hours |
| 2 — Data integrity | 01, 02, 04, 05 | 45 min |
| 3 — Code quality | 15, 16, 17 | 35 min |
| 4 — API & analytics | 03, 06, 07, 08, 14 | 2 hours |

## 5. Success Criteria

The system passes the to-be state when:
1. A re-benchmark scores ≥ 210/220 raw (95+/100 normalized)
2. All 17 gaps show "✅ Fixed" status
3. No new gaps are introduced
4. Existing functionality is unaffected (all pipelines run correctly)
