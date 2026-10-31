import { z } from 'zod';

export const quotationItemInputSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  productVariantId: z.string().uuid('Invalid variant ID').optional().nullable(),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
  unitPrice: z.number().nonnegative().optional(), // If omitted, looked up from product + variant surcharge
  lineDiscountAmount: z.number().nonnegative().default(0).optional(),
});

export const createQuotationSchema = z.object({
  customerId: z.string().uuid('Valid customer ID is required'),
  planId: z.string().uuid('Plan ID is optional').optional().nullable(),
  validityDays: z.number().int().positive().default(15),
  notes: z.string().max(500).optional(),
  items: z.array(quotationItemInputSchema).min(1, 'At least one line item is required'),
});

export const quotationQuerySchema = z.object({
  customerId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateQuotationInput = z.infer<typeof createQuotationSchema>;
export type QuotationQueryInput = z.infer<typeof quotationQuerySchema>;
