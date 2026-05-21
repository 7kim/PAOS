# Antigravity 2 Runtime Boundary

`config/antigravity2/` documents the local Antigravity 2 integration, but the browser profile, cache, session storage, and bundled IDE binaries are operator-local runtime state.

Tracked PAOS integration lives in:

- `agents/registry.json`
- `agents/antigravity/soul.md`
- `config/gemini/antigravity-ide/mcp_config.json`

Ignored runtime state lives under:

- `config/antigravity2/config/`
- `config/antigravity2/local-share/`

Do not commit browser caches, cookies, session locks, GPU caches, or generated IDE logs.
