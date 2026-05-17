# ─────────────────────────────────────────────────────────────────────────────
# PAOS Hub — Docker Image
# Includes: Next.js dashboard + MCP shared-memory server
# Memory, vault, knowledge, and logs are mounted as volumes at runtime.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
RUN apk add --no-cache git bash curl

WORKDIR /paos

# ── MCP server ────────────────────────────────────────────────────────────────
FROM base AS mcp-builder
COPY mcp/shared-memory-server/package*.json ./mcp/shared-memory-server/
RUN cd mcp/shared-memory-server && npm ci --production
COPY mcp/shared-memory-server/ ./mcp/shared-memory-server/

# ── Dashboard ─────────────────────────────────────────────────────────────────
FROM base AS dashboard-builder
COPY dashboard/package*.json ./dashboard/
RUN cd dashboard && npm ci
COPY dashboard/ ./dashboard/
RUN cd dashboard && npm run build

# ── Final image ───────────────────────────────────────────────────────────────
FROM base

WORKDIR /paos

# Copy MCP server
COPY --from=mcp-builder /paos/mcp ./mcp

# Copy built dashboard
COPY --from=dashboard-builder /paos/dashboard/.next/standalone ./dashboard/
COPY --from=dashboard-builder /paos/dashboard/.next/static ./dashboard/.next/static
COPY --from=dashboard-builder /paos/dashboard/public ./dashboard/public

# Copy bin scripts
COPY bin/ ./bin/
RUN chmod +x ./bin/*.sh

# ── Runtime directories (overridden by volume mounts) ─────────────────────────
RUN mkdir -p \
  /paos/memory/inbox/claude \
  /paos/memory/inbox/codex \
  /paos/memory/inbox/developer \
  /paos/memory/inbox/architect \
  /paos/memory/inbox/coordinator \
  /paos/memory/inbox/antigravity \
  /paos/memory/inbox/openclaw \
  /paos/memory/inbox/ollama \
  /paos/memory/shared \
  /paos/memory/tasks \
  /paos/logs \
  /paos/vault \
  /paos/knowledge

# ── Environment ───────────────────────────────────────────────────────────────
ENV MEMORY_DIR=/paos/memory
ENV KNOWLEDGE_DIR=/paos/knowledge
ENV LOGS_DIR=/paos/logs
ENV REPO_ROOT=/paos
ENV PORT=3333
ENV NODE_ENV=production

EXPOSE 3333
EXPOSE 3100

# ── Start both services ───────────────────────────────────────────────────────
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
