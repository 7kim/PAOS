# Gap 16: Hardcoded Paths

**Source:** Q108  
**Category:** Code Quality  
**Severity:** High  

## The Gap
Routes hardcode `/home/dev/...` paths instead of using global-config.

## The Fix
Replace all hardcoded paths with imports from `@/lib/global-config`.

## Estimated Effort
10 minutes

## Status
⏳ Pending
