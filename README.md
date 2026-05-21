# PAOS — Personal Agent Operating System

> **Self-hosted multi-agent AI orchestration.**  
> Claude Code, OpenCode, Codex, Gemini, Antigravity, OpenClaw, and Ollama — unified through shared memory, a messaging bus, cross-agent continuity, and a governance framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org) [![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](docker-compose.yml)

---

## What is PAOS?

PAOS is a self-hosted orchestration layer that connects multiple AI coding agents so they can collaborate on real software projects. Every agent shares the same memory, follows the same governance rules, and leaves a permanent audit trail of everything it does.

**Core features:**

- **Cross-agent continuity** — every agent reads a live `HANDOFF.md` as its first action each session, so it knows exactly where the last agent stopped, what decisions were made, and what's next — no context loss between agents or sessions
- **Shared memory bus** — 13 MCP tools give all agents access to the same ledger, task board, context, and inbox. One agent writes; every other agent reads
- **Per-agent git identity** — each agent commits under its own `@paos.nodealgo.com` email, visible as distinct authors in GitHub's gitgraph
- **Audit immutability** — a global append-only ledger records every agent action. Nothing is ever edited or deleted
- **Governance protocol** — the H-Factor enforces Separation of Powers (planner ≠ reviewer ≠ executor), Identity First, Skill Boundary, and Audit Immutability across all agents
- **Antigravity Review Loop** — a structured pipeline for non-trivial tasks: Plan → Architect review → Coordinator gate → Execute → Walkthrough. Agents cannot skip phases
- **Orchestration dashboard** — a Next.js UI at `localhost:3333` showing the live ledger, agent roster, task board, inboxes, HANDOFF state, and implementation plans
- **Docker-ready** — one command deploys the dashboard + MCP server in a container. All agent memory is live-mounted from the host

---

## Screenshots

### Overview — live agent activity
![Dashboard overview](docs/screenshots/dashboard-overview.png)

*47 ledger entries, 4 tasks, 4 plans, 6 inbox messages. Recent activity feed shows the TASK-003 pipeline closing with all 8 acceptance criteria passing.*

---

### Audit Ledger — every agent action, forever
![Audit ledger](docs/screenshots/dashboard-ledger.png)

*Append-only. Every row shows timestamp, agent badge, action type, and full description. No agent can edit or delete past entries.*

---

### Agent Roster — all agents, live status
![Agent roster](docs/screenshots/dashboard-agents.png)

*Claude Code, OpenCode Developer, OpenCode Plan, Codex, OpenClaw, Ollama, Antigravity, Gemini — each with inbox count and last activity snippet.*

---

### HANDOFF — cross-agent continuity
![HANDOFF state](docs/screenshots/dashboard-handoff.png)

*Every agent reads this file first. Shows last agent, session, active task, what was just done, what's not done yet, active projects, key decisions, and how to pick up. Rewritten every session — always current.*

---

### Tasks — YAML task board
![Task board](docs/screenshots/dashboard-tasks.png)

*TASK-003 marked Done. Status badges parsed live from YAML frontmatter in `memory/tasks/`.*

---

### Plans — implementation plans with walkthrough
![Plans viewer](docs/screenshots/dashboard-plans.png)

*TASK-003 implementation plan. Tabs: Plan (full spec), Tasks (breakdown), Walkthrough (post-execution audit). Written by @plan, reviewed by @architect, verified by @coordinator.*

---

### Inbox — agent messaging bus
![Agent inbox](docs/screenshots/dashboard-inbox.png)

*Per-agent tabs. Full message threading. Claude sends TASK-002 to developer's inbox with task card, implementation steps, and routing to @architect. Send Message button for manual dispatch.*

---

### GitGraph — per-agent commit identities
![GitGraph per-agent commits](docs/screenshots/gitgraph-agents.png)

*Every agent has its own git author. Claude, OpenCode Architect, OpenCode Coordinator, OpenCode Developer, Gemini — all visible as separate commit authors in GitHub's gitgraph.*

---

## Architecture

```

## Enterprise Agent Registry

The canonical agent integration contract is `agents/registry.json`. Dashboard APIs, MCP `list_agents`, health checks, and `bin/agent-commit.sh` read this registry instead of maintaining separate rosters.

```bash
bin/paos-agent list
bin/paos-agent doctor
bin/paos-agent doctor codex
bin/paos-agent mcp-sync
```

`doctor` commands are side-effect free: they do not call agents, write logs, mutate inboxes, or commit.
┌─────────────────────────────────────────────────────────────────┐
│                          Your Machine                           │
│                                                                 │
│  Claude Code ────┐                                              │
│  OpenCode ───────┤                                              │
│  Codex ──────────┼──► MCP Shared-Memory Server (13 tools)       │
│  Gemini ─────────┤         │           │           │            │
│  Antigravity ────┤     memory/      vault/       logs/          │
│  OpenClaw ───────┤       (shared filesystem — all agents)       │
│  Ollama ─────────┘                                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Docker Container                                        │    │
│  │  Dashboard (Next.js :3333) + MCP server                  │    │
│  │  Volumes: memory/ logs/ vault/ knowledge/ agents/        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Agent Pipeline (Antigravity Review Loop)

```
User request
     │
     ▼
 @plan ──────────────────────────────────────────────────────────┐
 (Project Manager)                                               │
 Produces: TASKS.md + IMPLEMENTATION_PLAN.md                     │
     │                                                           │
  ┌──┴──┐                                                        │
  ▼     ▼                                                        │
@architect  @coordinator  (parallel review + H-Factor gate)      │
     │                                                           │
     ▼  [PASS gate]                                              │
 @developer                                                      │
 (execution — writes code, files, tests, commits)                │
     │                                                           │
     ▼                                                           │
 @coordinator  (verification — all acceptance criteria)          │
     │                                                           │
     ▼                                                           │
 WALKTHROUGH.md  ←──────────────────────────────────────────────┘
 (post-execution audit, pipeline closed)
```

---

## Cross-Agent Continuity

Every agent starts every session by reading `memory/shared/HANDOFF.md` before doing anything else. This file is rewritten (not appended) at the end of each session by the last active agent.

**What HANDOFF.md contains:**
- Last agent, tool, timestamp, and session description
- Active task or "Pipeline IDLE"
- What was just done (files changed, decisions made)
- What is NOT done yet (blocked items, next steps)
- Active projects with stack and status
- Key decisions that are permanent (architecture, config, workflow)
- How to pick up — step-by-step for the next agent

This means any agent — on any machine — can cold-start into an ongoing project with full context in under 30 seconds.

```
Session N (Claude):   writes code → logs → rewrites HANDOFF.md
Session N+1 (Codex):  reads HANDOFF.md → continues exactly where Claude stopped
Session N+2 (OpenCode): same — zero context loss
```

---

## Quick Start

### Option A — Docker (3 commands)

```bash
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow
bash setup.sh --docker
```

### Option B — Native install

```bash
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow
bash setup.sh --native
```

### Option C — Ubuntu one-liner

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-ubuntu.sh)
```

---

## Docker Setup

### Prerequisites

| Tool | Install |
|------|---------|
| Docker Engine 24+ | `curl -fsSL https://get.docker.com \| sudo sh` |
| Docker Compose v2 | Bundled with Docker Engine 24+ |
| Git | `apt install git` |

### Steps

```bash
# 1. Clone
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow

# 2. Add your API keys
cp docker/secrets.env.template docker/secrets.env
nano docker/secrets.env

# 3. Build and start
sudo docker compose up -d

# 4. Open dashboard
http://localhost:3333
```

> **Linux:** Add yourself to the docker group to avoid `sudo`:
> ```bash
> sudo usermod -aG docker $USER && newgrp docker
> ```

### Docker Commands

```bash
sudo docker compose up -d            # Start in background
sudo docker compose logs -f          # Stream logs
sudo docker compose restart          # Restart
sudo docker compose down             # Stop
sudo docker compose up -d --build    # Rebuild image + restart
```

### What Runs in Docker

| Service | Port | Description |
|---------|------|-------------|
| Dashboard (Next.js) | `3333` | Agent overview, ledger, tasks, plans, inbox |
| MCP server | internal | 13-tool shared-memory bus |

The AI agents themselves (Claude Code, Codex, OpenCode, etc.) run on your **host machine** and communicate with the MCP server via their config files.

### Live-Mounted Volumes

```
~/AI_Workflow/memory/    →  /paos/memory/    (inboxes, tasks, context, HANDOFF)
~/AI_Workflow/logs/      →  /paos/logs/      (per-agent audit trails)
~/AI_Workflow/vault/     →  /paos/vault/     (Obsidian vault)
~/AI_Workflow/knowledge/ →  /paos/knowledge/ (docs, templates)
~/AI_Workflow/agents/    →  /paos/agents/    (soul files)
~/AI_Workflow/skills/    →  /paos/skills/    (reusable skills)
```

Agent writes on the host appear in the dashboard instantly.

---

## VPS / Cloud Deployment

Run PAOS on a VPS so the dashboard and MCP server are always on.

### 1. Provision a Server

- **OS:** Ubuntu 22.04 / 24.04 LTS
- **RAM:** 1 GB minimum (2 GB recommended)
- **Storage:** 20 GB SSD
- **Open port:** 3333 (or 80/443 behind nginx)

### 2. Install and Deploy

```bash
# SSH into VPS
ssh user@your-vps-ip

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker

# Clone and start
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow
cp docker/secrets.env.template docker/secrets.env
nano docker/secrets.env
bash setup.sh --vps
```

### 3. Auto-start on Reboot (systemd)

```bash
sudo tee /etc/systemd/system/paos.service > /dev/null <<EOF
[Unit]
Description=PAOS Hub
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/$USER/AI_Workflow
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
User=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now paos
```

### 4. HTTPS with Nginx (optional)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

sudo tee /etc/nginx/sites-available/paos > /dev/null <<EOF
server {
    server_name paos.yourdomain.com;
    location / {
        proxy_pass http://localhost:3333;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/paos /etc/nginx/sites-enabled/
sudo certbot --nginx -d paos.yourdomain.com
```

Dashboard available at `https://paos.yourdomain.com`.

---

## Native Install

### Ubuntu / Debian

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-ubuntu.sh)
```

Installs: Node.js 20, Git, MCP server, dashboard, Claude Code, Codex, OpenClaw. Sets up agent symlinks and patches all paths.

### macOS

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-mac.sh)
```

### Windows (PowerShell — Run as Administrator)

```powershell
irm https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-windows.ps1 | iex
```

> WSL2 (Ubuntu) recommended — all agent scripts are bash-based.

---

## Agent Setup

### Claude Code

```bash
npm install -g @anthropic-ai/claude-code
ln -sf ~/AI_Workflow/config/claude ~/.claude
claude   # PAOS vault protocol loads automatically
```

### OpenCode (5 roles: developer, plan, architect, coordinator, openclaw)

```bash
# Config already at config/opencode/opencode.json
opencode

# Invoke a specific role
@developer implement the payment module
@architect review the database schema
@plan create a task breakdown for auth feature
@coordinator verify TASK-004
```

### Codex

```bash
npm install -g @openai/codex
export OPENAI_API_KEY=sk-proj-...
codex
```

### Gemini CLI

```bash
npm install -g @google/gemini-cli
ln -sf ~/AI_Workflow/config/gemini ~/.gemini
gemini   # Soul file at agents/gemini/soul.md loads PAOS protocol
```

### Ollama (local LLM)

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama run llama3
```

### OpenClaw (channel agent — Telegram, WhatsApp, Slack)

```bash
npm install -g openclaw --prefix ~/.local
openclaw onboard   # configure your channels
```

---

## API Keys

| Key | Where to Get | Used By |
|-----|-------------|---------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/settings/keys) | Claude Code (API mode) |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) | Codex |
| `GOOGLE_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey) | Gemini / Antigravity |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) | GitHub push |

> Claude Code CLI uses OAuth by default — `ANTHROPIC_API_KEY` only needed for direct API calls.

---

## MCP Tools (shared-memory server)

All 13 tools are available to every connected agent:

| Tool | Description |
|------|-------------|
| `append_ledger` | Append to the immutable global audit ledger |
| `read_ledger` | Read the last N rows of the audit ledger |
| `write_context` | Append a structured entry to shared thinking context |
| `read_context` | Read the full shared context |
| `send_message` | Drop a message into another agent's inbox |
| `read_inbox` | Read messages from your own inbox |
| `list_agents` | List all agents with inbox count + last activity |
| `create_task` | Create a YAML task card in the task board |
| `read_task` | Read a task card by ID |
| `write_handoff` | Rewrite the HANDOFF.md cross-agent state file |
| `agent_commit` | Execute a git commit as a named agent |
| `process_notes` | Archive completed notes to notes-done.md |
| `process_questions` | Archive answered Q&A to user-questions-answered.md |

---

## Per-Agent Git Identities

Every agent commits under its own identity — visible as distinct authors in GitHub gitgraph:

```bash
./bin/agent-commit.sh claude "Agent[claude]: updated auth module"
./bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: fixed login bug"
./bin/agent-commit.sh codex "Agent[codex]: refactored database layer"
./bin/agent-commit.sh gemini "Agent[gemini]: added API endpoint"
```

| Agent | Git Email |
|-------|----------|
| Claude Code | `claude@paos.nodealgo.com` |
| Codex | `codex@paos.nodealgo.com` |
| OpenCode Developer | `developer@paos.nodealgo.com` |
| OpenCode Architect | `architect@paos.nodealgo.com` |
| OpenCode Coordinator | `coordinator@paos.nodealgo.com` |
| OpenCode Plan | `plan@paos.nodealgo.com` |
| Gemini | `gemini@paos.nodealgo.com` |
| Antigravity | `antigravity@paos.nodealgo.com` |
| OpenClaw | `openclaw@paos.nodealgo.com` |
| Ollama | `ollama@paos.nodealgo.com` |

---

## H-Factor Governance

PAOS enforces four invariants across all agents at all times:

| ID | Invariant | Rule |
|----|-----------|------|
| **I1** | Separation of Powers | Planner ≠ Reviewer ≠ Executor — no agent controls more than one phase |
| **I2** | Audit Immutability | `global_ledger.md` is append-only — no agent ever edits past entries |
| **I3** | Identity First | Every action is attributed to a named agent stamp before execution |
| **I4** | Skill Boundary | Agents act only within their declared capabilities |

Violations cause coordinator rejection — the pipeline cannot advance until the invariant is restored. Full constitution: [workflow.md](workflow.md).

---

## Memory Architecture

| Tier | Path | Access | Purpose |
|------|------|--------|---------|
| **Handoff** | `memory/shared/HANDOFF.md` | All agents | Live cross-agent state — rewritten each session |
| **A — Context** | `memory/shared/context.md` | All agents | Append-only shared thinking log |
| **B — Tasks** | `memory/tasks/<id>.md` | All agents | YAML task cards with status tracking |
| **C — Inbox** | `memory/inbox/<agent>/` | Per-agent | Async messages via MCP `send_message` |
| **Ledger** | `memory/global_ledger.md` | All agents | Immutable audit log — every action, forever |
| **Daily** | `vault/daily/<YYYY-MM-DD>.md` | Obsidian | Session diary per day |
| **Chats** | `vault/chats/*.md` | Obsidian | Decisions + files per chat session |

---

## Skills

Skills are reusable agent capabilities stored in `skills/`:

| Skill | Trigger | What it does |
|-------|---------|-------------|
| **Antigravity Review Loop** | Any non-trivial task | PM → Architect review → Coordinator gate → Execute → Walkthrough |
| **System Analysis & Design** | "SRS", "system design", "architecture" | 14-section SRS + Mermaid diagrams |
| **Project Scaffolder** | "scaffold", "new project" | 10-point discovery survey → full project structure via MCP |
| **Skill Creator** | "create skill", "new skill" | Elicitation interview → new skill in `skills/` |

---

## Directory Structure

```
AI_Workflow/
├── agents/                  # Agent souls (identity, protocol, boundaries)
│   ├── codex/soul.md
│   ├── developer/soul.md
│   ├── architect/soul.md
│   ├── coordinator/soul.md
│   ├── gemini/soul.md
│   └── profiler/soul.md
├── bin/                     # Utility scripts
│   ├── agent-commit.sh      # Per-agent git commits (mandatory)
│   ├── test-agents.sh       # Verify all agent identities
│   └── github-setup.sh      # First-time GitHub auth
├── config/                  # AI tool configurations
│   ├── claude/              # Claude Code → ~/.claude (symlink)
│   ├── codex/               # Codex → ~/.codex (symlink)
│   ├── opencode/            # OpenCode 5-agent definitions
│   ├── gemini/              # Gemini CLI → ~/.gemini (symlink)
│   └── secrets/             # .env (gitignored), .env.template (tracked)
├── dashboard/               # Next.js orchestration UI — port 3333
├── docker/                  # Docker deployment files
│   ├── Dockerfile           # Multi-stage: MCP server + Next.js dashboard
│   ├── docker-compose.yaml  # Legacy (run from docker/ subdir)
│   ├── entrypoint.sh        # Starts dashboard + MCP server
│   └── secrets.env.template # Copy → secrets.env, fill in API keys
├── docker-compose.yml       # Canonical compose file (run from repo root)
├── setup.sh                 # One-command setup (--docker / --native / --vps)
├── install-ubuntu.sh        # Ubuntu/Debian native installer
├── install-mac.sh           # macOS native installer
├── install-windows.ps1      # Windows native installer
├── docs/screenshots/        # Dashboard screenshots
├── knowledge/               # Canonical knowledge base (.md docs, templates)
├── logs/                    # Per-agent audit trails
│   ├── global_ledger.md     # Immutable — all agents
│   ├── claude/events.md
│   ├── developer/events.md
│   └── gemini/events.md
├── mcp/
│   └── shared-memory-server/  # 13-tool MCP bus (Node.js)
├── memory/                  # Symlink → logs/ (shared memory hub)
│   ├── shared/HANDOFF.md    # Cross-agent live state
│   ├── shared/context.md    # Tier A — shared thinking
│   ├── tasks/               # Tier B — task board
│   └── inbox/<agent>/       # Tier C — agent inboxes
├── skills/                  # Reusable agent skills
│   ├── antigravity-review-loop/
│   ├── project-scaffolder/
│   ├── system-analysis-and-design/
│   └── skill-creator-elicitation/
├── vault/                   # Obsidian vault (symlinks → memory/ + knowledge/)
│   ├── daily/               # Session diaries
│   └── chats/               # Chat summaries
└── workflow.md              # PAOS Constitution (H-Factor governance)
```

---

## Troubleshooting

**Docker permission denied on socket**
```bash
sudo usermod -aG docker $USER && newgrp docker
# Or just prefix with sudo: sudo docker compose up -d
```

**Dashboard shows zeros / no data**
```bash
# Check volume mounts — memory/ must exist on host
ls ~/AI_Workflow/memory/global_ledger.md
# Rebuild if needed
sudo docker compose up -d --build
```

**MCP tools not showing in Claude Code**
```bash
# Verify mcp.json has command as array (not string)
cat ~/.claude/mcp.json | python3 -m json.tool
# Should show: "command": ["node", "/path/to/index.js"]
```

**Paths still pointing to /home/dev**
```bash
grep -rl "/home/dev/AI_Workflow" ~/AI_Workflow \
  --include="*.json" --include="*.js" \
  | xargs sed -i "s|/home/dev/AI_Workflow|${HOME}/AI_Workflow|g"
```

**Agent commits fail / wrong author**
```bash
chmod +x ~/AI_Workflow/bin/agent-commit.sh
./bin/test-agents.sh   # verify all identities
```

---

## Forking / Personalising

1. Fork the repo on GitHub
2. Clone and run `bash setup.sh --native` — patches all paths automatically
3. Edit `user.md` with your identity
4. Replace `@paos.nodealgo.com` in `bin/agent-commit.sh` with your own domain
5. Fill `config/secrets/.env` with your API keys
6. Set up OpenClaw channels: `openclaw onboard`
7. Push your first agent commit: `./bin/agent-commit.sh claude "Agent[claude]: personalised PAOS for <yourname>"`

---

## License

MIT — use freely, personalise heavily.

---

*Built by [NodeAlgo](https://nodealgo.com) · PAOS H-Factor Protocol v2.1.0*
