---
date: 2026-05-17
agent: claude
focus: PAOS enterprise upgrade — gitgraph identities, Docker, OpenClaw, Codex, MCP enhancement, skills
---

# 2026-05-17 — PAOS Enterprise Upgrade

## Decisions

| # | Decision | Rationale |
| - | -------- | --------- |
| 1 | Per-agent git identities via `bin/agent-commit.sh` | Each agent commits as `<name>@paos.nodealgo.com` — separate authors visible in gitgraph |
| 2 | `.gitignore` full rewrite — untracked 8,263 extension binary files | Extensions were checked in, bloating repo; secrets were also tracked |
| 3 | MCP server upgraded to v1.0.0 with 7 new tools | `read_context`, `write_context`, `list_agents`, `create_task`, `read_task`, `read_ledger`, `agent_commit` — full enterprise messaging bus |
| 4 | OpenClaw cloned from github.com/openclaw/openclaw into `config/openclaw/openclaw-src/` | Source available; needs `npm run build` + `openclaw onboard` to complete channel setup |
| 5 | `~/.openclaw` → `config/openclaw/` symlink created | Follows same pattern as all other agents |
| 6 | Docker hub container: `docker/Dockerfile` + `docker-compose.yaml` | Volumes mount host memory/vault/logs — all agents share state through host filesystem |
| 7 | `gh` CLI v2.52.0 installed at `~/.local/bin/gh`, `bin/github-setup.sh` created | Interactive auth required — user runs `./bin/github-setup.sh` once |
| 8 | System Analysis & Design + Project Scaffolder skills registered in PAOS | Added `AGENTS.md` descriptors + wired into `opencode.json` for architect and coordinator |
| 9 | Secrets layer at `config/secrets/.env.template` (gitignored `.env`) | All API keys stored in one place, sourced by Docker and bin scripts |
| 10 | Architect and Coordinator agents added to `opencode.json` with full prompts | Full PAOS pipeline now has all 5 OpenCode agents configured |
| 11 | `agents/openclaw/soul.md` written — OpenClaw as channel agent (human interface) | Routes Telegram/WhatsApp messages into PAOS pipeline via MCP `create_task` |

## Files Created

| File | Purpose |
| ---- | ------- |
| `.gitignore` | Full rewrite — secrets, extensions, session files, SQLite DBs |
| `bin/agent-commit.sh` | Per-agent git commit with identity (gitgraph-visible) |
| `bin/test-agents.sh` | Tests all 8 agent identities — vault write + git commit |
| `bin/github-setup.sh` | One-shot GitHub repo create + push (interactive auth) |
| `config/secrets/.env.template` | API key template (gittracked) |
| `docker/Dockerfile` | Multi-stage build: MCP server + Next.js dashboard |
| `docker/docker-compose.yaml` | Hub deployment with host volume mounts |
| `docker/entrypoint.sh` | Starts both MCP server and dashboard |
| `docker/secrets.env.template` | Docker-specific secrets template |
| `docker/README.md` | Quick-start guide for Docker deployment |
| `agents/openclaw/soul.md` | OpenClaw PAOS agent soul with Article IX |
| `skills/system-analysis-and-design/AGENTS.md` | OpenCode skill descriptor |
| `skills/project-scaffolder/AGENTS.md` | OpenCode skill descriptor |

## Files Modified

| File | Change |
| ---- | ------ |
| `mcp/shared-memory-server/index.js` | v1.0.0 — 7 new tools added |
| `config/opencode/opencode.json` | Added architect + coordinator agents, all skills, REPO_ROOT env |
| `config/openclaw/README.md` | Full PAOS integration instructions |
| `CLAUDE.md` | Agent-commit standard, Docker section, GitHub section, secrets section |
| `config/claude/CLAUDE.md` | Lint-clean rewrite with agent-commit instruction |

## Open Questions

- OpenClaw: needs `npm run build` + `openclaw onboard` to configure channels (Telegram, etc.)
- Codex: needs `OPENAI_API_KEY` set in `config/secrets/.env` before running
- GitHub: user must run `./bin/github-setup.sh` once (interactive browser auth via `gh auth login`)
- Antigravity: vault protocol still not enforceable via config (VS Code extension limits)
- Dashboard: needs `npm run build` before Docker image can be built
