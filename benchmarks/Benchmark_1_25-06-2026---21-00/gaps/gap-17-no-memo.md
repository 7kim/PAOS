# Gap 17: Components Without React.memo

**Source:** Q110  
**Category:** Code Quality  
**Severity:** High  

## The Gap
Several components lack React.memo, causing unnecessary re-renders
when parent state changes.

## Files to Fix
1. `FileTreeExplorer.tsx` — exports without memo
2. `Canvas.tsx` — internal components without memo

## The Fix
Wrap each component's export: `export const X = memo(XComponent)`

## Estimated Effort
10 minutes

## Status
⏳ Pending
