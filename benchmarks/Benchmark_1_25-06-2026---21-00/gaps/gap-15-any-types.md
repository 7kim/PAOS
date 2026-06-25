# Gap 15: any Types

**Source:** Q102  
**Category:** Code Quality  
**Severity:** High  

## The Gap
~13 `: any` type annotations found across 5 files. Each `any` is an
admission that the type is unknown.

## Files with any
1. `Canvas.tsx` — flowStatus, templateToLoad params
2. `types.ts` — PipelineTemplate generic
3. `MiniDagView.tsx` — edge/node mapping functions
4. `TemplateBrowser.tsx` — template data shapes
5. `LoadPipelineDialog.tsx` — API response shapes

## The Fix
Replace each `any` with the correct interface. For API responses,
create response types. For dynamic node data, use proper union types.

## Estimated Effort
15 minutes

## Status
⏳ Pending
