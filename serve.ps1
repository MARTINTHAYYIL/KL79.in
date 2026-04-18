# KL79.in - Local Development Server (PowerShell version)
# Right-click -> Run with PowerShell

Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host "  KL79.in - Local Development Server" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Open this address in your browser:"
Write-Host "      http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C here to stop the server."
Write-Host "=========================================================" -ForegroundColor Green
Write-Host ""

function Test-Cmd($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

if (Test-Cmd python) {
    Write-Host "[Using Python] Starting on port 8080..." -ForegroundColor Yellow
    python -m http.server 8080
}
elseif (Test-Cmd py) {
    Write-Host "[Using py launcher] Starting on port 8080..." -ForegroundColor Yellow
    py -m http.server 8080
}
elseif (Test-Cmd npx) {
    Write-Host "[Using Node/npx] Starting on port 8080..." -ForegroundColor Yellow
    npx --yes http-server -p 8080 -c-1
}
else {
    Write-Host ""
    Write-Host "ERROR: Neither Python nor Node.js was found on your PC." -ForegroundColor Red
    Write-Host "Install Python from https://www.python.org/downloads/"
    Write-Host "(Tick 'Add Python to PATH' during install.)"
    Write-Host ""
    Read-Host "Press Enter to close"
}
