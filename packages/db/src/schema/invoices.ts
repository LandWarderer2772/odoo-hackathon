import { pgTable, uuid, text, timestamp, numeric, integer, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';
import { customers } from './customers';
import { subscriptions } from './subscriptions';
import { products, productVariants } from './products';
import { taxRules } from './taxes';
import { invoiceStatusEnum } from './enums';

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    invoiceNumber: text('invoice_number').notNull().unique(),
    subscriptionId: uuid('subscription_id').references(() => subscriptions.id, {
      onDelete: 'set null',
    }),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    status: invoiceStatusEnum('status').default('DRAFT').notNull(),
    invoiceDate: timestamp('invoice_date', { withTimezone: true }).defaultNow().notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
    subtotal: numeric('subtotal', { precision: 12, scale: 2 }).default('0.00').notNull(),
    discountTotal: numeric('discount_total', { precision: 12, scale: 2 }).default('0.00').notNull(),
    taxTotal: numeric('tax_total', { precision: 12, scale: 2 }).default('0.00').notNull(),
    amountTotal: numeric('amount_total', { precision: 12, scale: 2 }).default('0.00').notNull(),
    amountPaid: numeric('amount_paid', { precision: 12, scale: 2 }).default('0.00').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('invoices_business_idx').on(table.businessId),
    customerIdx: index('invoices_customer_idx').on(table.customerId),
  })
);

export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id')
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  productVariantId: uuid('product_variant_id').references(() => productVariants.id, {
    onDelete: 'set null',
  }),
  description: text('description').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  taxRuleId: uuid('tax_rule_id').references(() => taxRules.id, { onDelete: 'set null' }),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
