import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';
import { users } from './users';

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    companyName: text('company_name'),
    address: text('address'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('customers_business_idx').on(table.businessId),
    userIdx: index('customers_user_idx').on(table.userId),
  })
);

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
