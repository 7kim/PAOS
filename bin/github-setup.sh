#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# bin/github-setup.sh — Push AI_Workflow to GitHub
# ─────────────────────────────────────────────────────────────────────────────
# Run this ONCE to authenticate and push to GitHub.
# Usage: ./bin/github-setup.sh [repo-name]
# Default repo name: AI_Workflow
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_NAME="${1:-AI_Workflow}"
REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo ""
echo "════════════════════════════════════════"
echo "  PAOS — GitHub Setup"
echo "════════════════════════════════════════"
echo ""

# 1. Authenticate
echo "Step 1: Authenticate with GitHub"
echo "A browser window will open — log in with your GitHub account."
echo ""
gh auth login --hostname github.com --git-protocol https --web

echo ""
echo "Step 2: Creating private GitHub repo: $REPO_NAME"
gh repo create "$REPO_NAME" \
  --private \
  --description "PAOS — Personal Agent Operating System. Enterprise AI orchestration hub for Claude, Codex, OpenCode, Antigravity, OpenClaw, Ollama." \
  --source=. \
  --remote=origin

echo ""
echo "Step 3: Pushing to GitHub"
git push -u origin master

echo ""
echo "════════════════════════════════════════"
echo "  Done! Repository pushed to GitHub."
echo "  URL: $(gh repo view --json url -q .url)"
echo "════════════════════════════════════════"
