# PAOS — Personal Agent Operating System

![PAOS Dashboard](screenshots/dashboard-overview.png)

A multi-agent pipeline orchestration system. Build visual DAG pipelines, assign agents to nodes, execute cascading workflows, and track everything — tokens, costs, terminals, benchmarks, and file changes — from a single dashboard.

---

## Quick Start

### Ubuntu / Debian

```bash
# Prerequisites
sudo apt update && sudo apt install -y git curl nodejs npm python3

# Clone
git clone https://github.com/7kim/AI_Workflow.git
cd AI_Workflow/dashboard

# Node dependencies
npm install

# Environment
cp .env.example .env
# Edit .env with your API keys

# Run
npx next dev --port 3333
```

### Docker

```bash
docker build -t paos-dashboard .
docker run -d -p 3333:3333 \
  -v ~/AI_Workflow:/home/dev/AI_Workflow \
  -v ~/.hermes:/home/dev/.hermes \
  --name paos paos-dashboard
```

### Windows

```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install.ps1
```

---

## Screenshots

### Dashboard Overview
![Overview](screenshots/dashboard-overview.png)

### Pipeline Flow Builder
![Flow Builder](screenshots/flow-builder.png)
Drag-and-drop DAG pipeline editor. Add agent nodes, connect them with edges, configure prompts and skills per node.

### Pipeline Execution — Live Status
![Execution](screenshots/pipeline-execution.png)
Real-time node status: Pending → Ready → Running (with spinner + PID) → Completed. Progress bars, output previews, and edge animation.

### Pipeline Visualization
![Visualize](screenshots/pipeline-visualize.png)
Read-only DAG with clickable phase cards showing IMPLEMENTATION.md, REASONING.md, TASKS.md, WALKTHROUGH.md, and output logs.

### Benchmark Audit
![Benchmarks](screenshots/benchmarks.png)
Timeline of benchmark runs with grade badges (A/B/C/D/F). Click to see category breakdowns, gap kanban board, and SRS documents.

### Gap Kanban
![Kanban](screenshots/gap-kanban.png)
4-column kanban: Pending → In Progress → Fixed → Won't Fix. Click to toggle. Each gap has a toggleable .md file with evidence and fix code.

### Tokens & Cost Tracking
![Tokens](screenshots/tokens.png)
Per-day histogram, per-agent breakdown, cost comparison calculator (pick any model to see what usage would cost).

### Terminals
![Terminals](screenshots/terminals.png)
All running processes on the server. Pipeline PIDs link directly to their terminals with live output. Edit mode toggle, kill with confirmation.

### Agents Detection
![Agents](screenshots/agents.png)
Detects installed agents via CLI version checks. Shows install commands with copy-to-clipboard snippets.

### Projects
![Projects](screenshots/projects.png)
Project management with file tree explorer, pipeline counts, and workspace configuration.

### File Tree Explorer
![File Tree](screenshots/file-tree.png)
Browse project files, pipeline phase files, and benchmark files. Click to add as agent file references with read/edit mode.

---

## Features

### Pipeline System
- **Visual DAG Builder** — drag-and-drop node editor using @xyflow/react
- **Topological Execution** — Kahn's algorithm for correct dependency-ordered cascading
- **Branching & Joins** — parallel execution paths with sync points
- **Retry / Skip / Cancel** — error recovery per node
- **Live Status** — per-node spinner, PID, progress bar, output preview
- **Smart Edge Animation** — animate only between completed source and pending target
- **Phase Cards** — clickable .md artifacts (IMPLEMENTATION, REASONING, TASKS, WALKTHROUGH)
- **Pipeline Templates** — 8 presets + create/edit/delete custom templates
- **Load Pipeline** — open existing pipelines in the builder
- **Auto-naming** — `{Project}-PIPE_{counter}-{DD-MM-YYYY}---{HH-MM}`

### Agents
- **Multi-Agent Support** — Hermes, OpenCode, Claude Code, Codex via common interface
- **Agent Detection** — auto-detect installed agents via CLI version checks
- **Role System** — each role has a hidden default prompt + user override
- **Skills & MCPs** — per-node skill and MCP server configuration
- **File References** — attach project/benchmark/pipeline files with read/edit mode

### Dashboard
- **Projects** — workspace management with file tree, secrets, pipelines
- **Events** — real-time activity feed
- **Audit Ledger** — immutable action log
- **Handoff** — cross-session agent handoff
- **Inbox** — inter-agent messaging
- **Git View** — commit history visualization
- **Plans** — project planning and task tracking

### Benchmark System
- **Coding Principles Audit** — 110-question strict benchmark with evidence-based scoring
- **10 Principles** — OOP, Data Structures, Graph Theory, Linear Algebra, Digital Logic, Numerical Analysis, System Analysis, Database, Calculus, UX/UI, Security, API Endpoints, Code Quality
- **Gap Kanban** — Pending → In Progress → Fixed → Won't Fix with auto-removal
- **SRS Generation** — SRS-as-is.md + SRS-to-be.md per benchmark
- **Implementation Plans** — per-gap fix specs with acceptance criteria
- **SWOT Analysis** — strategic evaluation treating the project as an investment

### Token Tracking
- **Per-Agent Cost** — tokens and cost broken down by agent type
- **Daily Histogram** — 14/30-day view with input/output split bars
- **Cost Comparison** — compare actual cost against any model (Claude, GPT-4, Gemini, etc.)
- **Monthly Context** — total context tokens tracked

### Terminals
- **Process Viewer** — all server processes sorted by CPU
- **PID Integration** — click a PID from pipeline node → opens terminal view
- **Live Output** — reads from phase output.log
- **View / Edit Mode** — toggle between truncated view and full output
- **Kill with Confirmation** — SIGTERM → SIGKILL fallback

### Security & Code Quality
- TypeScript strict mode
- Zero `any` types enforcement (benchmarked)
- Kahn's algorithm with cycle detection
- DAG validation on every read
- Atomic write ordering
- In-memory caching with TTL
- No hardcoded filesystem paths in routes

---

## Configuration

### Environment Variables

Create `.env` in the dashboard root:

```env
# Required
MEMORY_DIR=/home/dev/AI_Workflow/memory
WORKSPACES_DIR=/home/dev/AI_Workflow/workspaces

# API Keys (for agents)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
DEEPSEEK_API_KEY=...

# Optional
API_TOKEN=your-dashboard-auth-token
TELEGRAM_BOT_TOKEN=...
PORT=3333
```

### Hermes Agent Setup

```bash
# Install Hermes
pip install hermes-agent

# Initialize
hermes init

# Verify
hermes --version
```

### OpenCode Setup

```bash
npm install -g opencode-cli
opencode --version
opencode init
```

### Claude Code Setup

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

---

## Agent Integration Guide

On first install, each agent needs to be introduced to PAOS. Run these prompts in their respective terminals:

### For Hermes Agent

```
You are now part of PAOS (Personal Agent Operating System).
Read ~/AI_Workflow/Coding-Principles.md to understand the architectural standards.
Read ~/AI_Workflow/Coding-Principles-Benchmark.md to understand how code is evaluated.
Load the system-analysis-and-design skill for SRS document generation.

Your role: execute pipeline phases, run benchmarks, generate reports.
```

### For OpenCode Developer

```
You are now part of PAOS.
Your role: implement code changes specified by pipeline phases.
You receive prompts from the pipeline executor with file references and acceptance criteria.
Use your coding tools to make changes, verify they pass, and report results.
```

### For Claude Code

```
You are now part of PAOS.
Your role: code review, implementation, and documentation.
Pipeline nodes will assign you tasks with specific prompts and file references.
Always verify your work against the acceptance criteria in the prompt.
```

---

## Architecture

```
                          ┌─────────────┐
                          │  Dashboard  │
                          │  (Next.js)  │
                          └──────┬──────┘
                                 │ HTTP
                    ┌────────────┴────────────┐
                    │      API Routes          │
                    │  (50+ endpoints)         │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
   ┌──────┴──────┐     ┌────────┴────────┐     ┌────────┴────────┐
   │  Pipelines   │     │    Queue        │     │   Benchmarks    │
   │  DAG Engine  │     │  Execution      │     │   Audit Engine  │
   └──────┬──────┘     └────────┬────────┘     └────────┬────────┘
          │                      │                      │
   ┌──────┴──────┐     ┌────────┴────────┐     ┌────────┴────────┐
   │  phases/    │     │  queue.json     │     │  benchmarks/    │
   │  per-node   │     │                 │     │  Benchmark_N/   │
   │  artifacts  │     │                 │     │  ├─ SRS-as-is   │
   └─────────────┘     └─────────────────┘     │  ├─ SRS-to-be   │
                                                │  ├─ gaps.md     │
   ┌─────────────────────────────────────────┐  │  └─ gaps/       │
   │        Filesystem-as-Database           │  └─────────────────┘
   │  ~/AI_Workflow/                         │
   │  ├── projects/{name}/                   │
   │  ├── memory/pipelines/{name}/           │
   │  ├── memory/metrics/                    │
   │  ├── memory/config/                     │
   │  ├── workspace/{name}.code-workspace    │
   │  └── benchmarks/                        │
   └─────────────────────────────────────────┘
```

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/pipelines | List all pipelines |
| POST | /api/pipelines | Create pipeline |
| GET | /api/pipelines/[id] | Pipeline detail |
| POST | /api/pipelines/[id]/execute-flow | Execute pipeline |
| GET | /api/pipelines/[id]/flow-status | Live execution status |
| GET | /api/pipelines/[id]/phases/[n]/log | Phase output log |
| GET | /api/pipelines/[id]/phases/[n]/files/[file] | Phase file content |
| GET | /api/benchmarks | List benchmark runs |
| GET | /api/benchmarks/[id] | Benchmark detail |
| PATCH | /api/benchmarks/[id]/gaps/[n] | Update gap status |
| POST | /api/benchmarks/[id]/gaps/[n]/create-pipeline | Gap → Pipeline |
| GET | /api/tokens | Token usage summary |
| POST | /api/tokens | Log token usage |
| GET | /api/terminals | List active terminals |
| POST | /api/terminals | Kill process |
| GET | /api/terminals/[pid] | Terminal output |
| GET | /api/agents | Detect installed agents |
| GET | /api/agents/available | List available agent types |
| GET | /api/settings | Visual settings |
| PATCH | /api/settings | Update settings |
| GET | /api/preferences | User preferences |
| PATCH | /api/preferences | Update preferences |
| GET | /api/templates | List pipeline templates |
| POST | /api/templates | Create template |
| GET | /api/templates/suggestions | Role suggestions per agent |
| GET | /api/workspaces | List workspaces |
| GET | /api/projects | List projects |
| GET | /api/projects/[name]/tree | File tree |
| GET | /api/queue | Pipeline queue state |

Full list: 50+ endpoints.

---

## Project Structure

```
AI_Workflow/
├── Coding-Principles.md             # Architectural constitution
├── Coding-Principles-Benchmark.md   # 110-question strict audit
├── SWOT-Benchmark.md                # Strategic evaluation
├── benchmarks/                      # Benchmark runs
│   └── Benchmark_1_*/               # Each run has its own folder
│       ├── SRS-as-is.md
│       ├── SRS-to-be.md
│       ├── full-audit.md
│       ├── gaps.md
│       ├── implementation.md
│       └── gaps/
├── dashboard/                       # Next.js dashboard (port 3333)
│   ├── app/                         # Pages + API routes
│   ├── components/                  # React components
│   └── lib/                         # Shared utilities
├── projects/                        # PAOS fabric projects
│   └── {name}/
│       ├── vault/
│       ├── config/
│       └── memory/
├── memory/                          # System state
│   ├── pipelines/
│   ├── metrics/
│   └── config/
├── workspaces/                      # VS Code workspace files
└── docs/                            # Documentation
```

---

## License

MIT — Free to use, modify, and distribute.
