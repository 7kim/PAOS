#!/bin/bash
# task-status.sh — Update task status in real-time
# Usage: task-status.sh <task-id> <status>
# Statuses: draft, approved, in_progress, done, failed

set -e

TASK_ID="$1"
STATUS="$2"

if [ -z "$TASK_ID" ] || [ -z "$STATUS" ]; then
  echo "Usage: task-status.sh <task-id> <status>"
  echo "Statuses: draft, approved, in_progress, done, failed"
  exit 1
fi

VALID_STATUSES=("draft" "approved" "in_progress" "done" "failed")
VALID=false
for s in "${VALID_STATUSES[@]}"; do
  if [ "$STATUS" = "$s" ]; then VALID=true; fi
done

if [ "$VALID" = false ]; then
  echo "Invalid status: $STATUS"
  echo "Valid: ${VALID_STATUSES[*]}"
  exit 1
fi

RESULT=$(curl -s -X PATCH "http://localhost:3333/api/tasks?id=${TASK_ID}&status=${STATUS}")
echo "$RESULT"

# Also update the task file itself for persistence
TASK_FILE="/home/dev/AI_Workflow/memory/tasks/${TASK_ID}.md"
if [ -f "$TASK_FILE" ]; then
  # Replace or add status line
  if grep -q "^Status:" "$TASK_FILE"; then
    sed -i "s/^Status:.*/Status: ${STATUS}/" "$TASK_FILE"
  else
    # Insert after title line
    sed -i "0,/^# /a\\Status: ${STATUS}" "$TASK_FILE"
  fi
  echo "Updated ${TASK_FILE}"
fi
