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
