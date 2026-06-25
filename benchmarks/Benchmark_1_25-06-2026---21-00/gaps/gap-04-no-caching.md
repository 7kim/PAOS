# Gap 04: No File Read Caching

**Source:** Q56 (★)  
**Category:** Database  
**Severity:** Critical ★  

## The Gap
Every API call re-reads META.json and pipeline-flow.json from disk.
A single request to GET /api/pipelines/[id] reads both files, and the
flow-status endpoint re-reads them again.

## The Fix
Add a simple in-memory cache with 5-second TTL:
```typescript
const cache = new Map<string, {data: any, expiry: number}>();
async function cachedRead<T>(key: string, reader: () => Promise<T>, ttl=5000): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) return cached.data;
  const data = await reader();
  cache.set(key, {data, expiry: Date.now() + ttl});
  return data;
}
```

## Estimated Effort
20 minutes

## Status
⏳ Pending
