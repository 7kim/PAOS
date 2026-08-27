# Implementation Plan — PAOS 6-Note Batch (self-pipeline)

## Objective
Ship 6 user notes in one self-pipeline (opencode-developer → opencode-developer): env `.env` export, MCP/Skills CRUD + repoint, terminals resource enrichment with app name, delete for inboxes/plans/tasks, agents file explorer + full delete with app→file mapping, plus a verify node that checks plan coverage.

## Scope
- **Files affected**:
  - `dashboard/app/api/mcp-servers/route.ts` (CRUD)
  - `dashboard/app/api/skills/route.ts` (CRUD)
  - `dashboard/app/api/terminals/route.ts` (enrichment)
  - `dashboard/app/api/inbox/route.ts`, `dashboard/app/api/plans/route.ts`, `dashboard/app/api/tasks/route.ts` (DELETE)
  - `dashboard/app/api/agents/route.ts`, new `dashboard/app/api/agents/[id]/files/route.ts`
  - `dashboard/app/mcp-servers/page.tsx`, `dashboard/app/terminals/page.tsx`, `dashboard/app/inbox/page.tsx`, `dashboard/app/plans/page.tsx`, `dashboard/app/tasks/page.tsx`, `dashboard/app/agents/page.tsx`, `dashboard/app/projects/page.tsx`, `dashboard/app/settings/page.tsx`
  - Pipeline artifacts: `memory/pipelines/PAOS/<PIPE>/*`
- **Systems affected**: Next.js dashboard APIs/pages, filesystem configs (`mcp/mcp-config.json`, `skills/*/SKILL.md`, `agents/registry.json`, `/proc`), audit ledger
- **Out of scope**: Per-PID live network bytes (needs eBPF), trash/restore, per-agent marketplace install, auto-restart of agents after MCP/Skill edits

## Technical Approach

### Task 1: Env export/download
- **Approach**: Client-side only. Reuse existing `secretsData` state. Build lines with same logic as `buildEnvWithNotes` (include `# KEY: note`). `new Blob([content], {type:'text/plain'})` → `URL.createObjectURL` → anchor `download`. Global dialog exports `config.env`, project dialog exports `${project}.env`.
- **Files**: `projects/page.tsx`, `settings/page.tsx` (add `Download` button + `exportEnv()` helper next to Save)
- **Rationale**: Zero API change, zero deps. Server already validates on Save; export is read-only view.

### Task 2: MCP servers CRUD
- **Approach**: Single `mcp/mcp-config.json` is source of truth (symlinked to agents). API does `readFile` → `JSON.parse` → mutate `mcpServers[name]` → `JSON.stringify` with 2-space → write to temp + `rename` atomic + copy `.bak`. Validate JSON against minimal schema (must have `command` or `url`). Normalize `enabled` (if `disabled===true` → `enabled=false`). GET returns full objects for UI.
- **Files**: `dashboard/app/api/mcp-servers/route.ts`, `dashboard/app/mcp-servers/page.tsx`
- **Rationale**: No DB, no new service. Atomic rename avoids half-write. UI reuses existing Card layout + Dialog.

### Task 3: Skills CRUD
- **Approach**: Scan `skills/` with `readdir`, read each `SKILL.md` first 20 lines for `disabled` frontmatter or presence in `skills/.disabled/`. POST creates `skills/<name>/SKILL.md` from minimal template (`# <name>\n...`). PUT edits file content. DELETE does `rm -rf` after backing up to `skills/.bak/<name>-<ts>.tgz` via `tar`. Repoint = edit `source` field inside SKILL.md or symlink target path shown as `source path` input.
- **Files**: `dashboard/app/api/skills/route.ts`, page (extend MCP page or dedicated `/skills` tab)
- **Rationale**: Filesystem IS the registry. No extra index. Mirrors `project-scaffolder` pattern.

### Task 4: Terminals enriched
- **Approach**: Keep `registry.getAll()` + `ps aux`. For each pid, try `readFileSync /proc/<pid>/comm` → app, `readlinkSync /proc/<pid>/cwd` → CWD, `readFileSync /proc/<pid>/status` → VmRSS, `readFileSync /proc/<pid>/io` → rchar/wchar, `execSync ps -o %cpu,%mem,etime` → cpu/mem. GPU optional: `execSync nvidia-smi --query-compute-apps=pid,used_memory --format=csv,noheader` → map. Categorize via thresholds. Return enriched objects; page renders badges.
- **Files**: `dashboard/app/api/terminals/route.ts`, `dashboard/app/terminals/page.tsx`
- **Rationale**: Stdlib only (`fs`, `child_process`). No new npm, no daemon. `nvidia-smi` fails silent on non-GPU hosts. Network per-PID skipped — `ss -p` parsing is noisy and needs root.

### Task 5: Delete inboxes/plans/tasks
- **Approach**: Add `DELETE` handlers: inbox → `unlink memory/inbox/<agent>/<id>.md`; plans → `rm -rf memory/pipelines/<proj>/<pipe>` or `unlink memory/pm-logs/<id>-*.md`; tasks → `unlink memory/tasks/<id>.md` or `projects/<proj>/tasks/<id>.md`. Audit: append `DELETE | <path>` to `memory/global_ledger.md` + project ledger. UI: `Trash2` icon + confirm `DELETE_<id>`.
- **Files**: 3 API routes + 3 pages
- **Rationale**: Hard delete with ledger entry; simplest, reversible via git if needed.

### Task 6: Agents file viewer/editor + full delete
- **Approach**: Registry already knows `id → binary → configPaths`. API enriches with `exists/size` via `stat`. New `.../files` route guards `path` must start with allowed roots (`agents/`, `config/`, `memory/inbox/`, `logs/`). GET reads (utf-8), PUT writes with `.bak` + `mkdir -p`. DELETE agent → `rm -rf agents/<id>/` + `read registry.json` → filter out `id` → write + backup + optionally `rm -rf memory/inbox/<id> logs/<id>`. Page: expand card → grouped file tree by AI app (e.g., `opencode-developer` badge shows `binary: opencode`), view/edit modal, delete button.
- **Files**: `dashboard/app/api/agents/route.ts`, new `dashboard/app/api/agents/[id]/files/route.ts`, `dashboard/app/agents/page.tsx`
- **Rationale**: Reuses existing registry; path guard prevents traversal. No new auth — dashboard already behind Tailscale + API_TOKEN.

### Task 7: Verify (2nd node)
- **Approach**: After Tasks 1–6, write `VERIFICATION.md` template, send inbox message to `opencode-developer` (`memory/inbox/developer/<ts>_verify.md`) with prompt: "verify pipeline <PIPE> vs IMPLEMENTATION_PLAN.md, run `npm --prefix dashboard run build` and checklist". Or exec second process `opencode --agent verify`. Status `executing` → `completed` on PASS.
- **Files**: `VERIFICATION.md`, `pipeline.json`, inbox message
- **Rationale**: Dogfooding PAOS pipeline — verifier is same binary, isolated inbox.

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Malformed MCP/Skills JSON breaks agents | Med | High | Validate parse + schema before write; keep .bak; atomic rename |
| Path traversal in agent file editor | Med | High | Whitelist roots; reject `..` segments; use `path.resolve` check |
| /proc read fails for short-lived pids | High | Low | Try/catch per pid; skip failed entries |
| Deleting last enabled developer locks pipeline | Low | High | Require `DELETE_<id>` confirm; block if `enabled` count ==1 unless force flag |
| Export leaks secrets to browser | Med | Med | Button only after auth; no logging of values; warn in UI |

## Rollback Strategy
- Every write creates `.bak` (`mcp-config.json.bak`, `registry.json.bak`, `SKILL.md.bak`, file `.bak`). Rollback = `cp .bak original` + `systemctl --user restart paos-hub` if needed.
- Git: `git checkout -- mcp/mcp-config.json agents/registry.json` restores committed state.
- Pipeline delete: `rm -rf memory/pipelines/PAOS/<PIPE>` is safe (no prod data).

## Design Rationale
- Ponytail ladder: stdlib (`fs`, `Blob`) over new deps; reuse `buildEnvWithNotes` instead of new server export; atomic file ops over DB; single JSON file over registry service.
- Deletion over addition: extend existing routes/pages rather than new services.
- Shortest diff wins: client-side export (5 lines) vs server `Content-Disposition`; `readlink /proc` vs `lsof`.
- Marks: `// ponytail: global lock, per-pid if throughput matters` and `# ponytail: heuristic category, eBPF when profiling demands` where shortcuts exist.

---

## Approval
Write `## APPROVED` below when ready to proceed, or add `<!-- COMMENT: ... -->` blocks inline for revisions.
