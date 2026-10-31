import assert from 'node:assert';
import { calculatePricing, isDiscountQualified, round2 } from '../src/utils/pricing.js';

console.log('🧪 Running Financial Pricing Engine Unit Tests...');

// 1. Basic product pricing with variant surcharge
{
  const result = calculatePricing([
    {
      productId: 'p1',
      productVariantId: 'v1',
      basePrice: '1200.00',
      variantSurcharge: '560.00',
      quantity: 1,
    },
  ]);

  assert.strictEqual(result.lines[0].effectiveUnitPrice, 1760.0);
  assert.strictEqual(result.lines[0].grossAmount, 1760.0);
  assert.strictEqual(result.subtotal, 1760.0);
  assert.strictEqual(result.amountTotal, 1760.0);
  console.log('✅ Scene 2 Variant Surcharge ($1200 + $560 = $1760) passed');
}

// 2. Multiple quantities and line discounts
{
  const result = calculatePricing([
    {
      productId: 'p1',
      basePrice: '100.00',
      quantity: 3,
      lineDiscountPercentage: 10, // 10% off
    },
    {
      productId: 'p2',
      basePrice: '50.00',
      quantity: 2,
      lineDiscountAmount: '15.00', // $15 off
    },
  ]);

  // Line 1: 3 * $100 = $300. Discount 10% = $30. Subtotal = $270
  assert.strictEqual(result.lines[0].grossAmount, 300.0);
  assert.strictEqual(result.lines[0].discountAmount, 30.0);
  assert.strictEqual(result.lines[0].subtotal, 270.0);

  // Line 2: 2 * $50 = $100. Discount = $15. Subtotal = $85
  assert.strictEqual(result.lines[1].grossAmount, 100.0);
  assert.strictEqual(result.lines[1].discountAmount, 15.0);
  assert.strictEqual(result.lines[1].subtotal, 85.0);

  assert.strictEqual(result.subtotal, 355.0);
  assert.strictEqual(result.amountTotal, 355.0);
  console.log('✅ Line-level discounts (percentage & fixed) passed');
}

// 3. Global discount with qualification gates
{
  // Discount requiring minimum 5 units
  const discountRule = {
    type: 'PERCENTAGE' as const,
    value: 15, // 15% off
    minQuantity: 5,
    minPurchaseAmount: '500.00',
  };

  // Not qualified: qty 4
  const unqualifiedResult = calculatePricing(
    [
      {
        productId: 'p1',
        basePrice: '150.00',
        quantity: 4, // 4 items, subtotal $600
      },
    ],
    discountRule
  );
  assert.strictEqual(unqualifiedResult.globalDiscountAmount, 0);
  assert.strictEqual(unqualifiedResult.amountTotal, 600.0);

  // Qualified: qty 5
  const qualifiedResult = calculatePricing(
    [
      {
        productId: 'p1',
        basePrice: '150.00',
        quantity: 5, // 5 items, subtotal $750
      },
    ],
    discountRule
  );
  // 15% of $750 = $112.50
  assert.strictEqual(qualifiedResult.globalDiscountAmount, 112.5);
  assert.strictEqual(qualifiedResult.taxableBase, 637.5);
  assert.strictEqual(qualifiedResult.amountTotal, 637.5);
  console.log('✅ Global discount qualification gate & percentage calculation passed');
}

// 4. Taxes (exclusive and inclusive)
{
  // Exclusive 18% tax
  const exclusiveTaxResult = calculatePricing([
    {
      productId: 'p1',
      basePrice: '1000.00',
      quantity: 1,
      taxRate: 18,
      taxIsInclusive: false,
    },
  ]);
  assert.strictEqual(exclusiveTaxResult.subtotal, 1000.0);
  assert.strictEqual(exclusiveTaxResult.taxTotal, 180.0);
  assert.strictEqual(exclusiveTaxResult.amountTotal, 1180.0);

  // Inclusive 18% tax on $1180 -> Tax should be $180, subtotal is $1180
  const inclusiveTaxResult = calculatePricing([
    {
      productId: 'p1',
      basePrice: '1180.00',
      quantity: 1,
      taxRate: 18,
      taxIsInclusive: true,
    },
  ]);
  assert.strictEqual(inclusiveTaxResult.subtotal, 1180.0);
  assert.strictEqual(inclusiveTaxResult.taxTotal, 180.0);
  assert.strictEqual(inclusiveTaxResult.amountTotal, 1180.0);
  console.log('✅ Exclusive & inclusive tax calculations passed');
}

// 5. Floating point precision safety (e.g. 0.1 + 0.2, odd cents)
{
  const result = calculatePricing([
    {
      productId: 'p1',
      basePrice: '19.99',
      quantity: 3,
      taxRate: 8.25,
    },
  ]);
  // 3 * 19.99 = 59.97
  // Tax 8.25% of 59.97 = 4.947525 -> round2 = 4.95
  // Total = 59.97 + 4.95 = 64.92
  assert.strictEqual(result.subtotal, 59.97);
  assert.strictEqual(result.taxTotal, 4.95);
  assert.strictEqual(result.amountTotal, 64.92);
  console.log('✅ Floating-point precision ($19.99 * 3 + 8.25% tax = $64.92) passed');
}

console.log('🎉 All Pricing Engine Unit Tests Passed Successfully!');
