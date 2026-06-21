@echo off
cd /d "%~dp0"

:: Check if node is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org
    pause
    exit /b 1
)

:: Install dependencies if node_modules is missing
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

:: Start server in background and open browser after short delay
echo Starting AI Resume Reviewer...
start "" /b node server.js

:: Wait 2 seconds for server to start, then open browser
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

exit
