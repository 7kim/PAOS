# Implementation Plan: PAOS Projects Page

## Objective
Build a Projects page on the PAOS dashboard with a file-explorer-style layout, two tabs (Current / Previous), and three new API endpoints to serve the data. Zero new npm dependencies — lightweight custom components only.

## Files to Create
1. `dashboard/app/api/projects/route.ts` — GET /api/projects (list all projects with status)
2. `dashboard/app/api/projects/[name]/route.ts` — GET /api/projects/[name] (detail + recent ledger)
3. `dashboard/app/api/projects/[name]/tree/route.ts` — GET /api/projects/[name]/tree (directory tree)
4. `dashboard/app/projects/page.tsx` — Projects page with tabs + split-panel layout
5. `dashboard/components/ProjectTree.tsx` — Recursive file-tree component (zero deps)
6. `dashboard/components/Tabs.tsx` — Simple tab component

## Files to Modify
- `dashboard/components/Sidebar.tsx` — Add "Projects" nav link under Dashboard section

## Data Sources
- `~/AI_Workflow/projects.md` — active project registry (markdown table)
- `~/AI_Workflow/memory/projects/<name>/ledger.md` — per-project audit trails
- `~/AI_Workflow/knowledge/previous-projects/` — archived project docs
- Filesystem for tree view

## API Design

### GET /api/projects
Returns `{ current: [...], previous: [...] }` with name, path, stack, status, lastActivity, ledgerCount, fileCount per project.

### GET /api/projects/[name]
Returns project details + last 10 ledger entries.

### GET /api/projects/[name]/tree
Returns recursive tree `{ tree: [{name, type, path, children}] }` — max depth 3, skip node_modules/.git/.next.

## Frontend Design
- Split panel: 30% tree sidebar | 70% detail panel
- Tab bar: "Current Projects" | "Previous Projects"
- ProjectTree: recursive component, lucide-react icons (Folder, FileText, ChevronRight/Down)
- Zero new npm deps — everything custom
- 30s auto-refresh, loading states

## Performance
- 30s TTL cache on all 3 API routes (like existing doctor cache)
- Tree depth capped at 3
- Skip node_modules, .git, .next in traversal