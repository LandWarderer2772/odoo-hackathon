import { z } from 'zod';

export const createVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().optional(),
  priceExtra: z
    .union([z.number(), z.string()])
    .transform((val) => String(val))
    .default('0.00'),
});

export const updateVariantSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().optional().nullable(),
  priceExtra: z
    .union([z.number(), z.string()])
    .transform((val) => String(val))
    .optional(),
  isActive: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  type: z.enum(['SERVICE', 'GOODS']).default('SERVICE'),
  salesPrice: z
    .union([z.number(), z.string()])
    .transform((val) => String(val)),
  costPrice: z
    .union([z.number(), z.string()])
    .transform((val) => String(val)),
  notes: z.string().optional(),
  variants: z.array(createVariantSchema).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['SERVICE', 'GOODS']).optional(),
  salesPrice: z
    .union([z.number(), z.string()])
    .transform((val) => String(val))
    .optional(),
  costPrice: z
    .union([z.number(), z.string()])
    .transform((val) => String(val))
    .optional(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
