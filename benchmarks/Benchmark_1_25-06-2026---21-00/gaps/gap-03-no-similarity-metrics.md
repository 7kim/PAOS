# Gap 03: No Similarity Metrics

**Source:** Q37  
**Category:** Linear Algebra  
**Severity:** Medium  

## The Gap
Template matching is exact-match only. No cosine similarity, distance
metrics, or vector embeddings for comparing agent/node configurations.

## The Fix
Implement cosine similarity for prompt matching and agent vector profiles.

## Files to Modify
1. `components/pipeline-builder/types.ts` — add AgentVector type
2. `lib/similarity.ts` — new file with cosine/euclidean functions

## Estimated Effort
30 minutes

## Status
⏳ Pending
