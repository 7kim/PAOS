# PAOS — Personal Agent Operating System

![PAOS Dashboard](screenshots/dashboard-overview.png)

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js) ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-green)

Most people running multiple coding agents (Claude Code, Codex, Gemini, Hermes...) end up with N terminal tabs, no shared memory between them, and no record of what any of them actually did. PAOS is one workspace that all of them plug into instead: a shared ledger, a shared knowledge base, and a dashboard where you build a pipeline, hand each step to whichever agent should own it, and watch the whole thing execute.

---

## How it's organized

![PAOS Architecture](screenshots/paos-architecture.svg)

Two layers:

**The Fabric** — the stuff that's global and always-on: an append-only audit ledger, the shared knowledge base, per-agent config and secrets, the skills library, MCP server definitions, the agent registry, and a FIFO pipeline queue. One instance, shared by every project.

**Per-project sandboxes** — each project gets `memory/pipelines/{project}/` with its own pipelines, ledger, kanban board, agent inboxes, vault, and secrets. A `MyProject_claude` identity is distinct from the global `claude` identity, so nothing about one project's audit trail leaks into another's.

Nothing here touches a database — the dashboard is a Next.js 16 App Router app with 63 API routes that all read and write markdown/JSON on disk. Pipelines run as DAGs, ordered with Kahn's topological sort, and each node spawns its assigned agent as a subprocess with its own prompt, file references, and PID.

---

## What's in the dashboard

### Pipelines — the core loop

![Pipeline Flow](screenshots/pipeline-flow.svg)
![Flow Builder](screenshots/flow-builder.png)

Drag out a DAG in the visual builder (`@xyflow/react`), assign an agent per node, and hit run. Branches and joins are supported for parallel work with sync points. If a node fails you can retry it, skip it, or cancel the run — and if you want to step in mid-execution, pausing lets you edit `INTERVENE.md` before resuming. Eight starter templates (Quick Dev, Analyze-Implement, PR Review, Bug Fix, etc.) cover the common shapes, and any saved pipeline can be reopened in the builder and re-run.

### Agents

![Agents](screenshots/agents.png)

Eleven agent identities ship in the registry — Hermes as orchestrator, Claude Code, Codex, Gemini, Antigravity for review/audit, OpenClaw, Developer, Architect, Coordinator, Ollama, and Signal — each with a `soul.md` defining what it is and what it's allowed to touch. The dashboard auto-detects which ones are actually installed via CLI version checks, and every role carries a default prompt you can override per node.

### Benchmarks

![Benchmarks](screenshots/benchmarks.png)

A 110-question, evidence-based audit across 9 weighted categories — OOP, data structures, and security carry the most weight; graph theory the least. Every run produces a full audit, a combined gaps file, before/after SRS documents (via the `system-analysis-and-design` skill), and an implementation plan. Gaps live on a four-column kanban — Pending, In Progress, Fixed, Won't Fix — and any gap can be turned directly into a new pipeline.

### Tokens & cost

![Tokens](screenshots/tokens.png)

Per-agent cost breakdowns, a 14/30-day histogram split by input and output tokens, a calendar view of daily spend, and side-by-side cost comparisons against what the same usage would have cost on GPT-4, Gemini, DeepSeek, or any other model's pricing.

### Terminals, Docker, Node processes

![Terminals](screenshots/terminals.png)

Every running process, sorted by CPU, with pipeline PIDs linking straight to their output — plus dedicated views for Docker containers (start/stop/restart/kill, expandable logs) and Node/npm/build processes specifically. All three refresh every 5 seconds, and kills go through SIGTERM before falling back to SIGKILL.

### Tasks, Ledger, Inbox, Handoff, Git View, Vault

Tasks move through `draft → approved → in_progress → done`, and a cron-driven watcher picks up anything approved and runs it — so "build me X" can go from a task card to a finished pipeline without more prompting. The ledger is an immutable log of every agent action, global or filtered per project. Inbox is a messaging bus between agents. Handoff is a living document each session rewrites so whoever picks things up next knows what happened and what's still open. Git View gives you a commit graph and diff viewer with commits mapped back to agent identity. Vault is Obsidian-compatible access to daily notes and chat transcripts, global or per project.

---

## By the numbers

| | |
|---|---|
| API endpoints | 63, across 24 resource groups — [docs/api.md](docs/api.md), or try `/api-playground` live |
| Dashboard pages | 18 |
| Agent identities | 11 |
| Benchmark audit | 110 questions, 9 categories |
| Pipeline templates | 8 |
| Stack | Next.js 16 · React 19 · TypeScript · Tailwind 4 · `@xyflow/react` for the DAG builder |

---

## Getting started

**Ubuntu / Debian**
```bash
sudo apt update && sudo apt install -y git curl nodejs npm python3
git clone https://github.com/7kim/PAOS.git
cd PAOS/dashboard
npm install
cp .env.example .env   # add your API keys
npm run dev             # → http://localhost:3333
```
Or just run `bash install-ubuntu.sh` from the repo root.

**macOS**: `bash install-mac.sh`

**Windows** (as Administrator):
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-windows.ps1
```

**Docker**: `docker compose up -d`

### Wiring up agents

```bash
# Hermes
pip install hermes-agent && hermes init

# Claude Code
npm install -g @anthropic-ai/claude-code
```
Codex, Gemini, and OpenClaw install and get auto-detected the same way — see `agents/registry.json` for the full roster and `AGENTS.md` for the exact startup/shutdown sequence each agent follows (read the handoff and ledger on the way in, log to its own event file and the global ledger on the way out).

Global secrets (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.) go in `config/secrets/.env` — copy `config/secrets/.env.template` to start. `MEMORY_DIR` and `WORKSPACES_DIR` need to point at your PAOS root.

---

## Under the hood

```
PAOS/
├── Coding-Principles.md             # Architectural constitution
├── Coding-Principles-Benchmark.md   # The 110-question audit
├── workflow.md                      # H-Factor governance rules
├── dashboard/                       # Next.js app — 18 pages, 63 API routes
│   ├── app/  components/  lib/
├── agents/                          # soul.md per agent + registry.json
├── skills/                          # Shared skill library
├── mcp/                             # MCP server configs
├── knowledge/                       # Shared docs, books, templates
├── config/{agent}/                  # Per-agent settings + secrets template
├── projects/{name}/  memory/pipelines/{project}/   # Per-project fabric + sandbox
├── benchmarks/                      # Benchmark run history
├── docs/                            # api.md, architecture.md, examples.md
└── screenshots/                     # What you're looking at in this README
```

A pipeline node's execution, end to end:

```
Dashboard ──▶ API route ──▶ Pipeline engine ──spawn──▶ Agent subprocess
                                  │                          │
                                  ├─▶ Benchmark engine ─▶ gaps.md
                                  └─▶ Queue / file-tree      │
                                                     writes to phases/{nodeId}/
                                                     ├── output.log
                                                     ├── IMPLEMENTATION.md
                                                     ├── REASONING.md
                                                     └── WALKTHROUGH.md
```

---

## Worth knowing

- Secrets are gitignored everywhere (`config/secrets/.env`, `.env`, `*.key`, `*.pem`) — only the `.env.template` placeholder is tracked, and that's the way it should stay.
- File reads go through path-traversal protection, all API inputs are validated, and TypeScript strict mode is on throughout.
- The dashboard's default config bakes in a real Tailscale hostname and machine-specific local paths. That's fine for a private fork but worth swapping for placeholders before treating this repo as a public template — a live device hostname doesn't need to be sitting in a public README.

---

## Contributing

1. Read `Coding-Principles.md` before touching architecture.
2. Run `Coding-Principles-Benchmark.md` before opening a PR.
3. Every gap from a benchmark run should end up Fixed or explicitly Won't Fix — no silent drops.
4. Keep to the naming conventions: kebab-case files, plural API resources.

---

## License

MIT — free to use, modify, and distribute.
