# Walkthrough — PAOS Projects Page

## Summary

Built a Projects page on the PAOS dashboard with file-explorer layout, Current/Previous tabs, and 3 API endpoints. Zero new npm dependencies — all custom components using existing lucide-react icons.

## Files Created

| # | File | Purpose |
|---|------|---------|
| 1 | `dashboard/app/api/projects/route.ts` | GET /api/projects — lists all projects (current + previous) with status, last activity, ledger count |
| 2 | `dashboard/app/api/projects/[name]/route.ts` | GET /api/projects/[name] — project detail + last 10 ledger entries |
| 3 | `dashboard/app/api/projects/[name]/tree/route.ts` | GET /api/projects/[name]/tree — recursive file tree (depth 3, skips node_modules/.git/.next) |
| 4 | `dashboard/components/Tabs.tsx` | Reusable tab bar component with optional count badges |
| 5 | `dashboard/components/ProjectTree.tsx` | Recursive file tree with expand/collapse, folder/file icons, selection highlighting |
| 6 | `dashboard/app/projects/page.tsx` | Main Projects page — split-panel (30% tree / 70% detail), Current/Previous tabs, 30s auto-refresh |

## Files Modified

| # | File | Change |
|---|------|--------|
| 7 | `dashboard/components/Sidebar.tsx` | Added `FolderKanban` import and "Projects" nav link after "Overview" |

## Data Sources

- `~/AI_Workflow/projects.md` — active project registry markdown table
- `~/AI_Workflow/memory/projects/<name>/ledger.md` — per-project audit trails
- `~/AI_Workflow/knowledge/previous-projects/` — archived projects
- Filesystem for tree view (max depth 3, skip build artifacts)

## API Endpoints

### GET /api/projects
Returns `{ current: [...], previous: [...] }` with name, path, status, lastActivity, ledgerCount per project.
- 30s TTL cache

### GET /api/projects/[name]
Returns project details + last 10 ledger entries (reversed, newest first).
- 30s TTL cache per-name

### GET /api/projects/[name]/tree
Returns recursive tree `{ tree: [{name, type, path, children}] }` — max depth 3, skips node_modules/.git/.next/__pycache__/.hermes/cache/.cache/hidden.

## Verification

- `curl http://localhost:3333/api/projects` — returns 200 with PAOS + 3 empty projects
- `curl http://localhost:3333/api/projects/PAOS` — returns 200 with ledger entries
- `curl http://localhost:3333/api/projects/PAOS/tree` — returns 200 with `ledger.md` as tree leaf
- `curl http://localhost:3333/projects` — returns 200, page renders

## Known Issues

- `lastActivity` shows "INIT" for PAOS project because the ledger literally contains "INIT" as its timestamp (actual data, not a bug)
- Previous-projects currently empty (`knowledge/previous-projects/` has only README.md) — tab shows 0

## Deviations from Plan

None. Implemented exactly per PLAN.md.
