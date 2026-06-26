# Gaps — Benchmark 2 (26 June 2026)

**Total:** 21 gaps (4 zero-score, 17 partial-score)  
**Status:** 21 Pending, 0 In Progress, 0 Fixed

---

## Zero-Score Gaps (must fix)

### Gap 1 — Q26: selectedSkills as Array, not Set
- **Score:** 0/2 | **Severity:** Medium | **Status:** ⏳ Pending
- **Plan:** `gaps/gap-01-selectedSkills-not-set.md`

### Gap 2 — Q27: No DAG validation on read
- **Score:** 0/2 | **Severity:** High | **Status:** ⏳ Pending
- **Plan:** `gaps/gap-02-no-dag-validation-on-read.md`

### Gap 3 — Q64: No moving averages
- **Score:** 0/2 | **Severity:** Medium | **Status:** ⏳ Pending
- **Plan:** `gaps/gap-03-no-moving-averages.md`

### Gap 4 — Q102: 47 `any` types across codebase
- **Score:** 0/2 | **Severity:** High | **Status:** ⏳ Pending
- **Plan:** `gaps/gap-04-any-types.md`

---

## Partial-Score Gaps (nice to fix)

### Gap 5 — Q13: Some non-RESTful route names
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** `execute-flow`, `phases-to-layout`, `generate-name` route paths

### Gap 6 — Q17: FlowBuilderProps has 7 fields
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** `components/pipeline-builder/Canvas.tsx`

### Gap 7 — Q23: Some .find() on arrays
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** Various API routes

### Gap 8 — Q24: Excessive .includes() usage
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** ConfigPanel.tsx, lib/paos.ts, lib/search.ts, etc.

### Gap 9 — Q32: Limited Set operations
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** Permission/logic checks use .filter() instead of Set operations

### Gap 10 — Q45: No NaN/Infinity edge case guards
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** Various numeric operation paths

### Gap 11 — Q59: No concurrent write lock
- **Score:** 1/2 | **Severity:** High | **Status:** ⏳ Pending
- **Files:** `execute-flow/route.ts`

### Gap 12 — Q62: No tasks/second measurement
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** `lib/pipeline-analytics.ts`

### Gap 13 — Q79: Path traversal mitigation partial
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** Various join() callers

### Gap 14 — Q80: No comprehensive input validation
- **Score:** 1/2 | **Severity:** Medium | **Status:** ⏳ Pending
- **Files:** All POST/PUT route handlers

### Gap 15 — Q84: No agent sandboxing
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** Agent execution paths

### Gap 16 — Q86: 3 dangerouslySetInnerHTML instances
- **Score:** 1/2 | **Severity:** Medium | **Status:** ⏳ Pending
- **Files:** `chart.tsx`, `settings/page.tsx`, `projects/page.tsx`

### Gap 17 — Q94: Some 500 instead of 404
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** Various route handlers

### Gap 18 — Q104: ~30 .then() chains in frontend
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** `Canvas.tsx`, `FileTreeExplorer.tsx`, `ConfigPanel.tsx`, etc.

### Gap 19 — Q106: PascalCase non-component files (docs)
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Status:** Acceptable — these are documentation files (README.md, DESIGN.md), not code files

### Gap 20 — Q108: 13 hardcoded paths
- **Score:** 1/2 | **Severity:** Medium | **Status:** ⏳ Pending
- **Files:** `lib/paos.ts`, `lib/pipeline-analytics.ts`, `lib/agent-stats.ts`, `benchmarks/page.tsx`, `execute/route.ts`, and more

### Gap 21 — Q110: Partial memo coverage
- **Score:** 1/2 | **Severity:** Low | **Status:** ⏳ Pending
- **Files:** Canvas.tsx, ConfigPanel.tsx, NodePalette.tsx, TemplateBrowser.tsx, VisualToolbar.tsx

---

## Fixed Since Benchmark 1

These items were gaps in Benchmark 1 but now score 2/2:

| Gap | Q | Status | Evidence |
|-----|---|--------|----------|
| Cycle detection | Q21 | ✅ Fixed | `pipelines/route.ts:297-302` |
| File caching | Q56 | ✅ Fixed | `lib/cache.ts:19-84` |
| Rate limiting | Q81 | ✅ Fixed | `middleware.ts:128-137` |
| CORS | Q82 | ✅ Fixed | `middleware.ts:157-167` |
| Authentication | Q85 | ✅ Fixed | `middleware.ts:70-78` |
| CSRF | Q87 | ✅ Fixed | `middleware.ts:117-122` |
| HSTS | Q90 | ✅ Fixed | `middleware.ts:145-152` |
| Pagination | Q96 | ✅ Fixed | `pipelines/route.ts:101-141` |
| Similarity metrics | Q37 | ✅ Fixed | `lib/similarity.ts` |
| Resource planner | Q65 | ✅ Fixed | `lib/resource-planner.ts` |
| React.memo (partial) | Q110 | ✅ Partial | 3 components memo'd |
