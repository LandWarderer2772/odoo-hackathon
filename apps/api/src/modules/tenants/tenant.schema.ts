import { z } from 'zod';

export const checkSlugSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
});

export const updateTenantSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').optional(),
  logoUrl: z.string().url('Invalid logo URL').optional().nullable(),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code')
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code')
    .optional(),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  customDbUrl: z.string().optional().nullable(),
});

export const testDbConnectionSchema = z.object({
  connectionUrl: z.string().min(10, 'PostgreSQL connection URL is required'),
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
export type TestDbConnectionInput = z.infer<typeof testDbConnectionSchema>;
