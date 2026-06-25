# PAOS Codebase Analysis

**Pipeline**: PIPE-25-06-2026---19-42  
**Phase**: n1 (Analyze)  
**Agent**: hermes-nous  
**Date**: 2026-06-25  
**Scope**: Full codebase survey at `/home/dev/AI_Workflow/`

---

## 1. Top-Level Structure

```
/home/dev/AI_Workflow/
├── AGENTS.md / CLAUDE.md / GEMINI.md  — Agent instructions
├── README.md (833 lines)              — Main project README
├── workflow.md (522 lines)            — PAOS Constitution (H-Factor v2.0.0)
├── LICENSE (MIT)                      — License
├── opencode.json                      — OpenCode MCP config
├── package.json                       — Root Node (minimal)
├── agents/                            — 14 agent soul.md identities
├── bin/                               — 31 CLI tools (bash/python)
├── config/                            — Per-agent & system config
├── dashboard/                         — Next.js 16 orchestration UI (131 files)
├── docs/                              — Documentation + screenshots (14 files)
├── docker/                            — Dockerfiles & compose (6 files)
├── hermes/                            — Full Hermes agent install (~6,027 files)
├── knowledge/                         — Knowledge base (69 files)
├── lib/                               — Shared JS library (1 file)
├── logs/                              — Event logs, pipeline state (86 files)
├── mcp/                               — MCP servers (10 files)
├── memory/                            — EMPTY directory
├── projects/                          — Project data (7 files)
├── skills/                            — Ponytail skill suite (154 files)
├── vault/                             — Agent vault (3 files)
├── workflows/                         — EMPTY directory
└── frontend -> /home/dev/Documents/Dev/PAOS-WEB  — BROKEN symlink
```

## 2. File Counts by Major Directory

| Directory | Count | Notes |
|-----------|-------|-------|
| agents/ | 22 | 12 soul.md + registry + schema + stubs |
| bin/ | 31 | 30 bash, 1 python, 1 node |
| config/ | ~760 | Includes ~650 vendored node_modules in config/opencode/ |
| dashboard/ | 131 | App, components, lib (no node_modules, no .next) |
| docs/ | 14 | 6 .md + 8 screenshot PNGs |
| docker/ | 6 | Dockerfile, compose, entrypoint, README, secrets |
| hermes/ | ~6,027 | Full Python agent install + venv + node_modules |
| knowledge/ | 69 | Books, docs, SRS, templates, Obsidian, Syncthing |
| lib/ | 1 | paos-registry.mjs |
| logs/ | 86 | Events, pipelines, ledger, inbox, queue, tasks |
| mcp/ | 10 | 2 MCP servers + config + hostinger |
| projects/ | 7 | Project ledgers, tasks, shared context |
| skills/ | 154 | ponytail-repo benchmarks + skill defs |
| vault/ | 3 | Chats template, daily note, dashboard note |
| **Total (approx)** | **~7,300** | Excluding hermes/ full install (~13,300 with hermes) |

## 3. Agent System (14 Registered Agents)

| Agent ID | Binary | Role |
|----------|--------|------|
| claude | `claude` | Primary orchestrator & coding |
| codex | `codex` | OpenAI coding executor |
| opencode-developer | `opencode` | PAOS executor (default) |
| opencode | `opencode` | Multi-agent CLI parent runtime |
| opencode-plan | `opencode` | Project manager & planner |
| opencode-architect | `opencode` | Peer reviewer |
| opencode-coordinator | `opencode` | Pipeline router & compliance |
| gemini | `gemini` | Google Gemini executor |
| antigravity | `agy` | Antigravity CLI executor |
| antigravity-ide | `antigravity-ide` | Desktop IDE surface |
| hermes-nous | `hermes` | Autonomous multi-platform agent |
| openclaw | `openclaw` | Human channel & delegation |
| ollama | `ollama` | Local model runtime |
| gitkraken | `gk` | Git context & issue tracking |

**Architecture**: Each agent has soul.md (identity + permissions), inbox directory, event log, git identity, MCP server list, and health check config. Four agents (`opencode-*`) share the same `opencode` binary but have divergent soul.md identities.

## 4. Dashboard System (Next.js 16)

- **Framework**: Next.js 16, App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui, lucide-react
- **Pipeline DAG**: @xyflow/react (React Flow)
- **Animation**: motion (framer-motion)
- **Pages (13)**: overview, agents, events, handoff, inbox, ledger, pipelines (with builder + visualize), plans, projects, tasks, vault, settings, api-playground, gitview
- **API Routes**: 38 handlers across 22 resource groups
- **Components**: 19 shadcn/ui components + 14 pipeline-builder components + sidebar, project tree, tabs, theme provider
- **Storage**: All data from markdown/JSON files on disk — no database
- **Pending integrations**: Clickhouse (DESIGN.md), Supabase (DESIGN.md) — not yet implemented

## 5. CLI Tools (bin/ — 31 files)

**Architecture**: 29 bash scripts + 1 Python + 1 Node.js

**h-* commands (15)**: help, whoami, status, inbox, daily, log, context, audit, commit, sync, chat, task, workspace, write-handoff, pipeline  
**paos-* tools (6)**: pipe-id, pipeline-handler, pipeline-watch, queue, agent, start-dashboard  
**Other (10)**: agent-commit.sh, sync-chat.py, test-agents.sh, lint-ledger.sh, setup-*.sh, init-paos.sh

## 6. MCP System (5 Servers)

Configured in `mcp/mcp-config.json`:
1. **shared-memory** — 14 MCP tools (read/write ledger, context, handoff, inbox, etc.)
2. **scaffold** — 2 tools (scaffold_project, list_templates)
3. **gitkraken** — Git context & issue tracking
4. **context7** — Library/framework documentation queries (HTTP)
5. **hostinger-domains/dns** — Hostinger API (npx)
6. **agent-browser** — Browser automation

## 7. Pipeline System

Located at `logs/pipelines/PAOS/`. Current pipeline state:

| Pipeline | Status | Phases |
|----------|--------|--------|
| AI_Workflow-PIPE_1-22-06-2026---17-08 | Completed | Unknown |
| AI_Workflow-PIPE_2-22-06-2026---17-45 | Completed | 2 phases |
| AI_Workflow-PIPE_3-22-06-2026---18-57 | Completed | Full Antigravity (PROPOSAL, REVIEW, ENHANCED_IDEAS) |
| PIPE-25-06-2026---19-42 | **Executing** | n1 (Analyze, hermes-nous) → n2 (Document, opencode-developer) |

**Pipeline directory structure per pipeline**:
```
pipeline.json      — Live status (status, currentTask, progress)
META.json          — Metadata (id, prompt, phases list, builder flag)
TASKS.md           — Top-level task list
pipeline-flow.json — DAG definition
builder-layout.json — Builder UI layout
phases/n{1,2}/     — Per-phase IMPLEMENTATION.md, REASONING.md, TASKS.md
```

## 8. Governance (H-Factor Constitution)

Defined in `workflow.md` (522 lines):
- **4 Invariants**: Separation of Powers (I1), Audit Immutability (I2), Identity First (I3), Skill Boundary (I4)
- **3-Phase Execution**: Strategic Planning → Peer Review → Execution & Logging
- **Dual-Logging Mandate**: Every event in agent log.md + global_ledger.md
- **Antigravity Review Loop**: 4-phase artifact-driven workflow (Planning → Review → Execution → Walkthrough)
- **Ponytail Mode**: Lazy senior dev mode — default active

## 9. Observations & Findings

### Strengths
1. Comprehensive documentation: ~3,500 lines across 10 files (API reference, architecture, examples, hub index)
2. Strong multi-agent interoperability: 14 agents unified under one governance framework
3. Well-structured pipeline system with phase hierarchy and state tracking
4. MCP-based tooling with 14 shared-memory tools for cross-agent communication
5. Ponytail integration for lazy-development discipline with benchmarked efficiency

### Issues / Discrepancies
1. **memory/ directory is empty** — MCP config points MEMORY_DIR=/home/dev/AI_Workflow/memory/ but all runtime data lives under logs/ and vault/. The MCP server and system prompt references may be out of sync.
2. **Broken symlink**: `frontend -> /home/dev/Documents/Dev/PAOS-WEB` — target does not exist.
3. **No test infrastructure** — No test framework outside ponytail-repo benchmarks (ESLint for linting only).
4. **Duplicate directories**: `.antigravity-cli/` and `.antigravitycli/` appear to be duplicates.
5. **Dashboard DESIGN.md is a Claude.com product spec** (589 lines) — appears to be accidentally included reference material, not PAOS dashboard design.
6. **Path inconsistency**: System prompt references `vault/memory/inbox/` but actual inbox data lives in `logs/inbox/`.
7. **Empty directories**: `workflows/`, `memory/`, `config/opencode/commands/`.

### Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Web UI | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui |
| Dashboard | @xyflow/react, lucide-react, motion, sonner, cmdk |
| MCP | Node.js shared-memory, scaffold |
| CLI | Bash (29), Python (1), Node (1) |
| Agents | Claude, OpenCode, Gemini, Codex, Hermes, Ollama |
| Infra | Docker, systemd, Tailscale Serve, inotify |
| Storage | Flat files (markdown/JSON) — no database |
| Git | Per-agent committer identities |
| IDE | VS Code, Obsidian |

## 10. Recommendations for Phase n2 (Document)

1. Document the memory/ vs logs/ discrepancy — clarify which path is authoritative
2. Document the pipeline builder UI flow and its DAG-based phase execution
3. Document the agent inbox communication protocol (file-based .md messages)
4. Document the systemd-based real-time pipeline watcher (paos-pipeline-handler.sh + path unit)
5. Document the broken symlink and empty directories as known issues
