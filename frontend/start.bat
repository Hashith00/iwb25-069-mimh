@echo off
echo Starting Green Proxy Frontend Dashboard...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting development server on http://localhost:3001
echo.
echo Make sure the Green Proxy backend is running on port 8080
echo.

call npm run dev
