# Gap 02: No DAG Validation on Read

**Source:** Coding-Principles-Benchmark Q27  
**Category:** Data Structures  
**Severity:** High  
**Score:** 0/2  

## The Gap
When reading a pipeline's DAG, there's no validation that edges reference
existing nodes. An edge pointing to a deleted node will cause a silent
failure during cascade.

**Evidence:** `route.ts:[id]/route.ts` — no validation of node references in edges.

## The Fix
Add validation on every DAG read:
```typescript
const nodeIds = new Set(nodes.map(n => n.id));
for (const edge of edges) {
  if (!nodeIds.has(edge.source)) throw new Error(`Edge ${edge.id} references unknown source: ${edge.source}`);
  if (!nodeIds.has(edge.target)) throw new Error(`Edge ${edge.id} references unknown target: ${edge.target}`);
}
```

## Files to Modify
1. `app/api/pipelines/[id]/route.ts` — add DAG validation

## Acceptance Criteria
- Pipeline with invalid edges returns error
- Valid pipeline returns normally

## Dependencies
None

## Estimated Effort
5 minutes

## Status
⏳ Pending
