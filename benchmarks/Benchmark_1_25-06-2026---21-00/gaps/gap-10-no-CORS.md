# Gap 10: No CORS Configuration

**Source:** Q82  
**Category:** Security  
**Severity:** High  

## The Gap
CORS is not explicitly configured. Default behaviour may use wildcard,
allowing any origin to make requests.

## The Fix
Add CORS headers in middleware or next.config.js:
```javascript
// next.config.js
headers: async () => [{
  source: '/api/:path*',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: 'https://dev.anaconda-notothen.ts.net' },
    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
  ]
}]
```

## Estimated Effort
10 minutes

## Status
⏳ Pending
