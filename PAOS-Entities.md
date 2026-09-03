# PAOS — Entity Reference

Every entity in the PAOS ecosystem, grouped by domain.

---

## 🤖 Agents

| Entity | Description |
|--------|-------------|
| **Agents** (`/agents`) | Monitor installed AI coding agents (Claude Code, OpenCode, Codex, Hermes) with health status, inbox counts, MCP servers, and per-agent install/uninstall/toggle controls |
| **Agent Replay** (`/agents/replay`) | Replay agent chat sessions and execution logs |
| **Agent Explorer** (`/agents/explorer`) | Deep-dive exploration of a single agent's files, history, and capabilities |
| **Agent Stats** (`/agents/stats`) | Aggregated performance metrics across all agents |
| **API: `/api/agents`** | List all agents with health checks, versions, and install status |
| **API: `/api/agents/[id]/health`** | Real-time health probe for a single agent |
| **API: `/api/agents/[id]/install`** | Install or update an agent package |
| **API: `/api/agents/[id]/toggle`** | Enable/disable an agent |
| **API: `/api/agents/[id]/files`** | List files in an agent's workspace |
| **API: `/api/agents/scoped`** | List agents scoped to the active project |
| **API: `/api/agents/stats`** | Aggregated agent performance statistics |
| **API: `/api/agents/available`** | Discover installable agents from the registry |
| **API: `/api/agents/installable`** | List agents available for installation |
| **API: `/api/agents/explorer`** | Deep-explore an agent's runtime state |
| **Lib: `agent-lifecycle.ts`** | Agent lifecycle management (register, deregister, probe) |
| **Lib: `agent-stats.ts`** | Agent metric collection and aggregation |
| **Lib: `process-registry.ts`** | In-memory registry tracking running agent processes (PIDs, labels, pipeline associations) |

---

## 📦 Projects

| Entity | Description |
|--------|-------------|
| **Projects** (`/projects`) | Browse and manage PAOS projects as scoped workspaces with file explorer, vault, secrets, and pipeline counts |
| **API: `/api/projects`** | List all projects with metadata and latest activity |
| **API: `/api/projects/[name]`** | Get details for a single project (pipeline count, activity, files) |
| **API: `/api/projects/[name]/tree`** | Recursive file tree for a project directory |
| **API: `/api/projects/[name]/integrate`** | Integrate a project into the PAOS ecosystem |
| **API: `/api/projects/import`** | Import a project from local path or GitHub URL |
| **Lib: `activeProject.ts`** | Track and resolve the currently active project across the system |

---

## 🔄 Pipelines (DAG Orchestration)

| Entity | Description |
|--------|-------------|
| **Pipelines** (`/pipelines`) | Visual DAG of all pipeline executions with git-graph nodes, status badges, queue panel, and creation dialog |
| **Pipeline Builder** (`/pipelines/builder`) | n8n-style drag-and-drop flow editor to create multi-phase pipeline DAGs |
| **Pipeline Visualize** (`/pipelines/[id]/visualize`) | Deep-dive view of a single pipeline: prompt, DAG canvas, phase cards with artifacts, intervention panel, task summary |
| **Pipeline Analytics** (`/pipelines/analytics`) | Execution analytics — success rates, duration histograms, phase bottleneck analysis |
| **API: `/api/pipelines`** | Create/list pipelines with queue state (pending, running, done) |
| **API: `/api/pipelines/[id]`** | Get/update/delete a single pipeline's metadata and files |
| **API: `/api/pipelines/[id]/execute`** | Execute a pipeline phase via the DAG runner |
| **API: `/api/pipelines/[id]/execute-flow`** | Trigger the full DAG flow execution with topological ordering |
| **API: `/api/pipelines/[id]/flow-status`** | Live DAG execution status (per-node PID, progress, output) |
| **API: `/api/pipelines/[id]/intervene`** | Read/write/delete INTERVENE.md to pause and inject operator instructions |
| **API: `/api/pipelines/[id]/phases/[nodeId]/retry`** | Retry a failed DAG node |
| **API: `/api/pipelines/[id]/phases/[nodeId]/skip`** | Skip a pending or failed DAG node |
| **API: `/api/pipelines/[id]/phases/[nodeId]/log`** | Stream execution log for a specific DAG node |
| **API: `/api/pipelines/[id]/phases/[nodeId]/files/[file]` | Read/write artifact files (PLAN.md, TASKS.md, WALKTHROUGH.md, REASONING.md, ANALYSIS.md) for a phase |
| **API: `/api/pipelines/[id]/phases-to-layout`** | Convert DAG phases to builder-layout.json for the visual editor |
| **API: `/api/pipelines/analytics`** | Aggregated pipeline execution metrics and trends |
| **API: `/api/pipelines/cost`** | Compute pipeline execution cost based on tokens and duration |
| **API: `/api/pipelines/generate-name`** | Auto-generate pipeline ID (PIPE-DD-MM-YYYY---HH-MM format) |
| **API: `/api/pipelines/schedule`** | Schedule a pipeline for future execution |
| **Lib: `pipeline-analytics.ts`** | Compute pipeline performance metrics and trend analysis |
| **Lib: `resource-planner.ts`** | Estimate resource requirements (tokens, time, agents) for pipeline execution |
| **Lib: `paos.ts`** | Core PAOS pipeline operations (create, enqueue, execute, delete) |

---

## 💬 Messaging & Communication

| Entity | Description |
|--------|-------------|
| **Inbox** (`/inbox`) | Cross-agent messaging hub — compose, read, sort, and reply to messages between agents |
| **API: `/api/inbox`** | List messages across all agent inboxes, filter by recipient |
| **API: `/api/send-message`** | Send a message from one agent to another |
| **API: `/api/queue`** | Pipeline queue operations (enqueue, dequeue, done, remove) backed by queue.json |

---

## 🔐 Secrets & Security

| Entity | Description |
|--------|-------------|
| **API: `/api/secrets`** | Project-scoped secrets CRUD (key=value pairs with notes, masked by default) |
| **API: `/api/global-secrets`** | Global secrets shared across all projects, with 100+ env variable templates |
| **API: `/api/csrf-token`** | CSRF token endpoint for form submissions |
| **Lib: `secret-templates.ts`** | Standardized env variable templates (Supabase, GitHub, OpenAI, etc.) with brand logos and categorized presets |
| **Lib: `csrf.ts`** | CSRF token generation and validation |

---

## 📂 Vault & Storage

| Entity | Description |
|--------|-------------|
| **Vault** (`/vault`) | Browse daily notes and agent chat transcripts stored in the PAOS vault with two-panel viewer |
| **API: `/api/vault`** | Read vault contents (daily notes, chats) with project scoping |
| **API: `/api/knowledge/health`** | Health check for the knowledge base and RAG system |

---

## 📋 Planning & Tasks

| Entity | Description |
|--------|-------------|
| **Plans** (`/plans`) | Browse implementation plans with tasks, walkthroughs, and batch download |
| **Tasks** (`/tasks`) | Task board showing all pipeline tasks across projects with status tracking |
| **Handoff** (`/handoff`) | Read the current PAOS cross-agent handoff state — what was done, what's pending, key decisions |
| **API: `/api/plans`** | List all implementation plans with task counts and metadata |
| **API: `/api/tasks`** | List all tasks across pipelines and projects |
| **API: `/api/handoff`** | Read the current HANDOFF.md content |
| **API: `/api/planner`** | Generate implementation plans via AI |

---

## 📊 Monitoring & Observability

| Entity | Description |
|--------|-------------|
| **Overview** (`/`) | At-a-glance system status hub with stats, agent health, recent activity feed, and quick actions |
| **Terminals** (`/terminals`) | View all running terminal sessions with PID, CPU/MEM/IO/GPU stats, inline output viewer, and kill controls |
| **Docker** (`/docker`) | View and manage Docker containers — start, stop, pause, restart, kill, remove, and view logs |
| **Node Processes** (`/node-processes`) | List all Node.js/npm/next/webpack/vite/tsc processes with PID, CPU, MEM, type detection, and SIGTERM/SIGKILL controls |
| **Events** (`/events`) | Real-time event log for all agent activities across projects with filtering |
| **Audit Ledger** (`/ledger`) | Full audit trail of every agent action with search, filtering, and row expansion |
| **System Doctor** (`/system/doctor`) | Automated system diagnostics and health checks |
| **API: `/api/overview`** | Aggregated dashboard stats (total tasks, plans, inbox, ledger) |
| **API: `/api/terminals`** | List all tracked terminal sessions with PID enrichment (CPU, MEM, IO, GPU) |
| **API: `/api/terminals/[pid]/log`** | Stream output log for a specific PID |
| **API: `/api/docker`** | List all Docker containers with resource stats |
| **API: `/api/node-processes`** | List all Node.js processes with type detection and resource stats |
| **API: `/api/events`** | List agent activity events with project filtering |
| **API: `/api/ledger`** | Full audit ledger with search and filtering |
| **API: `/api/system/doctor`** | Run system health diagnostics |
| **API: `/api/system/services`** | Monitor systemd services (paos-pipeline, paos-pipeline-handler, paos-telegram-bot) |

---

## 🧮 Tokens & Cost Tracking

| Entity | Description |
|--------|-------------|
| **Tokens** (`/tokens`) | Per-agent token tracking with calendar histogram, cost calculator, and model cost comparison |
| **API: `/api/tokens`** | Token usage data per agent (input/output/context, daily breakdown, cost estimates) |
| **Lib: `cost-tracker.ts`** | Token cost calculation and aggregation engine |

---

## 🧪 Benchmarks & Code Analysis

| Entity | Description |
|--------|-------------|
| **Benchmarks** (`/benchmarks`) | Full codebase benchmark suite with SRS audit, gap analysis, SWOT, and implementation plan generation |
| **API: `/api/benchmarks`** | Run and retrieve benchmark results |
| **API: `/api/benchmarks/[id]`** | Get detailed benchmark report by ID |
| **API: `/api/benchmarks/[id]/gaps/[n]`** | Get details for a specific gap in a benchmark |
| **API: `/api/benchmarks/[id]/gaps/[n]/create-pipeline`** | Auto-create a pipeline from a benchmark gap |

---

## 🤝 MCP Servers & Skills

| Entity | Description |
|--------|-------------|
| **MCP Servers** (`/mcp-servers`) | Configure, enable/disable, and manage MCP server connections (stdio and HTTP types) |
| **Skills** (`/skills`) | Browse and manage installed PAOS skills |
| **API: `/api/mcp-servers`** | CRUD for MCP server configurations (stored in mcp/mcp-config.json) |
| **API: `/api/skills`** | List installed PAOS skills |

---

## 🛠 Developer Tools

| Entity | Description |
|--------|-------------|
| **API Playground** (`/api-playground`) | Interactive API browser and tester — explore endpoints, send requests, view JSON responses |
| **Settings** (`/settings`) | Global configuration — theme, timezone, auto-refresh, global secrets, clean setup |
| **Code-SRS Settings** (`/settings/code-srs`) | Code-SRS platform configuration — feature flags, model aliases, tier management |
| **Git View** (`/gitview`) | Git activity visualization with per-agent commit history and diff viewer |
| **Graph** (`/graph`) | Visual graph view of system entities and their relationships |
| **Workspaces** (`/workspaces`) | Multi-workspace management |
| **API: `/api/settings`** | Read/write global settings |
| **API: `/api/settings/reset`** | Reset all settings to defaults |
| **API: `/api/preferences`** | User preferences persistence |
| **API: `/api/search`** | Full-text search across the PAOS system |
| **API: `/api/gitview`** | Commit history and diff data for git view |
| **API: `/api/workspaces`** | List all workspaces |
| **API: `/api/workspaces/[name]`** | Get workspace details |
| **API: `/api/admin/code-srs`** | Admin operations for Code-SRS |
| **API: `/api/templates`** | Template management for projects and pipelines |
| **API: `/api/templates/[id]`** | Get a specific template |
| **API: `/api/templates/suggestions`** | AI-powered template suggestions |
| **Lib: `settings.ts`** | Settings persistence and retrieval |
| **Lib: `global-config.ts`** | Central configuration module — all API paths, dirs, and env variables |
| **Lib: `cache.ts`** | File and data caching layer |

---

## 🎨 UI Components

| Component | Description |
|-----------|-------------|
| **Sidebar** (`Sidebar.tsx`) | Primary navigation with collapsible sections (Dashboard, Developer, Code-SRS), agent status strip, mobile responsive |
| `Badge` | Colored status/label pills for agents, states, tags |
| `Button` | Primary (gold), Outline, Ghost, Destructive with sm/md sizes |
| `Card` | Dark surface container with header, title, description, content |
| `Chart` | Recharts wrapper for histograms and time-series |
| `CodeEditor` | Code editor component (CodeMirror-based) |
| `Command` | Command palette (cmdk-style search) |
| `Dialog` | Overlay modal with header, title, description |
| `DropdownMenu` | Context menu with items, checkboxes, separators |
| `Input` / `InputGroup` | Text input with icon support |
| `Label` | Form label with required indicator |
| `Progress` | Horizontal progress bar (used in pipelines, plans) |
| `ScrollArea` | Custom scrollbar container |
| `Select` | Searchable dropdown |
| `Separator` | Visual divider line |
| `Sheet` | Side panel drawer (mobile sidebar) |
| `Skeleton` | Loading placeholder shimmer |
| `Sonner` | Toast notification system |
| `Switch` | On/off toggle (green when enabled) |
| `Table` | Data table with sortable headers, row expansion |
| `Tabs` | Tab navigation (used in pipeline visualize, plan detail) |
| `Textarea` | Multi-line text input with auto-resize |
| `Tooltip` | Hover tooltip (used in collapsed sidebar, icon buttons) |
| `WebTerminal` | xterm.js terminal emulator for browser |
| `Sidebar` (shadcn) | Base shadcn sidebar primitives (provider, trigger, menu, group) |

---

## 📚 Shared Libraries

| Library | Description |
|---------|-------------|
| `utils.ts` | General utilities (cn/classnames, formatters) |
| `similarity.ts` | Text similarity algorithms for search and matching |
| `search.ts` | Full-text search engine across vault, plans, tasks |
| `themes.ts` | Theme system — Midnight (default), Cinder, Ash presets with CSS variables |
| `viewAll.ts` | Cross-project "view all" mode toggle persistence |
| `useSearchParam.ts` | Hook for URL search param state |
| `use-mobile.ts` | Hook for mobile viewport detection (< 768px) |

---

## 🧩 Infrastructure

| Entity | Description |
|--------|-------------|
| `Dockerfile` | Production Docker image for the dashboard |
| `docker-compose.yaml` | Multi-service orchestration (dashboard + sidecar services) |
| `paos-dashboard.service` | Systemd user service — runs Next.js dev server, exposes via Tailscale serve on `dev.anaconda-notothen.ts.net` |
| `next.config.ts` | Next.js configuration — standalone output, custom webpack source-map, allowed dev origin for Tailscale |
| `Tailscale serve` | Private mesh network exposure — accessible from all Tailnet devices (iPad, phone, Fedora, Windows) without public internet exposure |

---

**Total:** 30 pages · 63 API routes · 26 UI components · 21 libraries · 1 hook
