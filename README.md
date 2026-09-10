# PAOS — Personal Agent Operating System

![PAOS Dashboard](screenshots/dashboard-overview.png)

A multi-agent orchestration framework for running Hermes, Claude Code, Codex, Gemini, and other coding agents against a single shared workspace. Build visual DAG pipelines, assign an agent to each node, execute cascading multi-phase workflows, and watch tokens, costs, terminals, benchmarks, and file changes update live from one dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js) ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Architecture

![PAOS Architecture](screenshots/paos-architecture.svg)

PAOS is organized in two layers:

- **The Fabric** — global infrastructure shared by every project: an append-only ledger, shared knowledge base, per-agent config, secrets, skills library, MCP server definitions, the agent registry, and a FIFO pipeline queue. This runs once, always on.
- **Per-Project Workspace** — each project gets an isolated sandbox (`memory/pipelines/{project}/`) with its own pipelines, ledger, kanban board, scoped agent inboxes, vault, and secrets, so audit trails never bleed between projects.

The dashboard itself is a Next.js 16 App Router application with 63 file-system-based API routes — there's no database; everything reads and writes markdown/JSON on disk. Pipelines are executed by a DAG engine using Kahn's topological sort, and agents are spawned as subprocesses with per-node prompts, file references, and PID tracking.

---

## Features

### Pipeline System

![Pipeline Flow](screenshots/pipeline-flow.svg)

- **Visual DAG Builder** — drag-and-drop node editor built on `@xyflow/react`
- **Topological Execution** — Kahn's algorithm for dependency-ordered cascading runs
- **Branching & Joins** — parallel execution paths with sync points
- **Retry / Skip / Cancel** — per-node error recovery
- **Live Status** — per-node spinner, PID, progress bar, output preview
- **Intervention** — pause a running pipeline, edit `INTERVENE.md`, resume

![Flow Builder](screenshots/flow-builder.png)

| Feature | Description |
|---------|-------------|
| Auto-naming | `{Project}-PIPE_{counter}-{DD-MM-YYYY}---{HH-MM}` |
| 8 template presets | Quick Dev, Analyze-Implement, PR Review, Bug Fix, etc. |
| Load pipeline | Reopen a saved pipeline in the builder for re-execution |
| Phase cards | Clickable `.md` artifacts per node (toggleable) |
| Smart animation | Edges animate only between a completed source and pending target |

### Agent System

![Agents](screenshots/agents.png)

- **Multi-agent support** — Hermes, Claude Code, Codex, Gemini, Antigravity, OpenClaw, and more, all behind a common interface
- **Agent detection** — auto-detects installed agents via CLI version checks
- **Role system** — each role carries a hidden default prompt plus a user override
- **Skills & MCPs** — per-node skill and MCP server configuration
- **File references** — attach project/benchmark/pipeline files in read or edit mode
- **Scoped identities** — every project gets its own aliased agent identities (e.g. `MyProject_claude`), so ledgers and inboxes stay isolated per project while a global identity handles cross-project work

11 agent identities ship in the registry: Hermes (orchestrator), Claude Code, Codex, Gemini, Antigravity (review/audit), OpenClaw, Developer, Architect, Coordinator, Ollama, and Signal — each backed by a `soul.md` defining its identity and skill boundaries.

### Benchmarks & Code Quality

![Benchmarks](screenshots/benchmarks.png)

The benchmark system scores code against a 110-question, evidence-based audit spanning 9 categories of the project's coding constitution:

| Category | Questions | Weight |
|----------|-----------|--------|
| OOP | 18 | Heavy |
| Data Structures | 9 | Heavy |
| Security | 15 | Heavy |
| Code Quality | 10 | Medium |
| API Endpoints | 10 | Medium |
| Database | 8 | Medium |
| UX/UI | 10 | Moderate |
| System Analysis | 7 | Heavy |
| Graph Theory | 6 | Supporting |

Each run generates `full-audit.md`, `gaps.md`, `SRS-as-is.md` / `SRS-to-be.md` (via the `system-analysis-and-design` skill), `implementation.md`, and `implementation-plan.md`. Gaps flow through a 4-column kanban: **Pending → In Progress → Fixed → Won't Fix**, and any gap can be converted straight into a new pipeline.

### Token Tracking

![Tokens](screenshots/tokens.png)

- Per-agent cost breakdown
- 14/30-day histogram with input/output split bars
- Calendar view of daily token and cost history
- Cost comparison against Claude, GPT-4, Gemini, DeepSeek, Llama, or any other model's pricing
- Monthly context-token totals

### Terminals, Docker & Node Processes

![Terminals](screenshots/terminals.png)

- **Terminals** — every running process sorted by CPU, with pipeline PIDs linking directly to their output, view/edit mode toggle, and kill with SIGTERM → SIGKILL fallback
- **Docker** — container list with start/stop/pause/restart/kill/remove actions and an expandable log viewer
- **Node Processes** — dedicated monitor for `node`/`npm`/`next`/`webpack`/`vite`/`tsc`/`pm2` processes with PID, CPU, memory, and CWD

All three auto-refresh every 5 seconds.

### Task Approval System

Tasks carry an identity (`author`, `executor`, `priority`, `due`) and move through a state machine: `draft → approved → in_progress → done` (or `failed`). A cron-driven task watcher picks up anything marked `approved` and executes it automatically, so a task can go from "build me X" to a running pipeline without more back-and-forth.

### Ledger, Inbox, Handoff & Git View

- **Ledger** — an immutable, append-only audit trail of every agent action, viewable globally or filtered per project
- **Inbox** — a cross-agent messaging bus with per-agent tabs and a composer
- **Handoff** — a live view of `HANDOFF.md`, rewritten every session so the next agent (or the next you) knows what was done and what's pending
- **Git View** — commit graph, per-commit diffs, and a directory tree browser, with commits mapped back to agent identity

### Vault

Obsidian-compatible vault access for daily notes and chat transcripts, scoped either globally or per project.

---

## Pages

The dashboard ships 18 UI pages, all under one Next.js App Router:

| Page | Route | Purpose |
|------|-------|---------|
| Overview | `/` | Live stats, recent ledger activity, agent health, auto-refreshed every 10s |
| Ledger | `/ledger` | Global or per-project audit trail |
| Pipelines | `/pipelines` | List, create, and drill into pipelines; Flow Builder lives here |
| Plans | `/plans` | Implementation plans with task breakdown and walkthrough |
| Tasks | `/tasks` | Task board with the approval state machine |
| Agents | `/agents` | Agent roster with live health checks |
| Inbox | `/inbox` | Cross-agent messaging |
| Handoff | `/handoff` | Session continuity state |
| Git View | `/gitview` | Repository browser |
| Terminals | `/terminals` | Running process monitor |
| Docker | `/docker` | Container management |
| Node Processes | `/node-processes` | Node/npm/build process monitor |
| Vault | `/vault` | Daily notes and chat transcripts |
| API Playground | `/api-playground` | Interactive endpoint explorer |
| Settings | `/settings` | Secrets, MCP registry, Code-SRS config, View All toggle |

A **View All** toggle in Settings merges every project's pipelines, plans, and git history into one unified view; turning it off shows project-selector chips instead.

---

## API

The dashboard exposes **63 REST endpoints across 24 resource groups**, all file-system based — reads and writes go straight to markdown/JSON under `memory/`, `projects/`, `config/`, and `vault/`.

| Group | Base Path | Endpoints |
|-------|-----------|-----------|
| Pipelines | `/api/pipelines[/:id]` | 10 |
| Projects | `/api/projects[/:name]` | 6 |
| Templates | `/api/templates[/:id]` | 6 |
| Agents | `/api/agents[/:id]` | 4 |
| Workspaces | `/api/workspaces[/:name]` | 4 |
| Events | `/api/events` | 2 |
| Handoff | `/api/handoff` | 2 |
| Secrets / Global Secrets | `/api/secrets`, `/api/global-secrets` | 2 + 2 |
| Tasks | `/api/tasks` | 2 |
| Queue | `/api/queue` | 2 |
| Docker | `/api/docker` | 2 |
| Node Processes | `/api/node-processes` | 2 |
| Terminals | `/api/terminals` | 2 |
| Admin / Code-SRS | `/api/admin/code-srs` | 2 |
| Overview, Ledger, Inbox, Skills, Send Message, MCP Servers, Plans, Vault, Git View, System Doctor | 1 each | 10 |

Full reference: [docs/api.md](docs/api.md) · Try it live at `/api-playground`.

---

## Quick Start

### Ubuntu / Debian

```bash
# Prerequisites
sudo apt update && sudo apt install -y git curl nodejs npm python3

# Clone
git clone https://github.com/7kim/PAOS.git
cd PAOS/dashboard

# Node dependencies
npm install

# Environment
cp .env.example .env
# Edit .env with your API keys

# Run
npm run dev
# → http://localhost:3333
```

Or use the installer:

```bash
bash install-ubuntu.sh
```

### macOS

```bash
bash install-mac.sh
```

### Windows

```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-windows.ps1
```

### Docker

```bash
docker compose up -d
```

---

## Configuration

### Environment Variables

Create `.env` in `dashboard/` (or `config/secrets/.env` for global secrets — see `config/secrets/.env.template`):

```env
# Required
MEMORY_DIR=/home/dev/AI_Workflow/memory
WORKSPACES_DIR=/home/dev/AI_Workflow/workspaces

# API Keys (for agents)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
```

### Agent Setup

**Hermes**
```bash
pip install hermes-agent
hermes init
hermes --version
```

**Claude Code**
```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

**Codex / Gemini / OpenClaw** — installed and detected the same way; see `agents/registry.json` for the full identity list and `AGENTS.md` for the startup/shutdown sequence each agent runs.

On first setup, each agent is introduced to PAOS with a short role prompt (execute pipeline phases and run benchmarks; implement code changes from pipeline phases; code review and documentation — depending on role) so it knows to check `memory/shared/HANDOFF.md`, the global ledger, and its inbox before starting work, and to log back to both its own event log and the global ledger when done.

---

## Project Structure

```
PAOS/
├── Coding-Principles.md             # Architectural constitution
├── Coding-Principles-Benchmark.md   # 110-question strict audit
├── workflow.md                      # H-Factor governance: separation of powers, audit immutability
├── install-ubuntu.sh / install-mac.sh / install-windows.ps1
├── Dockerfile / docker-compose.yml
├── screenshots/                     # Feature screenshots + architecture diagrams
├── benchmarks/                      # Benchmark runs (SRS, audits, gaps, implementation plans)
├── dashboard/                       # Next.js application
│   ├── app/                         # 18 pages + 63 API routes
│   ├── components/                  # React components (incl. shadcn/ui)
│   └── lib/                         # paos.ts, global-config.ts, cost-tracker.ts, themes.ts
├── agents/                          # Per-agent soul.md, registry.json
├── skills/                          # Shared skill library (system-analysis-and-design, etc.)
├── mcp/                             # MCP server configs (shared-memory, scaffold, search)
├── knowledge/                       # Shared knowledge base: docs, books, templates, references
├── config/{agent}/                  # Per-agent settings; config/secrets/.env.template
├── projects/{name}/                 # Per-project fabric (vault, config, memory)
├── memory/pipelines/{project}/      # Per-project sandbox: pipelines, ledger, kanban, inbox
├── docs/                            # api.md, architecture.md, examples.md
└── vault/                           # Global daily notes + chat history
```

---

## Data Flow

```
Browser (Dashboard) ──HTTP──▶ API Routes ──▶ Pipeline Engine ──spawn──▶ Agent (Hermes/Claude/Codex/...)
                                     │                                      │
                                     ├──▶ Benchmark Engine ──▶ gaps.md      │
                                     ├──▶ Queue System                       │
                                     └──▶ File Tree API                      │
                                                                    writes output
                                                                         │
                                                                    phases/{nodeId}/
                                                                    ├── output.log
                                                                    ├── IMPLEMENTATION.md
                                                                    ├── REASONING.md
                                                                    ├── TASKS.md
                                                                    └── WALKTHROUGH.md
```

---

## Security

- TypeScript strict mode enforced
- All API inputs validated; file-path traversal protection on every file read
- Secrets live only in `.env` files (gitignored) — `config/secrets/.env.template` is the tracked placeholder, never the real file
- Process/container kill actions require confirmation
- Benchmark audits check rate limiting, CORS, auth, CSRF, and XSS as part of the Security category

> **Before you push:** the dashboard's default config points at a Tailscale hostname and local paths (`~/AI_Workflow/...`) that are specific to one machine. Worth swapping in placeholders or a `.env.example` before treating this as a public template, so a real device hostname isn't sitting in a public repo.

---

## Contributing

1. Read `Coding-Principles.md` for architectural standards
2. Run `Coding-Principles-Benchmark.md` before submitting PRs
3. Ensure every gap is either Fixed or Won't Fix, with documentation
4. Follow the naming conventions: kebab-case files, plural API resources

---

## License

MIT — Free to use, modify, and distribute.
