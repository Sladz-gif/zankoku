@echo off
echo ========================================
echo    ZANKOKU - INSTALL AND RUN
echo ========================================
echo.

REM Set execution policy for this session
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process"

echo Installing dependencies...
powershell -Command "npm install"

echo.
echo Starting development server...
echo Server will be available at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

powershell -Command "npm run dev"

pause
