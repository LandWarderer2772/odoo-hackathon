import { pgTable, uuid, text, boolean, timestamp, numeric, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';
import { discountTypeEnum } from './enums';

export const discounts = pgTable(
  'discounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    name: text('name').notNull(),
    type: discountTypeEnum('type').default('PERCENTAGE').notNull(),
    value: numeric('value', { precision: 10, scale: 2 }).notNull(),
    validFrom: timestamp('valid_from', { withTimezone: true }).defaultNow().notNull(),
    validUntil: timestamp('valid_until', { withTimezone: true }),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('discounts_business_idx').on(table.businessId),
    businessCodeUnique: uniqueIndex('discounts_business_code_idx').on(table.businessId, table.code),
  })
);

export type Discount = typeof discounts.$inferSelect;
export type NewDiscount = typeof discounts.$inferInsert;
