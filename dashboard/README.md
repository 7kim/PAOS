# PAOS Orchestration Dashboard

> **Next.js 16 web UI for the Personal Agent Operating System.**  
> Live agent activity, audit ledger, pipeline management, task board, agent inbox, git visualization, Docker containers, Node processes, and more — at `https://dev.anaconda-notothen.ts.net` (Tailscale) or `http://localhost:3333`.

---

## Quick Start

```bash
# From the PAOS root
cd ~/AI_Workflow/dashboard
npm run dev
# → http://localhost:3333
```

Or via Docker:

```bash
cd ~/AI_Workflow
sudo docker compose up -d
# → http://localhost:3333
```

---

## Pages

### Overview (`/`)
Live PAOS system dashboard. Shows:
- **Stats cards** — task count, plan count, inbox messages, ledger entries, agent health
- **Recent activity** — the last 5 ledger entries with timestamp, agent badge, and action
- **Agent health** — system status indicator (healthy/degraded) with unhealthy agent details
- **Auto-refresh** — polls the `/api/overview` endpoint every 10 seconds

### Ledger (`/ledger`)
Immutable audit trail — every agent action, forever. Supports:
- **Global ledger** — all actions across all agents and projects
- **Per-project ledger** — filter via `?project=NAME` query parameter
- **View All** — merges all project ledgers + global into one chronological feed
- **Raw toggle** — view the underlying markdown table

### Pipelines (`/pipelines`)
Cross-agent plan-then-execute pipeline manager:
- **Pipeline list** — all pipelines across all projects with status badges, progress bars, and phase counts
- **Pipeline detail** (`/pipelines/:id`) — full breakdown: META, tasks, phases with artifacts, version history, walkthrough
- **Create pipeline** — POST form with project, prompt, plan markdown, tasks markdown
- **Flow Builder** — visual DAG editor for multi-agent pipelines with drag-and-drop nodes
- **Live execution** — real-time status via `/api/pipelines/:id/flow-status`
- **Intervention** — pause a running pipeline, edit INTERVENE.md, resume
- **Phase retry/skip** — retry a failed phase or skip a blocked one

### Plans (`/plans`)
Implementation plan viewer:
- Lists all plans from pipeline directories and legacy `pm-logs/`
- Shows plan content, task breakdown, and walkthrough in tabbed view
- Tracks which plans have walkthroughs (post-execution audits)

### Tasks (`/tasks`)
Task board with approval workflow:
- Lists all task cards from `memory/tasks/` (global) and per-project
- **Identity fields** — author (who wrote it), executor (who does the work), priority, due date
- **State machine** — `draft → approved → in_progress → done` (or `failed`)
- **Approve button** — flip a draft task to approved; the task watcher picks it up
- **Start/Done buttons** — manual status transitions
- **Stats row** — Draft / Approved / In Progress / Done counts
- Click to view full task card content with identity metadata panel

### Agents (`/agents`)
PAOS agent roster with live health monitoring:
- Shows all 12+ registered agents with color-coded badges
- Status: healthy, binary_missing, mcp_missing, configured
- Health checks: binary path, config file, inbox directory, log file, git identity, MCP config
- Per-agent inbox message count and last activity timestamp
- Scoped git identity management for per-project agent aliasing

### Inbox (`/inbox`)
Cross-agent messaging bus:
- Per-agent tabbed inbox view
- Messages from other agents with From/To/Subject/Timestamp headers
- Composer — send a message to any agent's inbox
- Project inbox merging (global + project-scoped)

### Handoff (`/handoff`)
Cross-agent continuity state:
- Live view of `HANDOFF.md` — always current, rewritten every session
- Shows: last agent, active task, what was done, what's pending, key decisions
- Edit button to rewrite handoff content

### Git View (`/gitview`)
Git repository browser:
- Commit log with graph visualization
- Filter by agent identity or grep commit messages
- Single-commit detail view (diff, files changed)
- Directory tree visualization from HEAD
- Agent identity mapping from `agents/registry.json`

### Terminals (`/terminals`)
View all running terminal sessions:
- PID, CPU%, MEM%, IO, GPU per process
- App name detection via `/proc/pid/comm`
- Category heuristic (cpu/memory/io/idle)
- Inline output viewer with expand/collapse
- Kill button (SIGTERM → SIGKILL after 5s)
- Fullscreen mode
- Auto-refresh every 5 seconds

### Docker (`/docker`)
Docker container management:
- List all containers with status, CPU, memory, ports
- Action buttons: Start, Stop, Pause, Resume, Restart, Kill, Remove
- Expandable logs viewer (click to see `docker logs`)
- Auto-refresh every 5 seconds

### Node Processes (`/node-processes`)
Node.js process monitor:
- All node/npm/next/webpack/vite/tsc/pm2 processes
- PID, PPID, CPU%, MEM%, RSS, VSZ, type detection, CWD
- Filter bar (by cmd, type, PID)
- Stats row: Total, Next.js, Node, NPM, Build process counts
- SIGTERM and SIGKILL buttons
- Auto-refresh every 5 seconds

### Vault (`/vault`)
Obsidian vault access:
- Daily notes — create or read per-date notes
- Chat transcripts — view chat history from sessions
- Supports global vault and per-project scoped vaults

### API Playground (`/api-playground`)
Interactive API explorer — test any dashboard endpoint with live responses.

### Settings (`/settings`)
PAOS configuration:
- Global secrets management (API keys, tokens)
- Per-project secrets management
- MCP server list from unified registry
- Code-SRS configuration (features, models)
- "View All" toggle to merge per-project data into unified views

---

## Task Approval System

Every task has identity and a state machine:

| Field | Purpose |
|-------|---------|
| `author` | Who wrote the task (e.g., `hermes-nous`, `opencode-developer`) |
| `executor` | Who should do the work (defaults to author) |
| `priority` | `critical`, `high`, `normal`, `low` |
| `due` | Deadline date |

**State machine:**
```
draft → approved → in_progress → done
              ↓
           failed
```

**How to use:**
1. Create a task: "Build me X as a task" → I write `memory/tasks/x.md` (Status: draft)
2. Review on `/tasks` page
3. Click **Approve** — status becomes `approved`
4. The task watcher picks it up within 30 minutes, executes, marks `done`

**Task Watcher** (cron job `paos-task-watcher`):
- Runs every 30 minutes, repeat once (on-demand)
- Trigger manually: `/cron run 6ef21d9e95f3` or tell me "run task watcher"
- Only processes tasks with `Status: approved`

---

## API

The dashboard exposes **63 REST API endpoints** across 24 resource groups. See [docs/api.md](../docs/api.md) for the full reference.

| Group | Base Path | Endpoints |
|-------|-----------|-----------|
| Overview | `/api/overview` | 1 |
| Ledger | `/api/ledger` | 1 |
| Pipelines | `/api/pipelines[/:id]` | 10 |
| Projects | `/api/projects[/:name]` | 6 |
| Agents | `/api/agents[/:id]` | 4 |
| Templates | `/api/templates[/:id]` | 6 |
| Events | `/api/events` | 2 |
| Inbox | `/api/inbox` | 1 |
| Handoff | `/api/handoff` | 2 |
| Skills | `/api/skills` | 1 |
| Send Message | `/api/send-message` | 1 |
| Secrets | `/api/secrets` | 2 |
| Global Secrets | `/api/global-secrets` | 2 |
| Tasks | `/api/tasks` | 2 (GET + PATCH) |
| MCP Servers | `/api/mcp-servers` | 1 |
| Queue | `/api/queue` | 2 |
| Plans | `/api/plans` | 1 |
| Vault | `/api/vault` | 1 |
| Workspaces | `/api/workspaces[/:name]` | 4 |
| Git View | `/api/gitview` | 1 |
| System Doctor | `/api/system/doctor` | 1 |
| Admin/Code-SRS | `/api/admin/code-srs` | 2 |
| Docker | `/api/docker` | 2 (GET + POST) |
| Node Processes | `/api/node-processes` | 2 (GET + POST) |
| Terminals | `/api/terminals` | 2 |

---

## Architecture

```
dashboard/                      ← Next.js 16 App Router
├── app/
│   ├── api/                    ← 24 resource groups, 63 endpoints
│   │   ├── agents/
│   │   ├── pipelines/
│   │   ├── ledger/
│   │   ├── inbox/
│   │   ├── tasks/
│   │   ├── plans/
│   │   ├── handoff/
│   │   ├── projects/
│   │   ├── events/
│   │   ├── queue/
│   │   ├── gitview/
│   │   ├── vault/
│   │   ├── workspace/
│   │   ├── secrets/
│   │   ├── templates/
│   │   ├── skills/
│   │   ├── mcp-servers/
│   │   ├── send-message/
│   │   ├── docker/
│   │   ├── node-processes/
│   │   ├── terminals/
│   │   └── system/
│   ├── (page routes)           ← 18 UI pages
│   ├── layout.tsx
│   └── globals.css
├── components/                 ← Reusable React components
├── lib/                        ← Shared utilities
│   ├── paos.ts                 ← systemDoctor(), agentHealth(), readRegistry()
│   └── global-config.ts        ← MEMORY_DIR, PIPELINES_DIR, etc.
├── hooks/                      ← Custom React hooks
└── public/                     ← Static assets
```

All API routes are **file-system based** — they read from and write to markdown/JSON files under `~/AI_Workflow/memory/`, `~/AI_Workflow/projects/`, `~/AI_Workflow/config/`, and `~/AI_Workflow/vault/`. There is no database.

---

## Key Libraries

| Path | Purpose |
|------|---------|
| `lib/global-config.ts` | Path constants: MEMORY_DIR, PROJECTS_DIR, PIPELINES_DIR, WORKSPACES_DIR, LOGS_DIR |
| `lib/paos.ts` | Shared PAOS operations: `systemDoctor()` (30s cache), `agentHealth()`, `readRegistry()`, `repoPath()` |
| `lib/process-registry.ts` | In-memory registry tracking running agent processes (PIDs, labels, pipeline associations) |
| `lib/cost-tracker.ts` | Token cost calculation and aggregation engine |
| `lib/cache.ts` | File and data caching layer |
| `lib/themes.ts` | Theme system — Midnight (default), Cinder, Ash presets with CSS variables |
| `components/ui/` | shadcn/ui components (button, card, dialog, input, select, table, tabs, badge, etc.) |
| `hooks/` | Custom React hooks for data fetching, polling, state management |

---

## Development

```bash
# Install dependencies
npm install

# Start dev server (port 3333)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

The dashboard expects the PAOS root at `~/AI_Workflow/`. All API routes resolve paths relative to this directory.

---

## Entity Reference

For a complete map of every entity in the PAOS system — pages, APIs, UI components, libraries, and infrastructure — see:

📄 **[PAOS-Entities.md](../PAOS-Entities.md)** — one-liner descriptions for all 120+ entities, grouped by domain.

---

*Part of the [PAOS](../README.md) ecosystem — Personal Agent Operating System.*
