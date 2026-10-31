#!/usr/bin/env bash
echo "===================================================="
echo "BrightLoop Database Migration & Seed Runner"
echo "===================================================="
echo "Target: DATABASE_URL from .env"

if ! nc -z localhost 5432 2>/dev/null && ! timeout 1 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/5432" 2>/dev/null; then
  echo "[Info] PostgreSQL not detected on port 5432. Launching database engine in background..."
  npx tsx scripts/start-db.ts &
  sleep 4
fi

npm run db:generate
npm run db:push
npm run db:seed
