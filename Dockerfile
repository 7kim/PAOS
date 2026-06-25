# PAOS Dockerfile
FROM node:22-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y \
    git curl python3 pandoc \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app
COPY . .

# Build
RUN npx next build

# Environment
ENV MEMORY_DIR=/data/memory
ENV WORKSPACES_DIR=/data/workspaces
ENV PORT=3333

# Volumes
VOLUME /data
VOLUME /home/dev

EXPOSE 3333

CMD ["npx", "next", "start", "--port", "3333"]
