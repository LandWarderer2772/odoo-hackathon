#!/bin/bash
echo "===================================================="
echo "BrightLoop Database Migration & Seed Runner"
echo "===================================================="
echo "Target: DATABASE_URL from .env"
npm run db:generate
npm run db:push
npm run db:seed
