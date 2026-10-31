import { pgTable, uuid, text, boolean, timestamp, numeric, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';
import { productTypeEnum } from './enums';

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: productTypeEnum('type').default('SERVICE').notNull(),
    salesPrice: numeric('sales_price', { precision: 12, scale: 2 }).notNull(),
    costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull(),
    notes: text('notes'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('products_business_idx').on(table.businessId),
  })
);

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    sku: text('sku'),
    priceExtra: numeric('price_extra', { precision: 12, scale: 2 }).default('0.00').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    productIdx: index('product_variants_product_idx').on(table.productId),
  })
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
