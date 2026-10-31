import { pgTable, uuid, text, boolean, timestamp, numeric, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses.js';

export const taxRules = pgTable(
  'tax_rules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    rate: numeric('rate', { precision: 5, scale: 2 }).notNull(), // e.g. 18.00%
    isInclusive: boolean('is_inclusive').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('tax_rules_business_idx').on(table.businessId),
  })
);

export type TaxRule = typeof taxRules.$inferSelect;
export type NewTaxRule = typeof taxRules.$inferInsert;
