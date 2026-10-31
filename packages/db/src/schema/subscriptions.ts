import { pgTable, uuid, text, timestamp, numeric, integer, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses.js';
import { customers } from './customers.js';
import { plans } from './plans.js';
import { products, productVariants } from './products.js';
import { discounts } from './discounts.js';
import { subscriptionStatusEnum } from './enums.js';

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    subscriptionNumber: text('subscription_number').notNull().unique(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    planId: uuid('plan_id')
      .notNull()
      .references(() => plans.id),
    discountId: uuid('discount_id').references(() => discounts.id, { onDelete: 'set null' }),
    status: subscriptionStatusEnum('status').default('DRAFT').notNull(),
    startDate: timestamp('start_date', { withTimezone: true }).defaultNow().notNull(),
    expiryDate: timestamp('expiry_date', { withTimezone: true }),
    nextBillingDate: timestamp('next_billing_date', { withTimezone: true }),
    paymentTerms: text('payment_terms'),
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('subscriptions_business_idx').on(table.businessId),
    customerIdx: index('subscriptions_customer_idx').on(table.customerId),
  })
);

export const subscriptionItems = pgTable('subscription_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  subscriptionId: uuid('subscription_id')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  productVariantId: uuid('product_variant_id').references(() => productVariants.id, {
    onDelete: 'set null',
  }),
  quantity: integer('quantity').default(1).notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  discountAmount: numeric('discount_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
  taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type SubscriptionItem = typeof subscriptionItems.$inferSelect;
export type NewSubscriptionItem = typeof subscriptionItems.$inferInsert;
