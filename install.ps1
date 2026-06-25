# PAOS — Windows Installer
# Run as Administrator: powershell -ExecutionPolicy Bypass -File install.ps1

Write-Host "==============================" -ForegroundColor Cyan
Write-Host " PAOS — Windows Installer" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`n[1/4] Checking prerequisites..." -ForegroundColor Yellow

$hasNode = Get-Command node -ErrorAction SilentlyContinue
$hasNpm = Get-Command npm -ErrorAction SilentlyContinue
$hasGit = Get-Command git -ErrorAction SilentlyContinue

if (-not $hasNode) {
    Write-Host "Node.js not found. Download from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}
if (-not $hasGit) {
    Write-Host "Git not found. Download from: https://git-scm.com/" -ForegroundColor Red
    exit 1
}
Write-Host "All prerequisites found." -ForegroundColor Green

# Clone repository
Write-Host "`n[2/4] Setting up repository..." -ForegroundColor Yellow
$repoPath = "$env:USERPROFILE\AI_Workflow"
if (Test-Path $repoPath) {
    Write-Host "AI_Workflow exists, pulling latest..." -ForegroundColor Yellow
    Set-Location $repoPath
    git pull
} else {
    Write-Host "Cloning AI_Workflow..." -ForegroundColor Yellow
    git clone https://github.com/7kim/AI_Workflow.git $repoPath
    Set-Location $repoPath
}

# Install dependencies
Write-Host "`n[3/4] Installing Node dependencies..." -ForegroundColor Yellow
Set-Location "$repoPath\dashboard"
npm install
Write-Host "Dependencies installed." -ForegroundColor Green

# Environment setup
Write-Host "`n[4/4] Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
    Write-Host "Created .env file. Edit it with your API keys." -ForegroundColor Yellow
} else {
    Write-Host ".env already exists."
}

# Create directories
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\AI_Workflow\memory\pipelines" | Out-Null
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\AI_Workflow\memory\metrics" | Out-Null
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\AI_Workflow\memory\config" | Out-Null

Write-Host "`n==============================" -ForegroundColor Green
Write-Host " PAOS is ready!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "Quick start:"
Write-Host "  cd $env:USERPROFILE\AI_Workflow\dashboard"
Write-Host "  npx next dev --port 3333"
Write-Host ""
Write-Host "Open http://localhost:3333 in your browser."
