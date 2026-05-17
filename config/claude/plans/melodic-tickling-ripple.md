# PAOS Enterprise Upgrade — Full Plan

## Context
AI_Workflow is being elevated to enterprise-grade multi-agent orchestration. All agents (Claude, Codex, OpenCode, Antigravity, OpenClaw, Ollama) must: share memory via vault, commit to git with distinct identities visible in gitgraph, communicate via MCP messaging, and be deployable as a Docker hub. OpenClaw will be installed and integrated. A secrets management layer will be added. The System Analysis & Design and Scaffolding skills will be fully registered in the pipeline.

---

## Phase 1 — Fix .gitignore (CRITICAL FIRST)

Current `.gitignore` ignores itself (!) and almost nothing else. Many secrets are likely already tracked.

**New `.gitignore`** must cover:
- `node_modules/`
- `*.sqlite`, `*.sqlite-wal`, `*.sqlite-shm`
- `config/claude/.claude.json`, `.credentials.json`, `backups/`, `file-history/`, `sessions/`, `ide/`, `cache/`, `session-env/`, `shell-snapshots/`, `mcp-needs-auth-cache.json`, `plugins/`
- `config/codex/auth.json`, `installation_id`, `models_cache.json`, `*.sqlite*`, `tmp/`, `.personality_migration`, `skills/.system/`
- `config/antigravity/extensions/` (huge binary extension dirs)
- `config/secrets/` (except `.env.template`)
- `.env`, `.env.local`, `.env.*` (except `.env.template`)
- `config/claude/projects/` (session data)
- `logs/**/*.lock`

Then `git rm --cached` everything that's now ignored but already tracked.

---

## Phase 2 — Per-Agent Git Identities

Create `bin/agent-commit.sh`:
```bash
#!/bin/bash
# Usage: ./bin/agent-commit.sh <agent-id> "<message>"
AGENTS file maps agent-id → name + email
git -c user.name="$NAME" -c user.email="$EMAIL" commit -m "$MSG"
```

Agent identities (show in gitgraph):
| Agent | Name | Email |
|-------|------|-------|
| claude | Claude Code [PAOS] | claude@paos.nodealgo.com |
| codex | Codex [PAOS] | codex@paos.nodealgo.com |
| opencode-developer | OpenCode Developer [PAOS] | developer@paos.nodealgo.com |
| opencode-architect | OpenCode Architect [PAOS] | architect@paos.nodealgo.com |
| opencode-coordinator | OpenCode Coordinator [PAOS] | coordinator@paos.nodealgo.com |
| antigravity | Antigravity [PAOS] | antigravity@paos.nodealgo.com |
| openclaw | OpenClaw [PAOS] | openclaw@paos.nodealgo.com |
| ollama | Ollama [PAOS] | ollama@paos.nodealgo.com |

Update all soul.md files + instructions.md to use `bin/agent-commit.sh` instead of raw `git commit`.
Update config/git/gitconfig (already symlinked) with `[includeIf]` sections if needed.
Create `bin/agent-commit.sh` and `bin/test-agents.sh`.

---

## Phase 3 — Secrets Management

Create `config/secrets/` directory with:
- `.env.template` — template listing all required keys (tracked in git)
- `.env` — actual keys (gitignored, user fills in)

Keys needed:
- `OPENAI_API_KEY=sk-...` (for Codex)
- `ANTHROPIC_API_KEY=...` (for Claude Code, if using API directly)
- `GOOGLE_API_KEY=...` (for Antigravity, if needed)

Update `config/codex/config.yaml` to reference `OPENAI_API_KEY` env var.
Add sourcing of `.env` to `bin/` scripts and docker-compose.yaml.
Add instructions in README for user to fill `.env` from template.

---

## Phase 4 — Install OpenClaw

Repo: `https://github.com/openclaw/openclaw`

Steps:
1. Clone to `/home/dev/AI_Workflow/config/openclaw/openclaw/` (source)
2. Follow installation: npm/pip/docker based on what's in the repo
3. Configure it to use AI_Workflow vault as memory
4. Create `~/.openclaw` symlink → `config/openclaw/`
5. Write `config/openclaw/instructions.md` (PAOS soul for OpenClaw)
6. Create `agents/openclaw/soul.md` (already has `agents/openclaw/` dir per CLAUDE.md)
7. Wire inbox: `memory/inbox/openclaw/` (already exists)

---

## Phase 5 — Enhance MCP Server

Add to `mcp/shared-memory-server/index.js`:

New tools:
1. **read_context** — read `memory/shared/context.md`
2. **write_context** — append entry to `memory/shared/context.md`
3. **list_agents** — return known agents + inbox counts
4. **create_task** — write task card to `memory/tasks/<id>.md`
5. **read_task** — read a task card
6. **agent_commit** — execute `bin/agent-commit.sh <agent> <msg>` (lets agents commit from within MCP)
7. **read_ledger** — read last N lines of global_ledger.md

This makes MCP the enterprise messaging bus — agents can delegate tasks, confirm delivery, read shared state, and commit — all through one server.

---

## Phase 6 — GitHub Push

Install `gh` CLI to `~/.local/bin/gh` (binary download, no sudo):
```bash
VERSION=2.52.0
curl -L https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_linux_amd64.tar.gz | tar xz
cp gh_*/bin/gh ~/.local/bin/
```

Then:
1. `gh auth login` (interactive — user must authenticate)
2. `gh repo create AI_Workflow --private --source=. --remote=origin`
3. `git push -u origin master`

---

## Phase 7 — Docker Hub Container

Create at `docker/`:

**`docker/Dockerfile`:**
```dockerfile
FROM node:20-alpine
WORKDIR /paos
COPY mcp/ ./mcp/
COPY dashboard/ ./dashboard/
COPY bin/ ./bin/
RUN cd dashboard && npm ci --production
RUN cd mcp/shared-memory-server && npm ci --production
EXPOSE 3333
CMD ["sh", "-c", "node mcp/shared-memory-server/index.js & cd dashboard && node .next/standalone/server.js"]
```

**`docker/docker-compose.yaml`:**
```yaml
services:
  paos-hub:
    build: ..
    ports: ["3333:3333"]
    volumes:
      - ../memory:/paos/memory
      - ../vault:/paos/vault
      - ../knowledge:/paos/knowledge
      - ../logs:/paos/logs
      - ./secrets.env:/paos/.env
    env_file: [./secrets.env]
    restart: unless-stopped
```

**`docker/secrets.env.template`** — lists all required env vars.

Also create `docker/README.md` with install instructions: clone repo, copy secrets.env.template → secrets.env, fill keys, `docker compose up`.

---

## Phase 8 — Register Skills in PAOS Pipeline

**System Analysis & Design skill** (`skills/system-analysis-and-design/`) — already has SKILL.md. Add:
- Registration in opencode.json as available skill for `@architect`
- `skills/system-analysis-and-design/AGENTS.md` — OpenCode skill descriptor
- Wire to coordinator routing: `@architect design <request>` → triggers this skill

**Project Scaffolder skill** (`skills/project-scaffolder/`) — same treatment:
- Registration in opencode.json  
- `skills/project-scaffolder/AGENTS.md`
- Wire to coordinator: `@scaffold <project-name>` → triggers this skill

Update `config/opencode/opencode.json` to add skills section to developer and architect agents.

---

## Phase 9 — Update All PAOS Docs

Update `workflow.md`, `knowledge/paos/constitution.md`, `CLAUDE.md`, `config/codex/instructions.md`, all soul.md files:
- Add `bin/agent-commit.sh` as the standard commit mechanism
- Add Codex, OpenClaw to all agent rosters
- Add secrets management section (Article X — Secrets)
- Add Docker deployment section

---

## Phase 10 — Test Each Agent

Create `bin/test-agents.sh`:
- Makes a test entry in each agent's events.md
- Makes a test row in global_ledger.md via MCP append_ledger
- Runs `bin/agent-commit.sh <agent> "Agent[<agent>]: test commit"` for each agent
- Verifies commit shows in `git log --oneline --all`

Run the test and show the gitgraph.

---

## Critical Files

| File | Action |
|------|--------|
| `.gitignore` | Full rewrite |
| `config/secrets/.env.template` | CREATE |
| `bin/agent-commit.sh` | CREATE |
| `bin/test-agents.sh` | CREATE |
| `mcp/shared-memory-server/index.js` | Add 7 new tools |
| `docker/Dockerfile` | CREATE |
| `docker/docker-compose.yaml` | CREATE |
| `config/openclaw/instructions.md` | CREATE |
| `agents/openclaw/soul.md` | CREATE |
| `skills/system-analysis-and-design/AGENTS.md` | CREATE |
| `skills/project-scaffolder/AGENTS.md` | CREATE |
| `config/opencode/opencode.json` | Add skills |
| All soul.md files | Add agent-commit |
| `config/claude/CLAUDE.md` | Add agent-commit, secrets |
| `config/codex/instructions.md` | Add agent-commit, secrets |

---

## Verification

1. `git log --oneline --all --graph` — shows commits from each agent identity
2. `docker compose up` in `docker/` — dashboard accessible at localhost:3333
3. `codex` with `OPENAI_API_KEY` set — reads vault correctly
4. MCP tools: `append_ledger`, `write_context`, `agent_commit` — all respond
5. `./bin/test-agents.sh` — all agents commit successfully

---

## Execution Order

1. Fix .gitignore → git rm --cached secrets
2. Create config/secrets/
3. Create bin/ scripts
4. Enhance MCP server
5. Install OpenClaw + configure
6. Install gh + push to GitHub
7. Docker setup
8. Register skills
9. Update all docs
10. Run test-agents.sh
11. Vault session-end writes + final commit
