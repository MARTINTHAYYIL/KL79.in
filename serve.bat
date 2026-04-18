@echo off
REM ============================================================
REM  KL79.in  -  Local Development Server
REM ------------------------------------------------------------
REM  Double-click this file to preview the website on your PC.
REM  It will try Python first, then Node.js.
REM ============================================================

cd /d "%~dp0"

echo.
echo =========================================================
echo   KL79.in - Local Development Server
echo =========================================================
echo.
echo   After the server starts, open this address in your
echo   web browser:
echo.
echo       http://localhost:8080
echo.
echo   Press Ctrl+C in this window to stop the server.
echo =========================================================
echo.

REM --- Try Python 3 first ------------------------------------
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Using Python] Starting server on port 8080...
    echo.
    python -m http.server 8080
    goto :eof
)

REM --- Try "py" launcher (Windows Python) --------------------
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Using py launcher] Starting server on port 8080...
    echo.
    py -m http.server 8080
    goto :eof
)

REM --- Try Node.js http-server -------------------------------
where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Using Node/npx] Starting server on port 8080...
    echo.
    npx --yes http-server -p 8080 -c-1
    goto :eof
)

echo.
echo =========================================================
echo   ERROR: Neither Python nor Node.js was found.
echo ---------------------------------------------------------
echo   Please install one of these (Python is easiest):
echo.
echo     Python:  https://www.python.org/downloads/
echo              (Tick "Add Python to PATH" during install)
echo.
echo     Node.js: https://nodejs.org/
echo =========================================================
echo.
pause
