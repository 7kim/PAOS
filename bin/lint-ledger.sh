#!/usr/bin/env bash
# bin/lint-ledger.sh — Validate global_ledger.md format
# Usage: ./bin/lint-ledger.sh [path/to/ledger.md]
# Exit 0 = clean, Exit 1 = violations found

set -euo pipefail

LEDGER="${1:-$(git -C "$(dirname "$0")" rev-parse --show-toplevel)/vault/memory/global_ledger.md}"

if [[ ! -f "$LEDGER" ]]; then
  echo "ERROR: ledger not found: $LEDGER" >&2
  exit 1
fi

ERRORS=0

# Check for blank lines inside the table body (breaks markdown table rendering)
BLANK_IN_TABLE=$(awk '/^\| / { in_table=1 } in_table && /^$/ { print NR }' "$LEDGER")
if [[ -n "$BLANK_IN_TABLE" ]]; then
  echo "FAIL: blank lines inside table at lines: $BLANK_IN_TABLE" >&2
  ERRORS=$((ERRORS + 1))
fi

# Check for START/END lifecycle noise rows (match the action column specifically)
LIFECYCLE_ROWS=$(awk -F'|' 'NR>2 && /^\|/ { action=$3; gsub(/^ +| +$/, "", action); if (action == "START" || action == "END") print NR": "action }' "$LEDGER" | wc -l)
if [[ "$LIFECYCLE_ROWS" -gt 0 ]]; then
  echo "FAIL: $LIFECYCLE_ROWS lifecycle noise rows (START/END) — these belong in events.md only" >&2
  awk -F'|' 'NR>2 && /^\|/ { action=$3; gsub(/^ +| +$/, "", action); if (action == "START" || action == "END") print NR": "$0 }' "$LEDGER" >&2
  ERRORS=$((ERRORS + 1))
fi

# Warn on rows where both Task and Commit are '-' but Action is a real action (not PAOS_TEST)
MISSING_TASK=$(awk -F'|' '
  NR > 2 && /^\|/ {
    action = $3; task = $6; commit = $7
    gsub(/^ +| +$/, "", action)
    gsub(/^ +| +$/, "", task)
    gsub(/^ +| +$/, "", commit)
    if (action !~ /PAOS_TEST|:---/ && task == "-" && commit == "-") {
      print NR": "action
    }
  }
' "$LEDGER" | wc -l)

if [[ "$MISSING_TASK" -gt 0 ]]; then
  echo "WARN: $MISSING_TASK real-work rows have both Task='-' and Commit='-' (fill in task ID or commit SHA)" >&2
fi

if [[ "$ERRORS" -eq 0 ]]; then
  echo "OK: ledger format is clean ($LEDGER)"
  exit 0
else
  echo "FAIL: $ERRORS error(s) in ledger" >&2
  exit 1
fi
