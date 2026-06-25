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
