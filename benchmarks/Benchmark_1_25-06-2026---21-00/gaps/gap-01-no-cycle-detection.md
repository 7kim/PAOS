# Gap 01: No Cycle Detection

**Source:** Coding-Principles-Benchmark Q21  
**Category:** Data Structures (Graph Theory)  
**Severity:** High  
**Score:** 0/2  

## The Gap
Kahn's algorithm silently truncates cyclic DAGs. If a user creates a
pipeline with a cycle (A→B→A), the topological sort returns fewer nodes
than expected without any error message. The pipeline appears to work
but skips nodes.

**Evidence:** `execute-flow/route.ts:9-26` — `topoSort` function does not check
`order.length < nodes.length`.

## The Fix
After Kahn's algorithm, add:
```typescript
if (order.length < nodes.length) {
  const cycled = nodes.filter(n => !order.includes(n.id));
  throw new Error(`Pipeline contains a cycle involving: ${cycled.map(n=>n.id).join(', ')}`);
}
```

## Files to Modify
1. `app/api/pipelines/[id]/execute-flow/route.ts` — add cycle check after topoSort

## Acceptance Criteria
- Cyclic pipeline returns error 400 with descriptive message
- Acyclic pipeline executes normally
- POST /api/pipelines also validates and rejects cycles

## Dependencies
None

## Estimated Effort
5 minutes

## Status
⏳ Pending
