#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# bin/test-agents.sh — PAOS Agent Commit Test
# ─────────────────────────────────────────────────────────────────────────────
# Tests that every PAOS agent can write to the vault and commit to git.
# Each agent gets a distinct git identity visible in gitgraph.
#
# Usage: ./bin/test-agents.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BIN="$REPO_ROOT/bin/agent-commit.sh"
TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
DATE="$(date -u +%Y-%m-%d)"
LOG_HEADER="[${TIMESTAMP}]"

echo ""
echo "════════════════════════════════════════════════════"
echo "  PAOS Agent Commit Test — ${DATE}"
echo "════════════════════════════════════════════════════"
echo ""

AGENTS=(
  "claude"
  "codex"
  "opencode-developer"
  "opencode-architect"
  "opencode-coordinator"
  "antigravity"
  "openclaw"
  "ollama"
)

PASS=0
FAIL=0

for AGENT in "${AGENTS[@]}"; do
  echo "── Testing agent: $AGENT ──"

  # Write a test entry to the agent's events.md
  EVENTS_FILE="$REPO_ROOT/logs/${AGENT}/events.md"
  mkdir -p "$(dirname "$EVENTS_FILE")"
  if [[ ! -f "$EVENTS_FILE" ]]; then
    echo "# ${AGENT} Events Log" > "$EVENTS_FILE"
    echo "" >> "$EVENTS_FILE"
  fi
  echo "${LOG_HEADER} | PAOS_TEST | test-agents.sh | Agent commit test — identity verified" >> "$EVENTS_FILE"

  # Write to global ledger
  LEDGER="$REPO_ROOT/logs/global_ledger.md"
  echo "| ${TIMESTAMP} | ${AGENT} | PAOS_TEST | logs/${AGENT}/events.md | Agent commit identity test | - | - |" >> "$LEDGER"

  # Make the commit
  if "$BIN" "$AGENT" "Agent[${AGENT}]: PAOS identity test commit — vault write verified" 2>&1; then
    echo "  ✓ PASS: $AGENT"
    PASS=$((PASS + 1))
  else
    echo "  ✗ FAIL: $AGENT"
    FAIL=$((FAIL + 1))
  fi
  echo ""
done

echo "════════════════════════════════════════════════════"
echo "  Results: ${PASS} passed, ${FAIL} failed"
echo "════════════════════════════════════════════════════"
echo ""
echo "Git log (all agents):"
git log --oneline --all --graph --format="%C(yellow)%h%Creset %C(cyan)%<(28,trunc)%ae%Creset %s" | head -30
echo ""

if [[ $FAIL -gt 0 ]]; then
  echo "Some agents failed. Check output above."
  exit 1
fi

echo "All agents committed successfully. PAOS identity verification complete."
