#!/usr/bin/env bash
# bin/paos-pipeline-handler.sh — Detect new pipeline submissions and notify executors
# Triggered by systemd paos-pipeline.path on writes to memory/pipelines/
set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────────────
PAOS_HOME="${PAOS_HOME:-$HOME/AI_Workflow}"
LOCK_FILE="/tmp/paos-pipeline.lock"
RATE_LIMIT_DIR="/tmp/paos-pipeline-ratelimit"
RATE_LIMIT_SECS=300          # max 1 notification per agent per 300s
HANDLER_TIMEOUT=30           # seconds for the whole handler run
MAX_TASKS_AUTO=20            # skip auto-exec if pipeline has more tasks than this
WHITELIST="$HOME/.config/paos/pipeline-whitelist.txt"
KILL_SWITCH="$HOME/.config/paos/auto-execute.off"

export PAOS_HOME

# ── Helpers ──────────────────────────────────────────────────────────────────
ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

log_ledger() {
    local agent="$1" action="$2" file="$3" desc="$4"
    echo "$(ts) | $agent | $action | $file | $desc" >> "$PAOS_HOME/vault/memory/global_ledger.md"
}

json_get() {
    # $1 = file  $2 = key  returns value or empty string
    python3 -c "
import json, sys
try:
    with open('$1') as f:
        d = json.load(f)
    print(d$2)
except Exception:
    sys.exit(1)
" 2>/dev/null || echo ""
}

# ── Lock (non-blocking) ─────────────────────────────────────────────────────
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
    echo "paos-pipeline: another handler is running, skipping"
    exit 0
fi

# ── Kill switch check ───────────────────────────────────────────────────────
if [[ -f "$KILL_SWITCH" ]]; then
    echo "paos-pipeline: kill switch active ($KILL_SWITCH exists), exiting"
    exit 0
fi

mkdir -p "$RATE_LIMIT_DIR"

# ── Scan pipeline directories ───────────────────────────────────────────────
found_pipeline=""
found_dir=""
for dir in "$PAOS_HOME"/memory/pipelines/PIPE-* "$PAOS_HOME"/memory/pipelines/AI_Workflow-PIPE-*; do
    [[ -d "$dir" ]] || continue
    pipe_json="$dir/pipeline.json"
    meta="$dir/META.json"
    [[ -f "$pipe_json" && -f "$meta" ]] || continue
    status="$(json_get "$pipe_json" "['status']")"
    if [[ "$status" == "submitted" ]]; then
        found_pipeline="$(basename "$dir")"
        found_dir="$dir"
        break
    fi
done
# Also scan inside project folders if not found
if [[ -z "$found_pipeline" ]]; then
    for project_dir in "$PAOS_HOME"/memory/pipelines/*/; do
        project_name="$(basename "$project_dir")"
        [[ "$project_name" == PIPE-* || "$project_name" == AI_Workflow-PIPE-* || "$project_name" == .* ]] && continue
        for dir in "$project_dir"PIPE-* "$project_dir"AI_Workflow-PIPE-*; do
            [[ -d "$dir" ]] || continue
            pipe_json="$dir/pipeline.json"
            meta="$dir/META.json"
            [[ -f "$pipe_json" && -f "$meta" ]] || continue
            status="$(json_get "$pipe_json" "['status']")"
            if [[ "$status" == "submitted" ]]; then
                found_pipeline="$(basename "$dir")"
                found_dir="$dir"
                break 2
            fi
        done
    done
fi
if [[ -z "$found_pipeline" ]]; then
    exit 0
fi
pipeline_id="$found_pipeline"
pipeline_dir="$found_dir"
pipe_json="$pipeline_dir/pipeline.json"
meta="$pipeline_dir/META.json"
echo "paos-pipeline: detected new pipeline $pipeline_id"

# ── Find executor from META.json phases ─────────────────────────────────
    executor="$(json_get "$meta" "['phases'][0]['agent']")"  # fallback: first phase
    # Find the first phase with status "submitted" — that's the one needing execution
    submitted_agent="$(python3 -c "
import json
with open('$meta') as f:
    m = json.load(f)
for p in m.get('phases', []):
    if p.get('status') == 'submitted':
        print(p.get('agent', 'unknown'))
        break
" 2>/dev/null || echo "")"
    [[ -n "$submitted_agent" ]] && executor="$submitted_agent"

    if [[ -z "$executor" || "$executor" == "unknown" ]]; then
        echo "paos-pipeline: could not determine executor for $pipeline_id, skipping"
        continue
    fi

    # ── Whitelist check ─────────────────────────────────────────────────────
    if [[ -f "$WHITELIST" ]]; then
        planner="$(json_get "$meta" "['phases'][0]['agent']")"
        if ! grep -qxF "$planner" "$WHITELIST" 2>/dev/null; then
            echo "paos-pipeline: planner '$planner' not in whitelist, skipping $pipeline_id"
            continue
        fi
    fi

    # ── Rate limit check ────────────────────────────────────────────────────
    rate_file="$RATE_LIMIT_DIR/$executor"
    now="$(date +%s)"
    if [[ -f "$rate_file" ]]; then
        last_run="$(cat "$rate_file")"
        elapsed=$(( now - last_run ))
        if (( elapsed < RATE_LIMIT_SECS )); then
            echo "paos-pipeline: rate limited for '$executor' ($((RATE_LIMIT_SECS - elapsed))s remaining)"
            continue
        fi
    fi

    # ── Write notification to executor's inbox ──────────────────────────────
    inbox_dir="$PAOS_HOME/vault/memory/inbox/$executor"
    mkdir -p "$inbox_dir"
    notif_file="$inbox_dir/$(date +%s%N)-paos-auto-executor.md"

    cat > "$notif_file" <<EOF
---
from: paos-auto-executor
to: $executor
subject: Pipeline Execution: $pipeline_id
priority: normal
timestamp: $(ts)
pipeline_id: $pipeline_id
---

# Auto-Triggered Pipeline: $pipeline_id

Pipeline **$pipeline_id** was auto-detected by the systemd path watcher.

## Files

- **Plan**: \`$pipeline_dir/IMPLEMENTATION_PLAN.md\`
- **Tasks**: \`$pipeline_dir/TASKS.md\`
- **Meta**: \`$pipeline_dir/META.json\`

Start by reading the plan and tasks, then execute them in order.
EOF

    echo "paos-pipeline: notified '$executor' about $pipeline_id ($notif_file)"

    # ── Update rate limit ───────────────────────────────────────────────────
    echo "$now" > "$rate_file"

    # ── Update pipeline.json status to "executing" ─────────────────────────
    python3 -c "
import json
with open('$pipe_json') as f:
    p = json.load(f)
p['status'] = 'executing'
p['updatedAt'] = '$(ts)'
with open('$pipe_json', 'w') as f:
    json.dump(p, f, indent=2)
" || true

    # ── Log to global ledger ────────────────────────────────────────────────
    log_ledger "paos-auto-executor" "NOTIFY" "$notif_file" \
        "Auto-detected pipeline $pipeline_id, notified $executor"

    # ── Auto-execute (if enabled and reasonable size) ───────────────────────
    if [[ ! -f "$KILL_SWITCH" ]]; then
        task_file="$pipeline_dir/TASKS.md"
        task_count=0
        [[ -f "$task_file" ]] && task_count=$(grep -c '\[ \]' "$task_file" 2>/dev/null || echo 0)

        if (( task_count <= MAX_TASKS_AUTO )); then
            echo "paos-pipeline: auto-executing $pipeline_id ($task_count tasks) via '$executor'"
            # ponytail: spawn execution in background with 30m timeout
            case "$executor" in
                opencode-developer|opencode)
                    timeout 1800 opencode run "$pipeline_dir" 2>&1 | \
                        logger -t "paos-executor[$pipeline_id]" &
                    ;;
                claude)
                    timeout 1800 claude --execute "$pipeline_dir" 2>&1 | \
                        logger -t "paos-executor[$pipeline_id]" &
                    ;;
                *)
                    echo "paos-pipeline: no auto-execution handler for '$executor', notification sent only"
                    ;;
            esac
        else
            echo "paos-pipeline: $pipeline_id has $task_count tasks > $MAX_TASKS_AUTO auto limit, skipping auto-execution"
        fi
    fi
done
