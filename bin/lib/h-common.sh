#!/usr/bin/env bash
# lib/h-common.sh — Shared library for all /h-* commands
# Source this in every h-* script: source "$(dirname "$0")/lib/h-common.sh"

set -euo pipefail

# ── Paths ──────────────────────────────────────────────────────────────────
PAOS_HOME="${PAOS_HOME:-$HOME/AI_Workflow}"
export PAOS_HOME

# ── Agent identity ─────────────────────────────────────────────────────────
agent_name() {
  local name
  name="${PAOS_AGENT:-}"
  if [[ -z "$name" ]]; then
    name="$(git -C "$PAOS_HOME" config user.name 2>/dev/null || echo "unknown")"
  fi
  echo "$name"
}

# ── Timestamp ───────────────────────────────────────────────────────────────
ts() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# ── Colors (auto-detect TTY) ───────────────────────────────────────────────
if [[ -t 1 ]]; then
  readonly H_INFO="\033[36m"     # cyan
  readonly H_WARN="\033[33m"    # yellow
  readonly H_ERROR="\033[31m"   # red
  readonly H_OK="\033[32m"      # green
  readonly H_BOLD="\033[1m"
  readonly H_RESET="\033[0m"
else
  readonly H_INFO=""
  readonly H_WARN=""
  readonly H_ERROR=""
  readonly H_OK=""
  readonly H_BOLD=""
  readonly H_RESET=""
fi

info()  { echo -e "${H_INFO}info${H_RESET}:  $*"; }
warn()  { echo -e "${H_WARN}warn${H_RESET}:  $*" >&2; }
error() { echo -e "${H_ERROR}error${H_RESET}: $*" >&2; }
ok()    { echo -e "${H_OK}ok${H_RESET}:    $*"; }

die() {
  error "$*"
  exit 1
}
