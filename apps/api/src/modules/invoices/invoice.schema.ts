import { z } from 'zod';
import { invoiceStatusValues } from '@brightloop/types';

export const createInvoiceItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID').optional().nullable(),
  productVariantId: z.string().uuid('Invalid variant ID').optional().nullable(),
  description: z.string().min(1, 'Description is required').max(255),
  quantity: z.number().int().positive('Quantity must be >= 1').default(1),
  unitPrice: z.number().nonnegative('Unit price must be >= 0'),
  taxRate: z.number().nonnegative().max(100).default(0).optional(),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid('Valid customer ID is required'),
  subscriptionId: z.string().uuid('Invalid subscription ID').optional().nullable(),
  dueDate: z.string().datetime().optional(),
  items: z.array(createInvoiceItemSchema).min(1, 'At least one invoice line item is required'),
});

export const invoiceQuerySchema = z.object({
  customerId: z.string().uuid().optional(),
  subscriptionId: z.string().uuid().optional(),
  status: z.enum(invoiceStatusValues).optional(),
  overdueOnly: z
    .enum(['true', 'false', '1', '0'])
    .optional()
    .transform((val) => val === 'true' || val === '1'),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const generateDueInvoicesSchema = z.object({
  cutoffDate: z.string().datetime().optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED']),
  reason: z.string().max(255).optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type InvoiceQueryInput = z.infer<typeof invoiceQuerySchema>;
export type GenerateDueInvoicesInput = z.infer<typeof generateDueInvoicesSchema>;
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>;
