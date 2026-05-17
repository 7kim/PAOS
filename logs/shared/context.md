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


## 2026-05-17 @claude — Session: AI_Workflow consolidation

**Thinking**: The vault had no enforcement mechanism — agents were ignoring it. Added Article IX to constitution making vault writes mandatory per H-Factor §I2/§I3. Also fixed critical circular symlinks in config/claude/ that were causing ELOOP errors.

**Decisions**:
- Obsidian vault is now the mandatory shared memory hub for all agents
- OpenClaw slot pre-wired (config/, inbox/, logs/, agent entry in opencode.json)
- Next.js dashboard live at localhost:3333
- OpenCode developer agent now has Antigravity Review Loop baked in

**Handoff Notes**: Any agent starting a new session should check vault/daily/2026-05-17.md for full activity log. Dashboard is not yet running — user must start it with `cd ~/AI_Workflow/dashboard && npm run dev`. Vault protocol is now law per Article IX.

---

## 2026-05-17 @claude — Session: Codex installation + full vault enforcement

**Thinking**: Vault protocol was only in CLAUDE.md (project-level) and constitution. It was not enforced globally (no user-level CLAUDE.md) and was missing from all OpenCode agent soul files. Also Codex was not yet installed or in the PAOS roster.

**Decisions**:
- Created `config/claude/CLAUDE.md` (user-level, = `~/.claude/CLAUDE.md`) — Article IX now applies to every Claude session regardless of project
- Article IX propagated to developer.md, developer/soul.md, coordinator/soul.md, architect/soul.md
- Codex CLI v0.130.0 installed at `~/.local/bin/codex`, symlinked `~/.codex` → `config/codex/`
- Codex is now a first-class PAOS agent: soul, inbox, logs, instructions, config all in AI_Workflow
- Dashboard agents API updated — Codex visible at localhost:3333

**Handoff Notes**: Codex needs `OPENAI_API_KEY` to run. All agent souls now have Article IX — every agent that reads its soul will know to write to the vault. The user-level `~/.claude/CLAUDE.md` ensures Claude Code follows vault protocol even in non-AI_Workflow projects.

---

## 2026-05-17 @claude — Session: PAOS Enterprise Upgrade

**Thinking**: The PAOS needed enterprise-grade infrastructure: per-agent git identities for gitgraph visibility, a proper .gitignore (8,263 extension files were tracked!), a Docker hub for portability, OpenClaw installed, MCP server upgraded to a full messaging bus, and skills properly registered in the pipeline.

**Decisions**:
- `bin/agent-commit.sh` is now the standard commit mechanism — all agents use `<agent>@paos.nodealgo.com` identities
- MCP server v1.0.0 has 10 tools: append_ledger, send_message, read_inbox, read_context, write_context, list_agents, create_task, read_task, read_ledger, agent_commit
- OpenClaw source cloned; needs build + onboard to activate channels
- Docker hub mounts host memory volumes — no network sync needed between agents
- All 8 agents verified in gitgraph via test-agents.sh

**Handoff Notes**: 
- User must run `./bin/github-setup.sh` to push to GitHub (interactive gh auth)
- User must fill `config/secrets/.env` with OPENAI_API_KEY for Codex
- User must run `cd config/openclaw/openclaw-src && npm install && npm run build && openclaw onboard` to activate OpenClaw channels
- Dashboard Docker build needs `cd dashboard && npm run build` first

## 2026-05-17 @claude — Session: Gap closure + cross-agent continuity wiring

**Thinking**: The PAOS infrastructure was built but agents were not actually using MCP tools or reading each other's chat history. Added explicit MCP mandates and cross-agent continuity protocol to every agent's config. This means every agent now loads shared state via MCP at session start and reads vault/chats/ to pick up where the last agent left off — regardless of which tool the previous agent used.

**Decisions**:
- config/claude/CLAUDE.md v2.1.0: mandatory MCP tool calls (read_ledger, read_context, read_inbox) at session start; skills registry with trigger conditions; full agent roster
- All 5 agent soul.md files updated with MCP calls + vault/chats/ reading + synthesis step
- .gitignore fixed: vault/.obsidian/plugins, codex/sessions, codex/log, openclaw/tui now excluded
- bin/start-dashboard.sh created for easy dashboard launch (built, ready at localhost:3333)
- GitHub was already completed in the last session (push succeeded to github.com/7kim/AI_Workflow.git)
- Scaffold server confirmed working (stdio MCP, list_templates returns fullstack-monorepo)

**Handoff Notes**: All agents now have the continuity protocol. Next agent starting a session should follow the MCP-first SESSION START in their soul.md or CLAUDE.md. The pipeline (PM→Architect→Developer) is still unexercised on a real task — that is the next logical step. User's main projects are: Tradingview (Python FastAPI + React scalping bot), project-gemini (Next.js+FastAPI scaffold), project-gpt (GPT archive). Tradingview is the most active.

---
## 2026-05-17 — claude — T20+T21 complete

**What changed**: All agents (9 configs) now have Step 4 — process notes.md + user-questions.md at project start. MCP tools process_notes and process_questions smoke tested and verified.

**MCP server**: v1.2.0, 13 tools: read_ledger, read_context, read_inbox, list_agents, append_ledger, write_context, send_message, create_task, read_task, agent_commit, write_handoff, process_notes, process_questions.

**Next priorities**:
1. Fix config/claude/mcp.json — add REPO_ROOT env var so agent_commit works from Claude sessions
2. Fill skill knowledge base (srs-template.md etc.)
3. Wire Tradingview + project-gemini to PAOS

---

## 2026-05-17 16:25 @opencode-architect — Task: TASK-003

**Thinking**: Reviewed TASK-003 IMPLEMENTATION_PLAN.md for Gemini agent soul file creation. Plan is fundamentally sound — correct scope, models on agents/codex/soul.md, covers all acceptance criteria. However, it's missing the companion TASKS.md artifact (Article VIII), doesn't name the executing agent (I1 gap), has no logging step (I2 gap), and the risk section is too sparse. Issued CONDITIONAL — plan can proceed once these 4 issues are resolved.

**Decisions**:
- Verdict: CONDITIONAL, not FAIL — core design is correct, issues are additive not structural
- TASKS.md must be produced as companion artifact (Article VIII §Phase 1)
- Executor must be named explicitly (@developer per pipeline)
- Logging step must be added as explicit execution task
- Risk analysis must enumerate at least 3 specific failure modes with mitigations

**Handoff Notes**: Next step: PM (@plan) resolves the 4 blocking issues (TASKS.md, executor field, logging step, risk analysis), then the plan can proceed to execution by @developer. Coordinator should verify artifacts before execution.
