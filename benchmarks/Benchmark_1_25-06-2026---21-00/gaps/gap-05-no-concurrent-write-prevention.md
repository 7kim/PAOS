# Gap 05: No Concurrent Write Prevention

**Source:** Q59  
**Category:** Database  
**Severity:** High  

## The Gap
Two simultaneous execute-flow calls for the same pipeline will both
write to META.json. The last write wins, potentially losing state.

## The Fix
Add a lockfile mechanism or use atomic rename pattern.

## Estimated Effort
15 minutes

## Status
⏳ Pending
