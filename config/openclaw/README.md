# OpenClaw — PAOS Integration

OpenClaw is a personal AI assistant that connects to Telegram, WhatsApp, Slack, Discord, and 20+ channels. In PAOS it acts as the **channel agent** — the human-facing communication layer.

**Install**: `npm install -g openclaw@latest --prefix ~/.local` (installed v2026.5.12)  
**Symlink**: `~/.openclaw` → `config/openclaw/`  
**Soul**: `agents/openclaw/soul.md`  
**Inbox**: `memory/inbox/openclaw/`  
**Events**: `logs/openclaw/events.md`

---

## Status

- [x] Installed via `curl -fsSL https://openclaw.ai/install.sh | bash` (v2026.5.12)
- [x] Binary at `~/.local/bin/openclaw`
- [x] `~/.openclaw` symlink created
- [x] Soul + PAOS integration files written
- [x] Inbox wired (`memory/inbox/openclaw/`)
- [ ] **Channel setup** — run: `openclaw onboard` to configure Telegram/WhatsApp/etc.
- [ ] **API keys** — configure LLM provider in OpenClaw settings

---

## Complete Setup

```bash
# 1. Run onboarding wizard (sets up channels: Telegram, WhatsApp, Slack, etc.)
openclaw onboard

# 2. Configure LLM backend in OpenClaw settings
# Point to Claude (Anthropic) or OpenAI as the AI provider
```

---

## PAOS Integration

OpenClaw writes to the vault as `openclaw` agent:

- Events: `logs/openclaw/events.md` = `vault/memory/openclaw/events.md`
- Inbox: `memory/inbox/openclaw/` (other agents send tasks here)
- Ledger: `memory/global_ledger.md` (via MCP `append_ledger`)
- Commits: `bin/agent-commit.sh openclaw "Agent[openclaw]: <description>"`

OpenClaw's soul is at `agents/openclaw/soul.md` — it defines how OpenClaw interacts with the PAOS pipeline.

---

## Channel → PAOS Pipeline

When a user sends a message via Telegram/WhatsApp:

1. OpenClaw receives it
2. OpenClaw reads `vault/memory/shared/context.md` for current PAOS state
3. OpenClaw delegates coding tasks to `memory/inbox/developer/` via `send_message` MCP tool
4. Developer agent picks up and executes
5. OpenClaw reports result back to the user channel

This turns OpenClaw into the **human interface layer** of PAOS.
