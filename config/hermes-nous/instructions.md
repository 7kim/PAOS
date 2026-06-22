# Hermes-Nous — PAOS Agent Integration
## Nous Research Hermes Agent v0.14.0

This file documents how the Nous Research Hermes Agent is integrated into PAOS.

## Quick Links

| Resource | Path |
|----------|------|
| Binary | `~/.local/bin/hermes` |
| Home | `~/AI_Workflow/hermes/` (→ `~/.hermes` symlink) |
| Config | `~/AI_Workflow/hermes/config.yaml` |
| Env | `~/AI_Workflow/hermes/.env` |
| SOUL | `~/AI_Workflow/hermes/SOUL.md` |
| Skills | `~/AI_Workflow/hermes/skills/` (89 skills) |
| Logs | `~/AI_Workflow/hermes/logs/` |
| Sessions | `~/AI_Workflow/hermes/sessions/` |
| PAOS Soul | `~/AI_Workflow/agents/hermes-nous/soul.md` |
| PAOS Inbox | `~/AI_Workflow/vault/memory/inbox/hermes-nous/` |
| PAOS Events | `~/AI_Workflow/vault/memory/hermes-nous/events.md` |
| PAOS Config | `~/AI_Workflow/config/hermes-nous/` |

## Commands for PAOS Integration

```bash
# One-shot query (for delegation from other PAOS agents)
hermes -z "analyze the current state of AI_Workflow"

# Start interactive chat
hermes

# Health check
hermes doctor

# Setup (recommended after fresh install)
hermes setup

# Manage sessions
hermes sessions list
hermes -c              # Resume most recent session
hermes -c "task-name"  # Resume session by name

# Gateway (multi-platform messaging)
hermes gateway install

# Web dashboard
hermes dashboard       # port 9119
```

## Default Model
The default model is configured in `~/AI_Workflow/hermes/config.yaml`:
```yaml
model:
  default: "anthropic/claude-opus-4.6"
```
Change with: `hermes model` or `hermes config set model <model>`

## Available Providers
Configured via `~/AI_Workflow/hermes/.env`:
- OpenRouter (`OPENROUTER_API_KEY`)
- Anthropic (`ANTHROPIC_API_KEY`)
- Google Gemini (`GOOGLE_API_KEY`)
- Nous Portal (`hermes login`)
- And 35+ more
