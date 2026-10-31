@echo off
echo ====================================================
echo Starting All BrightLoop Services (No Docker)
echo ====================================================
echo 1. Database:    Native PostgreSQL on port 5432
echo 2. REST API:    http://localhost:4000
echo 3. Web Portal:  http://localhost:3000
echo 4. Worker:      Autonomous Recurring Billing Loop
echo ====================================================

:: Check if PostgreSQL is already active on port 5432
netstat -ano | findstr /R /C:":5432 " >nul
if %errorlevel% neq 0 (
  echo [Info] PostgreSQL not detected on port 5432. Launching database engine...
  start "BrightLoop PostgreSQL Database" cmd /k "npx tsx scripts/start-db.ts"
  timeout /t 3 /nobreak >nul
) else (
  echo [Info] PostgreSQL database is already running on port 5432.
)

npm run dev:all
