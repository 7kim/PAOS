#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# bin/install-paos.sh — PAOS Bootstrap Installer for Ubuntu 24.04+ VPS
# ─────────────────────────────────────────────────────────────────────────────
# Provisions a fresh Ubuntu 24.04+ VPS with the full PAOS stack.
# Idempotent — safe to run multiple times.
#
# Usage:
#   bash bin/install-paos.sh
#   bash bin/install-paos.sh --yes        # skip confirmation prompts
#   bash bin/install-paos.sh --no-systemd # skip systemd unit installation
#   bash bin/install-paos.sh --no-tailscale # skip Tailscale serve setup
#   bash bin/install-paos.sh --no-deps    # skip npm/node/python install
#   bash bin/install-paos.sh --repo <URL> # clone from custom repo URL
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════════════════
PAOS_HOME="${PAOS_HOME:-$HOME/AI_Workflow}"
REPO_URL="${REPO_URL:-https://github.com/nodeal-com/AI_Workflow.git}"
BRANCH="${BRANCH:-main}"
AUTO_YES=false
INSTALL_SYSTEMD=true
SETUP_TAILSCALE=true
INSTALL_DEPS=true

# Parse arguments
for arg in "$@"; do
  case "$arg" in
    --yes|-y)           AUTO_YES=true ;;
    --no-systemd)       INSTALL_SYSTEMD=false ;;
    --no-tailscale)     SETUP_TAILSCALE=false ;;
    --no-deps)          INSTALL_DEPS=false ;;
    --repo=*)           REPO_URL="${arg#*=}" ;;
    *)                  ;;
  esac
done

# ═══════════════════════════════════════════════════════════════════════════════
# Style helpers
# ═══════════════════════════════════════════════════════════════════════════════
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
info()    { echo -e "  ${CYAN}ℹ${NC} $*"; }
success() { echo -e "  ${GREEN}✅${NC} $*"; }
warn()    { echo -e "  ${YELLOW}⚠${NC} $*"; }
fail()    { echo -e "  ${RED}❌${NC} $*"; exit 1; }
header()  { echo -e "\n${BOLD}${CYAN}━━━ $* ━━━${NC}"; }
sub()     { echo -e "     ${CYAN}→${NC} $*"; }

# ── Timestamp ───────────────────────────────────────────────────────────────
ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

# ═══════════════════════════════════════════════════════════════════════════════
# Pre-flight checks
# ═══════════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║            ${BOLD}PAOS Bootstrap Installer${NC}${CYAN}                    ║${NC}"
echo -e "${CYAN}║     Personal Agent Operating System — VPS Provisioning          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# OS detection
header "Detecting Operating System"
OS_ID=""
OS_VERSION=""
if [[ -f /etc/os-release ]]; then
  . /etc/os-release
  OS_ID="$ID"
  OS_VERSION="$VERSION_ID"
  info "Detected: $PRETTY_NAME"
else
  OS_ID="$(uname -s)"
  info "Detected: $OS_ID (no /etc/os-release)"
fi

# Verify we're on compatible OS
if [[ "$OS_ID" != "ubuntu" ]]; then
  warn "This script is designed for Ubuntu 24.04+. You're running '$OS_ID'."
  warn "Continuing anyway — some steps may need adjustment."
fi

# Ensure we're running as a normal user (not root)
if [[ "$EUID" -eq 0 ]]; then
  fail "Do NOT run as root. Run as your normal user (who has sudo)."
fi

# Sudo check
if ! command -v sudo &>/dev/null; then
  fail "sudo is required. Install it: apt update && apt install -y sudo"
fi
info "sudo available — will use for system packages"

# Confirm
if ! $AUTO_YES; then
  echo ""
  echo -e "${YELLOW}This script will:${NC}"
  echo "  • Install system packages (curl, git, build-essential, etc.)"
  echo "  • Install Node.js 22+ and Python 3.14+"
  echo "  • Clone/set up ~/AI_Workflow/ PAOS structure"
  echo "  • Install npm dependencies for dashboard & MCP servers"
  echo "  • Create dashboard/.env.local with random API token"
  echo "  • Create config/secrets/.env from template (if missing)"
  if $INSTALL_SYSTEMD; then
    echo "  • Install & enable systemd user services (paos-pipeline)"
  fi
  if $SETUP_TAILSCALE; then
    echo "  • Set up Tailscale serve for dashboard"
  fi
  echo "  • Start dashboard dev server on port 3333"
  echo ""
  read -r -p "Continue? [Y/n] " reply
  case "$reply" in
    n|N|no|NO) echo "Aborted."; exit 0 ;;
    *) ;;
  esac
fi

START_TS="$(ts)"

# ═══════════════════════════════════════════════════════════════════════════════
# 1. System package installation
# ═══════════════════════════════════════════════════════════════════════════════
header "Installing System Packages"

APT_PACKAGES=(
  curl git build-essential
  ca-certificates gnupg lsb-release
  unzip jq
  inotify-tools
  openssl
  ufw
)

sudo apt-get update -qq
sudo apt-get install -y -qq "${APT_PACKAGES[@]}"
success "System packages installed"

# ═══════════════════════════════════════════════════════════════════════════════
# 2. Node.js 22+ installation
# ═══════════════════════════════════════════════════════════════════════════════
header "Ensuring Node.js >= 22"

install_node_via_nvm() {
  if [[ -d "$HOME/.nvm" ]]; then
    # shellcheck disable=SC1091
    [[ -s "$HOME/.nvm/nvm.sh" ]] && . "$HOME/.nvm/nvm.sh"
  fi

  if ! command -v nvm &>/dev/null; then
    info "Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
    # shellcheck disable=SC1091
    [[ -s "$HOME/.nvm/nvm.sh" ]] && . "$HOME/.nvm/nvm.sh"
    success "nvm installed"
  else
    info "nvm already installed"
  fi

  if ! command -v node &>/dev/null || [[ "$(node --version | cut -d. -f1 | tr -d 'v')" -lt 22 ]]; then
    info "Installing Node.js 22 LTS via nvm..."
    nvm install 22
    nvm alias default 22
    nvm use default
    success "Node.js $(node --version) installed via nvm"
  else
    info "Node.js $(node --version) already meets requirements"
  fi
}

install_node_via_nodesource() {
  if command -v node &>/dev/null; then
    NODE_MAJOR=$(node --version | cut -d. -f1 | tr -d 'v')
    if [[ "$NODE_MAJOR" -ge 22 ]]; then
      info "Node.js $(node --version) already installed and meets requirements"
      return
    fi
  fi

  info "Installing Node.js 22.x from NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
  success "Node.js $(node --version) installed via NodeSource"
}

if $INSTALL_DEPS; then
  # Prefer nvm (user-local, no sudo)
  if command -v nvm &>/dev/null || [[ -d "$HOME/.nvm" ]]; then
    install_node_via_nvm
  elif command -v node &>/dev/null; then
    NODE_MAJOR=$(node --version | cut -d. -f1 | tr -d 'v')
    if [[ "$NODE_MAJOR" -ge 22 ]]; then
      info "Node.js $(node --version) already installed"
    else
      info "Node.js $(node --version) too old — upgrading via NodeSource"
      install_node_via_nodesource
    fi
  else
    # Try nvm first (no sudo), fall back to nodesource
    info "No Node.js found. Trying nvm first..."
    install_node_via_nvm 2>/dev/null || install_node_via_nodesource
  fi

  # Ensure npm is present
  if ! command -v npm &>/dev/null; then
    warn "npm not found after Node.js install — trying nodesource"
    install_node_via_nodesource
  fi
  success "npm $(npm --version) available"
else
  info "Skipping Node.js installation (--no-deps)"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 3. Python 3.14+ check
# ═══════════════════════════════════════════════════════════════════════════════
header "Ensuring Python 3"

if $INSTALL_DEPS; then
  if command -v python3 &>/dev/null; then
    PY_VER=$(python3 --version 2>&1 | grep -oP '\d+\.\d+')
    PY_MAJOR=$(echo "$PY_VER" | cut -d. -f1)
    PY_MINOR=$(echo "$PY_VER" | cut -d. -f2)
    info "Python $(python3 --version) installed"
    if [[ "$PY_MAJOR" -ge 3 && "$PY_MINOR" -ge 14 ]]; then
      success "Python 3.14+ requirement met"
    else
      warn "Python $PY_VER is older than 3.14. Recommend upgrading via deadsnakes PPA:"
      warn "  sudo add-apt-repository ppa:deadsnakes/ppa && sudo apt install python3.14"
    fi
  else
    info "Installing Python 3..."
    sudo apt-get install -y -qq python3 python3-pip python3-venv
    success "Python $(python3 --version) installed"
  fi
else
  info "Skipping Python checks (--no-deps)"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 4. Clone / set up ~/AI_Workflow/ structure
# ═══════════════════════════════════════════════════════════════════════════════
header "Setting Up ~/AI_Workflow/ Structure"

if [[ -d "$PAOS_HOME/.git" ]]; then
  info "PAOS repository already exists at $PAOS_HOME"
  cd "$PAOS_HOME"
  if git remote -v &>/dev/null; then
    info "Updating from remote..."
    git fetch origin 2>/dev/null || warn "Could not fetch from remote (offline?)"
    if git symbolic-ref -q HEAD &>/dev/null; then
      git pull --ff-only origin "$(git symbolic-ref --short HEAD)" 2>/dev/null || warn "Could not pull (local changes?)"
    fi
  fi
  success "Repository updated"
elif [[ -d "$PAOS_HOME" ]] && [[ -z "$(ls -A "$PAOS_HOME" 2>/dev/null)" ]]; then
  info "Cloning PAOS repository into $PAOS_HOME..."
  git clone --branch "$BRANCH" "$REPO_URL" "$PAOS_HOME"
  success "Repository cloned"
elif [[ -d "$PAOS_HOME" ]]; then
  info "Directory $PAOS_HOME exists but is not a git repo — initializing..."
  cd "$PAOS_HOME"
  git init
  info "Git repo initialized. No remote configured — you may need to add one:"
  sub "git remote add origin $REPO_URL"
  success "Directory initialized"
else
  info "Cloning PAOS repository into $PAOS_HOME..."
  mkdir -p "$(dirname "$PAOS_HOME")"
  git clone --branch "$BRANCH" "$REPO_URL" "$PAOS_HOME"
  success "Repository cloned"
fi

cd "$PAOS_HOME"

# Create essential subdirectories (idempotent)
mkdir -p \
  "$PAOS_HOME"/dashboard \
  "$PAOS_HOME"/agents/registry \
  "$PAOS_HOME"/agents/souls \
  "$PAOS_HOME"/mcp/shared-memory-server \
  "$PAOS_HOME"/mcp/scaffold-server \
  "$PAOS_HOME"/mcp/search-server \
  "$PAOS_HOME"/memory/inbox \
  "$PAOS_HOME"/memory/pipelines \
  "$PAOS_HOME"/memory/shared \
  "$PAOS_HOME"/knowledge/docs \
  "$PAOS_HOME"/knowledge/templates \
  "$PAOS_HOME"/bin \
  "$PAOS_HOME"/config/secrets \
  "$PAOS_HOME"/config/templates \
  "$PAOS_HOME"/logs \
  "$PAOS_HOME"/vault

success "Directory structure ready"

# ═══════════════════════════════════════════════════════════════════════════════
# 5. Install npm dependencies
# ═══════════════════════════════════════════════════════════════════════════════
header "Installing npm Dependencies"

install_npm_deps() {
  local dir="$1" label="$2"
  if [[ ! -f "$dir/package.json" ]]; then
    warn "No package.json in $label — skipping"
    return
  fi
  if [[ -d "$dir/node_modules" ]] && [[ -f "$dir/package-lock.json" ]]; then
    info "$label: dependencies already installed, verifying..."
    cd "$dir"
    npm ci --silent --no-fund --no-audit 2>&1 | tail -1 || true
    success "$label: dependencies up to date"
    return
  fi
  info "Installing $label dependencies..."
  cd "$dir"
  npm install --silent --no-fund --no-audit 2>&1 | tail -1 || warn "npm install had issues"
  success "$label: dependencies installed"
}

install_npm_deps "$PAOS_HOME/mcp/shared-memory-server" "shared-memory MCP server"
install_npm_deps "$PAOS_HOME/mcp/scaffold-server" "scaffold MCP server"
install_npm_deps "$PAOS_HOME/mcp/search-server" "search MCP server"
install_npm_deps "$PAOS_HOME/dashboard" "dashboard (Next.js)"

cd "$PAOS_HOME"

# ═══════════════════════════════════════════════════════════════════════════════
# 6. Generate API token & create dashboard/.env.local
# ═══════════════════════════════════════════════════════════════════════════════
header "Configuring Dashboard Secrets"

DASH_ENV="$PAOS_HOME/dashboard/.env.local"
API_TOKEN=""

if [[ -f "$DASH_ENV" ]]; then
  info "dashboard/.env.local already exists — reading existing token"
  # shellcheck disable=SC1090
  API_TOKEN="$(grep -oP '^API_TOKEN=\K.*' "$DASH_ENV" 2>/dev/null || echo "")"
  if [[ -z "$API_TOKEN" ]]; then
    warn "No API_TOKEN found in existing .env.local — generating new one"
    API_TOKEN="$(openssl rand -hex 32)"
    # Add or replace API_TOKEN line
    if grep -q '^API_TOKEN=' "$DASH_ENV"; then
      sed -i "s/^API_TOKEN=.*/API_TOKEN=$API_TOKEN/" "$DASH_ENV"
    else
      echo "API_TOKEN=$API_TOKEN" >> "$DASH_ENV"
    fi
    success "API_TOKEN updated in dashboard/.env.local"
  else
    info "Using existing API_TOKEN from dashboard/.env.local"
  fi
else
  API_TOKEN="$(openssl rand -hex 32)"
  cat > "$DASH_ENV" << EOF
# PAOS Dashboard Environment
# Auto-generated by bin/install-paos.sh on $(ts)
API_TOKEN=${API_TOKEN}
# Rate limiting
RATE_LIMIT=100
RATE_LIMIT_WINDOW_MS=60000
EOF
  success "dashboard/.env.local created with random API token"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 7. Create config/secrets/.env from template if missing
# ═══════════════════════════════════════════════════════════════════════════════
header "Creating config/secrets/.env"

ENV_TEMPLATE="$PAOS_HOME/config/secrets/.env.template"
ENV_FILE="$PAOS_HOME/config/secrets/.env"

if [[ -f "$ENV_FILE" ]]; then
  info "config/secrets/.env already exists — preserving"
else
  if [[ -f "$ENV_TEMPLATE" ]]; then
    cp "$ENV_TEMPLATE" "$ENV_FILE"
    # Update paths to current user
    if [[ "$(uname -s)" == "Linux" ]]; then
      sed -i "s|/home/YOUR_USER|$HOME|g" "$ENV_FILE"
    else
      sed -i '' "s|/home/YOUR_USER|$HOME|g" "$ENV_FILE"
    fi
    success "config/secrets/.env created from template"
    warn "→ Edit config/secrets/.env and add your API keys!"
  else
    warn "No .env.template found at $ENV_TEMPLATE"
    # Create a minimal one
    cat > "$ENV_FILE" << EOF
# PAOS Secrets — auto-generated by install-paos.sh
# Fill in your API keys below
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
MEMORY_DIR=$PAOS_HOME/memory
KNOWLEDGE_DIR=$PAOS_HOME/knowledge
TEMPLATES_DIR=$PAOS_HOME/knowledge/templates
LOGS_DIR=$PAOS_HOME/logs
API_TOKEN=$API_TOKEN
EOF
    success "Minimal config/secrets/.env created"
  fi
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 8. Make scripts executable
# ═══════════════════════════════════════════════════════════════════════════════
header "Making Scripts Executable"

chmod +x "$PAOS_HOME/bin/"*.sh 2>/dev/null || true
chmod +x "$PAOS_HOME/bin/"*.py 2>/dev/null || true
for f in "$PAOS_HOME/bin/h-"* "$PAOS_HOME/bin/paos-"*; do
  [[ -f "$f" ]] && chmod +x "$f" 2>/dev/null || true
done
success "Scripts in bin/ made executable"

# ═══════════════════════════════════════════════════════════════════════════════
# 9. Install & enable systemd user services
# ═══════════════════════════════════════════════════════════════════════════════
header "Installing Systemd User Services"

install_systemd_unit() {
  local unit_name="$1" unit_content="$2"
  local systemd_dir="$HOME/.config/systemd/user"
  mkdir -p "$systemd_dir"

  local unit_file="$systemd_dir/$unit_name"
  if [[ -f "$unit_file" ]]; then
    # Check if content matches
    if echo "$unit_content" | diff -q - "$unit_file" &>/dev/null; then
      info "$unit_name: already installed and up to date"
      return
    else
      info "$unit_name: updating..."
    fi
  fi
  echo "$unit_content" > "$unit_file"
  success "$unit_name installed"
}

if $INSTALL_SYSTEMD && command -v systemctl &>/dev/null; then
  # Enable lingering for user services
  sudo loginctl enable-linger "$(whoami)" 2>/dev/null || true

  # ── paos-pipeline.service ──────────────────────────────────────────────
  install_systemd_unit "paos-pipeline.service" "\
[Unit]
Description=PAOS Pipeline Handler — process submitted pipeline jobs
Documentation=https://hermes-agent.nousresearch.com/docs
After=network.target

[Service]
Type=oneshot
ExecStart=$PAOS_HOME/bin/paos-pipeline-handler.sh
Environment=PAOS_HOME=$PAOS_HOME
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
"

  # ── paos-pipeline.path ─────────────────────────────────────────────────
  install_systemd_unit "paos-pipeline.path" "\
[Unit]
Description=PAOS Pipeline Watcher — trigger handler on new pipeline submissions
Documentation=https://hermes-agent.nousresearch.com/docs

[Path]
PathModified=$PAOS_HOME/memory/pipelines/
Unit=paos-pipeline.service

[Install]
WantedBy=default.target
"

  # Reload systemd user daemon
  systemctl --user daemon-reload

  # Enable and start the path unit (this auto-triggers the service unit)
  if systemctl --user is-enabled paos-pipeline.path &>/dev/null; then
    info "paos-pipeline.path already enabled"
  else
    systemctl --user enable paos-pipeline.path
    info "paos-pipeline.path enabled"
  fi

  if systemctl --user is-active paos-pipeline.path &>/dev/null; then
    info "paos-pipeline.path already active"
  else
    systemctl --user start paos-pipeline.path
    info "paos-pipeline.path started"
  fi

  success "Systemd user services installed and enabled"
  info "Check status: systemctl --user status paos-pipeline.path"
else
  if ! $INSTALL_SYSTEMD; then
    info "Skipping systemd setup (--no-systemd)"
  elif ! command -v systemctl &>/dev/null; then
    warn "systemctl not found — skipping systemd service installation"
  fi
  info "Fallback watcher available: bash $PAOS_HOME/bin/paos-pipeline-watch.sh"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 10. Tailscale serve setup
# ═══════════════════════════════════════════════════════════════════════════════
header "Setting Up Tailscale Serve"

TAILSCALE_HOSTNAME=""

if $SETUP_TAILSCALE && command -v tailscale &>/dev/null; then
  if tailscale status 2>/dev/null | grep -q "$(hostname)"; then
    TAILSCALE_HOSTNAME="$(tailscale status --json 2>/dev/null | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    for k,v in d.get('Self', d.get('self', {})).items():
        if isinstance(v, dict) and 'DNSName' in v:
            print(v['DNSName'].rstrip('.'))
            break
except: pass
" 2>/dev/null || true)"
    if [[ -z "$TAILSCALE_HOSTNAME" ]]; then
      TAILSCALE_HOSTNAME="$(tailscale status 2>/dev/null | head -1 | awk '{print $2}')"
    fi

    if [[ -n "$TAILSCALE_HOSTNAME" ]]; then
      # Check if 3333 is already being served
      if tailscale serve status 2>/dev/null | grep -q ":3333"; then
        info "Tailscale serve already forwarding port 3333"
      else
        info "Setting up Tailscale serve for dashboard..."
        tailscale serve --bg --https=443 http://localhost:3333 2>&1 || \
          tailscale serve --bg http://localhost:3333 2>&1 || \
          warn "Could not configure Tailscale serve (may need --accept-routes or root)"
        success "Tailscale serve configured"
      fi
      success "Tailscale hostname: $TAILSCALE_HOSTNAME"
    else
      warn "Tailscale connected but couldn't determine hostname"
    fi
  else
    info "Tailscale is installed but not connected."
    info "Run 'sudo tailscale up' to connect, then re-run this script."
    info "Or set up manually: tailscale serve --bg --https=443 http://localhost:3333"
  fi
else
  if ! $SETUP_TAILSCALE; then
    info "Skipping Tailscale setup (--no-tailscale)"
  elif ! command -v tailscale &>/dev/null; then
    warn "tailscale CLI not found — skipping Tailscale serve setup"
    info "Install: curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up"
  fi
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 11. Start dashboard dev server
# ═══════════════════════════════════════════════════════════════════════════════
header "Starting Dashboard Dev Server"

if lsof -i :3333 -P -n 2>/dev/null | grep -q LISTEN; then
  info "Port 3333 is already in use — dashboard may already be running"
  # Show what's listening
  lsof -i :3333 -P -n 2>/dev/null | head -3 || true
else
  if [[ -d "$PAOS_HOME/dashboard/node_modules" ]] && [[ -f "$PAOS_HOME/dashboard/package.json" ]]; then
    info "Starting dashboard dev server on port 3333..."
    cd "$PAOS_HOME/dashboard"
    # Launch in background, capture PID
    nohup npm run dev -- --port 3333 > "$PAOS_HOME/logs/dashboard.log" 2>&1 &
    DASH_PID=$!
    success "Dashboard dev server starting (PID: $DASH_PID)"

    # Wait a moment and check if it's actually running
    sleep 3
    if kill -0 "$DASH_PID" 2>/dev/null; then
      info "Dashboard process is running"
    else
      warn "Dashboard process exited — check logs: tail -30 $PAOS_HOME/logs/dashboard.log"
    fi
    cd "$PAOS_HOME"
  else
    warn "Dashboard dependencies not installed — cannot start dev server"
    warn "Run: cd $PAOS_HOME/dashboard && npm install && npm run dev"
  fi
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 12. Vault symlinks
# ═══════════════════════════════════════════════════════════════════════════════
header "Verifying Vault Symlinks"

if [[ -L "$PAOS_HOME/vault/memory" ]]; then
  info "vault/memory → $(readlink "$PAOS_HOME/vault/memory")"
else
  info "Creating vault/memory symlink..."
  ln -sf "../memory" "$PAOS_HOME/vault/memory"
  success "vault/memory → memory"
fi

if [[ -L "$PAOS_HOME/vault/knowledge" ]]; then
  info "vault/knowledge → $(readlink "$PAOS_HOME/vault/knowledge")"
else
  info "Creating vault/knowledge symlink..."
  ln -sf "../knowledge" "$PAOS_HOME/vault/knowledge"
  success "vault/knowledge → knowledge"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 13. Log install to global ledger
# ═══════════════════════════════════════════════════════════════════════════════
header "Logging Installation"

GLOBAL_LEDGER="$PAOS_HOME/memory/global_ledger.md"
mkdir -p "$(dirname "$GLOBAL_LEDGER")"
if [[ ! -f "$GLOBAL_LEDGER" ]]; then
  cat > "$GLOBAL_LEDGER" << 'LEDGER'
# Global Audit Ledger — Aggregated

| Timestamp (UTC) | Agent | Action | File | Description | Task | Commit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
LEDGER
fi

echo "$START_TS | paos-install | INSTALL | bin/install-paos.sh | PAOS bootstrap install completed | - | -" >> "$GLOBAL_LEDGER"
success "Installation logged to global_ledger.md"

# ═══════════════════════════════════════════════════════════════════════════════
# Done!
# ═══════════════════════════════════════════════════════════════════════════════
header "Installation Complete"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       ${BOLD}PAOS Bootstrap Install Complete!${NC}${GREEN}                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}📋 Summary${NC}"
echo ""

echo -e "  ${CYAN}📁${NC} ${BOLD}PAOS Home:${NC}     $PAOS_HOME"
echo ""

if [[ -n "$API_TOKEN" ]]; then
  echo -e "  ${CYAN}🔑${NC} ${BOLD}API Token:${NC}      ${YELLOW}$API_TOKEN${NC}"
  echo -e "       ${BOLD}Auth Header:${NC}  ${YELLOW}Authorization: Bearer ${API_TOKEN}${NC}"
  echo ""
fi

echo -e "  ${CYAN}🌐${NC} ${BOLD}Dashboard URLs:${NC}"
echo -e "       Local:              ${CYAN}http://localhost:3333${NC}"

if [[ -n "$TAILSCALE_HOSTNAME" ]]; then
  echo -e "       Tailscale:          ${CYAN}https://${TAILSCALE_HOSTNAME}${NC}"
  echo -e "       Tailscale HTTPS:    ${CYAN}https://${TAILSCALE_HOSTNAME}:443${NC}"
fi

TAILSCALE_IP=""
TAILSCALE_IP="$(tailscale ip -4 2>/dev/null || true)"
if [[ -n "$TAILSCALE_IP" ]]; then
  echo -e "       Tailscale IP:       ${CYAN}http://${TAILSCALE_IP}:3333${NC}"
fi
echo ""

echo -e "  ${CYAN}⚙${NC}  ${BOLD}Systemd Services:${NC}"
if $INSTALL_SYSTEMD && command -v systemctl &>/dev/null; then
  echo -e "       paos-pipeline.path    $(systemctl --user is-active paos-pipeline.path 2>/dev/null || echo 'inactive')"
  echo -e "       paos-pipeline.service $(systemctl --user is-active paos-pipeline.service 2>/dev/null || echo 'inactive')"
fi
echo ""

echo -e "  ${CYAN}📝${NC} ${BOLD}Next Steps:${NC}"
echo ""
echo -e "       1. ${BOLD}Add API keys:${NC}"
echo -e "          ${YELLOW}  nano $PAOS_HOME/config/secrets/.env${NC}"
echo ""
echo -e "       2. ${BOLD}Start dashboard (if not running):${NC}"
echo -e "          ${YELLOW}  cd $PAOS_HOME/dashboard && npm run dev${NC}"
echo -e "          ${CYAN}  → http://localhost:3333${NC}"
echo ""
echo -e "       3. ${BOLD}Tailscale (if not connected):${NC}"
echo -e "          ${YELLOW}  sudo tailscale up${NC}"
echo -e "          ${YELLOW}  tailscale serve --bg --https=443 http://localhost:3333${NC}"
echo ""
echo -e "       4. ${BOLD}Verify pipeline watcher:${NC}"
echo -e "          ${YELLOW}  systemctl --user status paos-pipeline.path${NC}"
echo -e "          ${YELLOW}  journalctl --user -u paos-pipeline.service -n 10${NC}"
echo ""
echo -e "       5. ${BOLD}Firewall (UFW):${NC}"
echo -e "          ${YELLOW}  sudo ufw allow 3333/tcp${NC}"
echo -e "          ${YELLOW}  sudo ufw allow 443/tcp${NC}"
echo ""
echo -e "  ${CYAN}🔍${NC} ${BOLD}Logs:${NC}"
echo -e "       Dashboard:  ${YELLOW}tail -f $PAOS_HOME/logs/dashboard.log${NC}"
echo -e "       Pipeline:   ${YELLOW}journalctl --user -u paos-pipeline.service -f${NC}"
echo ""

echo -e "${GREEN}✅ PAOS is ready. Happy agentic computing! 🚀${NC}"
echo ""
