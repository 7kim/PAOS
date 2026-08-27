# Reasoning — Plan (planner: opencode-developer)

## What I understand about this task
6 user notes + live bug: (1) env export Blob download to `https://dev.anaconda-notothen.ts.net`, (2) MCP disable/add/delete/edit/repoint, (3) Skills same, (4) Terminals enriched PID·app·CWD·CPU/MEM/IO/GPU·category, (5) delete inboxes/plans/tasks, (6) agents files view/edit/full delete with app→binary mapping. Plus during execution user added 3 pipeline-delete fixes (queue purge, typed confirm, single-only). Pipeline is self: opencode-developer → opencode-developer → verify.

## Key findings from analysis
- Secrets already have `buildEnvWithNotes` logic; export is just that string as Blob — no new API needed (ponytail ladder: stdlib Blob over server Content-Disposition).
- MCP is single `mcp/mcp-config.json` symlinked to 7 agents; page was read-only. Need POST/DELETE atomic + .bak + JSON validation; normalize `enabled/disabled`.
- Skills = `skills/*/SKILL.md` dirs, not DB; toggle via `.disabled` marker; same CRUD pattern as MCP.
- Terminals had `ps aux` but dropped cpu/mem in UI; /proc gives app (`comm`), CWD (`readlink`), VmRSS, io — GPU via `nvidia-smi` optional; network per-PID needs eBPF — skip with n/a note.
- Inboxes/plans/tasks APIs were GET-only; need DELETE with ledger append; pipelines DELETE was `rm` only, left queue ghosts (7 pending + 1 running stuck).
- Agents registry `agents/registry.json` maps `id→binary→configPaths`; need `agents/[id]/files` route with path guard + full delete (rm dir + registry splice + inbox/log).

## Key decisions
- Use client-side Blob for export (0 deps, reuses existing state). Server export only if audit needed.
- Atomic file ops: write to `.tmp` → `rename` + `.bak` for MCP/registry/skills; no DB.
- Path guard whitelist (`agents/`, `config/`, `memory/inbox/`, `logs/`, `skills/`) + `path.resolve` check — prevents traversal.
- Terminals categorize heuristic: cpu>50 = cpu, mem>500MB = memory, io>100MB = io else idle; GPU silent fail.
- Queue fix: DELETE purges `queue.json` (pending/running/done) and GET auto-cleans stale running (fallback scan flat + project dirs) — persistence after clean.
- UI delete for pipelines: typed `${id}_Delete` (like projects) not `confirm()` — prevents mass delete; single dir `rm` only.

## Trade-offs
- Per-PID network bytes skipped (requires `ss -p` + root, noisy) — show "network: n/a" until profiling demands eBPF.
- Skills repoint via editing `SKILL.md` content / sourcePath field, not moving symlink target — minimal FS change, covers "other place".
- Auto-restart after MCP/Skill edits skipped — user restarts agent; avoids watchdog complexity.
- Verification as 2nd opencode invocation (self-verify) vs separate verifier agent — dogfoods pipeline, isolated inbox.

## What could go wrong
- Bad JSON in MCP breaks agents → mitigation: validate has `command` or `url` before write, keep `.bak`.
- Deleting last enabled developer locks pipeline → require typed confirm, block if enabled count==1 unless force.
- /proc reads fail for short-lived pids → try/catch per pid, skip.
- Export leaks secrets → button only behind Tailscale auth, no logging of values.
