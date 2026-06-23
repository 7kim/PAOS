# PAOS Architecture — Complete System Model

## Layer 1 — The Fabric (shared across ALL projects)

Global infrastructure — one instance, always running, shared by every project.

### Data & Storage

| Resource | Path | Description |
|----------|------|-------------|
| Global Ledger | `memory/global_ledger.md` | Unified append-only audit trail for cross-project coordination and security |
| Shared Context | `memory/shared/context.md` | Cross-agent thinking context visible to all agents |
| HANDOFF.md | `memory/shared/HANDOFF.md` | Session handoff between agents (global scope) |
| Knowledge | `knowledge/` | Shared knowledge base: docs, books, references, learnings, Q&A archives |
| Config | `config/<agent>/` | Per-agent settings (model, color, CLI path) |
| Secrets | `config/secrets/.env` | Global API keys, tokens (OpenAI, Anthropic, Hostinger, etc.) |
| Skills | `skills/` + `.hermes/skills/` | Shared skill library — any agent, any project can use them |
| MCP Config | `mcp/mcp-config.json` | Shared MCP server definitions (gitkraken, memory, scaffold, etc.) |
| Agent Registry | `agents/registry.json` | All known agent identities with inbox/status |
| Constitution | `workflow.md` | H-Factor governance rules: separation of powers, audit immutability, identity first, skill boundary |
| Queue | `memory/queue/{pending,running,done}/` | Global FIFO pipeline queue |

### Agents (shared identities)

| Agent | ID | Role |
|-------|----|------|
| Hermes | `hermes-nous` | Primary CLI agent, orchestrator |
| Claude Code | `claude` | Coding agent (Anthropic) |
| Codex | `codex` | Coding agent (OpenAI) |
| Gemini | `gemini` | Coding agent (Google) |
| Antigravity | `antigravity` | Review/audit agent |
| OpenClaw | `openclaw` | Developer agent |
| Developer | `developer` | Generic executor |
| Architect | `architect` | Reviewer / approval gate |
| Coordinator | `coordinator` | Multi-agent delegation |
| Ollama | `ollama` | Local LLM agent |
| Signal | `signal` | Messaging agent |

Each has a `soul.md` defining its identity, capabilities, and skill boundaries.

### Infrastructure

| Component | Description |
|-----------|-------------|
| Dashboard | Next.js 16 web UI (port 3333) |
| Systemd services | Auto-start, survive reboot, linger enabled |
| Tailscale Serve | Remote access via `dev.anaconda-notothen.ts.net` |
| Docker | `docker-compose.yml` + Dockerfile for containerized runs |
| Installers | `install-ubuntu.sh`, `install-mac.sh`, `install-windows.ps1` |
| VSCode Workspace | `AI_Workflow.code-workspace` |

### CLI Commands (14 /h-* tools)

| Command | Purpose |
|---------|---------|
| `h-help` | List all available commands |
| `h-whoami` | Show agent identity, soul path, git config |
| `h-status` | Recent ledger entries, shared context, active projects |
| `h-inbox` | Read messages in agent inbox |
| `h-daily` | Create or read global daily note |
| `h-log` | Dual-log: agent events + global ledger |
| `h-context` | Append structured thinking to shared context |
| `h-audit` | Read/filter global audit ledger |
| `h-commit` | Git commit with proper agent identity |
| `h-sync` | Sync chat transcripts |
| `h-chat` | Start/resume a chat session |
| `h-task` | Manage task cards |
| `h-pipeline` | Submit cross-agent pipeline plans |
| `h-write-handoff` | Write session handoff |

---

## Layer 2 — Per-Project Workspace

Each project gets its own fully isolated sandbox under `memory/pipelines/{project}/`.

### Project Directory Structure

```
memory/pipelines/{project}/
├── pipelines/                    ← that project's pipelines only
│   ├── PIPE-1-.../
│   │   ├── META.json
│   │   ├── PLAN.md
│   │   ├── TASKS.md
│   │   ├── WALKTHROUGH.md
│   │   └── pipeline.json
│   └── PIPE-2-.../
├── ledger.md                     ← per-project audit trail
├── kanban/                       ← kanban board data (plans, tasks, walkthrough)
├── inbox/                        ← scoped agent inboxes for this project
│   ├── {Project}_Claude/
│   ├── {Project}_OpenCode-Developer/
│   └── {Project}_Hermes/
├── vault/
│   ├── daily/                    ← per-project daily notes
│   ├── chats/                    ← per-project chat history
│   └── notes/                    ← per-project notes
├── shared-context.md             ← thinking context for agents on this project
├── handoff.md                    ← session handoff scoped to this project
├── events.md                     ← per-project event log
├── secrets/                      ← per-project secrets
│   └── .env                      ← database credentials, project-specific API keys
└── .project-meta.json            ← project metadata (source path, created at, integration status)
```

### Per-Project Dashboard Views

| Page | Scope | Notes |
|------|-------|-------|
| Project Pipelines | Filtered by `?project=` | Shows only that project's pipelines |
| Project Plans/Kanban | Filtered by `?project=` | Plan, tasks, walkthrough boards |
| Project Git View | Filtered by `?project=` | Commit history for that project only |
| Project Inbox | Scoped to project agents | Messages for `{Project}_Agent` identities |

### Settings — Global View Toggle

A **View All** toggle in Settings that merges per-project data into a single unified view:
- All pipelines from all projects (current default)
- All plans/kanban across all projects
- All git history merged chronologically
- When disabled, pages show project selector chips to pick one project

---

## Cross-Cutting Relationships

### Agents × Projects

```
Global Agent:  claude@PAOS.com          (works on global tasks)
Project Agent: MyProject_claude@PAOS.com  (scoped to one project)
```

Each project gets its own aliased agent identities so audit trails and inboxes stay isolated.

### Secrets × Projects

```
Global:  config/secrets/.env           (OpenAI key, Anthropic key, Hostinger token)
Project: memory/pipelines/{project}/secrets/.env  (DB password, project API key)
```

Agents merge both when working on a project — global secrets for infrastructure access, project secrets for project-specific resources.

### Ledgers × Projects

```
Global:  memory/global_ledger.md       (cross-project activity, security audit)
Project: memory/pipelines/{project}/ledger.md  (project-level changes only)
Agent:   memory/<agent>/events.md      (per-agent action log)
```

Every action is logged to all three — agent, project, and global — at different granularities.

### Daily Notes × Projects

```
Global:  vault/daily/2026-06-22.md     (PAOS-wide daily)
Project: memory/pipelines/{project}/vault/daily/2026-06-22.md  (project daily)
```

`h-daily` creates both when a project context is active.

---

## Dependency Flow

```
┌─────────────────────────────────────────────┐
│                 The Fabric                   │
│  Ledger · MCP · Skills · Secrets · Agents   │
│  Knowledge · Queue · Constitution · Config  │
└──────────┬──────────────────────────────────┘
           │ shared by all
           ▼
┌─────────────────────────────────────────────┐
│            Per-Project Sandbox               │
│  Pipelines · Ledger · Kanban · Inboxes      │
│  Vault · Context · Handoff · Events         │
│  Secrets · Scoped Agents                    │
└─────────────────────────────────────────────┘
```
