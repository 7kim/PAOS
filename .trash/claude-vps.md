# claude-vps — VPS Management CLI

**Path**: `/run/media/dev/.../claude-vps/` (external drive)
**Status**: Historical
**Stack**: Node.js CLI

## Purpose

Production-ready CLI for VPS management with Claude AI integration.
SSH automation, Tailscale networking, security hardening (UFW, Fail2ban, SSH key-only).

## Conventions Used

- Node.js CLI with Commander.js + Inquirer
- ESM modules
- kebab-case files, camelCase internals
- Detailed README-first development

## Key Patterns

- SSH key-only authentication enforced
- Tailscale mesh VPN for node-to-node connectivity
- UFW + Fail2ban hardening scripts
- Agent commit pattern (predates PAOS, manual)
