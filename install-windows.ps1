# ─────────────────────────────────────────────────────────────────────────────
# PAOS — Windows Install Script (PowerShell)
# Usage (Run as Administrator):
#   irm https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-windows.ps1 | iex
# Or locally:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\install-windows.ps1
# ─────────────────────────────────────────────────────────────────────────────
#Requires -Version 5.1

$ErrorActionPreference = "Stop"
$REPO_URL = "https://github.com/7kim/AI_Workflow.git"
$INSTALL_DIR = "$env:USERPROFILE\AI_Workflow"
$LOCAL_BIN = "$env:USERPROFILE\.local\bin"

function Write-Info   { param($msg) Write-Host "[PAOS] $msg" -ForegroundColor Cyan }
function Write-OK     { param($msg) Write-Host "[PAOS] OK  $msg" -ForegroundColor Green }
function Write-Warn   { param($msg) Write-Host "[PAOS] !  $msg" -ForegroundColor Yellow }
function Write-Fail   { param($msg) Write-Host "[PAOS] X  $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PAOS — Personal Agent Operating System         ║" -ForegroundColor Cyan
Write-Host "║   Windows Installer                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Detect Windows ────────────────────────────────────────────────────────────
if ($env:OS -ne "Windows_NT") {
    Write-Fail "This script is for Windows only. Use install-ubuntu.sh or install-mac.sh on Linux/macOS."
}

# ── WSL2 Check ────────────────────────────────────────────────────────────────
$wslAvailable = $false
try {
    $wslOutput = wsl --status 2>&1
    $wslAvailable = $true
} catch {}

Write-Host ""
Write-Host "PAOS works in two ways on Windows:" -ForegroundColor Yellow
Write-Host "  [1] WSL2 (Ubuntu) — RECOMMENDED — full bash support, best experience"
Write-Host "  [2] Native Windows — PowerShell only, limited bash script support"
Write-Host ""

if ($wslAvailable) {
    Write-Host "WSL2 is available on this machine." -ForegroundColor Green
    $choice = Read-Host "Install via WSL2? (Y/n)"
    if ($choice -ne "n" -and $choice -ne "N") {
        Write-Info "Launching Ubuntu install script inside WSL2..."
        wsl bash -c "bash <(curl -fsSL https://raw.githubusercontent.com/7kim/AI_Workflow/master/install-ubuntu.sh)"
        Write-Host ""
        Write-OK "PAOS installed inside WSL2. To use it:"
        Write-Host "  1. Open Ubuntu from Start Menu (or run 'wsl' in PowerShell)"
        Write-Host "  2. Run: cd ~/AI_Workflow && ./bin/test-agents.sh"
        Write-Host "  3. Start dashboard: cd ~/AI_Workflow/dashboard && npm run dev"
        Write-Host "     → http://localhost:3333"
        exit 0
    }
} else {
    Write-Warn "WSL2 not found. Installing native Windows support."
    Write-Warn "For the best experience, install WSL2 first:"
    Write-Warn "  wsl --install"
    Write-Warn "  Then re-run this script."
    Write-Host ""
}

# ─────────────────────────────────────────────────────────────────────────────
# NATIVE WINDOWS INSTALL
# ─────────────────────────────────────────────────────────────────────────────

# ── 1. Check for winget ───────────────────────────────────────────────────────
$hasWinget = $false
try { winget --version | Out-Null; $hasWinget = $true } catch {}

# ── 2. Git ────────────────────────────────────────────────────────────────────
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Info "Installing Git..."
    if ($hasWinget) {
        winget install --id Git.Git -e --source winget --silent
    } else {
        Write-Warn "winget not available. Download Git from: https://git-scm.com/download/win"
        Write-Warn "Install Git then re-run this script."
        Pause
    }
    # Refresh PATH
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
} else {
    Write-OK "Git already installed ($(git --version))"
}

# ── 3. Node.js ────────────────────────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Info "Installing Node.js 20..."
    if ($hasWinget) {
        winget install --id OpenJS.NodeJS.LTS -e --source winget --silent
    } else {
        Write-Warn "winget not available. Download Node.js from: https://nodejs.org/en/download/"
        Write-Warn "Install Node.js LTS then re-run this script."
        Pause
    }
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
} else {
    Write-OK "Node.js already installed ($(node --version))"
}

# ── 4. Clone repository ───────────────────────────────────────────────────────
if (Test-Path $INSTALL_DIR) {
    Write-Warn "$INSTALL_DIR already exists — pulling latest changes"
    git -C $INSTALL_DIR pull origin master 2>$null
} else {
    Write-Info "Cloning PAOS to $INSTALL_DIR..."
    git clone $REPO_URL $INSTALL_DIR
    Write-OK "Cloned to $INSTALL_DIR"
}

Set-Location $INSTALL_DIR

# ── 5. Update paths ───────────────────────────────────────────────────────────
Write-Info "Updating REPO_ROOT paths to $INSTALL_DIR (Windows-style)..."
$winPath = $INSTALL_DIR -replace '\\', '/'
$files = Get-ChildItem -Recurse -Include "*.json","*.js" -Exclude "node_modules","*.git" -File
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        if ($content -match '/home/dev/AI_Workflow') {
            $content = $content -replace '/home/dev/AI_Workflow', $winPath
            Set-Content $file.FullName $content
        }
    } catch {}
}
Write-OK "Paths updated"

# ── 6. Install MCP server deps ────────────────────────────────────────────────
Write-Info "Installing MCP server dependencies..."
Set-Location "$INSTALL_DIR\mcp\shared-memory-server"
npm install --silent
Write-OK "MCP server ready"

# ── 7. Install dashboard deps ──────────────────────────────────────────────────
Write-Info "Installing dashboard dependencies..."
Set-Location "$INSTALL_DIR\dashboard"
npm install --silent
Write-OK "Dashboard ready"

Set-Location $INSTALL_DIR

# ── 8. Install Claude Code ────────────────────────────────────────────────────
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Info "Installing Claude Code..."
    try {
        npm install -g @anthropic-ai/claude-code 2>$null
        Write-OK "Claude Code installed"
    } catch {
        Write-Warn "Claude Code install failed — run: npm install -g @anthropic-ai/claude-code"
    }
} else {
    Write-OK "Claude Code already installed"
}

# ── 9. Install OpenAI Codex ────────────────────────────────────────────────────
if (-not (Get-Command codex -ErrorAction SilentlyContinue)) {
    Write-Info "Installing OpenAI Codex..."
    try {
        npm install -g @openai/codex 2>$null
        Write-OK "Codex installed"
    } catch {
        Write-Warn "Codex install failed — run: npm install -g @openai/codex"
    }
} else {
    Write-OK "Codex already installed"
}

# ── 10. Install OpenClaw ──────────────────────────────────────────────────────
if (-not (Get-Command openclaw -ErrorAction SilentlyContinue)) {
    Write-Info "Installing OpenClaw..."
    try {
        npm install -g openclaw@latest 2>$null
        Write-OK "OpenClaw installed"
    } catch {
        Write-Warn "OpenClaw install failed — run: npm install -g openclaw@latest"
    }
} else {
    Write-OK "OpenClaw already installed ($(openclaw --version 2>&1 | Select-Object -First 1))"
}

# ── 11. Create .env from template ─────────────────────────────────────────────
$envFile = "$INSTALL_DIR\config\secrets\.env"
$envTemplate = "$INSTALL_DIR\config\secrets\.env.template"
if (-not (Test-Path $envFile)) {
    Copy-Item $envTemplate $envFile
    # Update paths for Windows
    $content = Get-Content $envFile -Raw
    $content = $content -replace '/home/dev/AI_Workflow', ($INSTALL_DIR -replace '\\', '/')
    Set-Content $envFile $content
    Write-Warn "Secrets file created at config\secrets\.env — fill in your API keys!"
} else {
    Write-OK "Secrets file already exists"
}

# ── 12. Agent config symlinks (Windows junctions) ─────────────────────────────
Write-Info "Setting up agent config junctions..."

function New-Junction {
    param($target, $link, $name)
    if (Test-Path $link) {
        Remove-Item $link -Force -Recurse 2>$null
    }
    if (Test-Path $target) {
        cmd /c "mklink /J `"$link`" `"$target`"" | Out-Null
        Write-OK "$name → $target"
    } else {
        Write-Warn "$target not found — skipping $name junction"
    }
}

New-Junction "$INSTALL_DIR\config\claude"   "$env:USERPROFILE\.claude"   ".claude"
New-Junction "$INSTALL_DIR\config\codex"    "$env:USERPROFILE\.codex"    ".codex"
New-Junction "$INSTALL_DIR\config\openclaw" "$env:USERPROFILE\.openclaw" ".openclaw"

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   PAOS Installation Complete!                    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Fill in your API keys:"
Write-Host "     notepad $INSTALL_DIR\config\secrets\.env" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Start the dashboard:"
Write-Host "     cd $INSTALL_DIR\dashboard; npm run dev" -ForegroundColor Yellow
Write-Host "     -> http://localhost:3333" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Set up OpenClaw channels (Telegram, WhatsApp, etc.):"
Write-Host "     openclaw onboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "  4. Test all agent git identities (Git Bash or WSL):"
Write-Host "     cd $INSTALL_DIR && bash bin/test-agents.sh" -ForegroundColor Yellow
Write-Host ""
Write-Host "  5. Start Claude Code:"
Write-Host "     claude" -ForegroundColor Yellow
Write-Host ""
Write-Host "Windows Note:" -ForegroundColor Yellow
Write-Host "  Agent scripts (bin/*.sh) require Git Bash or WSL2 to run."
Write-Host "  Dashboard and MCP server work natively with Node.js."
Write-Host ""
Write-Host "Documentation: $INSTALL_DIR\README.md" -ForegroundColor Cyan
Write-Host ""
