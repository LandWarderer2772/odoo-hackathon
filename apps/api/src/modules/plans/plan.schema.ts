import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  code: z.string().optional(),
  description: z.string().optional(),
  billingCycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('MONTHLY'),
  intervalCount: z.number().int().positive().default(1),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => String(val))
    .default('0.00'),
  minQuantity: z.number().int().positive().default(1),
  startDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
  endDate: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  autoCloseAtEnd: z.boolean().default(false),
  allowEarlyClosure: z.boolean().default(true),
  allowPausing: z.boolean().default(true),
  allowRenewal: z.boolean().default(true),
});

export const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  billingCycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  intervalCount: z.number().int().positive().optional(),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => String(val))
    .optional(),
  minQuantity: z.number().int().positive().optional(),
  startDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  autoCloseAtEnd: z.boolean().optional(),
  allowEarlyClosure: z.boolean().optional(),
  allowPausing: z.boolean().optional(),
  allowRenewal: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
