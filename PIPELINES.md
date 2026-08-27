# PIPELINES — PAOS Pipeline Contract (single source of truth)

> **Read this before creating any pipeline.** This file is the executable standard. `bin/h-pipeline` and `dashboard/app/api/pipelines/[id]/route.ts` enforce it. If Visualize is blank, you skipped this file.

## 1. What a Pipeline Must Have to Show Everything in Visualize

Every pipeline at `memory/pipelines/PAOS/<PIPE-ID>/` (mirrored to `logs/pipelines/PAOS/<PIPE-ID>/` and flat `memory/pipelines/<PIPE-ID>/`) must contain:

```
<PIPE-ID>/
├── META.json               # required — phases with `id`, status, artifacts
├── pipeline.json           # required — {status, progress:"x/y", currentTask, startedAt, completedAt}
├── PLAN.md                 # required — copy of IMPLEMENTATION_PLAN.md (visualize tabs both keys)
├── IMPLEMENTATION_PLAN.md  # required — Antigravity Plan (also aliased as PLAN.md)
├── TASKS.md                # required — [ ]/[~]/[x] with [S/M/L]
├── WALKTHROUGH.md          # required — summary, files, commands, verification (per Article VIII)
├── VERIFICATION.md         # required if Verify phase exists — 2nd-node checklist vs plan + build
├── pipeline-flow.json      # required for flower graph — {order:["planner","executor","verifier"], phases:{<id>:{status,agent,role,label,order}}}
├── builder-layout.json     # required for flower graph — {nodes:[{id,type:"phase",position:{x,y},data:{label,agent,status}}], edges:[{source,target}]}
└── phases/
    ├── planner/            # id must match META.json phases[].id
    │   ├── IMPLEMENTATION.md
    │   ├── REASONING.md    # required — thinking per node (this was missing → blank Reasoning tab)
    │   ├── TASKS.md
    │   └── WALKTHROUGH.md
    ├── executor/
    │   ├── IMPLEMENTATION.md
    │   ├── REASONING.md
    │   ├── TASKS.md
    │   └── WALKTHROUGH.md
    └── verifier/
        ├── IMPLEMENTATION.md
        ├── REASONING.md
        ├── TASKS.md
        └── WALKTHROUGH.md
```

**Why it was blank before:** we used `paos-pipe-id` + manual `mkdir` (flat Antigravity: only root `PLAN.md`/`TASKS.md`) — no `phases/*/REASONING.md`, no `pipeline-flow.json`/`builder-layout.json`, and `META.json` phases had no `id`. Dashboard `GET /api/pipelines/[id]/route.ts:75-340` synthesizes `phases[].reasoning` from `phases/<id>/REASONING.md` and DAG from `builder-layout.json` — missing files → empty graph + empty Reasoning tab (even though `WALKTHROUGH.md`/`TASKS.md` showed via fallback).

## 2. Status & Queue Contract

- `META.json` phases: `[{id:"planner"|"executor"|"verifier"|"n0"|"n1", agent, role, label, status:"pending|executing|completed", artifacts:["..."]}]` — `id` must equal `phases/<id>/` dir name.
- `pipeline.json`: `{"status":"executing"|"completed", "progress":"x/y", "currentTask":"...", "startedAt","completedAt"}` — dashboard derives `%` from this; also from `TASKS.md` `[x]` count.
- Queue: `memory/queue/queue.json` `{pending:[], running:null|{id}, done:[]}` — `GET /api/queue` auto-cleans stale `pending`/`running` whose `META.json` missing or `status:completed|failed` (including flat + project scan). `DELETE /api/pipelines/[id]` must purge queue (`pending/running/done`) — otherwise ghosts block next pipeline. Visualize queue panel reads `queue` field from `GET /api/pipelines`.

## 3. How to Create (Never manual mkdir)

```bash
# 1. Generate ID
bin/paos-pipe-id                          # → AI_Workflow-PIPE_N-DD-MM-YYYY---HH-MM

# 2. Submit via h-pipeline (creates all required files)
bin/h-pipeline submit --planner opencode-developer --prompt "your prompt" --plan ./IMPLEMENTATION_PLAN.md --tasks ./TASKS.md
# or dashboard: POST /api/pipelines {project:"PAOS", prompt, planMd, tasksMd}

# 3. The handler creates: META.json, pipeline.json, PLAN.md, TASKS.md, pipeline-flow.json, builder-layout.json, phases/<id>/{IMPLEMENTATION.md,REASONING.md,TASKS.md}
# 4. Execute
curl -X POST http://localhost:3333/api/pipelines/<PIPE-ID>/execute -H "Content-Type: application/json" -d '{"prompt":"..."}'
# or dashboard Play ▶️ — queue pending→running

# 5. Per phase, agent writes: phases/<id>/REASONING.md, updates pipeline.json progress, then WALKTHROUGH.md
# 6. On done: curl -X POST http://localhost:3333/api/queue -d '{"action":"done","status":"completed"}'  → moves running→done
```

**Checklist before `Execute` (agent must verify):**
- [ ] `META.json` phases each have `id` and `artifacts` includes its `REASONING.md`
- [ ] `phases/<id>/REASONING.md` exists and non-empty
- [ ] `pipeline-flow.json` order matches `META.json` phases order
- [ ] `builder-layout.json` nodes x=0,250,500 linear (or Flow Builder layout) and edges chain
- [ ] `TASKS.md` markers `[ ]` pending, `[x]` done — dashboard counts from both `TASKS.md` and `pipeline.json`
- [ ] `pipeline.json` `status:executing` `progress:0/y` at start

## 4. Visualize Contract

`dashboard/app/api/pipelines/[id]/route.ts`:
- Reads `META.json` phases → builds `phases[]` with `artifacts` + fallback `readdir *.md` + `phases/<id>/REASONING.md|TASKS.md|WALKTHROUGH.md`
- Reads `pipeline-flow.json` for DAG order; if missing, synthesizes from `META.json` phases (fallback added: linear builder-layout if `builder-layout.json` missing → flower never blank)
- `versionedArtifacts` groups `PLAN.md` vs `IMPLEMENTATION_PLAN.md` (both must be present — copy one to the other)

If you create a pipeline flat (only root files), Visualize will still show markdown via fallback, but **graph + Reasoning will be empty** until you backfill `phases/*/REASONING.md` + `pipeline-flow.json`/`builder-layout.json`.

## 5. Instructions to Agents (Read This)

- **Planner (`@plan`, `opencode-developer` as planner, `hermes-nous`)**: `Read workflow.md` + `Read PIPELINES.md` + `Read skills/antigravity-review-loop/SKILL.md` before writing `IMPLEMENTATION_PLAN.md`/`TASKS.md`. Then `bin/h-pipeline submit` — never `mkdir` manually.
- **Executor (`opencode-developer`)**: `Read memory/pipelines/PAOS/<PIPE>/META.json` + `PLAN.md` + `TASKS.md` + `phases/<id>/IMPLEMENTATION.md` → execute → write `phases/<id>/REASONING.md` (THINKING per Article III), update `TASKS.md` `[~]→[x]` and `pipeline.json` live, then `WALKTHROUGH.md`.
- **Verifier (2nd opencode)**: `Read PIPELINES.md` checklist → `grep` per task + `npm --prefix dashboard run build -- --webpack` + `curl /api/queue` → write `VERIFICATION.md`.
- **Coordinator**: verifies `log.md` + `global_ledger.md` dual-log and `PIPELINES.md` file completeness before marking `META.json` `completed`.

## 6. References

- Constitution: `workflow.md` Article II/III/VI/VIII
- Skill: `skills/antigravity-review-loop/SKILL.md` + `references/*.md`
- Code: `bin/h-pipeline` (submit creates scaffold), `dashboard/app/api/pipelines/[id]/route.ts` (display), `dashboard/app/api/queue/route.ts` (auto-clean), `dashboard/app/pipelines/page.tsx` (typed `${id}_Delete` + single-only)
- Example golden pipeline: `memory/pipelines/PAOS/PIPE-26-06-2026---12-48/` (has all files, graph shows)
- Current self-pipeline (fixed): `memory/pipelines/PAOS/AI_Workflow-PIPE_1-26-08-2026---23-34/` (backfilled)

---
*This file is the contract. If Visualize is blank, re-read this file and run `h-pipeline submit`.*
