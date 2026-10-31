import { pgTable, uuid, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';
import { roleEnum } from './enums';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    role: roleEnum('role').default('STAFF').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    passwordResetToken: text('password_reset_token'),
    passwordResetExpires: timestamp('password_reset_expires', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('users_business_idx').on(table.businessId),
    emailIdx: index('users_email_idx').on(table.email),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
