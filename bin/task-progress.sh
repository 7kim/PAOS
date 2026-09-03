#!/bin/bash
# task-progress.sh — Update task progress in real-time during execution
# Usage: task-progress.sh <task-id> <status> <progress-message> [project]
# Example: task-progress.sh my-feature in_progress "Building the API endpoint..." PAOS
#          task-progress.sh my-feature done "Task complete!" PAOS

set -e

TASK_ID="$1"
STATUS="$2"
PROGRESS="$3"
PROJECT="$4"

if [ -z "$TASK_ID" ]; then
  echo "Usage: task-progress.sh <task-id> [status] [progress message] [project]"
  echo "Statuses: draft, approved, in_progress, done, failed"
  exit 1
fi

# Update status if provided
if [ -n "$STATUS" ]; then
  local_params="id=${TASK_ID}&status=${STATUS}"
  if [ -n "$PROJECT" ]; then
    local_params="${local_params}&project=${PROJECT}"
  fi
  curl -s -X PATCH "http://localhost:3333/api/tasks?${local_params}" > /dev/null
  echo "✓ Status → ${STATUS}"
fi

# Update progress if provided
if [ -n "$PROGRESS" ]; then
  local_params="id=${TASK_ID}&progress=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$PROGRESS")"
  if [ -n "$PROJECT" ]; then
    local_params="${local_params}&project=${PROJECT}"
  fi
  curl -s -X PATCH "http://localhost:3333/api/tasks?${local_params}" > /dev/null
  echo "✓ Progress: ${PROGRESS}"
fi

# Also update the task MD file
if [ -n "$PROJECT" ]; then
  TASK_FILE="/home/dev/AI_Workflow/projects/${PROJECT}/tasks/${TASK_ID}.md"
else
  TASK_FILE="/home/dev/AI_Workflow/memory/tasks/${TASK_ID}.md"
fi
if [ -f "$TASK_FILE" ]; then
  if [ -n "$STATUS" ]; then
    if grep -q "^Status:" "$TASK_FILE"; then
      sed -i "s/^Status:.*/Status: ${STATUS}/" "$TASK_FILE"
    else
      sed -i "0,/^# /a\\Status: ${STATUS}" "$TASK_FILE"
    fi
  fi
  if [ -n "$PROGRESS" ]; then
    PROGRESS_ENCODED=$(python3 -c "import urllib.parse,sys;print(urllib.parse.unquote(sys.argv[1]))" "$PROGRESS")
    if grep -q "^Progress:" "$TASK_FILE"; then
      sed -i "s/^Progress:.*/Progress: ${PROGRESS_ENCODED}/" "$TASK_FILE"
    else
      echo "Progress: ${PROGRESS_ENCODED}" >> "$TASK_FILE"
    fi
  fi
fi
