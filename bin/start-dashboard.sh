#!/bin/bash
# Start the PAOS orchestration dashboard at http://localhost:3333
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$SCRIPT_DIR/../dashboard"

echo "Starting PAOS dashboard..."
echo "  URL: http://localhost:3333"
echo "  Dir: $DASHBOARD_DIR"
echo ""

cd "$DASHBOARD_DIR"
exec npm run dev
