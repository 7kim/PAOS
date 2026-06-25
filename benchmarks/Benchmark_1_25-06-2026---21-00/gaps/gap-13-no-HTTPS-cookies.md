# Gap 13: No HTTPS Cookies or HSTS

**Source:** Q90  
**Category:** Security  
**Severity:** High  

## The Gap
Served over tailscale tunnel. No Secure, HttpOnly, SameSite cookie flags.
No HSTS headers.

## The Fix
Add HSTS header and ensure cookies have secure flags where applicable.

## Estimated Effort
10 minutes

## Status
⏳ Pending
