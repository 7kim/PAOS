# Implementation Plan: Benchmark Gap #2

**Source**: Coding-Principles-Benchmark Q27
**Category**: Data Structures
**Severity**: High
**Score**: 0/2
**Found by**: opencode-developer (Benchmark 2)

## The Gap

DAG validation (cycle detection + edge source/target integrity) is only performed on POST create/save in `pipelines/route.ts`. The `GET /api/pipelines/[id]` endpoint does NOT validate the DAG before returning it. This means edges referencing non-existent nodes could cause silent cascade failures at execution time.

**Evidence:**
- `pipelines/route.ts:250-302` — Validation on POST (cycle + edge reference check)
- `pipelines/[id]/route.ts` — GET handler reads and returns layout without any validation

## The Fix

Add DAG validation to the GET handler at `pipelines/[id]/route.ts`. If the DAG is invalid, return a warning alongside the data (don't block the read — but inform the consumer).

## Files to Modify

1. `dashboard/app/api/pipelines/[id]/route.ts` — Add DAG validation after reading builder-layout.json
   - Verify all edge source/target IDs exist in nodes array
   - Run cycle detection (can reuse the topoSort + cycle check from pipelines/route.ts)
   - Return `warnings` array alongside pipeline data if DAG issues found

## Acceptance Criteria
- GET returns DAG warnings for edges referencing non-existent nodes
- GET returns DAG warnings for cyclic DAGs
- Valid DAGs return clean (no warnings)
- Score on re-audit: 2/2

## Dependencies
- None (cycle detection logic already exists in pipelines/route.ts)

## Estimated Effort
5 minutes

## Status
⏳ Pending — User must trigger via "work on gap 2" or "work on benchmark-gap-02"
