/**
 * Financial Calculation Engine for Brightloop / Aetheria Subscription Management
 * Handles variant surcharges, line discounts, global discounts, taxes (inclusive & exclusive),
 * and produces exact 2-decimal rounded financial summaries with zero floating-point drift.
 */

export interface LineItemInput {
  productId: string;
  productVariantId?: string | null;
  productName?: string;
  variantName?: string;
  quantity: number;
  basePrice: number | string;
  variantSurcharge?: number | string | null;
  lineDiscountAmount?: number | string | null;
  lineDiscountPercentage?: number | string | null;
  taxRate?: number | string | null; // e.g. 18 for 18%
  taxIsInclusive?: boolean;
}

export interface GlobalDiscountRule {
  id?: string;
  code?: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number | string;
  minQuantity?: number | null;
  minPurchaseAmount?: number | string | null;
  validFrom?: Date | string | null;
  validUntil?: Date | string | null;
  isActive?: boolean;
}

export interface CalculatedLineItem {
  productId: string;
  productVariantId: string | null;
  quantity: number;
  unitBasePrice: number;
  variantSurcharge: number;
  effectiveUnitPrice: number;
  grossAmount: number; // effectiveUnitPrice * quantity
  discountAmount: number;
  taxAmount: number;
  subtotal: number; // after line discount, before tax
  total: number; // final line total including tax
}

export interface PricingCalculationResult {
  lines: CalculatedLineItem[];
  subtotal: number; // Sum of line subtotals
  globalDiscountAmount: number;
  taxableBase: number;
  taxTotal: number;
  amountTotal: number;
  totalQuantity: number;
}

/**
 * Rounds a number to exactly 2 decimal places to prevent floating-point anomalies
 */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Converts a string, numeric, or nullish value safely to a float
 */
export function toNum(val: number | string | null | undefined, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  const parsed = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Formats a number to a standard financial 2-decimal string
 */
export function toDecimalStr(value: number | string | null | undefined): string {
  return round2(toNum(value)).toFixed(2);
}

/**
 * Checks whether a global discount qualifies against line items and amounts
 */
export function isDiscountQualified(
  discount: GlobalDiscountRule,
  totalQty: number,
  preDiscountSubtotal: number,
  referenceDate: Date = new Date()
): { qualified: boolean; reason?: string } {
  if (discount.isActive === false) {
    return { qualified: false, reason: 'Discount is inactive' };
  }

  if (discount.validFrom) {
    const from = new Date(discount.validFrom);
    if (referenceDate < from) {
      return { qualified: false, reason: 'Discount is not yet valid' };
    }
  }

  if (discount.validUntil) {
    const until = new Date(discount.validUntil);
    if (referenceDate > until) {
      return { qualified: false, reason: 'Discount has expired' };
    }
  }

  if (discount.minQuantity && totalQty < discount.minQuantity) {
    return {
      qualified: false,
      reason: `Minimum required quantity of ${discount.minQuantity} items not met`,
    };
  }

  const minAmt = toNum(discount.minPurchaseAmount, 0);
  if (minAmt > 0 && preDiscountSubtotal < minAmt) {
    return {
      qualified: false,
      reason: `Minimum required purchase amount of $${minAmt.toFixed(2)} not met`,
    };
  }

  return { qualified: true };
}

/**
 * Primary calculation pipeline:
 * 1. Effective Unit Price = Base Price + Variant Surcharge
 * 2. Line Gross = Effective Unit Price * Qty
 * 3. Line Discount = Percentage or Fixed
 * 4. Line Subtotal = Gross - Line Discount
 * 5. Pre-discount Subtotal = Sum(Line Subtotals)
 * 6. Global Discount applied if qualified
 * 7. Tax calculated per line or aggregated
 * 8. Final Amount Total = Subtotal - Global Discount + Taxes
 */
export function calculatePricing(
  items: LineItemInput[],
  globalDiscount?: GlobalDiscountRule | null,
  referenceDate: Date = new Date()
): PricingCalculationResult {
  let totalQty = 0;
  let preDiscountSubtotal = 0;
  let lineExclusiveTaxTotal = 0;
  let lineInclusiveTaxTotal = 0;

  const calculatedLines: CalculatedLineItem[] = items.map((item) => {
    const qty = Math.max(1, Math.floor(item.quantity));
    totalQty += qty;

    const basePrice = round2(toNum(item.basePrice));
    const variantSurcharge = round2(toNum(item.variantSurcharge, 0));
    const effectiveUnitPrice = round2(basePrice + variantSurcharge);
    const grossAmount = round2(effectiveUnitPrice * qty);

    // Calculate line-level discount
    let lineDiscount = 0;
    if (item.lineDiscountAmount && toNum(item.lineDiscountAmount) > 0) {
      lineDiscount = Math.min(grossAmount, round2(toNum(item.lineDiscountAmount)));
    } else if (item.lineDiscountPercentage && toNum(item.lineDiscountPercentage) > 0) {
      const pct = Math.min(100, Math.max(0, toNum(item.lineDiscountPercentage)));
      lineDiscount = round2((grossAmount * pct) / 100);
    }

    const subtotal = round2(grossAmount - lineDiscount);
    preDiscountSubtotal = round2(preDiscountSubtotal + subtotal);

    // Calculate line-level tax if provided
    let taxAmount = 0;
    const taxRate = toNum(item.taxRate, 0);
    if (taxRate > 0) {
      if (item.taxIsInclusive) {
        // Tax is already included in subtotal: Tax = Subtotal - (Subtotal / (1 + rate/100))
        taxAmount = round2(subtotal - subtotal / (1 + taxRate / 100));
        lineInclusiveTaxTotal = round2(lineInclusiveTaxTotal + taxAmount);
      } else {
        // Exclusive tax: Tax = Subtotal * (rate / 100)
        taxAmount = round2((subtotal * taxRate) / 100);
        lineExclusiveTaxTotal = round2(lineExclusiveTaxTotal + taxAmount);
      }
    }

    const lineTotal = item.taxIsInclusive ? subtotal : round2(subtotal + taxAmount);

    return {
      productId: item.productId,
      productVariantId: item.productVariantId || null,
      quantity: qty,
      unitBasePrice: basePrice,
      variantSurcharge,
      effectiveUnitPrice,
      grossAmount,
      discountAmount: lineDiscount,
      taxAmount,
      subtotal,
      total: lineTotal,
    };
  });

  // Evaluate global discount
  let globalDiscountAmount = 0;
  if (globalDiscount) {
    const { qualified } = isDiscountQualified(
      globalDiscount,
      totalQty,
      preDiscountSubtotal,
      referenceDate
    );

    if (qualified) {
      const discVal = toNum(globalDiscount.value, 0);
      if (globalDiscount.type === 'PERCENTAGE') {
        const pct = Math.min(100, Math.max(0, discVal));
        globalDiscountAmount = round2((preDiscountSubtotal * pct) / 100);
      } else {
        globalDiscountAmount = Math.min(preDiscountSubtotal, round2(discVal));
      }
    }
  }

  const taxableBase = round2(Math.max(0, preDiscountSubtotal - globalDiscountAmount));

  // If taxes were calculated at the line level, adjust if global discount was applied
  let exclusiveTaxTotal = lineExclusiveTaxTotal;
  let inclusiveTaxTotal = lineInclusiveTaxTotal;

  if (globalDiscountAmount > 0 && preDiscountSubtotal > 0) {
    const discountRatio = taxableBase / preDiscountSubtotal;
    exclusiveTaxTotal = round2(lineExclusiveTaxTotal * discountRatio);
    inclusiveTaxTotal = round2(lineInclusiveTaxTotal * discountRatio);
  }

  const taxTotal = round2(exclusiveTaxTotal + inclusiveTaxTotal);
  const amountTotal = round2(taxableBase + exclusiveTaxTotal);

  return {
    lines: calculatedLines,
    subtotal: preDiscountSubtotal,
    globalDiscountAmount,
    taxableBase,
    taxTotal,
    amountTotal,
    totalQuantity: totalQty,
  };
}
