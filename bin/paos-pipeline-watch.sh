#!/usr/bin/env bash
# bin/paos-pipeline-watch.sh — Fallback watcher for containers/WSL (no systemd)
#
# Uses inotifywait to detect writes to memory/pipelines/ and calls the handler.
# Usage:  ./bin/paos-pipeline-watch.sh
#         nohup ./bin/paos-pipeline-watch.sh &   (detached)
set -euo pipefail

PAOS_HOME="${PAOS_HOME:-$HOME/AI_Workflow}"
WATCH_DIR="$PAOS_HOME/memory/pipelines"

# Verify inotifywait is available
if ! command -v inotifywait &>/dev/null; then
    echo "paos-pipeline-watch: inotifywait not found. Install inotify-tools."
    echo "  apt install inotify-tools  |  brew install inotify-tools"
    exit 1
fi

echo "paos-pipeline-watch: watching $WATCH_DIR for changes..."

while inotifywait -q -e close_write -e create -e moved_to \
    --format '%w%f' "$WATCH_DIR" 2>/dev/null; do
    # Small delay to let file writes complete
    sleep 1
    "$PAOS_HOME/bin/paos-pipeline-handler.sh"
done
