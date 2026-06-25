# Gaps — Benchmark 1 (25 June 2026)

**Total:** 16 gaps  
**Current status:** 17 Pending, 0 In Progress, 0 Fixed, 0 Won't Fix

---

## Critical (3)

### Gap 1 — No Cycle Detection
- **Source:** Q21 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** Kahn's algorithm silently truncates cyclic DAGs. A cycle A→B→A produces incomplete execution without error.
- **The Fix:** Add `if (order.length < nodes.length)` check after topological sort. Return 400 error with list of cycled nodes.
- **Files:** `execute-flow/route.ts:9-26`
- **Effort:** 5 minutes

### Gap 2 — No DAG Validation on Read
- **Source:** Q27 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** Edges referencing non-existent nodes can cause silent cascade failures.
- **The Fix:** On every DAG read, verify all edge source/target IDs exist in nodes array.
- **Files:** `route.ts:[id]/route.ts`
- **Effort:** 5 minutes

### Gap 3 — No Similarity Metrics
- **Source:** Q37 | **Severity:** Medium | **Status:** ⏳ Pending
- **The Gap:** Template matching is exact-match only.
- **The Fix:** Implement cosine similarity for prompt/agent vector profiles.
- **Files:** New `lib/similarity.ts`
- **Effort:** 30 minutes

### Gap 4 — No File Caching
- **Source:** Q56 | **Severity:** Critical ★ | **Status:** ⏳ Pending
- **The Gap:** Every API call re-reads META.json from disk. Same file read 3+ times per request.
- **The Fix:** Add in-memory cache with 5-second TTL.
- **Files:** New `lib/cache.ts` + integrate into route handlers
- **Effort:** 20 minutes

### Gap 5 — No Concurrent Write Prevention
- **Source:** Q59 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** Two simultaneous execute-flow calls corrupt META.json (last write wins).
- **The Fix:** Lockfile or atomic rename pattern.
- **Files:** `execute-flow/route.ts`
- **Effort:** 15 minutes

### Gap 6 — No Velocity Tracking
- **Source:** Q62 | **Severity:** Medium | **Status:** ⏳ Pending
- **The Gap:** No measurement of task completion rate.
- **The Fix:** Track per-phase timestamps, compute tasks/sec.
- **Files:** `execute-flow/route.ts`, `route.ts:[id]/route.ts`
- **Effort:** 20 minutes

### Gap 8 — No Multi-Variable Optimization
- **Source:** Q65 | **Severity:** Medium | **Status:** ⏳ Pending
- **The Gap:** Agent count, parallelism, token cost not considered together.
- **The Fix:** Resource planner considering all variables.
- **Files:** New `lib/resource-planner.ts`
- **Effort:** 1 hour

### Gap 9 — No Rate Limiting
- **Source:** Q81 | **Severity:** Critical ★ | **Status:** ⏳ Pending
- **The Gap:** Unlimited API calls — easy to DOS.
- **The Fix:** Rate limiting middleware: 100 req/min per IP.
- **Files:** New `middleware.ts`
- **Effort:** 30 minutes

### Gap 10 — No CORS Configuration
- **Source:** Q82 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** CORS not explicitly configured.
- **The Fix:** Add CORS headers in next.config.js or middleware.
- **Files:** `next.config.js` or `middleware.ts`
- **Effort:** 10 minutes

### Gap 11 — No Authentication
- **Source:** Q85 | **Severity:** Critical ★ | **Status:** ⏳ Pending
- **The Gap:** Anyone with network access can create/delete pipelines.
- **The Fix:** API token check in middleware.
- **Files:** New `middleware.ts`
- **Effort:** 20 minutes

### Gap 12 — No CSRF Protection
- **Source:** Q87 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** POST/PUT/DELETE lack CSRF tokens.
- **The Fix:** CSRF token generation + validation.
- **Files:** `middleware.ts` + frontend header injection
- **Effort:** 15 minutes

### Gap 13 — No HTTPS Cookies or HSTS
- **Source:** Q90 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** No Secure/HttpOnly/SameSite cookie flags, no HSTS.
- **The Fix:** Add HSTS header + secure cookie defaults.
- **Files:** `middleware.ts`
- **Effort:** 10 minutes

### Gap 14 — No Pagination
- **Source:** Q96 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** GET /api/pipelines returns ALL pipelines. Will break >1000.
- **The Fix:** Add `?page=N&limit=M` with total count.
- **Files:** `api/pipelines/route.ts`
- **Effort:** 15 minutes

### Gap 15 — `any` Types
- **Source:** Q102 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** ~13 `any` types across 5 files.
- **The Fix:** Replace each `any` with proper interface.
- **Files:** Canvas.tsx, types.ts, MiniDagView.tsx, TemplateBrowser.tsx, LoadPipelineDialog.tsx
- **Effort:** 15 minutes

### Gap 16 — Hardcoded Paths
- **Source:** Q108 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** Routes hardcode `/home/dev/...` paths.
- **The Fix:** Replace with `global-config.ts` imports.
- **Files:** Various API route files
- **Effort:** 10 minutes

### Gap 17 — No React.memo
- **Source:** Q110 | **Severity:** High | **Status:** ⏳ Pending
- **The Gap:** Components without memo cause unnecessary re-renders.
- **The Fix:** Wrap Canvas children, FileTreeExplorer in memo.
- **Files:** Canvas.tsx, FileTreeExplorer.tsx
- **Effort:** 10 minutes
