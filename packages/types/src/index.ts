import { z } from 'zod';

// ==========================================
// 1. Customer DTOs
// ==========================================
export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters').max(100),
  email: z.string().email('Valid email address is required').max(150),
  phone: z.string().max(30).optional().nullable(),
  companyName: z.string().max(150).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  userId: z.string().uuid('Invalid user ID').optional().nullable(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'email', 'companyName', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;

export interface CustomerMetrics {
  activeSubscriptionsCount: number;
  totalInvoicesCount: number;
  unpaidBalance: number;
  totalPaid: number;
}

export interface CustomerFinancialSummary {
  totalBilled: number;
  totalPaid: number;
  unpaidBalance: number;
  overdueInvoicesCount: number;
}

// ==========================================
// 2. Quotation DTOs
// ==========================================
export const createQuotationItemSchema = z.object({
  productId: z.string().uuid(),
  productVariantId: z.string().uuid().optional().nullable(),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().nonnegative(),
});

export const createQuotationSchema = z.object({
  customerId: z.string().uuid('Customer ID is required'),
  planId: z.string().uuid('Plan ID is required').optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  items: z.array(createQuotationItemSchema).min(1, 'At least one item is required'),
});

export type CreateQuotationInput = z.infer<typeof createQuotationSchema>;

// ==========================================
// 3. Subscription & FSM DTOs
// ==========================================
export const subscriptionStatusValues = [
  'DRAFT',
  'QUOTATION',
  'CONFIRMED',
  'ACTIVE',
  'PAUSED',
  'CLOSED',
] as const;

export type SubscriptionStatus = (typeof subscriptionStatusValues)[number];

export const createSubscriptionItemSchema = z.object({
  productId: z.string().uuid(),
  productVariantId: z.string().uuid().optional().nullable(),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().nonnegative().optional(),
  lineDiscountAmount: z.number().nonnegative().default(0).optional(),
});

export const createSubscriptionSchema = z.object({
  customerId: z.string().uuid('Customer ID is required'),
  planId: z.string().uuid('Plan ID is required'),
  discountId: z.string().uuid().optional().nullable(),
  startDate: z.string().datetime().optional(),
  paymentTerms: z.string().max(100).optional().nullable(),
  items: z.array(createSubscriptionItemSchema).min(1, 'At least one item is required'),
});

export const subscriptionTransitionSchema = z.object({
  action: z.enum(['send_quote', 'confirm', 'activate', 'pause', 'resume', 'close']),
  reason: z.string().max(255).optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type SubscriptionTransitionInput = z.infer<typeof subscriptionTransitionSchema>;

// ==========================================
// 4. Invoice & Payment DTOs
// ==========================================
export const invoiceStatusValues = [
  'DRAFT',
  'CONFIRMED',
  'PARTIALLY_PAID',
  'PAID',
  'CANCELLED',
] as const;

export type InvoiceStatus = (typeof invoiceStatusValues)[number];

export const paymentMethodValues = [
  'BANK_TRANSFER',
  'CREDIT_CARD',
  'CASH',
  'CHECK',
] as const;

export type PaymentMethod = (typeof paymentMethodValues)[number];

export const recordPaymentSchema = z.object({
  invoiceId: z.string().uuid('Invoice ID is required'),
  amount: z.number().positive('Payment amount must be greater than zero'),
  method: z.enum(paymentMethodValues).default('BANK_TRANSFER'),
  paymentDate: z.string().datetime().optional(),
  paymentReference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

// ==========================================
// 5. Finance Reports & Executive Analytics DTOs
// ==========================================
export interface MonthlyRevenueDataPoint {
  month: string; // e.g. "2026-10"
  mrr: number;
  collected: number;
}

export interface FinanceSummaryResponse {
  activeSubscriptionsCount: number;
  mrr: number;
  arr: number;
  totalRevenueCollected: number;
  overdueInvoicesCount: number;
  overdueAmountTotal: number;
  monthlyRevenueTrend: MonthlyRevenueDataPoint[];
}

export interface AgedReceivablesBucket {
  bucket: 'CURRENT' | '1_30_DAYS' | '31_60_DAYS' | '61_90_DAYS' | '90_PLUS_DAYS';
  label: string;
  invoiceCount: number;
  amount: number;
}

export interface AgedReceivablesResponse {
  buckets: AgedReceivablesBucket[];
  totalOverdueAmount: number;
  asOfDate: string;
}
