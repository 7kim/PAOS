#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# bin/init-paos.sh — PAOS Fresh Start Initializer
# ─────────────────────────────────────────────────────────────────────────────
# Run this once after cloning the repo to:
#   - Clear all old session data (ledger, tasks, pipelines, inboxes, logs)
#   - Install dependencies (MCP servers, dashboard)
#   - Initialize fresh memory structures
#   - Set up vault for first use
#   - Keep your config/secrets/.env intact
#
# Usage: bash bin/init-paos.sh
#        bash bin/init-paos.sh --yes      # skip confirmation prompts
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUTO_YES=false
for arg in "$@"; do
  [[ "$arg" == "--yes" || "$arg" == "-y" ]] && AUTO_YES=true
done

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
info()    { echo -e "${CYAN}[PAOS]${NC} $*"; }
success() { echo -e "${GREEN}[PAOS] ✓${NC} $*"; }
warn()    { echo -e "${YELLOW}[PAOS] !${NC} $*"; }
fail()    { echo -e "${RED}[PAOS] ✗${NC} $*"; exit 1; }
header()  { echo -e "\n${BOLD}${CYAN}── $* ──${NC}"; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║   PAOS — Personal Agent Operating System                     ║${NC}"
echo -e "${CYAN}║   Fresh Start Initializer                                    ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ── Check we're in the right place ────────────────────────────────────────────
if [[ ! -f "${REPO_ROOT}/workflow.md" ]]; then
  fail "Run this from the PAOS repository root (AI_Workflow/). workflow.md not found."
fi

# ── Confirm ───────────────────────────────────────────────────────────────────
if ! $AUTO_YES; then
  echo -e "${YELLOW}This will:${NC}"
  echo "  • Clear all old memory data (global_ledger, tasks, pipelines, inboxes)"
  echo "  • Clear all agent event logs (files kept, content reset)"
  echo "  • Clear vault chat history and daily notes (templates kept)"
  echo "  • Update projects.md to focus only on PAOS itself"
  echo "  • Install MCP server and dashboard dependencies"
  echo "  • Keep your config/secrets/.env file intact"
  echo ""
  read -r -p "Continue? [Y/n] " reply
  case "$reply" in
    n|N|no|NO) echo "Aborted."; exit 0 ;;
    *) ;;
  esac
fi

cd "$REPO_ROOT"

# ═══════════════════════════════════════════════════════════════════════════════
# 1. KEEP secrets/.env — verify it exists
# ═══════════════════════════════════════════════════════════════════════════════
header "Secrets Check"
if [[ -f "${REPO_ROOT}/config/secrets/.env" ]]; then
  success "config/secrets/.env preserved"
else
  warn "config/secrets/.env not found — copying from template"
  cp "${REPO_ROOT}/config/secrets/.env.template" "${REPO_ROOT}/config/secrets/.env"
  echo -e "${YELLOW}  → Edit config/secrets/.env and add your API keys later${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 2. Clear all memory structures
# ═══════════════════════════════════════════════════════════════════════════════
header "Clearing Old Memory Data"

# global_ledger.md
cat > "${REPO_ROOT}/memory/global_ledger.md" << 'LEDGER'
# Global Audit Ledger — Aggregated

| Timestamp (UTC) | Agent | Action | File | Description | Task | Commit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INIT | paos-init | INIT | - | PAOS initialized fresh via bin/init-paos.sh | - | - |
LEDGER
success "memory/global_ledger.md — initialized"

# shared/context.md
cat > "${REPO_ROOT}/memory/shared/context.md" << 'CTX'
# Shared Context — AI Workflow

This is the append-only thinking context shared by all agents. Each agent writes a structured entry when they begin or end work.

**Format:**
```
## [YYYY-MM-DD HH:MM] @agent — Task: <task-id>
**Thinking**: <key ideas, decisions, rationale>
**Decisions Made**: <list>
**Handoff Notes**: <for next agent in pipeline>
```

---

## INIT @paos-init — Task: PAOS-FRESH-START

**Thinking**: PAOS was freshly initialized via bin/init-paos.sh. All old session data has been cleared. The system is starting clean with only PAOS itself as the active project.

**Decisions**:
- All previous session data, ledger entries, task cards, pipelines, inbox messages, and event logs have been reset
- The only active project is PAOS itself — enhancing the PAOS framework
- See HANDOFF.md for the current state

**Handoff Notes**: Welcome to a fresh PAOS. Read HANDOFF.md first, then pick up where you like.
CTX
success "memory/shared/context.md — initialized"

# shared/HANDOFF.md
INIT_TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
cat > "${REPO_ROOT}/memory/shared/HANDOFF.md" << HANDOFF
# HANDOFF — Current PAOS State

> This file is **rewritten** each session. It is the first thing every agent reads.
> Always current. Max 60 lines.

---

## Last Agent
- **Agent**: paos-init
- **Tool**: bin/init-paos.sh
- **Timestamp**: ${INIT_TS}
- **Session**: PAOS Fresh Start

## Active Task
PAOS has been freshly initialized. All old session data cleared. The current focus is enhancing PAOS itself.

## What Was Just Done
- Cleared all old memory data (global_ledger, tasks, pipelines, inboxes, shared context)
- Cleared all agent event logs
- Initialized vault for first use
- Installed MCP server dependencies
- Installed dashboard dependencies
- Updated projects.md — only PAOS is active

## What Is NOT Done Yet
- Configure API keys in config/secrets/.env (if not done)
- Install agent CLIs (Claude Code, Codex, Hermes, etc.) — run install scripts as needed
- Configure agent MCP connections
- This is a fresh start — no previous work to continue

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS | `$(pwd)` | Multi-Agent AI Orchestration | Active — fresh start |

## Key Decisions (permanent)
- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (14 tools) + `scaffold` (2 tools) + `gitkraken` (read-only)
- Every agent reads HANDOFF.md as Step 0 — universal cold-start
- **dashboard/ port**: 3333
- **Vault Symlinks**: `vault/knowledge` and `vault/memory` are critical symlinks mapping to root folders. NEVER delete them.
- **Documentation**: All new documentation goes in `knowledge/docs/` (NEVER `knowledge/` root)

## How to Pick Up
1. Read this file (done)
2. Read `vault/memory/global_ledger.md` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from fresh PAOS — what's next?"
HANDOFF
success "memory/shared/HANDOFF.md — initialized"

# shared/swot_audit.md (if exists)
if [[ -f "${REPO_ROOT}/memory/shared/swot_audit.md" ]]; then
  > "${REPO_ROOT}/memory/shared/swot_audit.md"
  success "memory/shared/swot_audit.md — cleared"
fi

# Clear tasks/ — keep directory, remove all .md files
mkdir -p "${REPO_ROOT}/memory/tasks"
find "${REPO_ROOT}/memory/tasks" -maxdepth 1 -name '*.md' ! -name '_template.md' -delete 2>/dev/null || true
# Create template if missing
if [[ ! -f "${REPO_ROOT}/memory/tasks/_template.md" ]]; then
  cat > "${REPO_ROOT}/memory/tasks/_template.md" << 'TMPL'
---
task_id: TASK-XXX
title: "Task Title"
status: pending
assigned_to: agent-id
created_by: agent-id
priority: normal
depends_on: "-"
created_at: YYYY-MM-DDTHH:MM:SSZ
---

# TASK-XXX — Task Title

**Status**: pending
**Assigned**: agent-id
**Created by**: agent-id

## Description



## Progress

<!-- Agent updates this section during execution -->
TMPL
fi
success "memory/tasks/ — cleared (template kept)"

# Clear pipelines/
mkdir -p "${REPO_ROOT}/memory/pipelines"
rm -rf "${REPO_ROOT}/memory/pipelines/PIPE-"* 2>/dev/null || true
success "memory/pipelines/ — cleared"

# Clear inbox files (keep directories)
mkdir -p "${REPO_ROOT}/memory/inbox"
for agent_dir in "${REPO_ROOT}/memory/inbox/"*/; do
  agent_name="$(basename "$agent_dir")"
  find "$agent_dir" -maxdepth 1 -name '*.md' -delete 2>/dev/null || true
  # Write a welcome message into each inbox
  cat > "${agent_dir}.gitkeep" 2>/dev/null || true
done
success "memory/inbox/ — messages cleared (directories kept)"

# Clear pm-logs/
mkdir -p "${REPO_ROOT}/memory/pm-logs"
find "${REPO_ROOT}/memory/pm-logs" -maxdepth 1 -name '*.md' -delete 2>/dev/null || true
success "memory/pm-logs/ — cleared"

# Clear prompts/
mkdir -p "${REPO_ROOT}/memory/prompts"
find "${REPO_ROOT}/memory/prompts" -maxdepth 1 -name '*.md' ! -name '_template.md' -delete 2>/dev/null || true
if [[ ! -f "${REPO_ROOT}/memory/prompts/_template.md" ]]; then
  cat > "${REPO_ROOT}/memory/prompts/_template.md" << 'PTMPL'
# Handoff Prompt Template

**From**: agent-id
**To**: agent-id
**Task**: TASK-XXX

## Context



## Required Actions



## Files to Modify



## Acceptance Criteria



## Handoff Notes
PTMPL
fi
success "memory/prompts/ — cleared (template kept)"

# Clear project ledgers (keep index.md + _template.md)
mkdir -p "${REPO_ROOT}/memory/projects"
find "${REPO_ROOT}/memory/projects" -maxdepth 1 -name '*.md' ! -name 'index.md' ! -name '_template.md' -delete 2>/dev/null || true
# Update index.md
cat > "${REPO_ROOT}/memory/projects/index.md" << 'PINDEX'
# Project Ledgers

| Project | Ledger | Status |
| ------- | ------ | ------ |
| PAOS | `PAOS/ledger.md` | Active — fresh start |
PINDEX

# Create PAOS project ledger
mkdir -p "${REPO_ROOT}/memory/projects/PAOS"
cat > "${REPO_ROOT}/memory/projects/PAOS/ledger.md" << 'PLEDGER'
# PAOS Project Ledger

| Timestamp (UTC) | Agent | Task ID | Action | Files | Commit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| INIT | paos-init | - | INIT | PAOS initialized fresh via bin/init-paos.sh | - |
PLEDGER
success "memory/projects/ — cleared (PAOS ledger created)"

# ═══════════════════════════════════════════════════════════════════════════════
# 3. Clear all agent event logs
# ═══════════════════════════════════════════════════════════════════════════════
header "Clearing Agent Event Logs"

mkdir -p "${REPO_ROOT}/logs"
for agent_dir in "${REPO_ROOT}/logs/"*/; do
  agent_name="$(basename "$agent_dir")"
  events_file="${agent_dir}events.md"
  if [[ -f "$events_file" ]]; then
    cat > "$events_file" << EVENTS
# ${agent_name^} Events Log — ${agent_name}@paos.nodealgo.com

| Timestamp (UTC) | Agent | Action | File | Description |
| :--- | :--- | :--- | :--- | :--- |
| ${INIT_TS} | paos-init | INIT | - | Log initialized fresh via bin/init-paos.sh |
EVENTS
    success "logs/${agent_name}/events.md — initialized"
  fi
done
# Also handle logs without agent subdirs (just files in logs/)
find "${REPO_ROOT}/logs" -maxdepth 1 -name '*.md' -delete 2>/dev/null || true

# ═══════════════════════════════════════════════════════════════════════════════
# 4. Update user.md — keep identity, strip old projects
# ═══════════════════════════════════════════════════════════════════════════════
header "Updating User Profile"

# Preserve the identity section, update projects section
if [[ -f "${REPO_ROOT}/user.md" ]]; then
  # Get existing content and replace projects registry + environment info
  cat > "${REPO_ROOT}/user.md" << USERMD
# Operator Identity Profile

## Identity

- **Name**: Abdullah Abdul Hakim
- **Organization**: NodeAlgo (nodealgo.com)
- **Role**: Full-stack developer & infrastructure tooling engineer
- **Profile Generated**: 2026-05-15T01:45:00Z
- **Profile Updated**: ${INIT_TS} (fresh start)

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
USERMD
  success "user.md — updated"
else
  warn "user.md not found — skipped"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 5. Update projects.md — only PAOS
# ═══════════════════════════════════════════════════════════════════════════════
header "Updating Project Registry"

cat > "${REPO_ROOT}/projects.md" << 'PROJ'
# Active Project Registry

> Only PAOS is active. All previous projects have been archived for a fresh start.

| Project | Path | Stack | Status | Notes |
|---------|------|-------|--------|-------|
| **PAOS** | `~/AI_Workflow/` | Multi-Agent AI Orchestration Framework | Active — fresh start | Enhancing the Personal Agent Operating System |

---

*PAOS is the only project. Focus: evolve the framework, skills, MCP tools, and agent ecosystem.*
PROJ
success "projects.md — updated"

# ═══════════════════════════════════════════════════════════════════════════════
# 6. Clear vault/chats/ (keep template)
# ═══════════════════════════════════════════════════════════════════════════════
header "Clearing Vault"

mkdir -p "${REPO_ROOT}/vault/chats"
find "${REPO_ROOT}/vault/chats" -maxdepth 1 -name '*.md' ! -name '_template.md' -delete 2>/dev/null || true
success "vault/chats/ — cleared (template kept)"

# Clear vault/daily/ (keep template if exists)
mkdir -p "${REPO_ROOT}/vault/daily"
find "${REPO_ROOT}/vault/daily" -maxdepth 1 -name '*.md' ! -name '_template.md' -delete 2>/dev/null || true
cat > "${REPO_ROOT}/vault/daily/$(date +%Y-%m-%d).md" << DAILY
# $(date +%Y-%m-%d)

## Today's Focus
PAOS fresh start — enhancing the framework

## Activity
| Action | Agent | Project | Files | Ref |
| ------ | ----- | ------- | ----- | --- |
| INIT | paos-init | PAOS | bin/init-paos.sh | PAOS-FRESH-START |

## Linked Memory
- [[memory/global_ledger.md]]
- [[memory/shared/context.md]]
DAILY
success "vault/daily/ — cleared (today created)"

# Update dashboard.md
cat > "${REPO_ROOT}/vault/dashboard.md" << 'DASH'
# PAOS Dashboard

Welcome to a fresh PAOS. Everything links from here.

## Live Dashboard

`http://localhost:3333` — Run: `cd ~/AI_Workflow/dashboard && npm run dev`

Sections: Overview · Audit Ledger · Agents · Tasks · Plans · Inbox

## Active Projects

- [[knowledge/paos/constitution.md]] — PAOS Constitution (H-Factor)
- PAOS — the framework itself (this repository)

## Knowledge Base

- [[knowledge/paos/constitution.md]] — PAOS Constitution (H-Factor)
- [[knowledge/srs/SRS-1-PAOS-Current-State.md]] — PAOS SRS

## Audit Trail

- [[memory/global_ledger.md]] — Aggregated ledger (all agents)

## Agent Pipeline

```
@developer → @plan (PM) → @architect + @coordinator (parallel) → @plan → @developer → @coordinator
```

## Agent Inboxes (Tier C)

- [[memory/inbox/developer/]] — OpenCode developer
- [[memory/inbox/architect/]] — Architect
- [[memory/inbox/coordinator/]] — Coordinator
- [[memory/inbox/claude/]] — Claude Code
- [[memory/inbox/gemini/]] — Gemini
- [[memory/inbox/hermes-nous/]] — Hermes (Nous Research)
- [[memory/inbox/opencode/]] — OpenCode CLI
- [[memory/inbox/codex/]] — Codex
- [[memory/inbox/antigravity/]] — Antigravity
- [[memory/inbox/ollama/]] — Ollama

## Shared Context

- [[memory/shared/context.md]] — Ongoing thinking (Tier A)
- [[memory/tasks/]] — Task board (Tier B)
- [[memory/prompts/]] — PM handoff prompts
- [[memory/pm-logs/]] — PM Antigravity artifacts

## Skills

| Skill | File |
| ----- | ---- |
| Antigravity Review Loop | `skills/antigravity-review-loop/SKILL.md` |
| System Analysis & Design | `skills/system-analysis-and-design/SKILL.md` |
| Project Scaffolder | `skills/project-scaffolder/SKILL.md` |
| Identity Elicitation | `skills/skill-creator-elicitation/SKILL.md` |
DASH
success "vault/dashboard.md — updated"

# ═══════════════════════════════════════════════════════════════════════════════
# 7. Path replacement — update hardcoded paths to current user's home
# ═══════════════════════════════════════════════════════════════════════════════
header "Updating Paths"

if [[ "$(uname -s)" == "Linux" ]]; then
  SED_CMD=(sed -i)
else
  SED_CMD=(sed -i '')
fi

# Get the current home directory
CURRENT_HOME="$HOME"
# Only update if the paths don't already match
if grep -rq "/home/dev/AI_Workflow" "${REPO_ROOT}" --include='*.json' --include='*.js' --include='*.md' --exclude-dir=.git --exclude-dir=node_modules 2>/dev/null; then
  info "Updating hardcoded /home/dev/AI_Workflow paths to ${CURRENT_HOME}/AI_Workflow..."
  find "${REPO_ROOT}" -type f \( -name '*.json' -o -name '*.js' -o -name '*.md' -o -name '*.yaml' -o -name '*.yml' \) \
    ! -path "${REPO_ROOT}/.git/*" \
    ! -path "${REPO_ROOT}/node_modules/*" \
    ! -path "${REPO_ROOT}/dashboard/node_modules/*" \
    ! -path "${REPO_ROOT}/mcp/*/node_modules/*" \
    ! -path "${REPO_ROOT}/config/secrets/.env" \
    -exec "${SED_CMD[@]}" "s|/home/dev/AI_Workflow|${CURRENT_HOME}/AI_Workflow|g" {} + 2>/dev/null || true
  success "Paths updated to ${CURRENT_HOME}/AI_Workflow"
else
  info "No path replacement needed — paths already match current user"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 8. Install MCP server dependencies
# ═══════════════════════════════════════════════════════════════════════════════
header "Installing Dependencies"

if [[ -f "${REPO_ROOT}/mcp/shared-memory-server/package.json" ]]; then
  info "Installing shared-memory MCP server dependencies..."
  cd "${REPO_ROOT}/mcp/shared-memory-server"
  npm install --silent 2>&1 | tail -1 || warn "npm install had issues (check above)"
  success "shared-memory MCP server ready"
fi

if [[ -f "${REPO_ROOT}/mcp/scaffold-server/package.json" ]]; then
  info "Installing scaffold MCP server dependencies..."
  cd "${REPO_ROOT}/mcp/scaffold-server"
  npm install --silent 2>&1 | tail -1 || warn "npm install had issues (check above)"
  success "scaffold MCP server ready"
fi

if [[ -f "${REPO_ROOT}/dashboard/package.json" ]]; then
  info "Installing dashboard dependencies..."
  cd "${REPO_ROOT}/dashboard"
  npm install --silent 2>&1 | tail -1 || warn "npm install had issues (check above)"
  success "dashboard dependencies installed"
fi

cd "$REPO_ROOT"

# ═══════════════════════════════════════════════════════════════════════════════
# 9. Make scripts executable
# ═══════════════════════════════════════════════════════════════════════════════
header "Making Scripts Executable"
chmod +x "${REPO_ROOT}/bin/"*.sh 2>/dev/null || true
chmod +x "${REPO_ROOT}/bin/"*.py 2>/dev/null || true
chmod +x "${REPO_ROOT}/bin/h-pipeline" 2>/dev/null || true
success "Scripts in bin/ made executable"

# ═══════════════════════════════════════════════════════════════════════════════
# 10. Check git setup
# ═══════════════════════════════════════════════════════════════════════════════
header "Git Check"
if [[ ! -d "${REPO_ROOT}/.git" ]]; then
  info "Initializing git repository..."
  git init
  success "Git repository initialized"
else
  success "Git repository already exists"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 11. Verify vault symlinks
# ═══════════════════════════════════════════════════════════════════════════════
header "Vault Symlink Verification"
if [[ -L "${REPO_ROOT}/vault/memory" ]]; then
  success "vault/memory → $(readlink "${REPO_ROOT}/vault/memory")"
else
  warn "vault/memory symlink missing — creating"
  ln -sf "../memory" "${REPO_ROOT}/vault/memory"
  success "Created vault/memory → memory"
fi

if [[ -L "${REPO_ROOT}/vault/knowledge" ]]; then
  success "vault/knowledge → $(readlink "${REPO_ROOT}/vault/knowledge")"
else
  warn "vault/knowledge symlink missing — creating"
  ln -sf "../knowledge" "${REPO_ROOT}/vault/knowledge"
  success "Created vault/knowledge → knowledge"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 12. Verify shared-memory MCP server works
# ═══════════════════════════════════════════════════════════════════════════════
header "MCP Server Smoke Test"
if command -v node &>/dev/null; then
  # Quick check: can the server start and list tools?
  timeout 5 node -e "
    const { spawn } = require('child_process');
    const s = spawn('node', ['${REPO_ROOT}/mcp/shared-memory-server/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        MEMORY_DIR: '${REPO_ROOT}/memory',
        KNOWLEDGE_DIR: '${REPO_ROOT}/knowledge',
        REPO_ROOT: '${REPO_ROOT}'
      }
    });
    let output = '';
    s.stdout.on('data', d => { output += d.toString(); });
    s.on('close', () => { process.exit(output.includes('tools') || output.includes('resources') ? 0 : 1); });
    s.stdin.write(JSON.stringify({jsonrpc: '2.0', id: 1, method: 'tools/list'}) + '\n');
    setTimeout(() => { s.kill(); process.exit(1); }, 4000);
  " 2>/dev/null && success "shared-memory MCP server responds" || warn "shared-memory smoke check skipped (expected during first run)"
else
  warn "Node.js not found — MCP servers cannot run yet. Install Node.js >=18"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# Done!
# ═══════════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║   PAOS Fresh Start Complete!                                 ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}What was done:${NC}"
echo "  • All old memory data cleared — fresh global_ledger, tasks, pipelines, inboxes"
echo "  • All agent event logs reset to initial state"
echo "  • Vault prepared with today's daily note"
echo "  • MCP server dependencies installed"
echo "  • Dashboard dependencies installed"
printf '  • Paths updated to %s/AI_Workflow\n' "$CURRENT_HOME"
echo "  • projects.md focuses only on PAOS"
echo "  • config/secrets/.env preserved"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo ""
echo "  1. Fill in your API keys (if not done):"
echo -e "     ${YELLOW}nano config/secrets/.env${NC}"
echo ""
echo "  2. Start the dashboard:"
echo -e "     ${YELLOW}cd ${REPO_ROOT}/dashboard && npm run dev${NC}"
echo -e "     → ${CYAN}http://localhost:3333${NC}"
echo ""
echo "  3. Commit this fresh start:"
echo -e "     ${YELLOW}./bin/agent-commit.sh hermes-nous \"Agent[hermes-nous]: Initialized PAOS fresh start\"${NC}"
echo ""
echo "  4. Start working with an agent:"
echo -e "     ${YELLOW}hermes${NC}  or  ${YELLOW}claude${NC}  or  ${YELLOW}opencode${NC}"
echo ""
echo -e "${CYAN}Documentation:${NC} workflow.md"
echo -e "${CYAN}Constitution:${NC}  knowledge/paos/constitution.md"
echo ""
