# Shared Context — AI Workflow

This is the append-only thinking context shared by all agents. Each agent writes a structured entry when they begin or end work.

**Format:**
```
## [YYYY-MM-DD HH:MM] @agent — Task: <task-id>
**Thinking**: <key ideas, decisions, rationale>
**Decisions Made**: <list>
**Handoff Notes**: <for next agent in pipeline>
```

---

## 2026-06-22 14:45 @hermes-nous — Task: PAOS-FRESH-START

**Thinking**: Created bin/init-paos.sh — a fresh-start initializer for PAOS. It clears all old memory, resets agent logs, creates a fresh .env from template (never keeps old secrets), installs deps, and prepares the system. Ran it live to reset this PAOS instance. Old session data, pipelines, inboxes, and chat history are all cleared. The only active project is PAOS itself.

**Decisions**:
- init-paos.sh always overwrites .env from template — no stale secrets kept
- Script moves SED_CMD detection to top so secrets section can use it
- Saved as `paos-fresh-start` skill for agent discoverability
- PAOS is now the sole active project (projects.md updated)

**Handoff Notes**: PAOS is fresh and clean. Next session starts with HANDOFF.md, global_ledger.md showing only the init entry, and an empty pipeline/task board. Focus is enhancing PAOS itself.

## INIT @paos-init — Task: PAOS-FRESH-START

**Thinking**: PAOS was freshly initialized via bin/init-paos.sh. All old session data has been cleared. The system is starting clean with only PAOS itself as the active project.

**Decisions**:
- All previous session data, ledger entries, task cards, pipelines, inbox messages, and event logs have been reset
- The only active project is PAOS itself — enhancing the PAOS framework
- See HANDOFF.md for the current state

**Handoff Notes**: Welcome to a fresh PAOS. Read HANDOFF.md first, then pick up where you like.

---

## 2026-06-22 16:19 @hermes-nous — Task: PONYTAIL-INSTALL

**Thinking**: Installed ponytail (DietrichGebert/ponytail) as a shared PAOS skill and for individual agents. Ponytail is the "lazy senior dev" coding philosophy: ~54% less code, ~20% cheaper, ~27% faster, 100% safe. Uses a 6-rung ladder: YAGNI → stdlib → native → installed dep → one line → minimum.

**Decisions**:
- Claude Code plugin installed via `claude plugin marketplace add` + `claude plugin install` — plugin is active and enabled\n- OpenCode configured via global opencode.json + PAOS-level opencode.json (plugin path) + command symlinks to ~/.config/opencode/command/\n- PAOS shared skill created at skills/ponytail/SKILL.md with full ladder, rules, and not-lazy-about section\n- Registered in skills/INDEX.md under new Software Development Skills section\n- Referenced in config/claude/CLAUDE.md skills table and config/opencode/AGENTS.md\n- Ponytail config set to defaultMode=full at ~/.config/ponytail/config.json\n- Also need to set up for OpenClaw via `clawhub install ponytail` if ClawHub is configured

**Handoff Notes**: Ponytail is installed and configured. Claude Code has the active plugin. OpenCode has the plugin and commands linked. PAOS shared skill available for all agents reading INDEX.md. If ClawHub is configured, run `clawhub install ponytail` for OpenClaw as well.

---

## 2026-06-22 16:24 @hermes-nous — Task: PAOS-INTEGRATION

**Thinking**: Fully integrated Claude Code and OpenCode into PAOS. Both now have their config homes symlinked into ~/AI_Workflow/config/. For Claude Code: merged runtime data (plugins, skills, rules, sessions, projects, backups) from ~/.claude/ into config/claude/. For OpenCode: installed the CLI binary (v1.17.9 via install script), merged global config from ~/.config/opencode/ into config/opencode/, including context7 MCP and ponytail commands. Both symlinks verified working. Ponytail plugin remains enabled on Claude Code after the move.

**Decisions**:
- ~/.claude/ → config/claude/ symlink (merged all runtime data first)\n- ~/.config/opencode/ → config/opencode/ symlink (installed CLI, merged configs)\n- settings.json merged across both agents (kept permissions, hooks, marketplaces, plugins)\n- OpenCode commands linked from ponytail-repo into config/opencode/commands/\n- Updated CLAUDE.md and AGENTS.md with integration banners and updated agent roster\n- Old ~/.claude.backup and ~/.config/opencode.backup kept in case rollback needed

**Handoff Notes**: Both agents fully integrated into PAOS. Claude Code and OpenCode CLI binaries are on PATH (via ~/.bashrc). Their config homes are symlinked into ~/AI_Workflow/config/. Old backup dirs exist as ~/.claude.backup and ~/.config/opencode.backup if rollback needed.

---

## 2026-06-22 17:02 @opencode-developer — Task: MODEL-PIN

**Thinking**: User asked to permanently pin opencode/deepseek-v4-flash-free as the Developer agent's model, with protection against overrides when Hermes delegates via pipeline or inbox. This required updating all configuration layers that could influence model selection. OpenCode supports agent-level model pinning via agent.<name>.model in opencode.json, and the OpenCode docs confirm this overrides the global default. The registry.json defaultModel field documents the intent for PAOS-level metadata even though OpenCode itself doesn't read it — it's for dashboard display and agent health checks.

**Decisions**:
- Model pinned in 5 layers: opencode.json (global default + agent), AGENTS.md (declarative), registry.json (PAOS metadata), soul.md (agent identity), pipeline-defaults.yaml (pipeline routing)
- small_model set to north-mini-code-free for lightweight tasks
- The pipeline-defaults.yaml executor_model field is documentation-level — the actual enforcement is in opencode.json's agent.developer.model which OpenCode reads directly
- Hermes-triggered delegation routes through pipeline-defaults.yaml → opencode-developer → inherits the pinned model from the developer agent config

**Handoff Notes**: Model pinning is complete. Next sessions will see the model as opencode/deepseek-v4-flash-free by default. The system prompt now reflects this in AGENTS.md.

---

## 2026-06-22 17:45 @opencode-developer — Task: PIPE-20260622-174508-pia2ix

**Thinking**: Designed 16 PAOS /h-* commands covering the full session lifecycle. User wanted a pipeline routed through Hermes to opencode-developer. Created pipeline PIPE-20260622-174508-pia2ix with 19 tasks, submitted to opencode-developer inbox, and notified Hermes via inbox message. Stray IMPLEMENTATION_PLAN.md and TASKS.md deleted from AI_Workflow root — pipeline artifacts live in memory/pipelines/.

**Decisions**:
- Commands are bash scripts in bin/, not MCP tools — work without the server running
- 16 commands: enough to cover Article IX lifecycle, not so many it's bloat
- h- prefix avoids collision with agent-native commands
- Pipeline routed to opencode-developer per PAOS standard; Hermes notified for visibility
- Plan + tasks stored in pipeline dir under memory/pipelines/

**Handoff Notes**: Pipeline PIPE-20260622-174508-pia2ix is in opencode-developer's inbox. Hermes also knows about it. 19 tasks, build order in TASKS.md. Standard Antigravity Review Loop applies: produce artifacts → user review → execute → walkthrough.

---

## 2026-06-22 18:18 @opencode-developer — Task: CROSS-AGENT-EXEC

**Thinking**: User wants real-time cross-agent execution without over-engineering. Current system is file-queue based (pull). User asked if we want Kafka or a daemon. Ponytail assessment: both are overkill. The minimal solution is a systemd path unit — 8 lines total, zero dependencies, built into Linux. Triggers on inbox file creation. Can notify or auto-execute opencode in tmux.

But the user wants a multi-agent conversation: share this idea with Hermes, get Hermes' enhanced ideas back, then combine into a final implementation plan that Hermes passes to opencode-developer for execution.

**Decisions**:
- Kafka is wrong scale (single machine, simple files)
- Custom daemon is premature automation (more code to debug)
- systemd path unit is the native solution: 4-line .path + 4-line .service, zero deps
- Two modes: notification-only vs auto-execution
- Notification via notify-send or terminal bell
- Auto-execution via tmux session
- This needs agent coordination: share → enhance → finalize → execute

**Handoff Notes**: Hermes should read this, refine the idea from an infrastructure/always-on perspective, then pass the combined plan back to opencode-developer for implementation.

---

## 2026-06-22 19:21 @opencode-developer — Task: PIPE-20260622-185724-pia2ix

**Thinking**: Hermes needs to check inbox. Phase 3 (Implementation Plan) is complete — IMPLEMENTATION_PLAN.md and TASKS.md are in the pipeline directory. I sent the handoff to Hermes' inbox with a detailed message. Hermes needs to do Phase 4 (review the plan) and then Phase 5 (pass back to opencode-developer for execution).

**Decisions**:
- Phase 3 artifacts delivered to hermes-nous inbox
- Pending: Phase 4 (hermes-nous reviews), Phase 5 (opencode-developer executes)
- Hermes needs to read inbox/memory first thing next session

**Handoff Notes**: Hermes: read inbox/memory for PIPE-20260622-185724-pia2ix. Review IMPLEMENTATION_PLAN.md and TASKS.md in the pipeline dir. Send review verdict back to opencode-developer inbox.

---

## 2026-06-22 19:44 @opencode-developer — Task: PIPE-20260622-185724-pia2ix

**Thinking**: Completed PIPE-20260622-185724-pia2ix: real-time cross-agent execution via systemd path unit. All 13 tasks executed. Systemd paos-pipeline.path watches memory/pipelines/ and triggers handler on new directory creation. Handler has 6 guardrails: lock, whitelist, rate limit, kill switch, task cap, timeout. Automatically writes inbox notifications and optionally spawns executors. Verified with test pipeline PIPE-TEST-0001.

**Decisions**:
- systemd PathChanged is non-recursive — new directory creation triggers it, but deep file updates don't. Acceptable for pipeline submission use case.

**Handoff Notes**: Pipeline complete. Systemd unit active. Hermes has been notified via inbox message with full summary.

---

## 2026-06-25 18:13 @opencode-developer — Task: #TASK-DOC-001

**Thinking**: Completed comprehensive documentation for PAOS. Created 3 files (2,245 lines total): dashboard README (218 lines), API reference (1,018 lines, 56 endpoints), and usage examples (1,009 lines). All artifacts build on thorough codebase exploration via sub-agents.

**Decisions**:
- dashboard/README.md rewritten (not appended) because old was generic Next.js boilerplate\n- docs/api.md organized by resource group (22 groups, 56 endpoints)\n- Every endpoint documented with path, params, response schema, JSON examples\n- docs/examples.md covers CLI, API, MCP tools, and end-to-end workflow\n- Pipeline phase n2 marked completed, pipeline status set to completed

**Handoff Notes**: Documentation phase complete. Next phase (Analyze by hermes-nous) is pending. The doc files are at: dashboard/README.md, docs/api.md, docs/examples.md. Pipeline at: memory/pipelines/PAOS/PIPE-25-06-2026---18-06

---

## 2026-06-25 19:12 @opencode-developer — Task: PIPE-25-06-2026---19-09

**Thinking**: Completed documentation audit for PAOS. Existing docs were already comprehensive (READMEmd: 819, api.md: 1,018, examples.md: 1,009 lines). Filled gaps: LICENSE file, docs/README.md hub. Updated README with Documentation section and badge fixes. Pipeline phase n2 complete. Next phase is 'Analyze' by hermes-nous.

**Decisions**:
- Created LICENSE (MIT) per README declaration — standard MIT boilerplate with NodeAlgo copyright\n- Created docs/README.md as a navigable hub index\n- Did not create CONTRIBUTING.md or CHANGELOG.md (YAGNI for personal project per ponytail)\n- Fixed docs badge in README to point to docs/README.md\n- Fixed Docker badge to point to docker/docker-compose.yaml

**Handoff Notes**: Next agent should read HANDOFF.md and continue to phase 'Analyze' (hermes-nous). Pipeline state at ~/AI_Workflow/logs/pipelines/PAOS/PIPE-25-06-2026---19-09/.

---

## 2026-06-25 19:16 @hermes-nous — Task: PIPE-25-06-2026---19-09

**Thinking**: Completed phase n1 (Analyze) for pipeline PIPE-25-06-2026---19-09. Conducted comprehensive codebase survey via explore agent, analyzed all existing documentation (~4,200 lines across 14+ files), identified 4 genuine gaps (secrets schema, pipeline templates, memory/logs dual structure, command ref) and 7 YAGNI gaps. Produced ANALYSIS.md with quality scores (coverage 9/10, depth 8/10) and priority-ranked recommendations. This was the final phase of the pipeline — both phases are now complete.

**Decisions**:
- Analysis output should be REASONING.md + ANALYSIS.md, not new documentation (n2 already handled doc creation)\n- Ponytail assessment applied to all found gaps: only 4 of 11 potential gaps are genuine\n- Pipeline META.json updated to reflect both phases completed with artifact lists\n- No git commit needed — only pipeline artifact files in phases/n1/ were modified

**Handoff Notes**: Pipeline PIPE-25-06-2026---19-09 is fully completed. Both phases done. Recommended follow-up: implement priority actions from ANALYSIS.md (docs/env-reference.md, docs/pipeline-templates.md, etc.) when needed.

---

## 2026-06-25 19:45 @hermes-nous — Task: PIPE-25-06-2026---19-42

**Thinking**: Completed phase n1 (Analyze) for pipeline PIPE-25-06-2026---19-42 "Test topological order". Full codebase survey via explore agent across ~10,000 files. Produced REASONING.md (decision log) and ANALYSIS.md (179-line structured report with 10 sections covering agents, dashboard, CLI, MCP, pipelines, governance, strengths/issues). Identified 7 discrepancies including empty memory/ dir, broken symlink, no test infra, duplicate dirs, DESIGN.md contamination, path inconsistency, and empty directories.

**Decisions**:
- Used explore sub-agent for comprehensive codebase survey (fastest path to full coverage)\n- Produced two artifacts: REASONING.md (decision log) + ANALYSIS.md (structured findings)\n- Maintained read-only stance — no files modified outside pipeline phase directory\n- Kept analysis concrete with actionable recommendations for phase n2\n- Phase n1 is complete — all pipeline tracking files updated and marked completed

**Handoff Notes**: Pipeline PIPE-25-06-2026---19-42 phase n1 is now complete. Phase n2 (Document, opencode-developer) is ready to execute — see ANALYSIS.md recommendations section (section 10) for documentation priorities. Pipeline artifacts are at logs/pipelines/PAOS/PIPE-25-06-2026---19-42/.

---

## 2026-06-25 19:49 @opencode-developer — Task: PIPE-25-06-2026---19-42

**Thinking**: Completed phase n2 (Document) for pipeline PIPE-25-06-2026---19-42. Created docs/pipelines.md (145 lines) — a cohesive pipeline system reference covering lifecycle, directory structure, DAG phase execution, Flow Builder UI, agent dispatch, known issues, and CLI/API references. This filled the genuine gap identified by phase n1 analysis: no single document explained the pipeline system end-to-end despite 3,500+ lines of existing docs. Used ponytail to skip re-documenting agent inbox protocol (already in examples.md), systemd watcher (self-documenting scripts), and creating a separate known-issues doc (added table to pipeliness.md instead).

**Decisions**:
- Created docs/pipelines.md as the single gap-filler rather than 3-4 separate docs\n- Reused existing links to api.md, examples.md, architecture.md rather than duplicating content\n- Included Known Issues table from ANALYSIS.md as a canonical reference (was undocumented)\n- Skipped agent inbox protocol doc (already covered in examples.md)\n- Skipped systemd watcher doc (self-documenting shell scripts)\n- Pipeline is now fully complete — both phases done

**Handoff Notes**: Pipeline PIPE-25-06-2026---19-42 is fully completed. Both phases (n1 Analyze by hermes-nous, n2 Document by opencode-developer) are done. Pipeline artifacts at logs/pipelines/PAOS/PIPE-25-06-2026---19-42/. Created docs/pipelines.md as the main output of n2.

---

## 2026-06-26 09:45 @hermes-nous — Task: storage-comparison-research

**Thinking**: Researched and wrote a comprehensive storage approach comparison for PAOS agent memory at ~/AI_Workflow/research/storage-comparison.md. Evaluated 4 approaches: RAG on filesystem, SQLite+sqlite-vec, PostgreSQL+pgvector, and Obsidian vault integration. Weighed setup effort, query performance, scalability (100/10K/1M docs), integration complexity with existing PAOS file structure, and pros/cons for agent memory retrieval.

**Decisions**:
- Short-term (now-3mo): Hybrid — keep filesystem, deepen Obsidian integration with [[wikilinks]] and #tags, add TF-IDF RAG as lightweight MCP tool\n- Medium-term (3-12mo): Migrate structured memory to SQLite+sqlite-vec once past 1K docs. Single-file, no server, trivial backups.\n- Long-term (12+mo): PostgreSQL+pgvector if scale reaches 100K+ docs or 50+ concurrent agents.\n- DO NOT migrate to DB yet — current ~50 doc scale doesn't justify infrastructure overhead.\n- DO NOT replace files entirely — human readability, git diff, and Obsidian integration are critical.

**Handoff Notes**: Next agent can read research/storage-comparison.md for full details, including phased implementation roadmap with concrete scripts/tooling suggestions.

---

## 2026-06-26 09:45 @hermes-nous — Task: LANGCHAIN-FEASIBILITY

**Thinking**: Researched LangChain/LangGraph and PAOS's current architecture for the feasibility study. Key findings: PAOS already has a superior pipeline DAG for multi-agent orchestration (systemd + file inboxes + React Flow). LangGraph's StateGraph is in-process Python only — architecturally mismatched with PAOS's multi-process agent dispatch model. LangChain @tool decorators add nothing over existing /h-* bash scripts and MCP config. Recommendation: adopt only the typed-state-schema concept from StateGraph, skip everything else.

**Decisions**:
- Created research/langchain-integration.md with full feasibility study
- Four research questions answered: StateGraph comparison, tool-calling, integration effort, MCP support
- Concrete recommendation: Adopt typed state schema (2-3d), Adapt lightweight checkpoints, Skip LangGraph + LangChain
- Decision matrix included for all major components

**Handoff Notes**: Research complete. File at research/langchain-integration.md. If someone wants to implement the state schema recommendation, they should start with updating pipeline-flow.json schema and execute-flow/route.ts checkpoint writes.

---

## 2026-06-26 10:44 @opencode-developer — Task: TASK-install-paos

**Thinking**: Created ~/AI_Workflow/bin/install-paos.sh — a comprehensive, idempotent PAOS bootstrap installer for Ubuntu 24.04+ VPS. The script covers: OS detection, Node.js 22+ install (nvm first, nodesource fallback), Python 3.14+ check, cloning/setting up ~/AI_Workflow/ structure, npm deps for dashboard + 3 MCP servers, API token generation for dashboard/.env.local, config/secrets/.env creation from template, script chmod, systemd user services (paos-pipeline.path + paos-pipeline.service), Tailscale serve setup, dashboard dev server launch on port 3333, vault symlinks, global ledger logging, and a detailed summary with URLs and API token.

**Decisions**:
- Used nvm-first for Node.js (user-local, no sudo), with nodesource fallback
- Used `openssl rand -hex 32` for API token generation
- systemd units use `PathModified` on memory/pipelines/ to trigger handler
- UI components sourced from existing init-paos.sh patterns for consistency
- supports --yes, --no-systemd, --no-tailscale, --no-deps, --repo= flags
- set -euo pipefail throughout with clear emoji-labeled output

**Handoff Notes**: Script is at ~/AI_Workflow/bin/install-paos.sh, executable, and passes bash -n syntax check.

---

## 2026-06-26 12:15 @opencode-developer — Task: PIPE-26-06-2026---10-22

**Thinking**: Completed QA audit pipeline PIPE-26-06-2026---10-22. Verified both visualize and builder pages compile with zero TS errors. Visualize page has 5 cosmetic `any`-type lint warnings. Builder page is clean. All 9 supporting components verified present.

**Decisions**:
- Verification via static analysis (TS compile + lint) since no test suite exists. This is acceptable for a compile-time audit.

**Handoff Notes**: Pipeline PIPE-26-06-2026---10-22 is fully complete. META.json updated to 'completed'. WALKTHROUGH.md written with full details.

---

## 2026-06-26 12:48 @hermes-nous — Task: PIPE-26-06-2026---12-46-n0

**Thinking**: Completed phase n0 (Plan) of PIPE-26-06-2026---12-46. The pipeline prompt asks to "Run a benchmark: node 1 analyzes the coding principles, node 2 runs the tests." Analyzed existing Benchmark 1 (C grade, 67/100, 17 gaps), scanned current codebase and found 8 of 17 gaps have been fixed since Benchmark 1 (cycle detection, caching, rate limiting, CORS, auth, CSRF, HSTS, pagination). 9 gaps remain open. Created comprehensive IMPLEMENTATION.md for Benchmark 2 execution by phase n1. Handing off to opencode-developer next.

**Decisions**:
- Run Benchmark 2 as a full fresh audit (not delta) for accurate comparison\n- Use same Coding-Principles-Benchmark v2.0 framework\n- Keep phase read-only (no code changes during audit)\n- Output to benchmarks/Benchmark_2_<ts>/ following same structure as Benchmark 1

**Handoff Notes**: Phase n0 artifacts ready at phases/n0/. Phase n1 (opencode-developer) should execute per IMPLEMENTATION.md: run 110-question strict audit, score all questions, generate gaps, output to benchmarks/Benchmark_2_<ts>/.

---

## 2026-06-26 12:50 @hermes-nous — Task: PIPE-26-06-2026---12-42

**Thinking**: Completed phase n0 (Plan) for pipeline PIPE-26-06-2026---12-42 'Test the new builder layout visualize view'. Explored builder/visualize architecture (~18 files), understood data flow from builderLayout in META.json → MiniDagView → ReadOnlyNode rendering on visualize page. Created planning artifacts: IMPLEMENTATION.md (plan), TASKS.md (4 tasks for n1), REASONING.md (analysis/decisions). Handed off to n1 (opencode-developer) with updated IMPLEMENTATION.md and TASKS.md in phases/n1/. Updated all tracking files.

**Decisions**:
- CLI-verifiable scope: data integrity, API, static analysis, edge cases (no browser testing)\n- Use this pipeline itself as the test subject (it has builderLayout)\n- 4 tasks for n1 executor: data validation, API check, TS compilation, edge case analysis\n- Updated n1 files directly with test plan for seamless handoff

**Handoff Notes**: Pipeline PIPE-26-06-2026---12-42 phase n0 is complete. Phase n1 (Execute, opencode-developer) is ready. The n1/IMPLEMENTATION.md contains 4 test tasks with full instructions. Pipeline artifacts at logs/pipelines/PAOS/PIPE-26-06-2026---12-42/.

---

## 2026-06-26 12:52 @hermes-nous — Task: PIPE-26-06-2026---12-48-n0

**Thinking**: Completed phase n0 (Plan) of PIPE-26-06-2026---12-48. The pipeline prompt asks to "Run benchmark module: node 1 analyzes the rules, node 2 executes the tests." Analyzed Coding-Principles.md (666 lines, 10 principles) and Coding-Principles-Benchmark.md v2.0 (110-question strict audit). Cross-referenced against existing Benchmark 1 results (C grade, 67/100, 17 gaps). Scanned current codebase and found 10 of 17 gaps have been fixed (2 more than prior analysis — similarity metrics and DAG validation both now present). 7 gaps remain open. Created comprehensive IMPLEMENTATION.md, REASONING.md, TASKS.md, and WALKTHROUGH.md for phase n0. Also prepared proper handoff artifacts in phases/n1/ for opencode-developer.

**Decisions**:
- Run Benchmark 2 as a full fresh audit (not delta) for accurate comparison\n- Use same Coding-Principles-Benchmark v2.0 framework\n- Keep phase read-only (no code changes during audit)\n- Output to benchmarks/Benchmark_2_<ts>/ following same structure as Benchmark 1\n- Updated gap count: 10 fixed (not 8 as previous analysis found) — Q37 similarity and Q27 DAG validation also fixed

**Handoff Notes**: Phase n0 artifacts ready at phases/n0/. Phase n1 (opencode-developer) should execute per phases/n1/IMPLEMENTATION.md: run 110-question strict audit, score all questions, generate gaps for scores < 2, output to benchmarks/Benchmark_2_<ts>/.

---

## 2026-06-26 12:54 @opencode-developer — Task: PIPE-26-06-2026---12-46-n1

**Thinking**: Completed phase n1 (Execute) of PIPE-26-06-2026---12-46. Ran 110-question strict audit using Coding-Principles-Benchmark v2.0. Score: 192/220 raw, 87/100 normalized, B grade. 8 infra gaps fixed since Benchmark 1 (cycles, caching, rate limit, CORS, auth, CSRF, HSTS, pagination). 4 remaining gaps: Q26 (Set), Q27 (DAG validation on read), Q64 (moving averages), Q102 (47 any types). Full output at benchmarks/Benchmark_2_26-06-2026---12-49/.

**Decisions**:
- Keep same v2.0 framework for direct comparability\n- All 4 gap plans created but not executed (read-only audit)\n- Partial credit (1/2) for 17 questions where evidence suggests partial implementation\n- Score improvement from C→B is objectively measured with grep evidence

**Handoff Notes**: Pipeline PIPE-26-06-2026---12-46 fully complete. Pipeline artifacts at phases/n1/. User can trigger gap work via 'work on gap {1-4}'.

---

## 2026-08-30 17:14 @opencode-developer — Task: hermes-venv-restore-20260830

**Thinking**: User deleted hermes-agent venv (python version) and feared memory loss. Invested that memory lives in ~/.hermes/state.db (136MB) not venv. Snapshots verified: one state snapshot 20260826 pre-update and one curator backup. Live DB has more messages than snapshot so intact. Restored correct python 3.11 per .python-version and requires-python cap, reinstalled deps. Wrote HANDOFF so next Hermes agent knows restore is already done and what to verify on 'do restore' request.

**Decisions**:
- 3.11 chosen because repo pins .python-version=3.11 and pyproject.toml requires-python >=3.11,<3.14; 3.15 fails Rust wheel builds
- Live DB ahead of snapshot so no restore needed; keep snapshot as fallback
- venv recreation via uv venv + uv sync + symlink .venv->venv to satisfy repo layout

**Handoff Notes**: Next Hermes session: if user says 'do restore', verify .venv/bin/python --version is 3.11.x, run hermes sessions list and python -c sqlite counts on state.db vs snapshot, confirm MEMORY.md and skills present. Only copy snapshot state.db over live if live corrupted. Handoff written 2026-08-30.
