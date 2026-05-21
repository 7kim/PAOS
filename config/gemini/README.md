# Gemini and Antigravity MCP Config

This directory keeps only stable PAOS integration files under version control.

Tracked:

- `antigravity-ide/mcp_config.json`
- `antigravity-backup/mcp_config.json`

Ignored:

- browser profiles
- local auth/session state
- generated Antigravity summaries
- cache databases

Regenerate MCP files from the canonical registry:

```bash
bin/paos-agent mcp-sync
```
