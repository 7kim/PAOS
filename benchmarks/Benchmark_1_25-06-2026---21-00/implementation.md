# Implementation Specification — Benchmark 1

**Gaps:** 17  
**Target Grade:** A (95+/100)  
**Estimated Total Effort:** ~4.5 hours

---

## Overview

This document provides the complete implementation specification for closing
all 17 gaps identified in Benchmark 1. Each gap has:
- Exact code changes required
- Files to modify
- Acceptance criteria for verification
- Integration notes (how changes affect existing functionality)

---

## Phase 1: Security Hardening (1.5 hours)

### Gap 9 — Rate Limiting (30 min)

**Implementation:**
```typescript
// middleware.ts
const rateLimit = new Map<string, { count: number; reset: number }>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, reset: now + 60000 };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + 60000;
  }
  entry.count++;

  if (entry.count > 100) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  rateLimit.set(ip, entry);
  return NextResponse.next();
}
```

**Integration:** No changes to existing routes. Middleware runs before all requests.

### Gap 11 — Authentication (20 min)

**Implementation:**
```typescript
// In middleware.ts (combined with rate limiting)
export function middleware(request: NextRequest) {
  // Rate limit check (from Gap 9)
  // ...

  // Auth check for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const token = request.headers.get("x-api-token");
    if (token !== process.env.API_TOKEN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}
```

**Integration:** All API routes will require `x-api-token` header. The dashboard will need to send this token with every fetch call.

### Gap 10 — CORS (10 min)

**Implementation:**
```javascript
// next.config.js — add headers
headers: async () => [{
  source: '/api/:path*',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: 'https://dev.anaconda-notothen.ts.net' },
    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,PATCH' },
    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-api-token' },
  ],
}]
```

### Gap 12 — CSRF (15 min)

**Implementation:**
Generate CSRF token on login, validate on state-changing requests.

### Gap 13 — HTTPS/HSTS (10 min)

**Implementation:**
```javascript
// next.config.js headers
{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
```

---

## Phase 2: Data Integrity (45 min)

### Gap 1 — Cycle Detection (5 min)

```typescript
// In topoSort function, after the while loop:
if (order.length < nodes.length) {
  const inOrder = new Set(order);
  const cycled = nodes.filter((n: any) => !inOrder.has(n.id)).map((n: any) => n.id);
  throw new Error(`Pipeline contains a cycle involving: ${cycled.join(', ')}`);
}
```

### Gap 2 — DAG Validation (5 min)

```typescript
// In GET /api/pipelines/[id], after reading builder-layout.json
const nodeIds = new Set(nodes.map((n: any) => n.id));
for (const edge of edges) {
  if (!nodeIds.has(edge.source)) throw new Error(`Unknown source: ${edge.source}`);
  if (!nodeIds.has(edge.target)) throw new Error(`Unknown target: ${edge.target}`);
}
```

### Gap 4 — File Caching (20 min)

```typescript
// New file: lib/cache.ts
const cache = new Map<string, { data: any; expiry: number }>();

export async function cachedRead<T>(
  key: string,
  reader: () => Promise<T>,
  ttl = 5000
): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) return cached.data;
  const data = await reader();
  cache.set(key, { data, expiry: Date.now() + ttl });
  return data;
}
```

### Gap 5 — Concurrent Write Prevention (15 min)

Use fs.rename for atomic writes: write to temp file, then rename to target.

---

## Phase 3: Code Quality (35 min)

### Gap 15 — `any` Types (15 min)

Affected files and their fixes:
- `Canvas.tsx` — Replace `flowStatus: any` with proper phase type
- `types.ts` — Replace `PipelineTemplate` generics with concrete types
- `MiniDagView.tsx` — Replace `e: any` with `Edge` type
- `TemplateBrowser.tsx` — Create `Template` interface
- `LoadPipelineDialog.tsx` — Create `PipelineSummary` interface

### Gap 16 — Hardcoded Paths (10 min)

Find and replace all `/home/dev/...` with imports from `@/lib/global-config`.

### Gap 17 — React.memo (10 min)

```typescript
// FileTreeExplorer.tsx
export const FileTreeExplorer = memo(FileTreeExplorerComponent);

// Canvas.tsx
const MemoizedConfigPanel = memo(ConfigPanel);
```

---

## Phase 4: API & Analytics (2 hours)

### Gap 14 — Pagination (15 min)

```typescript
// GET /api/pipelines
const page = parseInt(searchParams.get("page") || "1");
const limit = parseInt(searchParams.get("limit") || "50");
const start = (page - 1) * limit;
const paginated = pipelines.slice(start, start + limit);
return { pipelines: paginated, total: pipelines.length, page, limit };
```

### Gap 6 — Velocity Tracking (20 min)

Track `startedAt` and `completedAt` per phase. Compute `tasks/sec = completedCount / elapsed`.

### Gap 3 — Similarity Metrics (30 min)

Implement cosine similarity on prompt embeddings and agent profile vectors.

### Gap 8 — Multi-Variable Optimization (1 hour)

Build a resource planner that constrains parallelism based on available agent slots and token budgets.

---

## Verification

After implementation:
1. Run `hermes benchmark rules:Coding-Principles-Benchmark.md`
2. All 17 gaps should show ✅ Fixed
3. Target score: ≥ 208/220 (95%)
4. All existing pipelines should continue to work correctly
