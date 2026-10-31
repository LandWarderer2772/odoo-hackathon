import { relations } from 'drizzle-orm';
import { businesses } from './businesses.js';
import { users } from './users.js';
import { products, productVariants } from './products.js';
import { plans } from './plans.js';
import { customers } from './customers.js';
import { quotations, quotationItems } from './quotations.js';
import { subscriptions, subscriptionItems } from './subscriptions.js';
import { invoices, invoiceItems } from './invoices.js';
import { taxRules } from './taxes.js';
import { discounts } from './discounts.js';
import { payments, paymentAllocations } from './payments.js';

export const businessesRelations = relations(businesses, ({ many }) => ({
  users: many(users),
  products: many(products),
  plans: many(plans),
  customers: many(customers),
  quotations: many(quotations),
  subscriptions: many(subscriptions),
  invoices: many(invoices),
  taxRules: many(taxRules),
  discounts: many(discounts),
  payments: many(payments),
}));

export const usersRelations = relations(users, ({ one }) => ({
  business: one(businesses, {
    fields: [users.businessId],
    references: [businesses.id],
  }),
  customerProfile: one(customers, {
    fields: [users.id],
    references: [customers.userId],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  business: one(businesses, {
    fields: [products.businessId],
    references: [businesses.id],
  }),
  variants: many(productVariants),
  quotationItems: many(quotationItems),
  subscriptionItems: many(subscriptionItems),
  invoiceItems: many(invoiceItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  quotationItems: many(quotationItems),
  subscriptionItems: many(subscriptionItems),
  invoiceItems: many(invoiceItems),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  business: one(businesses, {
    fields: [plans.businessId],
    references: [businesses.id],
  }),
  subscriptions: many(subscriptions),
  quotations: many(quotations),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  business: one(businesses, {
    fields: [customers.businessId],
    references: [businesses.id],
  }),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  quotations: many(quotations),
  subscriptions: many(subscriptions),
  invoices: many(invoices),
  payments: many(payments),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  business: one(businesses, {
    fields: [quotations.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  plan: one(plans, {
    fields: [quotations.planId],
    references: [plans.id],
  }),
  items: many(quotationItems),
}));

export const quotationItemsRelations = relations(quotationItems, ({ one }) => ({
  quotation: one(quotations, {
    fields: [quotationItems.quotationId],
    references: [quotations.id],
  }),
  product: one(products, {
    fields: [quotationItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [quotationItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  business: one(businesses, {
    fields: [subscriptions.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [subscriptions.customerId],
    references: [customers.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
  discount: one(discounts, {
    fields: [subscriptions.discountId],
    references: [discounts.id],
  }),
  items: many(subscriptionItems),
  invoices: many(invoices),
}));

export const subscriptionItemsRelations = relations(subscriptionItems, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [subscriptionItems.subscriptionId],
    references: [subscriptions.id],
  }),
  product: one(products, {
    fields: [subscriptionItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [subscriptionItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  business: one(businesses, {
    fields: [invoices.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  subscription: one(subscriptions, {
    fields: [invoices.subscriptionId],
    references: [subscriptions.id],
  }),
  items: many(invoiceItems),
  allocations: many(paymentAllocations),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [invoiceItems.productVariantId],
    references: [productVariants.id],
  }),
  taxRule: one(taxRules, {
    fields: [invoiceItems.taxRuleId],
    references: [taxRules.id],
  }),
}));

export const taxRulesRelations = relations(taxRules, ({ one, many }) => ({
  business: one(businesses, {
    fields: [taxRules.businessId],
    references: [businesses.id],
  }),
  invoiceItems: many(invoiceItems),
}));

export const discountsRelations = relations(discounts, ({ one, many }) => ({
  business: one(businesses, {
    fields: [discounts.businessId],
    references: [businesses.id],
  }),
  subscriptions: many(subscriptions),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  business: one(businesses, {
    fields: [payments.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [payments.customerId],
    references: [customers.id],
  }),
  allocations: many(paymentAllocations),
}));

export const paymentAllocationsRelations = relations(paymentAllocations, ({ one }) => ({
  payment: one(payments, {
    fields: [paymentAllocations.paymentId],
    references: [payments.id],
  }),
  invoice: one(invoices, {
    fields: [paymentAllocations.invoiceId],
    references: [invoices.id],
  }),
}));
