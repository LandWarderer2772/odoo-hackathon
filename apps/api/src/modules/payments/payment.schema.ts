import { z } from 'zod';
import { paymentMethodValues } from '@brightloop/types';

export const recordPaymentSchema = z.object({
  invoiceId: z.string().uuid('Valid invoice ID is required'),
  amount: z.number().positive('Payment amount must be greater than zero'),
  method: z.enum(paymentMethodValues).default('BANK_TRANSFER'),
  paymentDate: z.string().datetime().optional(),
  paymentReference: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export const paymentQuerySchema = z.object({
  customerId: z.string().uuid().optional(),
  invoiceId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>;
