#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# PAOS — macOS Install Script
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-mac.sh)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_URL="https://github.com/7kim/AI_Workflow.git"
INSTALL_DIR="${HOME}/AI_Workflow"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()    { echo -e "${CYAN}[PAOS]${NC} $*"; }
success() { echo -e "${GREEN}[PAOS] ✓${NC} $*"; }
warn()    { echo -e "${YELLOW}[PAOS] !${NC} $*"; }
fail()    { echo -e "${RED}[PAOS] ✗${NC} $*"; exit 1; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   PAOS — Personal Agent Operating System         ║${NC}"
echo -e "${CYAN}║   macOS Installer                                ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# ── Check OS ─────────────────────────────────────────────────────────────────
if [[ "$(uname -s)" != "Darwin" ]]; then
  fail "This script is for macOS only. Use install-ubuntu.sh for Linux."
fi

# ── 1. Homebrew ───────────────────────────────────────────────────────────────
if ! command -v brew &>/dev/null; then
  info "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Add brew to PATH for Apple Silicon
  if [[ -f "/opt/homebrew/bin/brew" ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "${HOME}/.zprofile"
  fi
  success "Homebrew installed"
else
  success "Homebrew already installed"
fi

# ── 2. Git ────────────────────────────────────────────────────────────────────
if ! command -v git &>/dev/null; then
  info "Installing git..."
  brew install git
  success "git installed"
else
  success "git $(git --version | awk '{print $3}') already installed"
fi

# ── 3. Node.js ────────────────────────────────────────────────────────────────
if command -v node &>/dev/null; then
  NODE_MAJOR=$(node -e "process.exit(parseInt(process.versions.node))" 2>/dev/null; echo $?)
  if node -e "process.exit(parseInt(process.versions.node)>=18?0:1)" 2>/dev/null; then
    success "Node.js $(node --version) already installed"
  else
    warn "Node.js $(node --version) is too old — installing v20..."
    brew install node@20
    brew link --overwrite node@20
  fi
else
  info "Installing Node.js 20..."
  brew install node@20
  brew link --overwrite node@20
  success "Node.js $(node --version) installed"
fi

# ── 4. Clone repository ───────────────────────────────────────────────────────
if [[ -d "${INSTALL_DIR}" ]]; then
  warn "Directory ${INSTALL_DIR} already exists — pulling latest changes"
  git -C "${INSTALL_DIR}" pull origin master 2>/dev/null || warn "Pull failed — continuing with existing files"
else
  info "Cloning PAOS to ${INSTALL_DIR}..."
  git clone "${REPO_URL}" "${INSTALL_DIR}"
  success "Cloned to ${INSTALL_DIR}"
fi

cd "${INSTALL_DIR}"

# ── 5. Update paths ───────────────────────────────────────────────────────────
info "Updating REPO_ROOT paths to ${INSTALL_DIR}..."
find . -type f \( -name "*.json" -o -name "*.js" -o -name "*.md" \) \
  ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./.next/*" \
  -exec sed -i '' "s|/home/dev/AI_Workflow|${INSTALL_DIR}|g" {} + 2>/dev/null || true
success "Paths updated"

# ── 6. Install MCP server deps ────────────────────────────────────────────────
info "Installing MCP server dependencies..."
cd "${INSTALL_DIR}/mcp/shared-memory-server"
npm install --silent
success "MCP server ready"

# ── 7. Install dashboard deps ──────────────────────────────────────────────────
info "Installing dashboard dependencies..."
cd "${INSTALL_DIR}/dashboard"
npm install --silent
success "Dashboard dependencies installed"

# ── 8. Ensure ~/.local/bin exists and is in PATH ──────────────────────────────
mkdir -p "${HOME}/.local/bin"
SHELL_RC="${HOME}/.zshrc"
[[ "${SHELL}" == *"bash"* ]] && SHELL_RC="${HOME}/.bash_profile"

if ! echo "$PATH" | grep -q "${HOME}/.local/bin"; then
  warn "Adding ~/.local/bin to PATH in ${SHELL_RC}"
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${SHELL_RC}"
  export PATH="${HOME}/.local/bin:${PATH}"
fi

# ── 9. Install Claude Code ────────────────────────────────────────────────────
if command -v claude &>/dev/null; then
  success "Claude Code already installed"
else
  info "Installing Claude Code..."
  npm install -g @anthropic-ai/claude-code --prefix "${HOME}/.local" --silent 2>/dev/null || \
    warn "Claude Code install failed — run: npm install -g @anthropic-ai/claude-code"
fi

# ── 10. Install OpenAI Codex ───────────────────────────────────────────────────
if command -v codex &>/dev/null; then
  success "Codex already installed"
else
  info "Installing OpenAI Codex..."
  npm install -g @openai/codex --prefix "${HOME}/.local" --silent 2>/dev/null || \
    warn "Codex install failed — run: npm install -g @openai/codex"
fi

# ── 11. Install OpenClaw ──────────────────────────────────────────────────────
if command -v openclaw &>/dev/null; then
  success "OpenClaw already installed ($(openclaw --version 2>&1 | head -1))"
else
  info "Installing OpenClaw..."
  npm install -g openclaw@latest --prefix "${HOME}/.local" --silent 2>/dev/null || \
    warn "OpenClaw install failed — run: npm install -g openclaw --prefix ~/.local"
fi

# ── 12. Set up symlinks ────────────────────────────────────────────────────────
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
setup_symlink "${INSTALL_DIR}/config/openclaw" "${HOME}/.openclaw" ".openclaw"

# ── 13. Configure secrets ─────────────────────────────────────────────────────
if [[ ! -f "${INSTALL_DIR}/config/secrets/.env" ]]; then
  cp "${INSTALL_DIR}/config/secrets/.env.template" "${INSTALL_DIR}/config/secrets/.env"
  sed -i '' "s|/home/dev/AI_Workflow|${INSTALL_DIR}|g" "${INSTALL_DIR}/config/secrets/.env"
  warn "Secrets file created at config/secrets/.env — fill in your API keys!"
else
  success "Secrets file already exists"
fi

# ── 14. Make scripts executable ───────────────────────────────────────────────
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
echo "  2. Start the dashboard:"
echo -e "     ${YELLOW}cd ${INSTALL_DIR}/dashboard && npm run dev${NC}"
echo -e "     → ${CYAN}http://localhost:3333${NC}"
echo ""
echo "  3. Set up OpenClaw channels (Telegram, WhatsApp, etc.):"
echo -e "     ${YELLOW}openclaw onboard${NC}"
echo ""
echo "  4. Test all agent git identities:"
echo -e "     ${YELLOW}cd ${INSTALL_DIR} && ./bin/test-agents.sh${NC}"
echo ""
echo "  5. Start Claude Code:"
echo -e "     ${YELLOW}claude${NC}"
echo ""
echo -e "${CYAN}Note:${NC} Restart your terminal or run ${YELLOW}source ${SHELL_RC}${NC} to update PATH."
echo -e "${CYAN}Documentation:${NC} ${INSTALL_DIR}/README.md"
echo ""
