# Reasoning — Execute (executor: opencode-developer)

## What I understand
Execute TASKS.md 1→6 in order, plus live pipeline-delete fixes (queue purge, typed confirm, single-only) that emerged mid-execution when user clicked Play and saw 7 ghosts + 1 stale running blocking queue. Must keep ponytail: fewest files, shortest diff, stdlib first.

## Execution strategy
1. **Task 1 export**: add `exportGlobalSecrets()` / `exportProjectSecrets()` helpers next to `save*` — Blob + anchor, preserve `# KEY: note`. No API. Add `Download` import.
2. **Task 2 MCP**: replace `GET` to return `raw` + `enabled`, add `POST` (upsert, validate command|url, copy .bak, tmp→rename) + `DELETE` (?id). Page: rewrite to CRUD with toggle (Power), Edit/Add dialog (stdio:http switch), env as `KEY=VALUE` lines, headers JSON, typed Delete. Reuse existing Card.
3. **Task 3 Skills**: new `GET` scans `skills/*` via `readdir` + `stat` + read first lines for `disabled`, `POST` mkdir+write `SKILL.md` + `.disabled` marker, `DELETE` rm -rf + .bak. New `app/skills/page.tsx` mirrors MCP CRUD (View/Edit/Toggle/Delete, sourcePath repoint field).
4. **Task 4 Terminals**: enrich `GET` with `readFileSync /proc/pid/comm|cwd|status|io` + `ps` cpu/mem + `nvidia-smi` map; categorize; page adds `app` badge beside PID, resource badges (CPU/MEM MB/IO/GPU) + category + CWD/cmd detail pane. Fix bug where cpu/mem not displayed.
5. **Task 5 deletes**: add `DELETE` to `inbox` (id+inbox+project), `tasks` (id scan all projects), `plans` (rm pipeline dir or pm-logs) all `appendFile global_ledger.md`; pages add Trash + `confirm()` (typed for pipelines only).
6. **Task 6 agents**: new `api/agents/[id]/files` (GET list from registry `configPaths`+agentDir+inbox/log with exists/size/binary mapping, GET file, PUT .bak, DELETE file or whole agent → rm dir + registry splice + inbox/log). Page: expand Files → per-file View/Edit/Delete + Delete Agent typed `${id}_Delete`.
7. **Live fixes**: `pipelines/[id]/route.ts DELETE` exact `rm` + queue purge (incl flat check), `queue/route.ts GET` clean stale pending+running (fallback scan flat/project dirs) + persist, `pipelines/page.tsx` typed dialog.

## What to watch
- MCP/Skills writes must be atomic — never partial JSON.
- Path guard must reject `..` and non-whitelisted roots.
- Terminals /proc reads per pid must not crash whole GET — wrap each in try/catch.
- Pipeline DELETE must not wildcard — test deleting one leaves others.

## Why this approach
- Stdlib (`fs`, `child_process`, `Blob`) over new deps; reuse `buildEnvWithNotes` vs new endpoint; single JSON file over service.
- Delete over addition: extend existing routes/pages, not new services.
- Shortest diff: client Blob (5 lines) vs server disposition; `readlink` vs `lsof`.

## Deviations
- Skills repoint via sourcePath field not symlink move — minimal.
- Network per-PID skipped — ponytail heuristic, eBPF when needed.
- Auto-restart skipped — user restarts agent.
