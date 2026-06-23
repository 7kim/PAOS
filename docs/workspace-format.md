# PAOS Workspace File Format

PAOS uses VS Code-compatible `.code-workspace` files as its project definition format.
This ensures the same file works in VS Code, Cursor, and the future PAOS code editor.

## File Format

```json
{
  "$schema": "./.schemas/workspace.schema.json",
  "name": "my-project",
  "folders": [
    { "path": "/home/dev/projects/my-app" }
  ],
  "settings": {
    "paos": {
      "version": 1,
      "project": "my-project",
      "createdAt": "2026-06-22T22:00:00.000Z",
      "pipelinesDir": "memory/pipelines/my-project",
      "agents": {
        "default": "my-project_opencode-developer",
        "reviewer": "my-project_architect",
        "coordinator": "my-project_coordinator"
      },
      "secrets": {
        "path": "memory/pipelines/my-project/secrets/.env"
      },
      "vault": {
        "path": "memory/pipelines/my-project/vault"
      },
      "sourcePath": "/home/dev/projects/my-app"
    }
  },
  "extensions": {
    "recommendations": [
      "github.vscode-github-actions",
      "dbaeumer.vscode-eslint"
    ]
  }
}
```

## Fields

### Top-Level (VS Code Standard)

| Field | Required | Description |
|-------|----------|-------------|
| `folders` | Yes | Array of `{ path }` objects — repo directories in the workspace |
| `settings` | No | Editor settings object — VS Code applies these |
| `extensions` | No | Recommended extensions |
| `name` | No | Display name (PAOS extension) |

### PAOS Settings (`settings.paos`)

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | Schema version (currently 1) |
| `project` | Yes | Project name — matches the workspace filename stem |
| `createdAt` | Yes | ISO timestamp of workspace creation |
| `pipelinesDir` | Yes | Path to pipeline storage (relative to PAOS_HOME or absolute) |
| `agents` | No | Per-project agent identity overrides |
| `secrets.path` | No | Path to project-specific .env file |
| `vault.path` | No | Path to project vault directory |
| `sourcePath` | No | Absolute path to the source repo on disk |
| `importedAt` | No | Timestamp of import (if imported) |
| `integratedAt` | No | Timestamp of PAOS integration (if integrated) |
| `analysis` | No | Result of project analysis (languages, frameworks, etc.) |

## Storage

Workspace files live at `PAOS_HOME/workspaces/{name}.code-workspace`.

## Compatibility

- **VS Code**: File → Open Workspace → select `.code-workspace` file. VS Code loads folders and settings, ignores PAOS-specific settings.
- **PAOS Dashboard**: Reads workspace files to list projects, uses `paos` settings for project context.
- **PAOS CLI** (`h-workspace`): Create, list, open, show current workspace.
- **Future PAOS Editor**: Same format — PAOS settings section drives agent integration.
