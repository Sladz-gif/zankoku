@echo off
echo Starting Zankoku Development Server...
echo.
echo ========================================
echo    ZANKOKU - DEV MODE
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo Please install npm from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js and npm detected!
echo.
echo Installing dependencies...
npm install

echo.
echo Starting development server...
echo Server will be available at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
npm run dev

pause
