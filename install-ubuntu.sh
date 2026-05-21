#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# PAOS — Ubuntu / Debian Install Script
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-ubuntu.sh)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_URL="https://github.com/7kim/AI_Workflow.git"
INSTALL_DIR="${HOME}/AI_Workflow"
NODE_VERSION="20"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()    { echo -e "${CYAN}[PAOS]${NC} $*"; }
success() { echo -e "${GREEN}[PAOS] ✓${NC} $*"; }
warn()    { echo -e "${YELLOW}[PAOS] !${NC} $*"; }
fail()    { echo -e "${RED}[PAOS] ✗${NC} $*"; exit 1; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   PAOS — Personal Agent Operating System         ║${NC}"
echo -e "${CYAN}║   Ubuntu / Debian Installer                      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# ── Check OS ─────────────────────────────────────────────────────────────────
if [[ "$(uname -s)" != "Linux" ]]; then
  fail "This script is for Ubuntu/Debian only. Use install-mac.sh for macOS."
fi

# ── 1. System dependencies ───────────────────────────────────────────────────
info "Installing system dependencies..."
sudo apt-get update -qq
sudo apt-get install -y git curl wget build-essential

# ── 2. Node.js ────────────────────────────────────────────────────────────────
if command -v node &>/dev/null && [[ "$(node -e 'process.exit(parseInt(process.versions.node)>=18?0:1)' 2>/dev/null; echo $?)" == "0" ]]; then
  success "Node.js $(node --version) already installed"
else
  info "Installing Node.js ${NODE_VERSION}..."
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt-get install -y nodejs
  success "Node.js $(node --version) installed"
fi

# ── 3. Clone repository ───────────────────────────────────────────────────────
if [[ -d "${INSTALL_DIR}" ]]; then
  warn "Directory ${INSTALL_DIR} already exists — pulling latest changes"
  git -C "${INSTALL_DIR}" pull origin master 2>/dev/null || warn "Pull failed — continuing with existing files"
else
  info "Cloning PAOS to ${INSTALL_DIR}..."
  git clone "${REPO_URL}" "${INSTALL_DIR}"
  success "Cloned to ${INSTALL_DIR}"
fi

cd "${INSTALL_DIR}"

# ── 4. Update paths ───────────────────────────────────────────────────────────
info "Updating REPO_ROOT paths to ${INSTALL_DIR}..."
find . -type f \( -name "*.json" -o -name "*.js" -o -name "*.md" \) \
  ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./.next/*" \
  -exec sed -i "s|/home/dev/AI_Workflow|${INSTALL_DIR}|g" {} + 2>/dev/null || true
success "Paths updated"

# ── 5. Install MCP server deps ────────────────────────────────────────────────
info "Installing MCP server dependencies..."
cd "${INSTALL_DIR}/mcp/shared-memory-server"
npm install --silent
success "MCP server ready"

# ── 6. Install dashboard deps ──────────────────────────────────────────────────
info "Installing dashboard dependencies..."
cd "${INSTALL_DIR}/dashboard"
npm install --silent
success "Dashboard dependencies installed"

# ── 7. Ensure ~/.local/bin exists and is in PATH ──────────────────────────────
mkdir -p "${HOME}/.local/bin"
if ! echo "$PATH" | grep -q "${HOME}/.local/bin"; then
  warn "Adding ~/.local/bin to PATH — you may need to restart your shell"
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${HOME}/.bashrc"
  export PATH="${HOME}/.local/bin:${PATH}"
fi

# ── 8. Install Claude Code ────────────────────────────────────────────────────
if command -v claude &>/dev/null; then
  success "Claude Code already installed ($(claude --version 2>&1 | head -1))"
else
  info "Installing Claude Code..."
  npm install -g @anthropic-ai/claude-code --prefix "${HOME}/.local" --silent 2>/dev/null || \
    warn "Claude Code install failed — install manually: npm install -g @anthropic-ai/claude-code"
fi

# ── 9. Install OpenAI Codex ────────────────────────────────────────────────────
if command -v codex &>/dev/null; then
  success "Codex already installed"
else
  info "Installing OpenAI Codex..."
  npm install -g @openai/codex --prefix "${HOME}/.local" --silent 2>/dev/null || \
    warn "Codex install failed — install manually: npm install -g @openai/codex"
fi

# ── 10. Install OpenClaw ──────────────────────────────────────────────────────
if command -v openclaw &>/dev/null; then
  success "OpenClaw already installed ($(openclaw --version 2>&1 | head -1))"
else
  info "Installing OpenClaw..."
  npm install -g openclaw@latest --prefix "${HOME}/.local" --silent 2>/dev/null || \
    warn "OpenClaw install failed — install manually: npm install -g openclaw --prefix ~/.local"
fi

# ── 10b. Install Nous Research Hermes Agent (optional) ─────────────────────────
if command -v hermes &>/dev/null; then
  success "Nous Hermes already installed ($(hermes --version 2>&1 | head -1))"
else
  info "Installing Nous Research Hermes Agent (autonomous agent with 89 skills)..."
  curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash 2>/dev/null && \
    success "Nous Hermes installed" || \
    warn "Install manually: curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash"
fi

# ── 10c. Install Signal CLI (PAOS notification agent) ──────────────────────────
if [[ ! -f "${HOME}/.local/bin/signal" ]]; then
  info "Creating Signal CLI — PAOS notification agent..."
  cp "${INSTALL_DIR}/bin/signal-template" "${HOME}/.local/bin/signal" 2>/dev/null || \
    cat > "${HOME}/.local/bin/signal" << 'SIGNAL'
#!/usr/bin/env python3
"""PAOS Signal — notification & messenger agent. Usage: signal <message>"""
import os, sys, json
from datetime import datetime
MSG = ' '.join(sys.argv[1:]) if len(sys.argv) > 1 else 'Ping from Signal'
TS = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
print(f'[{TS}] Signal: {MSG}')
SIGNAL
  chmod +x "${HOME}/.local/bin/signal"
  success "Signal CLI created at ~/.local/bin/signal"
fi

# ── 11. Set up symlinks ────────────────────────────────────────────────────────
info "Setting up agent symlinks..."
setup_symlink() {
  local target="$1" link="$2" name="$3"
  if [[ -L "${link}" ]]; then
    rm "${link}"
  elif [[ -e "${link}" ]]; then
    mv "${link}" "${link}.bak"
    warn "Backed up existing ${link} to ${link}.bak"
  fi
  ln -sf "${target}" "${link}"
  success "~/${name} → ${target}"
}

setup_symlink "${INSTALL_DIR}/config/claude"   "${HOME}/.claude"   ".claude"
setup_symlink "${INSTALL_DIR}/config/codex"    "${HOME}/.codex"    ".codex"
setup_symlink "${INSTALL_DIR}/config/gemini"   "${HOME}/.gemini"   ".gemini"
setup_symlink "${INSTALL_DIR}/config/openclaw" "${HOME}/.openclaw" ".openclaw"

# Symlink MCP configs to unified registry
MCP_CONFIG="${INSTALL_DIR}/mcp/mcp-config.json"
for agent_link in \
  "${HOME}/.claude/mcp.json" \
  "${INSTALL_DIR}/config/gemini/config/mcp_config.json" \
  "${INSTALL_DIR}/config/signal/mcp_config.json"; do
  mkdir -p "$(dirname "${agent_link}")"
  ln -sf "${MCP_CONFIG}" "${agent_link}" 2>/dev/null || true
done
success "MCP configs symlinked to unified registry"

# ── 12. Configure secrets ─────────────────────────────────────────────────────
if [[ ! -f "${INSTALL_DIR}/config/secrets/.env" ]]; then
  cp "${INSTALL_DIR}/config/secrets/.env.template" "${INSTALL_DIR}/config/secrets/.env"
  # Update default paths in .env
  sed -i "s|/home/dev/AI_Workflow|${INSTALL_DIR}|g" "${INSTALL_DIR}/config/secrets/.env"
  warn "Secrets file created at config/secrets/.env — fill in your API keys!"
else
  success "Secrets file already exists"
fi

# ── 13. Make scripts executable ───────────────────────────────────────────────
chmod +x "${INSTALL_DIR}/bin/"*.sh
success "Scripts made executable"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   PAOS Installation Complete!                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo ""
echo "  1. Fill in your API keys:"
echo -e "     ${YELLOW}nano ${INSTALL_DIR}/config/secrets/.env${NC}"
echo ""
echo "  2. Launch the PAOS Dashboard (click desktop icon or run):"
echo -e "     ${YELLOW}sudo systemctl start paos-dashboard${NC}"
echo -e "     → ${CYAN}http://localhost:3333${NC}"
echo ""
echo "  3. Set up OpenClaw channels (Telegram, WhatsApp, etc.):"
echo -e "     ${YELLOW}openclaw onboard${NC}"
echo ""
echo "  4. (Optional) Configure Nous Hermes API keys:"
echo -e "     ${YELLOW}nano ~/.hermes/.env${NC}"
echo ""
echo "  5. Test all agent git identities:"
echo -e "     ${YELLOW}cd ${INSTALL_DIR} && ./bin/test-agents.sh${NC}"
echo ""
echo "  6. Sync continuous chat transcript:"
echo -e "     ${YELLOW}python3 ${INSTALL_DIR}/bin/sync-chat.py${NC}"
echo ""
echo "  7. Start an agent:"
echo -e "     ${YELLOW}claude${NC}  or  ${YELLOW}opencode${NC}  or  ${YELLOW}hermes${NC}"
echo ""
echo -e "${CYAN}Documentation:${NC} ${INSTALL_DIR}/README.md"
echo -e "${CYAN}Constitution:${NC}  ${INSTALL_DIR}/workflow.md"
echo ""
