# Implementation Plan: Benchmark Gap #3

**Source**: Coding-Principles-Benchmark Q64
**Category**: Calculus
**Severity**: Medium
**Score**: 0/2
**Found by**: opencode-developer (Benchmark 2)

## The Gap

Pipeline progress jumps discretely from value to value (e.g., 0→1→2→3→4/4) with no interpolation or smoothing. For long-running phases, the progress bar provides no granular indication of within-phase progress.

**Evidence:**
- `execute-flow/route.ts:318` — `progress = runningCount/total` — discrete phase count increments
- No EMA (exponential moving average) or smoothing function exists anywhere in the codebase

## The Fix

Implement a simple EMA-based smoothing for progress display values, so the progress bar shows gradual movement rather than discrete jumps. This should be entirely cosmetic — the actual progress counter stays as-is, but the displayed value is smoothed.

## Files to Modify

1. `dashboard/lib/pipeline-analytics.ts` — Add `smoothProgress(current: number, previous: number, alpha?: number): number` EMA function
2. `dashboard/app/api/pipelines/[id]/flow-status/route.ts` — Apply smoothing to the progress value returned to the frontend
3. `dashboard/components/pipeline-builder/ReadOnlyNode.tsx` or Canvas.tsx — Smooth the displayed progress bar

## Acceptance Criteria
- Progress bar shows smooth interpolation instead of discrete jumps
- EMA function has configurable alpha (default 0.3)
- Actual progress counter is unchanged (still accurate)
- Score on re-audit: 2/2

## Dependencies
- None

## Estimated Effort
20 minutes

## Status
⏳ Pending — User must trigger via "work on gap 3" or "work on benchmark-gap-03"
