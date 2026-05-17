#!/bin/sh
# PAOS Hub entrypoint — starts dashboard + MCP server
set -e

# Source secrets if present
if [ -f /paos/.env ]; then
  echo "[paos] Loading secrets from /paos/.env"
  set -a; . /paos/.env; set +a
fi

echo "[paos] Starting MCP shared-memory server..."
node /paos/mcp/shared-memory-server/index.js &
MCP_PID=$!

echo "[paos] Starting dashboard on port ${PORT:-3333}..."
HOSTNAME=0.0.0.0 node /paos/dashboard/server.js &
DASH_PID=$!

echo "[paos] PAOS Hub running — dashboard: http://localhost:${PORT:-3333}"
echo "[paos] MCP PID: $MCP_PID | Dashboard PID: $DASH_PID"

# Wait for either to exit
wait -n $MCP_PID $DASH_PID
