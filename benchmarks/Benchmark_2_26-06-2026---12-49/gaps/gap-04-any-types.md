# Implementation Plan: Benchmark Gap #4

**Source**: Coding-Principles-Benchmark Q102
**Category**: Code Quality
**Severity**: High
**Score**: 0/2
**Found by**: opencode-developer (Benchmark 2)

## The Gap

47 `any` types exist across the codebase. Each `any` is an admission that the type is unknown, bypassing TypeScript's type checking and potentially hiding bugs. This is a systemic code quality issue.

**Evidence:** See below for complete list of `any` occurrences.

## Files to Modify (47 occurrences)

### `dashboard/lib/pipeline-analytics.ts`
- Line 22: `recent: any[]` — should be `RecentPipeline[]` with proper interface

### `dashboard/app/system/doctor/page.tsx`
- Line 11: `detail: any` — should be specific type

### `dashboard/app/benchmarks/page.tsx`
- Lines 227, 287, 316, 370, 373: `cat: any`, `g: any`, `gap: any` — should be typed

### `dashboard/app/agents/page.tsx`
- Line 71: `(p: any)` — should use proper agent type

### `dashboard/app/page.tsx`
- Lines 128-129: `a: any` — should be typed

### `dashboard/app/pipelines/[id]/visualize/page.tsx`
- Line 46: `nodes: any[]; edges: any[]` — should use proper DAG types

### `dashboard/app/pipelines/page.tsx`
- Lines 739, 794: `t: any`, `body: any` — should be typed

### `dashboard/app/pipelines/builder/page.tsx`
- Line 80: `layout: any` — should be `BuilderLayout`

### `dashboard/app/api/system/services/route.ts`
- Line 73: `e: any` — should be `unknown`

### `dashboard/app/api/benchmarks/[id]/route.ts`
- Lines 32, 65: `gaps: any[]`, `categories: any[]` — should be typed

### `dashboard/app/api/benchmarks/route.ts`
- Line 13: `benchmarks: any[]` — should be typed

### `dashboard/app/api/agents/[id]/toggle/route.ts`
- Line 15: `(a: any)` — should be `AgentEntry`

### `dashboard/app/api/agents/route.ts`
- Line 23: `e: any` — should be `unknown`

### `dashboard/app/api/inbox/route.ts`
- Line 7: `messages: any[]` — should be `InboxMessage[]`

### `dashboard/app/api/pipelines/schedule/route.ts`
- Line 11: `schedules: any[]` — should be `Schedule[]`

### `dashboard/app/api/pipelines/[id]/phases/[nodeId]/skip/route.ts`
- Lines 50-51: `(e: any)` — should be `Edge`

### `dashboard/app/api/pipelines/[id]/phases-to-layout/route.ts`
- Lines 42, 57: `(p: any)`, `(n: any)` — should be typed

### `dashboard/app/api/pipelines/[id]/flow-status/route.ts`
- Line 39: `(p: any)` — should be typed

### `dashboard/app/api/pipelines/[id]/execute-flow/route.ts`
- Lines 18, 62, 84, 204, 317, 367, 377, 378, 392, 395, 411: Multiple `any` usages — should use proper types (Node, Edge, Phase, QueueItem, etc.)

### `dashboard/app/api/pipelines/route.ts`
- Lines 175, 201, 207, 250, 268, 300, 341: Multiple `any` usages — should use proper types

### `dashboard/app/api/terminals/route.ts`
- Lines 7, 54: `procs: any[]`, `e: any` — should be typed

## The Fix

Replace each `any` with the correct TypeScript type. This is a mechanical task that can be done incrementally per file.

## Acceptance Criteria
- Zero `any` types in the codebase
- All replaced with proper interfaces or types
- TypeScript compilation succeeds with no errors
- No behavioral changes
- Score on re-audit: 2/2

## Dependencies
- Some types may need to be defined first (if they don't exist yet)

## Estimated Effort
30 minutes (mechanical replacement)

## Status
⏳ Pending — User must trigger via "work on gap 4" or "work on benchmark-gap-04"
