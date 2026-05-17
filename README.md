# PAOS — Personal Agent Operating System

> **Self-hosted multi-agent AI orchestration.**
> Claude Code, Codex, OpenCode, Gemini, Antigravity, OpenClaw, and Ollama — unified through shared memory, a messaging bus, and a governance framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](docker-compose.yml)

---

## What is PAOS?

PAOS is a self-hosted orchestration layer that connects multiple AI coding agents so they can:

- **Share memory** — agents read what others have done via a shared vault and audit ledger
- **Delegate tasks** — agents send work to each other's inboxes via an MCP messaging bus
- **Commit under their own identity** — each agent has its own git author visible in gitgraph
- **Follow governance rules** — the H-Factor protocol (Separation of Powers, Audit Immutability, Identity First, Skill Boundary)

All state lives on your machine. No cloud sync required.

---

## Screenshots

> 📸 **See it live** — screenshots from the dashboard running at `localhost:3333`

| Dashboard Overview | Audit Ledger |
|---|---|
| ![Dashboard overview](docs/screenshots/dashboard-overview.png) | ![Audit ledger](docs/screenshots/dashboard-ledger.png) |

| Agent Roster | Task Board |
|---|---|
| ![Agent roster](docs/screenshots/dashboard-agents.png) | ![Task board](docs/screenshots/dashboard-tasks.png) |

| GitGraph — Per-Agent Commits |
|---|
| ![GitGraph](docs/screenshots/gitgraph-agents.png) |

> Screenshots not loading? [See docs/screenshots/README.md](docs/screenshots/README.md) for how to capture them from a running instance.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Your Machine                          │
│                                                              │
│  Claude Code ──┐                                             │
│  OpenCode ─────┤                                             │
│  Codex ────────┼──► MCP Shared-Memory Server (13 tools)      │
│  Gemini ───────┤         ↕           ↕           ↕           │
│  Antigravity ──┤     memory/      vault/       logs/         │
│  OpenClaw ─────┤       (shared filesystem — all agents)      │
│  Ollama ───────┘                                             │
│                                                              │
│  Dashboard (Next.js) ─────────────────► localhost:3333       │
└──────────────────────────────────────────────────────────────┘
```

### Agent Pipeline

```
User / OpenClaw (channel agent)
        │
        ▼
    @plan  (Project Manager — TASKS.md + IMPLEMENTATION_PLAN.md)
        │
   ┌────┴────┐
   ▼         ▼
@architect  @coordinator  (parallel review + H-Factor gate)
        │
        ▼
   @developer  (execution — code, tests, commits)
        │
        ▼
   @coordinator  (verification + pipeline close)
```

---

## Quick Start

### Option A — Docker (recommended, 3 commands)

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

### Option C — One-liner (Ubuntu)

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-ubuntu.sh)
```

---

## Docker Setup

### Prerequisites

| Tool | Minimum | Install |
|------|---------|---------|
| Docker Engine | 24+ | `curl -fsSL https://get.docker.com \| sh` |
| Docker Compose | v2 | bundled with Docker Desktop / Engine 24+ |
| Git | 2.x | `apt install git` / `brew install git` |

### Steps

```bash
# 1. Clone
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow

# 2. Add your API keys
cp docker/secrets.env.template docker/secrets.env
nano docker/secrets.env

# 3. Build and start
docker compose up -d

# 4. Open dashboard
open http://localhost:3333       # macOS
xdg-open http://localhost:3333  # Linux
```

### Docker Commands

```bash
docker compose up -d             # Start (background)
docker compose logs -f           # Stream logs
docker compose restart           # Restart
docker compose down              # Stop + remove container
docker compose up -d --build     # Rebuild image + restart
docker compose ps                # Check status
```

### What Runs in Docker

| Service | Port | Description |
|---------|------|-------------|
| Dashboard (Next.js) | `3333` | Agent overview, ledger, task board |
| MCP server | internal | Shared-memory bus for all agents |

> **AI agents (Claude Code, Codex, OpenCode, etc.) run on your host machine** — they communicate with the containerised MCP server via stdio/config. Only the dashboard and MCP server are containerised.

### Volumes (live-mounted from host)

```
~/AI_Workflow/memory/     →  /paos/memory/     (agent inboxes, tasks, context)
~/AI_Workflow/logs/       →  /paos/logs/       (per-agent audit trails)
~/AI_Workflow/vault/      →  /paos/vault/      (Obsidian vault)
~/AI_Workflow/knowledge/  →  /paos/knowledge/  (docs, templates)
~/AI_Workflow/agents/     →  /paos/agents/     (soul files)
~/AI_Workflow/skills/     →  /paos/skills/     (reusable skills)
```

Changes your agents make on the host are instantly visible in the dashboard.

---

## VPS / Cloud Deployment

Run PAOS on a VPS (DigitalOcean, Hetzner, AWS EC2, etc.) so the dashboard is always on and agents can coordinate regardless of which machine they're running from.

### 1. Provision a VPS

Recommended specs:
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 1 GB minimum, 2 GB recommended
- **Storage**: 20 GB SSD
- **Port**: 3333 (or 80/443 behind nginx)

### 2. Initial Server Setup

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Create a non-root user
adduser paos
usermod -aG sudo paos
su - paos

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker paos
newgrp docker
```

### 3. Deploy PAOS

```bash
# Clone the repo
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow

# Add your API keys
cp docker/secrets.env.template docker/secrets.env
nano docker/secrets.env

# Start (headless, no prompts)
bash setup.sh --vps
# or manually:
docker compose up -d
```

### 4. Run as a Systemd Service (auto-restart on reboot)

```bash
sudo tee /etc/systemd/system/paos.service > /dev/null <<EOF
[Unit]
Description=PAOS Hub
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/paos/AI_Workflow
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
User=paos

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable paos
sudo systemctl start paos
```

### 5. Expose with Nginx + HTTPS (optional)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Create nginx config
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
sudo systemctl reload nginx
```

Dashboard will be available at `https://paos.yourdomain.com`.

### 6. Point Agents at the VPS MCP Server

On your development machine, update `config/opencode/opencode.json` and Claude's `~/.claude/mcp.json` to point to the VPS:

```json
"shared-memory": {
  "type": "local",
  "command": ["ssh", "paos@your-vps-ip", "node", "/home/paos/AI_Workflow/mcp/shared-memory-server/index.js"]
}
```

Or tunnel locally:

```bash
ssh -L 3100:localhost:3100 paos@your-vps-ip
```

---

## Native Install

### Ubuntu / Debian

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-ubuntu.sh)
```

The script:
1. Installs Node.js 20, git
2. Clones the repo to `~/AI_Workflow`
3. Updates all hardcoded paths to your actual install path
4. Installs MCP server + dashboard dependencies
5. Installs Claude Code, Codex, OpenClaw
6. Sets up agent symlinks (`~/.claude`, `~/.codex`, `~/.openclaw`)
7. Creates `config/secrets/.env` from template

### macOS

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-mac.sh)
```

### Windows (PowerShell — Run as Administrator)

```powershell
irm https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-windows.ps1 | iex
```

> **Windows:** WSL2 (Ubuntu) is recommended. All agent scripts are bash-based.

---

## API Keys

| Key | Where to Get | Required For |
|-----|-------------|-------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/settings/keys) | Claude Code (API mode) |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) | Codex |
| `GOOGLE_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey) | Gemini / Antigravity |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) | GitHub push (optional) |

> Claude Code CLI uses OAuth by default — `ANTHROPIC_API_KEY` is only needed for direct API calls.

---

## Agent Setup

### Claude Code

```bash
# Install
npm install -g @anthropic-ai/claude-code

# Link config
ln -sf ~/AI_Workflow/config/claude ~/.claude

# Start — PAOS protocol loads automatically from config/claude/CLAUDE.md
claude
```

### OpenCode (5 agents: developer, plan, architect, coordinator, openclaw)

```bash
# Config is already at config/opencode/opencode.json
opencode

# Invoke a specific agent
@developer build the authentication module
@architect review this design
@plan create a task breakdown for the payment feature
@coordinator verify TASK-001
```

### Codex

```bash
npm install -g @openai/codex
export OPENAI_API_KEY=sk-proj-...
codex
```

### Gemini CLI

```bash
# Install
npm install -g @google/gemini-cli

# Link config (reads soul from agents/gemini/soul.md)
ln -sf ~/AI_Workflow/config/gemini ~/.gemini
gemini
```

### Ollama (local LLM)

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3
ollama run llama3
```

---

## Agent Git Identities

Every agent commits under its own identity — visible as separate authors in GitHub's gitgraph:

```bash
./bin/agent-commit.sh claude "Agent[claude]: added auth module"
./bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: fixed login bug"
./bin/agent-commit.sh codex "Agent[codex]: refactored database layer"
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

## MCP Tools (shared-memory server)

| Tool | Description |
|------|-------------|
| `append_ledger` | Append to the immutable global audit ledger |
| `send_message` | Drop a message into another agent's inbox |
| `read_inbox` | Read messages from your own inbox |
| `read_context` | Read the shared thinking context |
| `write_context` | Append a structured entry to shared context |
| `list_agents` | List all agents with inbox counts + last activity |
| `create_task` | Create a YAML task card in the task board |
| `read_task` | Read a task card by ID |
| `read_ledger` | Read the last N rows of the audit ledger |
| `agent_commit` | Execute a git commit as a named agent |
| `write_handoff` | Rewrite the HANDOFF.md cross-agent state file |
| `process_notes` | Archive completed notes to notes-done.md |
| `process_questions` | Archive answered questions with Q&A pairs |

---

## Memory Tiers

| Tier | Path | Purpose |
|------|------|---------|
| A — Shared Context | `memory/shared/context.md` | Append-only thinking log for all agents |
| B — Task Board | `memory/tasks/<id>.md` | YAML task cards with status tracking |
| C — Agent Inbox | `memory/inbox/<agent>/` | Async messages via MCP |
| Audit Ledger | `memory/global_ledger.md` | Immutable action log (all agents) |
| HANDOFF | `memory/shared/HANDOFF.md` | Live cross-agent state — rewritten each session |

---

## H-Factor Governance

PAOS enforces four invariants across all agents:

| ID | Invariant | Rule |
|----|-----------|------|
| I1 | **Separation of Powers** | Planner ≠ Reviewer ≠ Executor — never control more than one phase |
| I2 | **Audit Immutability** | `global_ledger.md` is append-only — never edit past entries |
| I3 | **Identity First** | Every action attributed to the acting agent's stamp |
| I4 | **Skill Boundary** | Act only within declared capabilities |

Full constitution: [workflow.md](workflow.md)

---

## Directory Structure

```
AI_Workflow/
├── agents/                 # Agent souls (identity, protocol, boundaries)
│   ├── codex/soul.md
│   ├── developer/soul.md
│   ├── architect/soul.md
│   ├── coordinator/soul.md
│   └── gemini/soul.md
├── bin/                    # Utility scripts
│   ├── agent-commit.sh     # Per-agent git commits (mandatory)
│   ├── test-agents.sh      # Verify all agent identities
│   └── github-setup.sh     # First-time GitHub auth
├── config/                 # AI tool configurations
│   ├── claude/             # Claude Code → ~/.claude (symlink)
│   ├── codex/              # Codex → ~/.codex (symlink)
│   ├── opencode/           # OpenCode agent definitions
│   ├── gemini/             # Gemini CLI → ~/.gemini (symlink)
│   └── secrets/            # .env (gitignored), .env.template
├── dashboard/              # Next.js orchestration UI — port 3333
├── docker/                 # Docker deployment files
│   ├── Dockerfile
│   ├── docker-compose.yaml
│   ├── entrypoint.sh
│   └── secrets.env.template
├── docker-compose.yml      # Root-level compose file (use this)
├── setup.sh                # One-command setup (Docker or native)
├── install-ubuntu.sh       # Ubuntu/Debian native installer
├── install-mac.sh          # macOS native installer
├── install-windows.ps1     # Windows native installer
├── docs/screenshots/       # Dashboard screenshots
├── knowledge/              # Knowledge base (.md docs, templates)
├── logs/                   # Per-agent audit trails
├── mcp/                    # MCP servers
│   └── shared-memory-server/  # 13-tool messaging bus
├── memory/                 # Symlink → logs/ (shared memory hub)
│   ├── shared/context.md   # Tier A — shared thinking
│   ├── tasks/              # Tier B — task board
│   └── inbox/<agent>/      # Tier C — agent inboxes
├── skills/                 # Shareable agent skills
│   ├── antigravity-review-loop/
│   ├── project-scaffolder/
│   └── system-analysis-and-design/
├── vault/                  # Obsidian vault (symlinks → memory/ + knowledge/)
└── workflow.md             # PAOS Constitution (H-Factor governance)
```

---

## Troubleshooting

**Dashboard doesn't start after `docker compose up`**
```bash
docker compose logs paos-hub
# Common fix: ensure dashboard was built
docker compose up -d --build
```

**MCP tools not showing in Claude Code**
```bash
# Restart Claude and check MCP config
cat ~/.claude/mcp.json | python3 -m json.tool
# Should show shared-memory with command array (not string)
```

**Permission denied on agent commits**
```bash
chmod +x ~/AI_Workflow/bin/agent-commit.sh
git config --list | grep user.email
```

**Paths still pointing to `/home/dev/AI_Workflow`**
```bash
# The install script patches these automatically. To fix manually:
grep -rl "/home/dev/AI_Workflow" ~/AI_Workflow \
  --include="*.json" --include="*.js" --include="*.md" \
  | xargs sed -i "s|/home/dev/AI_Workflow|${HOME}/AI_Workflow|g"
```

**Docker on Linux: permission denied**
```bash
sudo usermod -aG docker $USER
newgrp docker    # apply without logout
```

---

## Forking / Personalising

1. Update `user.md` with your identity
2. Run setup.sh — it patches all paths automatically
3. Replace `@paos.nodealgo.com` in `bin/agent-commit.sh` with your domain
4. Fill `config/secrets/.env` with your API keys
5. Configure your channels in OpenClaw: `openclaw onboard`

---

## License

MIT — use freely, personalise heavily.

---

*Built by [NodeAlgo](https://nodealgo.com) · PAOS H-Factor Protocol v2.1.0*
