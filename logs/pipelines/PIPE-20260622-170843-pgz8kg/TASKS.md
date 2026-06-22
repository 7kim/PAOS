# TASKS — PAOS Projects Page

[ ] Task 1: Create API route — GET /api/projects [M]
File: `dashboard/app/api/projects/route.ts`
- Parse projects.md for active projects
- Scan memory/projects/ for additional project dirs with ledgers
- Check knowledge/previous-projects/ for archived metadata
- Return { current: [...], previous: [...] }
- Add 30s TTL cache

[ ] Task 2: Create API route — GET /api/projects/[name] [S]
File: `dashboard/app/api/projects/[name]/route.ts`
- Read memory/projects/<name>/ledger.md — last 10 entries
- Return project name, path, status, stack, ledger entries

[ ] Task 3: Create API route — GET /api/projects/[name]/tree [M]
File: `dashboard/app/api/projects/[name]/tree/route.ts`
- Recursive fs.readdir with depth 3
- Skip node_modules, .git, .next, __pycache__, .hermes/cache
- Return { tree: [...] }

[ ] Task 4: Create Tabs component [S]
File: `dashboard/components/Tabs.tsx`
- Props: tabs, activeId, onChange
- Horizontal tab bar matching dashboard theme

[ ] Task 5: Create ProjectTree component [M]
File: `dashboard/components/ProjectTree.tsx`
- Recursive component — folder with chevron toggle, file as leaf
- Icons: Folder, FileText, ChevronRight/Down from lucide-react
- Zero external deps

[ ] Task 6: Create Projects page [L]
File: `dashboard/app/projects/page.tsx`
- Split-panel: 30% tree, 70% detail
- Tabs: Current / Previous Projects
- Fetch projects → populate tree → click node → show details
- Loading states + 30s auto-refresh

[ ] Task 7: Update Sidebar [XS]
File: `dashboard/components/Sidebar.tsx`
- Add Projects link with FolderKanban icon

[ ] Task 8: Verify & restart [XS]
- Restart paos-dashboard (systemctl --user restart)
- Verify /api/projects returns 200 with data
- Verify /projects page renders in browser