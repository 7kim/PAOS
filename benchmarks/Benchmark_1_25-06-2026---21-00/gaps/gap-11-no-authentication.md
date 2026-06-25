# Gap 11: No Authentication

**Source:** Q85 (★)  
**Category:** Security  
**Severity:** Critical ★  

## The Gap
Every endpoint is publicly accessible. Anyone with network access to
the tailscale tunnel can create, delete, or modify pipelines, projects,
and configurations.

## The Fix
Implement at minimum a shared API token check:
```typescript
// middleware.ts
export function middleware(req) {
  const token = req.headers.get('x-api-token');
  if (!token || token !== process.env.API_TOKEN) {
    return new Response('Unauthorized', {status: 401});
  }
}
```

## Files to Modify
1. `middleware.ts` — add auth check

## Estimated Effort
20 minutes

## Status
⏳ Pending
