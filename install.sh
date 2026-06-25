#!/bin/bash
# PAOS Installer — Ubuntu / Debian
# Run: bash install.sh

set -e

echo "=============================="
echo " PAOS — Ubuntu Installer"
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "\n${YELLOW}[1/6] Checking prerequisites...${NC}"

for cmd in git curl node npm python3; do
    if ! command -v $cmd &>/dev/null; then
        echo -e "${RED}Missing: $cmd${NC}"
        echo "Installing..."
        sudo apt update && sudo apt install -y $cmd
    fi
done
echo -e "${GREEN}All prerequisites found.${NC}"

# Clone / pull
echo -e "\n${YELLOW}[2/6] Setting up repository...${NC}"
if [ -d "$HOME/AI_Workflow" ]; then
    echo "AI_Workflow exists, pulling latest..."
    cd "$HOME/AI_Workflow"
    git pull
else
    echo "Cloning AI_Workflow..."
    git clone https://github.com/7kim/AI_Workflow.git "$HOME/AI_Workflow"
    cd "$HOME/AI_Workflow"
fi

# Install Node dependencies
echo -e "\n${YELLOW}[3/6] Installing Node dependencies...${NC}"
cd "$HOME/AI_Workflow/dashboard"
npm install
echo -e "${GREEN}Dependencies installed.${NC}"

# Environment setup
echo -e "\n${YELLOW}[4/6] Setting up environment...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env 2>/dev/null || true
    echo -e "${YELLOW}Created .env file. Edit it with your API keys.${NC}"
else
    echo ".env already exists."
fi

# Create directories
echo -e "\n${YELLOW}[5/6] Creating data directories...${NC}"
mkdir -p "$HOME/AI_Workflow/memory/pipelines"
mkdir -p "$HOME/AI_Workflow/memory/metrics"
mkdir -p "$HOME/AI_Workflow/memory/config"
mkdir -p "$HOME/AI_Workflow/memory/queue"
mkdir -p "$HOME/AI_Workflow/projects"
mkdir -p "$HOME/AI_Workflow/workspaces"
mkdir -p "$HOME/AI_Workflow/benchmarks"
mkdir -p "$HOME/AI_Workflow/screenshots"
echo -e "${GREEN}Directories created.${NC}"

# Run
echo -e "\n${YELLOW}[6/6] Starting dashboard...${NC}"
echo -e "${GREEN}=============================="
echo " PAOS is ready!"
echo "==============================${NC}"
echo ""
echo "Quick start:"
echo "  cd ~/AI_Workflow/dashboard"
echo "  npx next dev --port 3333"
echo ""
echo "Or run as service:"
echo "  sudo tee /etc/systemd/system/paos-dashboard.service << EOF"
echo "[Unit]"
echo "Description=PAOS Dashboard"
echo "After=network.target"
echo "[Service]"
echo "Type=simple"
echo "User=$USER"
echo "WorkingDirectory=$HOME/AI_Workflow/dashboard"
echo "ExecStart=$(which npx) next start --port 3333"
echo "Restart=always"
echo "[Install]"
echo "WantedBy=multi-user.target"
echo "EOF"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable --now paos-dashboard"
echo ""
echo "Open http://localhost:3333 in your browser."
