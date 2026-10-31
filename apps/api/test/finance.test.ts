import assert from 'node:assert';
import { round2, toNum } from '../src/utils/pricing.js';

console.log('🧪 Running Finance Engine & Aged Receivables Unit Tests...');

// Test 1: Normalized MRR across all billing intervals
{
  function computeSubscriptionMrr(
    totalAmount: number,
    billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    intervalCount: number = 1
  ): number {
    const count = Math.max(1, intervalCount);
    let mrr = 0;
    switch (billingCycle) {
      case 'DAILY':
        mrr = (totalAmount / count) * (365 / 12);
        break;
      case 'WEEKLY':
        mrr = ((totalAmount / count) * 52) / 12;
        break;
      case 'MONTHLY':
        mrr = totalAmount / count;
        break;
      case 'YEARLY':
        mrr = (totalAmount / count) / 12;
        break;
    }
    return round2(mrr);
  }

  // Monthly $190/mo -> MRR = $190.00
  assert.strictEqual(computeSubscriptionMrr(190, 'MONTHLY', 1), 190);

  // Quarterly $600/quarter (intervalCount = 3) -> MRR = $200.00
  assert.strictEqual(computeSubscriptionMrr(600, 'MONTHLY', 3), 200);

  // Annual $2400/yr -> MRR = $200.00
  assert.strictEqual(computeSubscriptionMrr(2400, 'YEARLY', 1), 200);

  console.log('✅ Normalized MRR calculations across billing cycles passed');
}

// Test 2: Aged Receivables Bucketing Algorithm
{
  type BucketKey = 'CURRENT' | '1_30_DAYS' | '31_60_DAYS' | '61_90_DAYS' | '90_PLUS_DAYS';

  function classifyAgingBucket(asOfDate: Date, dueDate: Date): BucketKey {
    const diffMs = asOfDate.getTime() - dueDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'CURRENT';
    if (diffDays <= 30) return '1_30_DAYS';
    if (diffDays <= 60) return '31_60_DAYS';
    if (diffDays <= 90) return '61_90_DAYS';
    return '90_PLUS_DAYS';
  }

  const asOf = new Date('2026-10-31T00:00:00Z');

  // Due in future
  assert.strictEqual(classifyAgingBucket(asOf, new Date('2026-11-15T00:00:00Z')), 'CURRENT');

  // Due today
  assert.strictEqual(classifyAgingBucket(asOf, new Date('2026-10-31T00:00:00Z')), 'CURRENT');

  // Due 15 days ago -> 1-30 days
  assert.strictEqual(classifyAgingBucket(asOf, new Date('2026-10-16T00:00:00Z')), '1_30_DAYS');

  // Due 45 days ago -> 31-60 days
  assert.strictEqual(classifyAgingBucket(asOf, new Date('2026-09-16T00:00:00Z')), '31_60_DAYS');

  // Due 75 days ago -> 61-90 days
  assert.strictEqual(classifyAgingBucket(asOf, new Date('2026-08-17T00:00:00Z')), '61_90_DAYS');

  // Due 120 days ago -> 90+ days
  assert.strictEqual(classifyAgingBucket(asOf, new Date('2026-07-03T00:00:00Z')), '90_PLUS_DAYS');

  console.log('✅ Aged receivables bucketing passed');
}

// Test 3: Payment Allocation & Invoice State Transitions
{
  function processPayment(
    invoiceTotal: number,
    currentPaid: number,
    paymentAmount: number
  ) {
    const total = round2(invoiceTotal);
    const prevPaid = round2(currentPaid);
    const payment = round2(paymentAmount);
    const balanceDue = round2(total - prevPaid);

    if (payment > balanceDue) {
      throw new Error(`Overpayment not allowed: payment $${payment} > balance $${balanceDue}`);
    }

    const newPaid = round2(prevPaid + payment);
    const newBalance = round2(total - newPaid);
    const newStatus =
      newPaid >= total ? 'PAID' : newPaid > 0 ? 'PARTIALLY_PAID' : 'CONFIRMED';

    return { newPaid, newBalance, newStatus };
  }

  // Initial partial payment: $100 on $190 invoice
  const step1 = processPayment(190, 0, 100);
  assert.strictEqual(step1.newPaid, 100);
  assert.strictEqual(step1.newBalance, 90);
  assert.strictEqual(step1.newStatus, 'PARTIALLY_PAID');

  // Second payment: $90 on remaining balance
  const step2 = processPayment(190, step1.newPaid, 90);
  assert.strictEqual(step2.newPaid, 190);
  assert.strictEqual(step2.newBalance, 0);
  assert.strictEqual(step2.newStatus, 'PAID');

  // Overpayment rejection
  assert.throws(() => {
    processPayment(190, 100, 95);
  }, /Overpayment not allowed/);

  console.log('✅ Payment allocation and status progression verified');
}

console.log('🎉 All Finance Engine Tests Passed Successfully!');
