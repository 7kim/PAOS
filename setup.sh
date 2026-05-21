#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# PAOS — One-Command Setup
# Usage: bash setup.sh
#        bash setup.sh --docker      # Docker mode (no prompts)
#        bash setup.sh --native      # Native install (no prompts)
#        bash setup.sh --vps         # VPS / headless Docker mode
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[PAOS]${NC} $*"; }
success() { echo -e "${GREEN}[PAOS] ✓${NC} $*"; }
warn()    { echo -e "${YELLOW}[PAOS] !${NC} $*"; }
fail()    { echo -e "${RED}[PAOS] ✗${NC} $*"; exit 1; }
header()  { echo -e "\n${BOLD}${CYAN}── $* ──${NC}"; }

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║   PAOS — Personal Agent Operating System                     ║${NC}"
echo -e "${CYAN}║   Multi-Agent AI Orchestration Hub                           ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Three-Tier Ecosystem:                                       ║${NC}"
echo -e "${CYAN}║  • PAOS (this repo)       — Core orchestration hub          ║${NC}"
echo -e "${CYAN}║  • PAOS-WEB (port 3334)   — Customer-facing app builder     ║${NC}"
echo -e "${CYAN}║  • PAOS-VPS               — Remote agent coordination       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ── Parse args ────────────────────────────────────────────────────────────────
MODE=""
for arg in "$@"; do
  case "$arg" in
    --docker) MODE="docker" ;;
    --native) MODE="native" ;;
    --vps)    MODE="vps"    ;;
  esac
done

OS="$(uname -s)"

# ── Detect Docker ─────────────────────────────────────────────────────────────
has_docker() { command -v docker &>/dev/null && docker info &>/dev/null 2>&1; }

# ── Mode selection ────────────────────────────────────────────────────────────
if [[ -z "$MODE" ]]; then
  echo -e "${BOLD}How would you like to run PAOS?${NC}"
  echo ""
  echo "  [1] Docker   — Dashboard + MCP server in a container (recommended)"
  echo "  [2] Native   — Install agents directly on this machine"
  echo ""
  read -r -p "Enter 1 or 2: " choice
  case "$choice" in
    1) MODE="docker" ;;
    2) MODE="native" ;;
    *) fail "Invalid choice. Run: bash setup.sh --docker  or  bash setup.sh --native" ;;
  esac
fi

# ─────────────────────────────────────────────────────────────────────────────
# DOCKER MODE
# ─────────────────────────────────────────────────────────────────────────────
if [[ "$MODE" == "docker" || "$MODE" == "vps" ]]; then

  header "Docker Setup"

  # Check Docker
  if ! command -v docker &>/dev/null; then
    if [[ "$OS" == "Linux" ]]; then
      info "Docker not found — installing Docker Engine..."
      curl -fsSL https://get.docker.com | sh
      sudo usermod -aG docker "$USER"
      warn "You may need to log out and back in for Docker group to take effect."
      warn "If 'docker compose up' fails with permission denied, run: newgrp docker"
    else
      fail "Docker not found. Install Docker Desktop from https://docs.docker.com/get-docker/ then re-run setup.sh"
    fi
  else
    success "Docker $(docker --version | awk '{print $3}' | tr -d ',')"
  fi

  # Check docker compose (v2)
  if ! docker compose version &>/dev/null 2>&1; then
    fail "Docker Compose v2 not found. Update Docker Desktop or install the compose plugin: https://docs.docker.com/compose/install/"
  fi
  success "Docker Compose $(docker compose version --short 2>/dev/null || echo 'v2')"

  # Secrets
  SECRETS_FILE="${REPO_ROOT}/docker/secrets.env"
  if [[ ! -f "$SECRETS_FILE" ]]; then
    info "Creating secrets file from template..."
    cp "${REPO_ROOT}/docker/secrets.env.template" "$SECRETS_FILE"
    echo ""
    echo -e "${YELLOW}┌──────────────────────────────────────────────────────┐${NC}"
    echo -e "${YELLOW}│  ACTION REQUIRED: Fill in your API keys               │${NC}"
    echo -e "${YELLOW}│                                                        │${NC}"
    echo -e "${YELLOW}│  nano ${SECRETS_FILE}              │${NC}"
    echo -e "${YELLOW}│                                                        │${NC}"
    echo -e "${YELLOW}│  Keys needed:                                          │${NC}"
    echo -e "${YELLOW}│    ANTHROPIC_API_KEY  (console.anthropic.com)          │${NC}"
    echo -e "${YELLOW}│    OPENAI_API_KEY     (platform.openai.com)            │${NC}"
    echo -e "${YELLOW}│    GOOGLE_API_KEY     (aistudio.google.com)            │${NC}"
    echo -e "${YELLOW}└──────────────────────────────────────────────────────┘${NC}"
    echo ""
    if [[ "$MODE" != "vps" ]]; then
      read -r -p "Press Enter after filling in your keys to continue (or Ctrl+C to exit)..."
    else
      warn "VPS mode: continuing without waiting. Edit docker/secrets.env before docker compose up."
    fi
  else
    success "Secrets file exists at docker/secrets.env"
  fi

  # Build and start
  header "Building and Starting PAOS"
  cd "${REPO_ROOT}"
  info "Building Docker image (this takes ~2 minutes on first run)..."
  docker compose build
  info "Starting PAOS Hub..."
  docker compose up -d

  # Health check
  info "Waiting for dashboard to be ready..."
  for i in $(seq 1 12); do
    if curl -sf http://localhost:3333/api/overview &>/dev/null; then
      break
    fi
    sleep 5
  done

  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║   PAOS Hub is running!                               ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "  Dashboard:  ${CYAN}http://localhost:3333${NC}"
  echo ""
  echo -e "  Useful commands:"
  echo -e "    ${YELLOW}docker compose logs -f${NC}         # View logs"
  echo -e "    ${YELLOW}docker compose restart${NC}         # Restart"
  echo -e "    ${YELLOW}docker compose down${NC}            # Stop"
  echo -e "    ${YELLOW}docker compose up -d --build${NC}   # Rebuild + restart"
  echo ""
  echo -e "  Agent MCP configs are at:"
  echo -e "    ${YELLOW}${REPO_ROOT}/mcp/mcp-config.json${NC} (unified registry)"
  echo ""
  echo -e "  Cross-agent chat syncing:"
  echo -e "    ${YELLOW}python3 ${REPO_ROOT}/bin/sync-chat.py${NC}"
  echo ""
  echo -e "  ${BOLD}Companion Projects:${NC}"
  echo -e "  • ${CYAN}PAOS-WEB${NC} — Customer-facing app at ~/Documents/Dev/PAOS-WEB/"
  echo -e "    (run its setup.sh to install: the web interface for pipeline submission)"
  echo -e "  • ${CYAN}PAOS-VPS${NC} — Remote agent coordination at ~/Documents/Dev/PAOS-VPS/"
  echo -e "    (future: deploy agents to a VPS via encrypted tunnel)"
  echo ""

# ─────────────────────────────────────────────────────────────────────────────
# NATIVE MODE
# ─────────────────────────────────────────────────────────────────────────────
elif [[ "$MODE" == "native" ]]; then

  header "Native Install"

  case "$OS" in
    Linux)
      info "Running Ubuntu/Debian installer..."
      bash "${REPO_ROOT}/install-ubuntu.sh"
      ;;
    Darwin)
      info "Running macOS installer..."
      bash "${REPO_ROOT}/install-mac.sh"
      ;;
    MINGW*|MSYS*|CYGWIN*)
      info "Running Windows installer..."
      powershell -ExecutionPolicy Bypass -File "${REPO_ROOT}/install-windows.ps1"
      ;;
    *)
      fail "Unsupported OS: $OS. Please follow the manual install steps in README.md."
      ;;
  esac

  # ── Ecosystem info ──────────────────────────────────────────────────────────
  echo ""
  echo -e "${BOLD}${CYAN}── PAOS Ecosystem ──${NC}"
  echo ""
  echo -e "  ${GREEN}✓${NC} ${BOLD}PAOS${NC} core installed at:    ${REPO_ROOT}"
  echo ""
  echo "  Companion projects (separate repos):"
  echo ""
  echo "  • PAOS-WEB — Customer-facing app builder"
  echo "    ${YELLOW}~/Documents/Dev/PAOS-WEB/${NC}"
  echo "    Setup: cd ~/Documents/Dev/PAOS-WEB && bash setup.sh"
  echo "    → Web interface at ${CYAN}http://localhost:3334${NC}"
  echo ""
  echo "  • PAOS-VPS — Remote agent coordination"
  echo "    ${YELLOW}~/Documents/Dev/PAOS-VPS/${NC}"
  echo "    Setup: cd ~/Documents/Dev/PAOS-VPS && bash setup.sh"
  echo "    → Future: VPS agent daemon + encrypted tunnel"
  echo ""

fi
