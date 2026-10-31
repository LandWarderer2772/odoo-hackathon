import { pgTable, uuid, text, timestamp, numeric, index } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';
import { customers } from './customers';
import { invoices } from './invoices';
import { paymentMethodEnum } from './enums';

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    paymentReference: text('payment_reference').notNull().unique(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    method: paymentMethodEnum('method').default('BANK_TRANSFER').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paymentDate: timestamp('payment_date', { withTimezone: true }).defaultNow().notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessIdx: index('payments_business_idx').on(table.businessId),
    customerIdx: index('payments_customer_idx').on(table.customerId),
  })
);

export const paymentAllocations = pgTable('payment_allocations', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentId: uuid('payment_id')
    .notNull()
    .references(() => payments.id, { onDelete: 'cascade' }),
  invoiceId: uuid('invoice_id')
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  allocatedAt: timestamp('allocated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type PaymentAllocation = typeof paymentAllocations.$inferSelect;
export type NewPaymentAllocation = typeof paymentAllocations.$inferInsert;
