#!/usr/bin/env bash
set -euo pipefail

# PAOS Dashboard — Comprehensive API Smoke Test
# Tests ALL endpoints, generates JSON results for health-check.html
# Usage: ./test-all-endpoints.sh [base_url]

BASE="${1:-http://localhost:3333}"
RESULTS_FILE="/tmp/paos-smoke-results.json"
PASS=0
FAIL=0
TOTAL=0

mkdir -p "$(dirname "$RESULTS_FILE")"
echo '[]' > "$RESULTS_FILE"

# ----- helpers -----
green() { echo "  ✅ $1"; }
yellow() { echo "  ⚠️  $1"; }
red()   { echo "  ❌ $1"; }

record() {
  local method="$1" path="$2" status="$3" expected="$4"
  TOTAL=$((TOTAL+1))
  local pass=false
  if [ "$status" = "$expected" ]; then
    pass=true
    PASS=$((PASS+1))
    green "$method $path → $status"
  else
    FAIL=$((FAIL+1))
    red "$method $path → $status (expected $expected)"
  fi

  local entry
  entry=$(jq -n \
    --arg method "$method" \
    --arg path "$path" \
    --argjson status "$status" \
    --argjson expected "$expected" \
    --argjson pass "$pass" \
    '{method: $method, path: $path, status: $status, expected: $expected, pass: $pass}')

  local tmp; tmp=$(mktemp)
  jq --argjson e "$entry" '. += [$e]' "$RESULTS_FILE" > "$tmp" && mv "$tmp" "$RESULTS_FILE"
}

# Single curl call captures both status code AND body
req() {
  local method="$1" path="$2" expected="${3:-200}" data="${4:-}"
  local curl_args=(-s -w "\n%{http_code}" -X "$method")
  if [ -n "$data" ]; then
    curl_args+=(-d "$data" -H "Content-Type: application/json")
  fi
  local output
  output=$(curl "${curl_args[@]}" "$BASE$path")
  local status
  status=$(echo "$output" | tail -1)
  local body
  body=$(echo "$output" | sed '$d')
  record "$method" "$path" "$status" "$expected"
}

test_get()  { req GET "$@"; }
test_post() { req POST "$@"; }
test_del()  { req DELETE "$@"; }

echo ""
echo "══════════════════════════════════════════════"
echo "  PAOS Dashboard — API Smoke Test"
echo "  Base: $BASE"
echo "  Time: $(date -u)"
echo "══════════════════════════════════════════════"
echo ""

# ── Agent endpoints ──────────────────────────────
echo "── Agents ──"
test_get  "/api/agents"
test_get  "/api/agents/scoped"
test_get  "/api/agents/opencode-developer/health"

# ── Pipeline endpoints ───────────────────────────
echo "── Pipelines ──"
test_get  "/api/pipelines"
test_get  "/api/pipelines/PIPE-25-06-2026---16-42"

# ── Project endpoints ────────────────────────────
echo "── Projects ──"
test_get  "/api/projects"
# /api/projects/[name] only supports DELETE, so 405 is correct behavior
test_get  "/api/projects/AI_Workflow" 405

# ── Data / query endpoints ───────────────────────
echo "── Data ──"
test_get  "/api/overview"
test_get  "/api/events"
test_get  "/api/ledger"
test_get  "/api/handoff"
test_get  "/api/gitview"
test_get  "/api/plans"
test_get  "/api/tasks"
test_get  "/api/inbox"
test_get  "/api/queue"
test_get  "/api/vault"

# ── System / config endpoints ────────────────────
echo "── System ──"
test_get  "/api/system/doctor"
test_get  "/api/mcp-servers"
test_get  "/api/skills"
test_get  "/api/workspaces"

# ── Secrets (requires ?project= param) ────────────
echo "── Secrets ──"
test_get  "/api/secrets?project=PAOS" 200
test_get  "/api/global-secrets"

# ── Write endpoints (POST smoke only) ────────────
echo "── Write endpoints ──"
test_post "/api/send-message" 200 '{"to":"hermes-nous","from":"opencode-developer","subject":"Smoke test — please ignore","body":"Automated smoke test message from PIPE-25-06-2026---16-42"}'

# ── Summary ──────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════"
echo "  Results: $PASS passed / $FAIL failed / $TOTAL total"
echo "══════════════════════════════════════════════"

# Append summary to results JSON
tmp=$(mktemp)
jq --argjson pass "$PASS" --argjson fail "$FAIL" --argjson total "$TOTAL" \
  '. += [{"__summary__": {"pass": $pass, "fail": $fail, "total": $total, "timestamp": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'", "base": "'"$BASE"'"}}]' \
  "$RESULTS_FILE" > "$tmp" && mv "$tmp" "$RESULTS_FILE"

# Use summary pass/fail for exit code
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
