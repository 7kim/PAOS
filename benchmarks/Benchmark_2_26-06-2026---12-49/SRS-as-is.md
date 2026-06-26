# System Requirements Specification — As-Is

**Benchmark:** Benchmark 2 (26 June 2026)  
**Version:** 2.0  
**Status:** Current state audit

---

## 1. Purpose

This document describes the PAOS AI_Workflow system **as it currently exists**,
based on the Coding Principles Benchmark v2.0 audit. It documents the system's
architecture, capabilities, and the gaps identified.

## 2. System Overview

PAOS is a multi-agent pipeline orchestration system with:
- A React/Next.js dashboard for building, visualizing, and monitoring pipelines
- A DAG-based pipeline execution engine using Kahn's topological sort
- Support for multiple agent types (Hermes, OpenCode, Antigravity, Codex)
- A file-as-database persistence model with atomic writes and caching
- A queue-based execution scheduler with optional scheduling
- Comprehensive security middleware (auth, rate limiting, CORS, CSRF, HSTS)

## 3. Current Capabilities

| Capability | Status | Details |
|-----------|--------|---------|
| Pipeline DAG creation | ✅ | Flow Builder with drag-and-drop nodes, edges, branching, joining |
| Topological execution | ✅ | Kahn's algorithm, BFS-based, handles branch/join patterns |
| Cycle detection | ✅ | On POST save — detects cycles with node identification |
| Multi-agent support | ✅ | 5 agent types via common `AgentProfile` interface |
| Real-time status | ✅ | 2s polling, status icons, progress bars, PID display |
| Responsive UI | ✅ | 390px–3840px with progressive disclosure |
| Error recovery | ✅ | Retry, Skip, Cancel, Intervene — 4 recovery paths |
| Template system | ✅ | Templates with categories, presets, and similarity matching |
| Security middleware | ✅ | Bearer auth, rate limiting (100/min/IP), CORS, CSRF, HSTS |
| File caching | ✅ | In-memory FileCache with 5s TTL |
| Pagination | ✅ | `?page=N&limit=M` with total count and cap |
| Similarity matching | ✅ | Cosine similarity via `lib/similarity.ts` |
| Resource planning | ✅ | Multi-variable agent allocation via `lib/resource-planner.ts` |
| Crash recovery | ✅ | Atomic writes with pipeline-flow.json persistence |
| Queue system | ✅ | Enqueue/dequeue/done with auto-cleanup |
| Atomic file writes | ✅ | .tmp → rename pattern for writes |
| Code quality | ⚠️ | 47 `any` types remain; ~30 .then chains in frontend |
| DAG validation on read | ❌ | Validation only on POST create, not on GET read |
| Moving averages | ❌ | No progress interpolation or smoothing |
| Set usage | ⚠️ | selectedSkills is Array, should be Set |

## 4. Current Grade

**Overall:** B (87/100) — 192/220 raw

| Category | Score | Max | % |
|----------|-------|-----|---|
| OOP | 31 | 36 | 86% |
| Data Structures | 12 | 18 | 67% |
| Graph Theory | 11 | 12 | 92% |
| Linear Algebra | 8 | 8 | 100% |
| Digital Logic | 8 | 8 | 100% |
| Numerical Analysis | 7 | 8 | 88% |
| System Analysis | 14 | 14 | 100% |
| Database | 15 | 16 | 94% |
| Calculus | 7 | 10 | 70% |
| UX/UI | 20 | 20 | 100% |
| Security | 26 | 30 | 87% |
| API Endpoints | 19 | 20 | 95% |
| Code Quality | 14 | 20 | 70% |

## 5. Architecture

```
┌─────────────────────────────────────────────┐
│  Dashboard (Next.js App Router)              │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Builder │ │Visualize │ │ Settings/Etc │  │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘  │
│       │           │               │          │
│  ┌────▼───────────▼───────────────▼───────┐  │
│  │   API Routes (/api/*) — Next.js Route  │  │
│  │   Handlers                             │  │
│  └────┬───────────┬───────────────┬───────┘  │
│       │           │               │          │
│  ┌────▼───────────▼───────────────▼───────┐  │
│  │   Middleware (auth/rate/CSRF/CORS)     │  │
│  └────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│  Filesystem (File-as-Database)              │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐   │
│  │Pipeline  │ │ Queue    │ │ Benchmarks │   │
│  │Data      │ │ .json    │ │ Directory  │   │
│  └──────────┘ └──────────┘ └────────────┘   │
│                                              │
│  Libraries:                                  │
│  ├── lib/cache.ts          — FileCache       │
│  ├── lib/csrf.ts           — CSRF tokens     │
│  ├── lib/similarity.ts     — Cosine sim.     │
│  ├── lib/resource-planner.ts — Agent alloc   │
│  ├── lib/pipeline-analytics.ts — Metrics     │
│  └── lib/paos.ts           — Global config   │
└──────────────────────────────────────────────┘
```

## 6. Key Metrics

| Metric | Value |
|--------|-------|
| Total route handlers | 66 |
| Frontend components | ~20 in pipeline-builder |
| Route files per resource | Pipelines: 13, Agents: 9, Projects: 6 |
| Dependency vulnerabilities | 4 (1 low, 3 moderate) |
| `any` types remaining | 47 |
| Hardcoded paths | 13 |
| `.then()` chains | ~30 |
| Files with `dangerouslySetInnerHTML` | 3 |

## 7. Gap Summary

### Critical (0)
- None

### High (2)
- **Q27**: DAG validation on read — missing, edge source/target could reference nonexistent nodes
- **Q102**: 47 `any` types — largest code quality debt

### Medium (3)
- **Q26**: selectedSkills as Array, not Set — should use Set for uniqueness
- **Q64**: No moving averages — no progress interpolation
- **Q80**: No comprehensive input validation
- **Q86**: 3 dangerouslySetInnerHTML instances without sanitization
- **Q108**: 13 hardcoded paths

### Low (12)
- Q13, Q17, Q23, Q24, Q32, Q45, Q59, Q62, Q79, Q84, Q94, Q104, Q106, Q110

## 8. Comparison to Benchmark 1

| Aspect | B1 (25 Jun) | B2 (26 Jun) | Delta |
|--------|-------------|-------------|-------|
| Raw score | 148/220 | 192/220 | +44 |
| Normalized | 67/100 | 87/100 | +20 |
| Grade | C | B | +1 |
| ★ failures | 3 | 0 | -3 |
| 0-score gaps | 10 | 4 | -6 |
| Security % | 33% | 87% | +54pp |
| Database % | 62% | 94% | +32pp |
| Calculus % | 40% | 70% | +30pp |
| API % | 85% | 95% | +10pp |
| Code Quality % | 70% | 70% | — |
| Data Structures % | 67% | 67% | — |

The codebase improved primarily through the security infrastructure updates
(auth, rate limiting, CORS, CSRF, HSTS) plus caching, pagination, similarity
matching, and resource planning. Code quality metrics (any types, .then chains,
hardcoded paths) remain at similar levels to Benchmark 1.
