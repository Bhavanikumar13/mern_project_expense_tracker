@echo off
echo Checking backend server status...

netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo [OK] Backend server is running on port 5000
    echo Starting frontend only...
    cd client
    npm run dev
) else (
    echo [WARNING] Backend server is NOT running!
    echo Starting both frontend and backend...
    npm run dev-all
)
