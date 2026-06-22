# Operator Identity Profile

## Identity

- **Name**: Abdullah Abdul Hakim
- **Organization**: NodeAlgo (nodealgo.com)
- **Role**: Full-stack developer & infrastructure tooling engineer
- **Profile Generated**: 2026-05-15T01:45:00Z
- **Profile Updated**: $(date -u +"%Y-%m-%dT%H:%M:%SZ") (fresh start)

## Field of Expertise

### Core Domains
- **VPS & Infrastructure Management**: SSH automation, Tailscale networking, WireGuard VPN, security hardening (UFW, Fail2ban, SSH key-only), system monitoring
- **AI/LLM Orchestration**: Multi-provider agent layers (Claude, Gemini, OpenAI, Ollama, LM Studio, Copilot) — unified abstractions over heterogeneous AI backends
- **Trading & Financial UI**: Real-time candlestick charts (lightweight-charts), Binance/US design systems, WebSocket data pipelines, mock market data engines
- **Developer Tooling**: CLI tools (Commander.js, Inquirer), VS Code extensions, MCP servers, pnpm monorepos
- **Video/Media Processing**: Playwright-based downloaders, WebP-to-MP4 conversion (imageio), ffmpeg pipelines

### Current Project
| Project | Stack | Purpose |
|---------|-------|---------|
| **PAOS** | Multi-Agent AI Orchestration Framework | Enhancing and evolving the Personal Agent Operating System |

### Languages (ranked by frequency)
1. Python — primary
2. JavaScript / TypeScript — dashboard, CLI tools
3. Bash / PowerShell — cross-platform scripting, VPS automation

### Coding Style Vector
- **Commit Convention**: `Agent[<name>]: <present-tense description>`
- **Module System**: ESM (`"type": "module"`)
- **Line Endings**: LF (Linux / WSL native)
- **Indentation**: 2-space (TypeScript/JS/JSON), 4-space (Python)
- **Naming**: camelCase (JS/TS), snake_case (Python), kebab-case (files/directories)
- **Type Safety**: Full TypeScript with strict types
- **Documentation**: **Heavy** — SRS documents, DESIGN specs, AGENTS.md for agent guardrails
- **Testing**: Node built-in test runner (`node --test`), pytest
- **License**: MIT

## Environment Summary

- **OS**: Linux (Ubuntu 26.04)
- **Runtime**: Node.js >=18, Python 3
- **AI Tools**: Claude Code, OpenCode, Gemini, Codex, Hermes, Ollama
- **Knowledge Base**: `~/AI_Workflow/knowledge/` — canonical .md reference repository
- **Network**: Tailscale mesh VPN, multi-VPS fleet

## PAOS Preferences

- **Preferred Workflow**: Full H-Factor 3-Phase (Plan → Review → Execute → Log)
- **Communication Style**: Structured summaries. Professional. No emojis.
- **Git Discipline**: Auto-commit after every successful task via bin/agent-commit.sh
- **Risk Tolerance**: Conservative. Architect review is mandatory before execution.
- **Knowledge Priority**: Consult `~/AI_Workflow/knowledge/` before designing solutions.
- **Active Focus**: Enhancing PAOS itself — the framework, skills, MCP tools, and agent integration

---

*PAOS initialized fresh — bin/init-paos.sh*
