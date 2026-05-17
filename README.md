# PAOS — Personal Agent Operating System

> **Enterprise-grade multi-agent AI orchestration hub.**
> Claude, Codex, OpenCode, Antigravity, OpenClaw, Ollama, and Copilot — unified through shared memory, a messaging bus, and a governance framework.

---

## What is PAOS?

PAOS is a self-hosted orchestration layer that connects multiple AI coding agents (Claude Code, OpenAI Codex, OpenCode, Google Gemini/Antigravity, Ollama) so they can:

- **Share memory** — agents read what others have done via a shared Obsidian vault and audit ledger
- **Delegate tasks** — agents send work to each other's inboxes via an MCP messaging bus
- **Commit under their own identity** — each agent has a distinct `@paos.nodealgo.com` git author visible in gitgraph
- **Follow governance rules** — the H-Factor protocol (Separation of Powers, Audit Immutability, Identity First, Skill Boundary) keeps agents from stepping on each other

All state lives on your machine. No cloud sync required.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Your Machine                        │
│                                                          │
│   Claude Code ──┐                                        │
│   OpenCode ─────┤                                        │
│   Codex ────────┤──► MCP Shared-Memory Server            │
│   Antigravity ──┤       ↕  ↕  ↕  ↕                      │
│   OpenClaw ─────┤    memory/  vault/  logs/              │
│   Ollama ───────┘       (shared filesystem)              │
│                                                          │
│   Dashboard ──────────────────► localhost:3333           │
└─────────────────────────────────────────────────────────┘
```

### Agent Pipeline

```
User Input
    │
    ▼
 @openclaw (channel agent — Telegram/WhatsApp/Slack)
    │
    ▼
 @plan (Project Manager — TASKS.md + IMPLEMENTATION_PLAN.md)
    │
    ├──► @architect (peer review + system design)
    └──► @coordinator (orchestration + delegation)
              │
              ▼
         @developer (execution — code, tests, commits)
```

### Memory Tiers

| Tier | Path | Purpose |
|------|------|---------|
| A — Shared Context | `memory/shared/context.md` | Append-only thinking log for all agents |
| B — Task Board | `memory/tasks/<id>.md` | YAML task cards with status |
| C — Agent Inbox | `memory/inbox/<agent>/` | Async messages via MCP |
| Audit Ledger | `memory/global_ledger.md` | Immutable action log |
| Daily Notes | `vault/daily/<YYYY-MM-DD>.md` | Obsidian session diary |

---

## Prerequisites

| Tool | Minimum Version | Required For |
|------|----------------|-------------|
| Git | 2.x | Core — all agents |
| Node.js | 18+ | MCP server, Dashboard, Codex, OpenClaw |
| npm | 8+ | Package installs |
| bash | 4+ | Agent scripts (Linux/macOS) |
| Claude Code | latest | Claude agent |
| OpenAI Codex | latest | Codex agent (`@openai/codex`) |
| OpenClaw | 2026.5.x | Channel agent (Telegram/WhatsApp) |
| Docker | 24+ | Optional — containerised deployment |
| Obsidian | latest | Optional — vault UI |

### API Keys Needed

| Key | Where to Get |
|-----|-------------|
| `OPENAI_API_KEY` | platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | console.anthropic.com/settings/keys |
| `GOOGLE_API_KEY` | aistudio.google.com/app/apikey |
| `GITHUB_TOKEN` | github.com/settings/tokens (scopes: `repo`, `workflow`) |

---

## Installation

### Ubuntu / Debian

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-ubuntu.sh)
```

Or manually:

```bash
# 1. Clone
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow

# 2. Install Node.js 20 (if needed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# 3. Install npm packages
cd mcp/shared-memory-server && npm install && cd ../..
cd dashboard && npm install && cd ..

# 4. Install agents
npm install -g @openai/codex --prefix ~/.local
curl -fsSL https://openclaw.ai/install.sh | bash

# 5. Install Claude Code
npm install -g @anthropic-ai/claude-code --prefix ~/.local

# 6. Set up symlinks
ln -sf ~/AI_Workflow/config/claude ~/.claude
ln -sf ~/AI_Workflow/config/codex ~/.codex
ln -sf ~/AI_Workflow/config/openclaw ~/.openclaw

# 7. Configure secrets
cp config/secrets/.env.template config/secrets/.env
nano config/secrets/.env   # fill in your API keys

# 8. Start dashboard
cd dashboard && npm run dev
```

### macOS

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-mac.sh)
```

Or manually:

```bash
# 1. Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install dependencies
brew install git node

# 3. Clone
git clone https://github.com/7kim/AI_Workflow.git ~/AI_Workflow
cd ~/AI_Workflow

# 4. Install npm packages
cd mcp/shared-memory-server && npm install && cd ../..
cd dashboard && npm install && cd ..

# 5. Install agents
npm install -g @openai/codex --prefix ~/.local
curl -fsSL https://openclaw.ai/install.sh | bash
npm install -g @anthropic-ai/claude-code --prefix ~/.local

# 6. Set up symlinks
ln -sf ~/AI_Workflow/config/claude ~/.claude
ln -sf ~/AI_Workflow/config/codex ~/.codex
ln -sf ~/AI_Workflow/config/openclaw ~/.openclaw

# 7. Configure secrets
cp config/secrets/.env.template config/secrets/.env
nano config/secrets/.env

# 8. Start dashboard
cd dashboard && npm run dev
```

### Windows (PowerShell — Run as Administrator)

```powershell
irm https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-windows.ps1 | iex
```

Or manually — see [install-windows.ps1](install-windows.ps1) for the full script.

> **Windows Note:** PAOS is fully supported on Windows via WSL2 (Ubuntu) or native PowerShell. WSL2 is recommended for the best experience since all agent scripts are bash-based.

---

## Configuration

### 1. API Keys

Edit `config/secrets/.env` (copied from `.env.template`):

```env
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
GITHUB_TOKEN=github_pat_...

MEMORY_DIR=/home/yourname/AI_Workflow/memory
KNOWLEDGE_DIR=/home/yourname/AI_Workflow/knowledge
TEMPLATES_DIR=/home/yourname/AI_Workflow/knowledge/templates
LOGS_DIR=/home/yourname/AI_Workflow/logs
```

> Update `MEMORY_DIR`, `KNOWLEDGE_DIR`, `TEMPLATES_DIR`, and `LOGS_DIR` to match your actual install path.

### 2. Update REPO_ROOT

Edit `config/opencode/opencode.json` and `mcp/shared-memory-server/index.js` — replace `/home/dev/AI_Workflow` with your actual path:

```bash
# Quick find-and-replace
grep -rl "/home/dev/AI_Workflow" . --include="*.json" --include="*.js" --include="*.md" \
  | xargs sed -i 's|/home/dev/AI_Workflow|/home/YOUR_USER/AI_Workflow|g'
```

### 3. Git Identity (optional)

By default, agent commits use `@paos.nodealgo.com` emails. To use your own domain, edit `bin/agent-commit.sh` and change the email suffix.

---

## Running PAOS

### Start the Dashboard

```bash
cd ~/AI_Workflow/dashboard
npm run dev
# → http://localhost:3333
```

The dashboard shows: active agents, audit ledger, task board, agent inboxes, and system overview.

### Start the MCP Server

```bash
cd ~/AI_Workflow/mcp/shared-memory-server
node index.js
```

This gives all agents access to shared memory, task creation, agent messaging, and git commits via MCP tools.

### Run with Docker (recommended for production)

```bash
cd ~/AI_Workflow

# First build the dashboard
cd dashboard && npm run build && cd ..

# Launch
docker compose -f docker/docker-compose.yaml up -d

# View logs
docker compose -f docker/docker-compose.yaml logs -f
```

Dashboard available at `http://localhost:3333`.

---

## Agent Setup

### Claude Code

Claude Code reads its configuration from `~/.claude` which is symlinked to `config/claude/`.

```bash
# Install
npm install -g @anthropic-ai/claude-code --prefix ~/.local

# The symlink must exist
ls -la ~/.claude  # → should point to AI_Workflow/config/claude/

# Start a session
claude
```

Claude follows the vault protocol automatically via `config/claude/CLAUDE.md`.

### OpenAI Codex

```bash
# Install
npm install -g @openai/codex --prefix ~/.local

# Set API key
export OPENAI_API_KEY=sk-proj-...

# Run
codex
```

Codex config lives at `~/.codex` → `config/codex/`. Its soul is at `agents/codex/soul.md`.

### OpenCode (5 agents)

OpenCode runs 5 specialised agents: `developer`, `plan`, `architect`, `coordinator`, `openclaw`.

```bash
# Config is at config/opencode/opencode.json
# Start a session
opencode

# Invoke a specific agent
@developer build the authentication module
@architect review this design
@plan create a task breakdown for the payment feature
```

### OpenClaw (Channel Agent)

OpenClaw connects Telegram, WhatsApp, Slack, Discord, and 20+ channels to your PAOS pipeline.

```bash
# Install (already done if you ran the install script)
# openclaw --version

# Onboard — sets up your channels
openclaw onboard

# Once configured, messages from Telegram/WhatsApp route to PAOS
```

### Ollama (Local LLM)

```bash
# Install
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3

# Run
ollama run llama3
```

---

## Agent Git Identities

Every agent commits under its own git identity — visible as separate authors in GitHub's gitgraph.

```bash
# Commit as a specific agent
./bin/agent-commit.sh claude "Agent[claude]: added auth module"
./bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: fixed login bug"
./bin/agent-commit.sh codex "Agent[codex]: refactored database layer"

# Test all agents
./bin/test-agents.sh
```

| Agent | Git Email |
|-------|----------|
| Claude Code | claude@paos.nodealgo.com |
| Codex | codex@paos.nodealgo.com |
| OpenCode Developer | developer@paos.nodealgo.com |
| OpenCode Architect | architect@paos.nodealgo.com |
| OpenCode Coordinator | coordinator@paos.nodealgo.com |
| OpenCode Plan | plan@paos.nodealgo.com |
| Antigravity | antigravity@paos.nodealgo.com |
| OpenClaw | openclaw@paos.nodealgo.com |
| Ollama | ollama@paos.nodealgo.com |

---

## MCP Tools

The shared-memory MCP server exposes 10 tools to all connected agents:

| Tool | Description |
|------|-------------|
| `append_ledger` | Append a row to the immutable global audit ledger |
| `send_message` | Drop a message into another agent's inbox |
| `read_inbox` | Read messages from your own inbox |
| `read_context` | Read the shared thinking context |
| `write_context` | Append a structured entry to shared context |
| `list_agents` | List all agents with inbox counts + last activity |
| `create_task` | Create a YAML task card in the task board |
| `read_task` | Read a task card by ID |
| `read_ledger` | Read the last N lines of the audit ledger |
| `agent_commit` | Execute a git commit as a named agent |

---

## Directory Structure

```
AI_Workflow/
├── agents/                    # Agent souls (personality, protocol, boundaries)
│   ├── architect/soul.md
│   ├── codex/soul.md
│   ├── coordinator/soul.md
│   ├── developer/soul.md
│   ├── openclaw/soul.md
│   └── profiler/soul.md
├── bin/                       # Utility scripts
│   ├── agent-commit.sh        # Per-agent git commits
│   ├── test-agents.sh         # Verify all agent identities
│   └── github-setup.sh        # First-time GitHub push
├── config/                    # AI tool configurations
│   ├── claude/                # Claude Code CLI → ~/.claude (symlink)
│   ├── codex/                 # Codex → ~/.codex (symlink)
│   ├── openclaw/              # OpenClaw → ~/.openclaw (symlink)
│   ├── opencode/opencode.json # OpenCode agent definitions
│   └── secrets/               # .env (gitignored), .env.template (tracked)
├── dashboard/                 # Next.js orchestration UI (port 3333)
├── docker/                    # Docker deployment files
├── knowledge/                 # Canonical knowledge base (.md ebooks, templates)
├── logs/                      # Per-agent audit trails
│   ├── claude/events.md
│   ├── codex/events.md
│   ├── opencode-developer/events.md
│   └── global_ledger.md
├── mcp/                       # MCP servers
│   └── shared-memory-server/  # 10-tool messaging bus
├── memory/                    # Symlink → logs/ (shared memory hub)
│   ├── shared/context.md      # Tier A — shared thinking
│   ├── tasks/                 # Tier B — task board
│   └── inbox/<agent>/         # Tier C — agent inboxes
├── skills/                    # Shareable agent skills
│   ├── system-analysis-and-design/
│   ├── project-scaffolder/
│   ├── antigravity-review-loop/
│   └── skill-creator-elicitation/
├── vault/                     # Obsidian vault (symlinks into memory/ + knowledge/)
│   ├── daily/                 # Session diaries
│   └── chats/                 # Chat summaries
└── workflow.md                # PAOS Constitution (H-Factor governance)
```

---

## H-Factor Governance

PAOS enforces four invariants across all agents:

| ID | Invariant | Rule |
|----|-----------|------|
| I1 | Separation of Powers | Planner ≠ Reviewer ≠ Executor — never control more than one phase |
| I2 | Audit Immutability | `global_ledger.md` is append-only — never edit past entries |
| I3 | Identity First | Every action attributed to the acting agent's stamp |
| I4 | Skill Boundary | Act only within declared capabilities |

The full constitution is in [workflow.md](workflow.md).

---

## Obsidian Vault

Open the vault in Obsidian by pointing it at `~/AI_Workflow/vault/`. You'll see:

- **Daily notes** — session diaries per YYYY-MM-DD
- **Chat summaries** — decisions + files changed per session
- **Global ledger** — immutable audit trail across all agents
- **Shared context** — the thinking log all agents append to

The vault is how agents share state asynchronously — one agent writes, others read.

---

## Troubleshooting

**MCP server won't start**
```bash
cd mcp/shared-memory-server
npm install
node index.js
```

**Agent commits fail**
```bash
# Ensure script is executable
chmod +x bin/agent-commit.sh
# Ensure git is configured
git config --list | grep user
```

**Dashboard 404**
```bash
cd dashboard
npm install
npm run dev   # dev mode, or:
npm run build && node .next/standalone/server.js   # production
```

**OpenClaw not finding binary**
```bash
# Re-install
npm install -g openclaw@latest --prefix ~/.local
# Verify
openclaw --version
```

**Codex API key missing**
```bash
source ~/AI_Workflow/config/secrets/.env
echo $OPENAI_API_KEY   # should print your key
```

---

## Contributing / Forking

PAOS is designed to be personalised. When forking:

1. Update `user.md` with your identity
2. Update all `REPO_ROOT` / path references to your install path
3. Replace `@paos.nodealgo.com` email domain in `bin/agent-commit.sh` with your own
4. Fill `config/secrets/.env` with your own API keys

---

## License

MIT — use freely, personalise heavily.

---

*Built by [NodeAlgo](https://nodealgo.com) using PAOS H-Factor Protocol v2.0.0*
