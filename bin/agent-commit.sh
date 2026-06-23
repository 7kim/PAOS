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
  echo "Run: bin/paos-agent list" >&2
  exit 1
fi

# ── Navigate to repo root ──────────────────────────────────────────────────────
REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# ── Check for project-scoped git identity from workspace ────────────────────
SCOPED_NAME=""
SCOPED_EMAIL=""
if [[ -n "${PAOS_WORKSPACE:-}" ]]; then
  WS_FILE="$PAOS_HOME/workspaces/$PAOS_WORKSPACE.code-workspace"
  if [[ -f "$WS_FILE" ]]; then
    SCOPED_IDENTITY="$(node -e '
const fs = require("fs");
const ws = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const paos = ws.settings?.paos || {};
const identities = paos.gitIdentities || {};
const agentId = process.argv[2];
const entry = identities[agentId];
if (entry) process.stdout.write(JSON.stringify(entry));
' "$WS_FILE" "$AGENT_ID" || true)"
    if [[ -n "$SCOPED_IDENTITY" ]]; then
      SCOPED_NAME="$(node -e 'const d=JSON.parse(process.argv[1]); process.stdout.write(d.name)' "$SCOPED_IDENTITY")"
      SCOPED_EMAIL="$(node -e 'const d=JSON.parse(process.argv[1]); process.stdout.write(d.email)' "$SCOPED_IDENTITY")"
    fi
  fi
fi

# ── Resolve identity from canonical registry ──────────────────────────────────
IDENTITY_JSON="$(node -e '
const fs = require("fs");
const id = process.argv[1];
const registry = JSON.parse(fs.readFileSync("agents/registry.json", "utf8"));
const agent = registry.agents.find((item) => item.id === id || (item.aliases || []).includes(id));
if (!agent) process.exit(2);
process.stdout.write(JSON.stringify(agent.gitIdentity));
' "$AGENT_ID" || true)"

if [[ -z "$IDENTITY_JSON" ]]; then
  echo "Unknown agent: $AGENT_ID" >&2
  echo "Run: bin/paos-agent list" >&2
  exit 1
fi

NAME="${SCOPED_NAME:-$(node -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data.name)' "$IDENTITY_JSON")}"
EMAIL="${SCOPED_EMAIL:-$(node -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data.email)' "$IDENTITY_JSON")}"

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
  -c core.hooksPath=.githooks \
  commit -m "$MESSAGE"

echo ""
echo "✓ Committed as: $NAME <$EMAIL>"
echo "  Message: $MESSAGE"
echo "  SHA: $(git rev-parse --short HEAD)"
