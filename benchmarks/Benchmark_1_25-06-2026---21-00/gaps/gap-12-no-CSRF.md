# Gap 12: No CSRF Protection

**Source:** Q87  
**Category:** Security  
**Severity:** High  

## The Gap
All POST/PUT/DELETE endpoints lack CSRF tokens. A third-party site
could submit requests on behalf of an authenticated user.

## The Fix
Add CSRF token generation and validation for state-changing endpoints.

## Estimated Effort
15 minutes

## Status
⏳ Pending
