# Gap 09: No Rate Limiting

**Source:** Q81 (★)  
**Category:** Security  
**Severity:** Critical ★  

## The Gap
Every API endpoint can be called unlimited times. A single user or bot
can DOS the dashboard by hammering any endpoint.

## The Fix
Add rate limiting middleware in Next.js:
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
// or simple in-memory rate limiter
const rateLimit = new Map<string, {count: number, reset: number}>();
export function middleware(req) {
  const ip = req.ip || 'anonymous';
  const now = Date.now();
  const entry = rateLimit.get(ip) || {count: 0, reset: now + 60000};
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60000; }
  entry.count++;
  if (entry.count > 100) return new Response('Too Many Requests', {status: 429});
  rateLimit.set(ip, entry);
}
```

## Files to Modify
1. `middleware.ts` — add rate limiting

## Estimated Effort
30 minutes

## Status
⏳ Pending
