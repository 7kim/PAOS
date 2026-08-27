# TASKS — PAOS 6-Note Batch (self-pipeline opencode→opencode)

[ ] Task 1: Env export/download .env — global + project [S]
File: `dashboard/app/projects/page.tsx`, `dashboard/app/settings/page.tsx`, (no API change)
- Add `exportEnv()` helper: reuse `buildEnvWithNotes` logic client-side → `Blob` → `URL.createObjectURL` → `<a download>`
- Global: filename `config.env` or `.env`; project: `${project}.env`
- Preserve `# KEY: note` comments
- Test: create 2 secrets + notes → Export → open file → verify content

[ ] Task 2: MCP servers CRUD — disable/add/delete/edit/repoint [M]
Files: `dashboard/app/api/mcp-servers/route.ts`, `dashboard/app/mcp-servers/page.tsx`
- API: extend GET to return full server objects; add POST (upsert), DELETE (remove) with `readFile→writeFile` atomic rename + `.bak` + JSON validation
- Normalize `enabled/disabled` to single flag; support both `command/args/env` and `type:http/url/headers`
- Page: toggle switch, Edit dialog (command, args, env k=v, url, headers), Add dialog, Delete confirm, "restart agent to apply" note
- No new deps; reuse existing mcp-config.json symlinked path

[ ] Task 3: Skills CRUD — same as MCP [M]
Files: `dashboard/app/api/skills/route.ts`, `dashboard/app/mcp-servers/page.tsx` or `dashboard/app/skills/page.tsx` (extend existing or add tab)
- API: scan `skills/*/SKILL.md` via `readdir`; GET returns list + enabled flag (frontmatter `disabled`), POST upserts (mkdir+write), DELETE rm -rf with .bak zip
- Page: list skills with enabled toggle, Edit (SKILL.md source path/description), Add, Delete; show `source path` to support repointing
- Depends: Task 2 pattern reuse

[ ] Task 4: Terminals enriched — PID + app name + resources + category [M]
Files: `dashboard/app/api/terminals/route.ts`, `dashboard/app/terminals/page.tsx`
- API: for each pid from `registry` + `ps aux`, enrich with `comm` (app name via /proc/pid/comm or ps -o comm), CWD via readlink /proc/pid/cwd, VmRSS via /proc/pid/status, IO via /proc/pid/io (read/write bytes), CPU% MEM% via ps, GPU via `nvidia-smi --query-compute-apps=pid,used_memory` (optional, fail silent)
- Categorize: cpu-heavy (>50% CPU) | memory-heavy (>500MB RSS) | io-heavy (>100MB R+W) | idle
- Page: render row as `PID · app · cmd · CWD` + badges `CPU% / MEM MB / R/W MB / GPU` + category; fix bug where existing cpu/mem not displayed
- Depends: none

[ ] Task 5: Delete inboxes / plans / tasks [S]
Files: `dashboard/app/api/inbox/route.ts`, `dashboard/app/api/plans/route.ts`, `dashboard/app/api/tasks/route.ts`, `dashboard/app/inbox/page.tsx`, `dashboard/app/plans/page.tsx`, `dashboard/app/tasks/page.tsx`
- API: add DELETE (single id via ?id=) and DELETE collection (inbox dir / PIPE dir) with `unlink/rm` + audit append to `memory/global_ledger.md`
- Page: add trash icon + confirm `DELETE_<id>` for each list item; bulk no
- Depends: none

[ ] Task 6: Agents file viewer/editor + full delete + app→file mapping [L]
Files: `dashboard/app/api/agents/route.ts`, `dashboard/app/api/agents/[id]/files/route.ts` (new), `dashboard/app/agents/page.tsx`, `agents/registry.json` (read/write)
- API: enrich GET /api/agents to return `configPaths[{path,exists,size}] + inbox + log + soul` from registry; new route `GET/PUT/DELETE /api/agents/[id]/files?path=` with `readFile/writeFile` + .bak + path traversal guard (must be within allowed roots)
- Page: agent card → expand → file tree grouped by AI app (registry binary mapping, e.g., developer→opencode→config/opencode/opencode.json + agents/developer/soul.md); click to view/edit modal, delete agent button does `rm -rf agents/<id>/ + remove registry entry + optionally remove inbox/log` with confirm `DELETE_<id>`
- Depends: none (reads registry already)

[ ] Task 7: Verify — launch opencode as 2nd node to verify plan coverage [S]
Files: `memory/pipelines/PAOS/<PIPE>/VERIFICATION.md`, inbox message to `opencode-developer`
- After Tasks 1–6 done, write `VERIFICATION.md` checklist vs IMPLEMENTATION_PLAN.md, then spawn verification via `POST /api/send-message` or direct exec: second opencode reads plan + diff + runs `npm run build` + manual checks, reports PASS/FAIL per task
- Pipeline status → completed when verified
