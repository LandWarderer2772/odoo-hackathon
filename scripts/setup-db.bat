@echo off
echo ====================================================
echo BrightLoop Database Migration & Seed Runner
echo ====================================================
echo Target: DATABASE_URL from .env

netstat -ano | findstr /R /C:":5432 " >nul
if %errorlevel% neq 0 (
  echo [Info] PostgreSQL not detected on port 5432. Launching database engine...
  start "BrightLoop PostgreSQL Database" cmd /k "npx tsx scripts/start-db.ts"
  timeout /t 4 /nobreak >nul
)

npm run db:generate
npm run db:push
npm run db:seed
