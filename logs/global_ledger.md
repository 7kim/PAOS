# Global Audit Ledger — Aggregated

| Timestamp (UTC) | Agent | Action | File | Description | Task | Commit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-06-22T14:39:00Z | paos-init | INIT | - | PAOS initialized fresh via bin/init-paos.sh | - | - |
| 2026-06-22T14:45:00Z | hermes-nous | SCRIPT_CREATE | bin/init-paos.sh | Created fresh-start initializer; fixed to always overwrite .env from template | PAOS-FRESH-START | eb6cc06 |
| 2026-06-22T14:55:00Z | hermes-nous | HERMES_INTEGRATE | ~/AI_Workflow/hermes/, ~/.hermes symlink | Moved Hermes home to AI_Workflow/hermes/, wired MCP servers (shared-memory, scaffold, gitkraken) to config.yaml, updated soul.md, instructions.md, AGENTS.md, registry.json | PAOS-INTEGRATION | pending |
