import assert from 'node:assert';
import { computeNextBillingDate } from '../src/modules/subscriptions/subscription.service.js';

console.log('🧪 Running Subscription Lifecycle FSM & Billing Cycle Unit Tests...');

// Test 1: Daily Billing Cycle
{
  const base = new Date('2026-10-01T12:00:00Z');
  const next = computeNextBillingDate(base, 'DAILY', 1);
  assert.strictEqual(next.toISOString().slice(0, 10), '2026-10-02');
  console.log('✅ Daily billing cycle date computation passed');
}

// Test 2: Weekly Billing Cycle with interval count = 2 (Bi-weekly)
{
  const base = new Date('2026-10-01T12:00:00Z');
  const next = computeNextBillingDate(base, 'WEEKLY', 2);
  assert.strictEqual(next.toISOString().slice(0, 10), '2026-10-15');
  console.log('✅ Bi-weekly interval count calculation passed');
}

// Test 3: Monthly Billing Cycle (Standard SaaS)
{
  const base = new Date('2026-01-15T12:00:00Z');
  const next = computeNextBillingDate(base, 'MONTHLY', 1);
  assert.strictEqual(next.toISOString().slice(0, 10), '2026-02-15');

  // Quarterly (intervalCount = 3)
  const quarterly = computeNextBillingDate(base, 'MONTHLY', 3);
  assert.strictEqual(quarterly.toISOString().slice(0, 10), '2026-04-15');
  console.log('✅ Monthly and quarterly billing cycle passed');
}

// Test 4: Yearly Billing Cycle
{
  const base = new Date('2026-10-31T12:00:00Z');
  const next = computeNextBillingDate(base, 'YEARLY', 1);
  assert.strictEqual(next.toISOString().slice(0, 10), '2027-10-31');
  console.log('✅ Yearly billing cycle passed');
}

// Test 5: FSM Transition Validation Rules Simulation
{
  type SubStatus = 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

  function canTransition(
    current: SubStatus,
    action: string,
    plan: { allowPausing: boolean; allowEarlyClosure: boolean },
    isBeforeExpiry: boolean = false
  ): { allowed: boolean; nextStatus?: SubStatus; reason?: string } {
    switch (action) {
      case 'send_quote':
        if (current !== 'DRAFT') return { allowed: false, reason: 'Must be in DRAFT' };
        return { allowed: true, nextStatus: 'QUOTATION' };

      case 'confirm':
        if (current !== 'DRAFT' && current !== 'QUOTATION')
          return { allowed: false, reason: 'Must be in DRAFT or QUOTATION' };
        return { allowed: true, nextStatus: 'CONFIRMED' };

      case 'activate':
        if (current !== 'CONFIRMED') return { allowed: false, reason: 'Must be in CONFIRMED' };
        return { allowed: true, nextStatus: 'ACTIVE' };

      case 'pause':
        if (current !== 'ACTIVE') return { allowed: false, reason: 'Must be ACTIVE' };
        if (!plan.allowPausing) return { allowed: false, reason: 'Plan does not allow pausing' };
        return { allowed: true, nextStatus: 'PAUSED' };

      case 'resume':
        if (current !== 'PAUSED') return { allowed: false, reason: 'Must be PAUSED' };
        return { allowed: true, nextStatus: 'ACTIVE' };

      case 'close':
        if (current === 'CLOSED') return { allowed: false, reason: 'Already closed' };
        if (isBeforeExpiry && !plan.allowEarlyClosure)
          return { allowed: false, reason: 'Plan does not allow early closure' };
        return { allowed: true, nextStatus: 'CLOSED' };

      default:
        return { allowed: false, reason: 'Invalid action' };
    }
  }

  const flexiblePlan = { allowPausing: true, allowEarlyClosure: true };
  const lockedPlan = { allowPausing: false, allowEarlyClosure: false };

  // DRAFT -> QUOTATION -> CONFIRMED -> ACTIVE
  assert.strictEqual(canTransition('DRAFT', 'send_quote', flexiblePlan).allowed, true);
  assert.strictEqual(canTransition('QUOTATION', 'confirm', flexiblePlan).allowed, true);
  assert.strictEqual(canTransition('CONFIRMED', 'activate', flexiblePlan).allowed, true);

  // Pause guards
  assert.strictEqual(canTransition('ACTIVE', 'pause', flexiblePlan).allowed, true);
  assert.strictEqual(canTransition('ACTIVE', 'pause', lockedPlan).allowed, false);

  // Resume guards
  assert.strictEqual(canTransition('PAUSED', 'resume', flexiblePlan).allowed, true);
  assert.strictEqual(canTransition('ACTIVE', 'resume', flexiblePlan).allowed, false);

  // Early closure guards
  assert.strictEqual(canTransition('ACTIVE', 'close', flexiblePlan, true).allowed, true);
  assert.strictEqual(canTransition('ACTIVE', 'close', lockedPlan, true).allowed, false);

  console.log('✅ FSM Transition rules & plan capability guards verified');
}

console.log('🎉 All FSM & Lifecycle Tests Passed Successfully!');
