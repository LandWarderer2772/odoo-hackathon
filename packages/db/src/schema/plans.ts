import { pgTable, uuid, text, boolean, timestamp, numeric, integer, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses.js';
import { billingCycleEnum } from './enums.js';

export const plans = pgTable(
  'plans',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    code: text('code'),
    description: text('description'),
    billingCycle: billingCycleEnum('billing_cycle').default('MONTHLY').notNull(),
    intervalCount: integer('interval_count').default(1).notNull(),
    price: numeric('price', { precision: 12, scale: 2 }).default('0.00').notNull(),
    minQuantity: integer('min_quantity').default(1).notNull(),
    startDate: timestamp('start_date', { withTimezone: true }).defaultNow().notNull(),
    endDate: timestamp('end_date', { withTimezone: true }),
    autoCloseAtEnd: boolean('auto_close_at_end').default(false).notNull(),
    allowEarlyClosure: boolean('allow_early_closure').default(true).notNull(),
    allowPausing: boolean('allow_pausing').default(true).notNull(),
    allowRenewal: boolean('allow_renewal').default(true).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('plans_business_idx').on(table.businessId),
  })
);

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
