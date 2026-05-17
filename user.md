# Operator Identity Profile

## Identity

- **Name**: Abdullah Abdul Hakim
- **Organization**: NodeAlgo (nodealgo.com)
- **Role**: Full-stack developer & infrastructure tooling engineer
- **Profile Generated**: 2026-05-15T01:45:00Z
- **Profile Updated**: 2026-05-17T02:50:00Z (projects audit)

## Field of Expertise

### Core Domains
- **VPS & Infrastructure Management**: SSH automation, Tailscale networking, WireGuard VPN, security hardening (UFW, Fail2ban, SSH key-only), system monitoring
- **AI/LLM Orchestration**: Multi-provider agent layers (Claude, Gemini, OpenAI, Ollama, LM Studio, Copilot) — unified abstractions over heterogeneous AI backends
- **Trading & Financial UI**: Real-time candlestick charts (lightweight-charts), Binance/US design systems, WebSocket data pipelines, mock market data engines
- **Developer Tooling**: CLI tools (Commander.js, Inquirer), VS Code extensions, MCP servers, pnpm monorepos
- **Video/Media Processing**: Playwright-based downloaders, WebP-to-MP4 conversion (imageio), ffmpeg pipelines

### Projects

| Project | Stack | Purpose |
|---------|-------|---------|
| **Tradingview** | Python (FastAPI), React 18, Vite, lightweight-charts, zustand, react-query, recharts | Binance Futures scalping bot with real-time dashboard, backtesting engine, live trade execution |
| **project-gemini** | Next.js 16, React 19, FastAPI, PostgreSQL (scaffold — files empty) | AI-driven full-stack project scaffold template with MCP integration |
| **project-gpt** | Markdown only (single session log) | GPT conversation archive — 147KB session export |

### Languages (ranked by frequency)
1. Python — primary (Tradingview bot, FastAPI backend, backtesting)
2. JavaScript / TypeScript — dashboard (React, Vite), opencode skills
3. Bash / PowerShell — cross-platform scripting, VPS automation

### Frameworks & Libraries
- **Frontend**: React 18, Vite, lightweight-charts, recharts, zustand, @tanstack/react-query, date-fns, papaparse
- **Backend**: Python (FastAPI), Node.js (Express)
- **AI SDKs**: @anthropic-ai/sdk, @google/generative-ai, openai
- **Build**: Vite, pnpm, tsup, TypeScript

### Project Archetype
**Trading systems + AI-augmented tooling.** Heavy documentation (SRS.md, SETUP.md, README-first), real-time data pipelines (WebSocket + SSE), and cross-platform (Linux bot runtime + web dashboard).

## Coding Style Vector

- **Commit Convention**: Conventional Commits (single-word present tense: `What you did`)
- **Module System**: ESM (`"type": "module"`) — both Node.js CLI and web projects
- **Line Endings**: LF (Linux / WSL native)
- **Indentation**: 2-space (TypeScript/JS/JSON uniform)
- **Naming**: camelCase (JS/TS), snake_case (Python), kebab-case (files/directories)
- **Type Safety**: Full TypeScript with strict types, `.d.ts` generation via tsup
- **Documentation**: **Heavy** — ARCHITECTURE.md, SRS documents, DESIGN specs, README-first development, AGENTS.md for agent guardrails
- **Testing**: Node built-in test runner (`node --test`), Jest + ts-jest
- **Linting**: ESLint 9 (flat config), Prettier
- **License**: MIT
- **Design Philosophy**: Mock-first then integrate, documentation-driven development, separation of concerns (pluggable provider layers), cross-platform from day one

## Environment Summary

- **OS**: Linux (WSL / Ubuntu) + Windows (bat/ps1 automation)
- **Editor**: VSCode with Antigravity, GitLens, Python/Jupyter, Edge DevTools, Peacock, markdownlint, clangd
- **Runtime**: Node.js >=18, Python (Jupyter), pnpm >=8
- **AI Tools**: Claude Code, opencode, GitHub Copilot, ollama, Gemini, OpenClaw (all configs consolidated under `~/AI_Workflow/`)
- **Knowledge Base**: `~/AI_Workflow/knowledge/` — canonical .md ebook and reference repository (symlinked into Obsidian vault)
- **Storage**: `~/Documents/Dev/` as primary workspace
- **Network**: Tailscale mesh VPN, multi-VPS fleet

## PAOS Preferences

- **Preferred Workflow**: Full H-Factor 3-Phase (Plan → Review → Execute → Log)
- **Communication Style**: Structured summaries. Professional. No emojis.
- **Git Discipline**: Auto-commit after every successful task. Feature branches for experiments.
- **Risk Tolerance**: Conservative. Architect review is mandatory before execution.
- **Knowledge Priority**: Consult `~/AI_Workflow/knowledge/` and `~/AI_Workflow/agents/*/docs/` before designing solutions.
- **Coordinator Mode**: Preferred for multi-agent tasks. Direct invocation OK for single-agent work.
- **Default Agent**: `@developer` - delegates planning to `@plan` (PM), who routes to `@architect` + `@coordinator` in parallel, then hands off back to `@developer` for execution.
- **OpenClaw**: Slot reserved in `~/AI_Workflow/config/openclaw/` and `memory/inbox/openclaw/`. Will integrate into PAOS pipeline once installed.

---

*Elicited by @profiler via skill-creator-elicitation/SKILL.md (H-Factor §I3). Scan target: `~/AI_Workflow/knowledge/`. PAOS active since 2026-05-15.*
