# Gap 14: No Pagination

**Source:** Q96  
**Category:** API Endpoints  
**Severity:** High  

## The Gap
GET /api/pipelines returns ALL pipelines. Will time out or crash with
>1000 pipelines.

## The Fix
Add pagination: `?page=1&limit=50` with total count in response.

## Estimated Effort
15 minutes

## Status
⏳ Pending
