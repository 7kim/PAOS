#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# GitKraken MCP — PAOS Setup
# Installs the GitKraken MCP server for AI agent git context.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$(dirname "$0")")" && pwd)"
BOLD='\033[1m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${CYAN}[GK]${NC} $*"; }
success() { echo -e "${GREEN}[GK] ✓${NC} $*"; }
warn()    { echo -e "${YELLOW}[GK] !${NC} $*"; }
fail()    { echo -e "${RED}[GK] ✗${NC} $*"; exit 1; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   GitKraken MCP — PAOS Setup                     ║${NC}"
echo -e "${CYAN}║   29 tools: git, issues, PRs, graph, blame       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# ── Check gk binary ──────────────────────────────────────────────────────────
if ! command -v gk &>/dev/null; then
  info "GitKraken CLI not found — downloading..."

  # Detect arch
  ARCH="amd64"
  if [[ "$(uname -m)" == "aarch64" ]]; then ARCH="arm64"; fi

  LATEST=$(curl -sL https://api.github.com/repos/gitkraken/gk-cli/releases/latest \
    | grep browser_download_url | grep "linux_${ARCH}" | head -1 | cut -d'"' -f4)

  if [[ -z "$LATEST" ]]; then
    fail "Could not find download URL. Install manually: https://github.com/gitkraken/gk-cli/releases"
  fi

  info "Downloading: $LATEST"
  curl -sL "$LATEST" -o /tmp/gk.deb
  sudo dpkg -i /tmp/gk.deb
  rm /tmp/gk.deb
  success "GitKraken CLI $(gk --version) installed"
else
  success "GitKraken CLI $(gk --version) already installed"
fi

# ── MCP config link ───────────────────────────────────────────────────────────
MCP_CONFIG="${REPO_ROOT}/mcp/mcp-config.json"
if grep -q "gitkraken" "$MCP_CONFIG" 2>/dev/null; then
  success "GitKraken MCP registered in PAOS config"
else
  warn "GitKraken MCP not in mcp-config.json — add it manually"
fi

# ── Inbox + log ────────────────────────────────────────────────────────────────
mkdir -p "${REPO_ROOT}/memory/inbox/gitkraken" "${REPO_ROOT}/logs/gitkraken"
success "GitKraken inbox and log directories ready"

# ── Auth ───────────────────────────────────────────────────────────────────────
echo ""
info "Authenticate with GitKraken to enable cloud features:"
echo ""
echo "  ${YELLOW}gk auth login${NC}"
echo ""
echo "  This opens a browser to sign in to GitKraken.dev."
echo "  Required for: issue tracking, PRs, AI features."
echo "  Without auth: read-only git tools still work."
echo ""

# ── Verify MCP server ─────────────────────────────────────────────────────────
info "Verifying MCP server..."
if gk mcp --list-tools &>/dev/null; then
  TOOLS=$(gk mcp --list-tools 2>&1 | grep "^Tool:" | wc -l)
  success "GitKraken MCP server responds — ${TOOLS} tools available"
else
  warn "GitKraken MCP tools check failed — try running 'gk mcp --list-tools' manually"
fi

# ── Done ───────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   GitKraken MCP ready!                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  PAOS agents can now use GitKraken MCP tools:"
echo -e "  • ${CYAN}git_log_or_diff${NC}  — Commit history filtered by author"
echo -e "  • ${CYAN}git_graph${NC}       — Visual commit graph"
echo -e "  • ${CYAN}git_blame${NC}       — Line-by-line author info"
echo -e "  • ${CYAN}git_status${NC}      — Working tree status"
echo -e "  • ${CYAN}git_branch${NC}      — Branch management"
echo -e "  • ${CYAN}issues_*${NC}        — GitHub/GitLab/Jira issue ops"
echo -e "  • ${CYAN}pull_request_*${NC}  — PR management"
echo ""
echo -e "  MCP config: ${REPO_ROOT}/mcp/mcp-config.json"
echo ""
echo -e "  ${BOLD}Quick test:${NC} ask an agent:"
echo -e "    '${YELLOW}show me the last 5 commits on main branch using gitkraken${NC}'"
echo ""
