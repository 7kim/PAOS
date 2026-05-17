# project-gemini — Full-Stack Scaffold

**Path**: `~/Documents/Dev/project-gemini/`
**Status**: Active (scaffold, mostly empty)
**Last updated**: 2026-05-17

## Purpose

AI-driven full-stack project scaffold. Next.js 16 frontend + FastAPI backend + PostgreSQL database.
Used as a template for new full-stack projects.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19 |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| AI | MCP integration (mcp-config.json) |
| Infra | docker-compose.yml |

## Structure

```
project-gemini/
├── frontend/       — Next.js 16 app
├── backend/        — FastAPI
├── database/       — migrations, schema
├── ai_model/       — AI integration
├── ui/             — shared UI components
├── diagrams/       — architecture diagrams
├── docs/           — documentation
├── tasks.md        — task board
└── docker-compose.yml
```

## Notes

- Scaffold exists but files are largely empty — used as a starting point
- Has its own MCP config at `mcp-config.json`
- chat.md contains conversation history about the project
