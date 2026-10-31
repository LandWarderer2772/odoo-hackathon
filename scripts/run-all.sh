#!/usr/bin/env bash
echo "===================================================="
echo "Starting All BrightLoop Services (No Docker)"
echo "===================================================="
echo "1. Database:    Native PostgreSQL on port 5432"
echo "2. REST API:    http://localhost:4000"
echo "3. Web Portal:  http://localhost:3000"
echo "4. Worker:      Autonomous Recurring Billing Loop"
echo "===================================================="

if ! nc -z localhost 5432 2>/dev/null && ! timeout 1 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/5432" 2>/dev/null; then
  echo "[Info] PostgreSQL not detected on port 5432. Launching database engine in background..."
  npx tsx scripts/start-db.ts &
  sleep 3
else
  echo "[Info] PostgreSQL database is already running on port 5432."
fi

npm run dev:all
