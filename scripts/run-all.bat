@echo off
echo ====================================================
echo Starting All BrightLoop Services (No Docker)
echo ====================================================
echo 1. Web Portal:  http://localhost:3000
echo 2. REST API:    http://localhost:4000
echo 3. Worker:      Autonomous Recurring Billing Loop
echo ====================================================
npm run dev:all
