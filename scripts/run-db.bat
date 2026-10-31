@echo off
echo ====================================================
echo Starting BrightLoop Native PostgreSQL Server
echo ====================================================
echo Database: postgresql://brightloop:brightloop_secret@localhost:5432/brightloop_db
echo ====================================================
npx tsx scripts/start-db.ts
