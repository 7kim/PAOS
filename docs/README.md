# PAOS Documentation

> Central index for PAOS — Personal Agent Operating System documentation.

## Quick Links

| Document | Description |
|----------|-------------|
| [README](../README.md) | Project overview, quick start, agent setup, architecture, troubleshooting |
| [API Reference](api.md) | 56 REST endpoints across 22 resource groups — full request/response specs |
| [Examples](examples.md) | CLI, API, MCP, and pipeline workflows with runnable commands |
| [Architecture](architecture.md) | System model: global fabric, per-project sandboxes, cross-cutting concerns |
| [Workspace Format](workspace-format.md) | `.code-workspace` file schema for PAOS project definitions |
| [Dashboard Guide](../dashboard/README.md) | Next.js orchestration UI — pages, endpoints, development |

## Reference Files

| File | Description |
|------|-------------|
| [Constitution](../workflow.md) | H-Factor governance: Separation of Powers, Audit Immutability, Identity First, Skill Boundary |
| [Agent Roster](../agents/registry.json) | All registered agent identities with inbox paths and status |
| [MCP Registry](../mcp/mcp-config.json) | Unified MCP server definitions shared by all agents |
| [User Identity](../user.md) | Operator profile: field of expertise, coding style, preferences |
| [Docker Guide](../docker/README.md) | Docker deployment, ports, volume mounts, secrets |

## CLI Tools Reference

All tools live in `bin/` and are runnable from the PAOS root (`~/AI_Workflow`).

| Command | Language | Purpose |
|---------|----------|---------|
| `agent-commit.sh` | bash | Git commit with per-agent identity and auto-staging |
| `github-setup.sh` | bash | One-time GitHub authentication and push setup |
| `h-help` | bash | List all available h-* commands |
| `h-whoami` | bash | Show current agent identity, soul path, git config |
| `h-status` | bash | Recent ledger entries, shared context, active projects |
| `h-inbox` | bash | Read agent inbox messages |
| `h-daily` | bash | Create or read global/project daily notes |
| `h-log` | bash | Dual-log: write to both events.md and global_ledger.md |
| `h-context` | bash | Append structured thinking to shared context.md |
| `h-audit` | bash | Compliance audit: dual-logging, git, handoff freshness |
| `h-commit` | bash | PAOS git commit with agent identity (wrapper) |
| `h-sync` | bash | End-of-session: handoff + commit + chat sync in one command |
| `h-chat` | bash | Start/resume or save a chat summary |
| `h-task` | bash | Manage task cards: list, read, create |
| `h-workspace` | bash | Manage project workspaces: list, create, open, show, delete |
| `h-write-handoff` | bash | Write session handoff to HANDOFF.md |
| `h-pipeline` | python3 | Submit, list, execute cross-agent pipeline plans |
| `init-paos.sh` | bash | Fresh-start initializer — clears old memory, resets logs, creates .env |
| `lint-ledger.sh` | bash | Validate global ledger markdown table format |
| `obsidian.sh` | bash | Launch Obsidian pointing to the AI Workflow vault |
| `paos-agent` | node | Agent management: list, doctor, health checks |
| `paos-pipe-id` | bash | Generate pipeline ID in `AI_Workflow-PIPE_N-DD-MM-YYYY---HH-MM` format |
| `paos-pipeline-handler.sh` | bash | Systemd-triggered handler for new pipeline submissions |
| `paos-pipeline-watch.sh` | bash | Fallback inotify watcher for containers/WSL (no systemd) |
| `paos-queue` | bash | FIFO pipeline queue: enqueue, dequeue, mark done |
| `setup-gitkraken.sh` | bash | Install GitKraken MCP server for AI agent git context |
| `start-dashboard.sh` | bash | Start the Next.js dashboard at `localhost:3333` |
| `sync-chat.py` | python3 | Parse Antigravity JSONL logs into shared chat transcript |
| `test-agents.sh` | bash | Verify all agent git identities commit correctly |

Complete usage examples for h-* commands: [examples.md#5-h-command-cli-reference](examples.md#5-h-command-cli-reference)

## Screenshots

| View | File |
|------|------|
| Overview dashboard | [dashboard-overview.png](screenshots/dashboard-overview.png) |
| Audit ledger | [dashboard-ledger.png](screenshots/dashboard-ledger.png) |
| Agent roster | [dashboard-agents.png](screenshots/dashboard-agents.png) |
| HANDOFF viewer | [dashboard-handoff.png](screenshots/dashboard-handoff.png) |
| Task board | [dashboard-tasks.png](screenshots/dashboard-tasks.png) |
| Plans viewer | [dashboard-plans.png](screenshots/dashboard-plans.png) |
| Agent inbox | [dashboard-inbox.png](screenshots/dashboard-inbox.png) |
| GitGraph per-agent | [gitgraph-agents.png](screenshots/gitgraph-agents.png) |

Screenshot details: [screenshots/README.md](screenshots/README.md)

---

*Part of the [PAOS](../README.md) ecosystem — Personal Agent Operating System.*
