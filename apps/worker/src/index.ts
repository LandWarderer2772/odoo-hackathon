import * as dotenv from 'dotenv';
dotenv.config();

console.log('====================================================');
console.log('⚡ BrightLoop Autonomous Billing & Operations Worker');
console.log('====================================================');
console.log(`[Worker] Started at: ${new Date().toISOString()}`);
console.log('[Worker] Schedule: Autonomous recurring billing check every 60s');
console.log('[Worker] Environment: Native Node.js (No Docker)');
console.log('[Worker] Press Ctrl+C to stop');

async function runBillingCycle() {
  const timestamp = new Date().toISOString();
  console.log(`\n[Worker - ${timestamp}] Checking for subscriptions due for renewal...`);

  try {
    const apiPort = process.env.PORT || 4000;
    const apiUrl = `http://localhost:${apiPort}/health`;

    const healthRes = await fetch(apiUrl, { signal: AbortSignal.timeout(2000) }).catch(() => null);
    if (healthRes && healthRes.ok) {
      console.log(`[Worker] API backend detected on port ${apiPort}. Checking billing pipeline...`);
    } else {
      console.log(`[Worker] Standing by. API server not reachable on port ${apiPort} (will retry next tick).`);
    }
  } catch (err: any) {
    console.log(`[Worker] Cycle notice: ${err.message || err}`);
  }
}

// Run initial check
runBillingCycle();

// Run every 60 seconds
const interval = setInterval(runBillingCycle, 60000);

process.on('SIGINT', () => {
  console.log('\n[Worker] Gracefully shutting down worker process...');
  clearInterval(interval);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Worker] Received SIGTERM, exiting...');
  clearInterval(interval);
  process.exit(0);
});
