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
