# vps-kit — VPS Fleet Management

**Path**: `/run/media/dev/.../vps-kit/` (external drive)
**Status**: Historical
**Stack**: TypeScript Monorepo (CLI + VS Code Extension + MCP server)

## Purpose

Cross-platform CLI + VS Code Extension + MCP server for VPS fleet management.
Unified tooling across CLI, IDE, and AI agent contexts.

## Architecture Decisions

- **Monorepo with pnpm workspaces**: CLI, extension, MCP server as separate packages
- **MCP server**: predates PAOS — early MCP experimentation
- **VS Code Extension**: IntelliSense for VPS configs, fleet status sidebar
- **tsup for builds**: generates both ESM and CJS outputs with .d.ts

## Conventions Used

- Full TypeScript strict mode
- ESM primary, CJS compatibility shims
- tsup + pnpm
- VS Code extension with TypeScript + vsce
- MCP server with stdio transport
