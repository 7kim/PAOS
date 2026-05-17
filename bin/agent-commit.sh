#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# bin/agent-commit.sh — PAOS Per-Agent Git Commit
# ─────────────────────────────────────────────────────────────────────────────
# Usage: ./bin/agent-commit.sh <agent-id> "<commit message>" [--no-stage]
#
# Makes a git commit attributed to the specified PAOS agent identity.
# Commits show as separate identities in gitgraph, allowing full audit
# of which AI agent made each change.
#
# Agent IDs:
#   claude | codex | opencode-developer | opencode-architect |
#   opencode-coordinator | opencode-plan | antigravity | openclaw | ollama
#
# Example:
#   ./bin/agent-commit.sh claude "Agent[claude]: updated shared context"
#   ./bin/agent-commit.sh codex  "Agent[codex]: refactored auth module"
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

AGENT_ID="${1:-}"
MESSAGE="${2:-}"
NO_STAGE="${3:-}"

if [[ -z "$AGENT_ID" || -z "$MESSAGE" ]]; then
  echo "Usage: $0 <agent-id> \"<commit message>\" [--no-stage]" >&2
  echo "Agent IDs: claude, codex, opencode-developer, opencode-architect, opencode-coordinator, opencode-plan, antigravity, openclaw, ollama" >&2
  exit 1
fi

# ── Agent identity map ────────────────────────────────────────────────────────
declare -A AGENT_NAME
declare -A AGENT_EMAIL

AGENT_NAME[claude]="Claude Code [PAOS]"
AGENT_EMAIL[claude]="claude@paos.nodealgo.com"

AGENT_NAME[codex]="Codex [PAOS]"
AGENT_EMAIL[codex]="codex@paos.nodealgo.com"

AGENT_NAME[opencode-developer]="OpenCode Developer [PAOS]"
AGENT_EMAIL[opencode-developer]="developer@paos.nodealgo.com"

AGENT_NAME[opencode-architect]="OpenCode Architect [PAOS]"
AGENT_EMAIL[opencode-architect]="architect@paos.nodealgo.com"

AGENT_NAME[opencode-coordinator]="OpenCode Coordinator [PAOS]"
AGENT_EMAIL[opencode-coordinator]="coordinator@paos.nodealgo.com"

AGENT_NAME[opencode-plan]="OpenCode Plan [PAOS]"
AGENT_EMAIL[opencode-plan]="plan@paos.nodealgo.com"

AGENT_NAME[antigravity]="Antigravity [PAOS]"
AGENT_EMAIL[antigravity]="antigravity@paos.nodealgo.com"

AGENT_NAME[openclaw]="OpenClaw [PAOS]"
AGENT_EMAIL[openclaw]="openclaw@paos.nodealgo.com"

AGENT_NAME[ollama]="Ollama [PAOS]"
AGENT_EMAIL[ollama]="ollama@paos.nodealgo.com"

AGENT_NAME[gemini]="Gemini [PAOS]"
AGENT_EMAIL[gemini]="gemini@paos.nodealgo.com"

# ── Validate agent ─────────────────────────────────────────────────────────────
if [[ -z "${AGENT_NAME[$AGENT_ID]+_}" ]]; then
  echo "Unknown agent: $AGENT_ID" >&2
  echo "Valid agents: ${!AGENT_NAME[*]}" >&2
  exit 1
fi

NAME="${AGENT_NAME[$AGENT_ID]}"
EMAIL="${AGENT_EMAIL[$AGENT_ID]}"

# ── Navigate to repo root ──────────────────────────────────────────────────────
REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# ── Stage all changes unless --no-stage ───────────────────────────────────────
if [[ "$NO_STAGE" != "--no-stage" ]]; then
  git add -A
fi

# ── Check if there's anything to commit ───────────────────────────────────────
if git diff --cached --quiet; then
  echo "[agent-commit] Nothing to commit for agent: $AGENT_ID"
  exit 0
fi

# ── Commit with agent identity ────────────────────────────────────────────────
git \
  -c user.name="$NAME" \
  -c user.email="$EMAIL" \
  commit -m "$MESSAGE"

echo ""
echo "✓ Committed as: $NAME <$EMAIL>"
echo "  Message: $MESSAGE"
echo "  SHA: $(git rev-parse --short HEAD)"
