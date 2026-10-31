import { z } from 'zod';
import { subscriptionStatusValues } from '@brightloop/types';

export const subscriptionItemInputSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  productVariantId: z.string().uuid('Invalid product variant ID').optional().nullable(),
  quantity: z.number().int().positive('Quantity must be >= 1').default(1),
  unitPrice: z.number().nonnegative().optional(), // If omitted, resolved from product + variant surcharge
  lineDiscountAmount: z.number().nonnegative().default(0).optional(),
});

export const createSubscriptionSchema = z.object({
  customerId: z.string().uuid('Valid customer ID is required'),
  planId: z.string().uuid('Valid plan ID is required'),
  discountId: z.string().uuid('Invalid discount ID').optional().nullable(),
  startDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional().nullable(),
  paymentTerms: z.string().max(100).optional().nullable(),
  items: z.array(subscriptionItemInputSchema).min(1, 'Subscription must contain at least one line item'),
});

export const subscriptionQuerySchema = z.object({
  customerId: z.string().uuid().optional(),
  planId: z.string().uuid().optional(),
  status: z.enum(subscriptionStatusValues).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const subscriptionTransitionSchema = z.object({
  action: z.enum(['send_quote', 'confirm', 'activate', 'pause', 'resume', 'close']),
  reason: z.string().max(255).optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type SubscriptionQueryInput = z.infer<typeof subscriptionQuerySchema>;
export type SubscriptionTransitionInput = z.infer<typeof subscriptionTransitionSchema>;
