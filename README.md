# PAOS — Personal Agent Operating System

![PAOS Dashboard](screenshots/dashboard-overview.png)

A multi-agent pipeline orchestration system. Build visual DAG pipelines, assign agents to nodes, execute cascading workflows, and track everything — tokens, costs, terminals, benchmarks, and file changes — from a single dashboard.

---

## Architecture

![PAOS Architecture](screenshots/paos-architecture.svg)

PAOS runs as a Next.js dashboard serving 50+ API endpoints. Pipelines are stored as files on disk (META.json, builder-layout.json) and executed via a DAG engine using Kahn's topological sort. Agents (Hermes, OpenCode, Claude Code, Codex) are spawned as subprocesses with per-node prompts, file references, and PID tracking.

The system tracks token usage per call, logs all execution output, and generates benchmark reports with evidence-based scoring across 13 categories.

---

## Features

### Pipeline System

![Pipeline Flow](screenshots/pipeline-flow.svg)

- **Visual DAG Builder** — drag-and-drop node editor using @xyflow/react
- **Topological Execution** — Kahn's algorithm for correct dependency-ordered cascading
- **Branching & Joins** — parallel execution paths with sync points
- **Retry / Skip / Cancel** — error recovery per node
- **Live Status** — per-node spinner, PID, progress bar, output preview

![Flow Builder](screenshots/flow-builder.png)

| Feature | Description |
|---------|-------------|
| Auto-naming | `{Project}-PIPE_{counter}-{DD-MM-YYYY}---{HH-MM}` |
| 8 Template Presets | Quick Dev, Analyze-Implement, PR Review, Bug Fix, etc. |
| Load Pipeline | Open saved pipelines in the builder for re-execution |
| Phase Cards | Clickable .md artifacts per node (toggleable) |
| Smart Animation | Edges animate only between completed source and pending target |

### Agent System

- **Multi-Agent Support** — Hermes, OpenCode, Claude Code, Codex via common interface
- **Agent Detection** — auto-detect installed agents via CLI version checks
- **Role System** — each role has a hidden default prompt + user override
- **Skills & MCPs** — per-node skill and MCP server configuration
- **File References** — attach project/benchmark/pipeline files with read/edit mode

![Agents](screenshots/agents.png)

### Benchmarks & Code Quality

The benchmark system evaluates code against 13 categories of coding principles with strict, evidence-based scoring:

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

![Benchmarks](screenshots/benchmarks.png)

Each benchmark run generates:
- `full-audit.md` — complete 110-question audit
- `gaps.md` — all gaps combined with fixes
- `SRS-as-is.md` — current state requirements (via system-analysis-and-design skill)
- `SRS-to-be.md` — target state with gaps closed
- `implementation.md` — full implementation spec
- `implementation-plan.md` — prioritized work plan

Gaps are managed in a 4-column kanban: **Pending → In Progress → Fixed → Won't Fix**.

### Token Tracking

![Tokens](screenshots/tokens.png)

- **Per-Agent Cost** — tokens and cost broken down by agent type
- **Daily Histogram** — 14/30-day view with input/output split bars
- **Calendar View** — per-day token and cost history
- **Cost Comparison** — compare actual cost against any model (Claude, GPT-4, Gemini, DeepSeek, Llama, etc.)
- **Monthly Context** — total context tokens tracked

| Metric | Display |
|--------|---------|
| Total Tokens | Input + Output split bar |
| Actual Cost | Real cost from model pricing |
| Comparable Cost | What it would cost with Claude Sonnet/GPT-4/any model |
| By Agent | Per-agent breakdown with cost |

### Terminals

![Terminals](screenshots/terminals.png)

- All running processes sorted by CPU usage
- Pipeline PIDs link directly to their terminal output
- View/Edit mode toggle (truncated vs full output)
- Kill with confirmation (SIGTERM → SIGKILL fallback)
- Click PID from pipeline node → opens terminal in view mode

### API Endpoints

50+ API routes organized by resource:

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/pipelines` | List/create pipelines |
| GET | `/api/pipelines/[id]` | Pipeline detail with enriched phases |
| POST | `/api/pipelines/[id]/execute-flow` | Execute DAG cascade |
| GET | `/api/pipelines/[id]/flow-status` | Live per-node status |
| GET | `/api/pipelines/[id]/phases/[n]/log` | Phase output log |
| GET | `/api/pipelines/[id]/phases/[n]/files/[file]` | Phase file content |
| POST | `/api/pipelines/[id]/phases/[n]/retry` | Retry failed node |
| POST | `/api/pipelines/[id]/phases/[n]/skip` | Skip failed node |
| GET | `/api/benchmarks` | List benchmark runs |
| GET | `/api/benchmarks/[id]` | Benchmark with categories, gaps, SRS |
| PATCH | `/api/benchmarks/[id]/gaps/[n]` | Update gap status |
| POST | `/api/benchmarks/[id]/gaps/[n]/create-pipeline` | Convert gap to pipeline |
| GET/POST | `/api/tokens` | Token usage summary/log |
| GET/POST | `/api/terminals` | List/kill processes |
| GET | `/api/terminals/[pid]` | Terminal output |
| GET | `/api/agents/available` | Available agent types |
| GET | `/api/settings` | Visual settings |
| PATCH | `/api/preferences` | User preferences |
| GET/POST | `/api/templates` | Pipeline templates CRUD |
| GET | `/api/templates/suggestions` | Role suggestions per agent |
| GET | `/api/workspaces` | Project workspaces |
| GET | `/api/projects/[name]/tree` | File tree explorer |

Full reference: [docs/api.yaml](docs/api.yaml)

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

Or use the installer:

```bash
bash install.sh
```

### Docker

```bash
docker compose up -d
```

### Windows

```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install.ps1
```

---

## Configuration

### Environment Variables

Create `.env` in `dashboard/`:

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

#### Hermes Agent

```bash
pip install hermes-agent
hermes init
hermes --version
```

#### OpenCode Developer

```bash
npm install -g opencode-cli
opencode --version
opencode init
```

#### Claude Code

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

---

## Agent Integration

On first setup, introduce each agent to PAOS with these prompts:

### For Hermes Agent

```
You are now part of PAOS (Personal Agent Operating System).
Read ~/AI_Workflow/Coding-Principles.md to understand architectural standards.
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

## Project Structure

```
AI_Workflow/
├── Coding-Principles.md             # Architectural constitution
├── Coding-Principles-Benchmark.md   # 110-question strict audit
├── SWOT-Benchmark.md                # Strategic evaluation
├── install.sh                       # Ubuntu installer
├── install.ps1                      # Windows installer
├── Dockerfile                       # Docker build
├── docker-compose.yml               # Docker Compose
├── screenshots/                     # Feature screenshots + diagrams
├── benchmarks/                      # Benchmark runs
│   └── Benchmark_N_date/
│       ├── SRS-as-is.md
│       ├── SRS-to-be.md
│       ├── full-audit.md
│       ├── gaps.md
│       ├── implementation.md
│       └── gaps/
├── dashboard/                       # Next.js application
│   ├── app/                         # Pages + API routes
│   ├── components/                  # React components
│   └── lib/                         # Shared utilities
├── projects/{name}/                 # Fabric directories
│   ├── vault/
│   ├── config/
│   └── memory/
├── memory/                          # System state
│   ├── pipelines/
│   ├── metrics/
│   └── config/
└── workspaces/                      # VS Code workspace files
```

---

## Data Flow

```
Browser (Dashboard) ──HTTP──▶ API Routes ──▶ Pipeline Engine ──spawn──▶ Agent (Hermes/OpenCode/Claude)
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
- All API inputs validated
- File path traversal protection on all file reads
- No secrets in config.yaml (only .env)
- `.env` gitignored
- Process killing requires confirmation
- Benchmark audits check rate limiting, CORS, auth, CSRF, XSS

---

## Contributing

1. Read `Coding-Principles.md` for architectural standards
2. Run `Coding-Principles-Benchmark.md` before submitting PRs
3. Ensure all gaps are either Fixed or Won't Fix with documentation
4. Follow the naming conventions: kebab-case files, plural API resources

---

## License

MIT — Free to use, modify, and distribute.
