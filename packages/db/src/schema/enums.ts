import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', [
  'SUPER_ADMIN',
  'BUSINESS_ADMIN',
  'STAFF',
  'CUSTOMER',
]);

export const productTypeEnum = pgEnum('product_type', [
  'SERVICE',
  'GOODS',
]);

export const billingCycleEnum = pgEnum('billing_cycle', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'DRAFT',
  'QUOTATION',
  'CONFIRMED',
  'ACTIVE',
  'PAUSED',
  'CLOSED',
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'DRAFT',
  'CONFIRMED',
  'PARTIALLY_PAID',
  'PAID',
  'CANCELLED',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'BANK_TRANSFER',
  'CREDIT_CARD',
  'CASH',
  'CHECK',
]);

export const discountTypeEnum = pgEnum('discount_type', [
  'PERCENTAGE',
  'FIXED',
]);

export const quotationStatusEnum = pgEnum('quotation_status', [
  'DRAFT',
  'SENT',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
]);
