# Implementation Plan: Benchmark Gap #1

**Source**: Coding-Principles-Benchmark Q26
**Category**: Data Structures
**Severity**: Medium
**Score**: 0/2
**Found by**: opencode-developer (Benchmark 2)

## The Gap

`selectedSkills` is stored as an ordinary Array in `ConfigPanel.tsx`, but skills should be unique. Using `.includes()` on an array for uniqueness checks is O(n) instead of O(1) with `Set.has()`.

**Evidence:**
- `ConfigPanel.tsx:279` — `const enabled = (nodeData.selectedSkills || []).includes(skill.name)`
- `ConfigPanel.tsx:288` — `const current = nodeData.selectedSkills || []`
- `ConfigPanel.tsx:292` — `onUpdate(node.id, { selectedSkills: next })` — next is built as array

## The Fix

Change `selectedSkills` from `string[]` to `Set<string>` in the node data interface, and update the ConfigPanel to use Set operations.

## Files to Modify

1. `dashboard/components/pipeline-builder/ConfigPanel.tsx` — change selectedSkills handling from array to Set
2. `dashboard/components/pipeline-builder/types.ts` — update the node data interface to use `Set<string>` for selectedSkills

## Acceptance Criteria
- `selectedSkills` is a `Set<string>` in the type interface
- Adding a skill twice doesn't create duplicates
- `enabled` check uses `Set.has()` instead of `Array.includes()`
- Score on re-audit: 2/2

## Dependencies
- None

## Estimated Effort
5 minutes

## Status
⏳ Pending — User must trigger via "work on gap 1" or "work on benchmark-gap-01"
