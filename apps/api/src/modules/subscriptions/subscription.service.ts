import { and, eq, desc, sql, inArray, or, ilike } from 'drizzle-orm';
import {
  db,
  subscriptions,
  subscriptionItems,
  customers,
  plans,
  products,
  productVariants,
  discounts,
  invoices,
  invoiceItems,
  Subscription,
  Plan,
} from '@brightloop/db';
import {
  CreateSubscriptionInput,
  SubscriptionQueryInput,
  SubscriptionTransitionInput,
} from './subscription.schema.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import {
  calculatePricing,
  GlobalDiscountRule,
  round2,
  toDecimalStr,
  toNum,
} from '../../utils/pricing.js';

export function computeNextBillingDate(
  baseDate: Date,
  billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
  intervalCount: number = 1
): Date {
  const next = new Date(baseDate);
  const count = Math.max(1, intervalCount);

  switch (billingCycle) {
    case 'DAILY':
      next.setDate(next.getDate() + count);
      break;
    case 'WEEKLY':
      next.setDate(next.getDate() + count * 7);
      break;
    case 'MONTHLY':
      next.setMonth(next.getMonth() + count);
      break;
    case 'YEARLY':
      next.setFullYear(next.getFullYear() + count);
      break;
  }
  return next;
}

export class SubscriptionService {
  /**
   * List subscriptions with search, filtering, and pagination
   */
  async listSubscriptions(businessId: string, query: SubscriptionQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(subscriptions.businessId, businessId)];

    if (query.customerId) {
      conditions.push(eq(subscriptions.customerId, query.customerId));
    }
    if (query.planId) {
      conditions.push(eq(subscriptions.planId, query.planId));
    }
    if (query.status) {
      conditions.push(eq(subscriptions.status, query.status));
    }

    if (query.search && query.search.trim() !== '') {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(subscriptions.subscriptionNumber, term),
          ilike(customers.name, term),
          ilike(customers.email, term)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(subscriptions)
      .leftJoin(customers, eq(subscriptions.customerId, customers.id))
      .where(whereClause);

    const total = countResult?.count || 0;

    const items = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.businessId, businessId),
        query.customerId ? eq(subscriptions.customerId, query.customerId) : undefined,
        query.planId ? eq(subscriptions.planId, query.planId) : undefined,
        query.status ? eq(subscriptions.status, query.status) : undefined
      ),
      orderBy: [desc(subscriptions.createdAt)],
      limit,
      offset,
      with: {
        customer: true,
        plan: true,
        discount: true,
        items: {
          with: {
            product: true,
            productVariant: true,
          },
        },
      },
    });

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single subscription with full items, invoices, and plan details
   */
  async getSubscriptionById(businessId: string, subscriptionId: string) {
    const sub = await db.query.subscriptions.findFirst({
      where: and(eq(subscriptions.id, subscriptionId), eq(subscriptions.businessId, businessId)),
      with: {
        customer: true,
        plan: true,
        discount: true,
        items: {
          with: {
            product: true,
            productVariant: true,
          },
        },
        invoices: {
          orderBy: (inv, { desc }) => [desc(inv.createdAt)],
          limit: 15,
        },
      },
    });

    if (!sub) {
      throw new NotFoundError(`Subscription with ID '${subscriptionId}' not found`);
    }

    return sub;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(businessId: string, input: CreateSubscriptionInput) {
    // 1. Verify customer
    const customer = await db.query.customers.findFirst({
      where: and(eq(customers.id, input.customerId), eq(customers.businessId, businessId)),
    });
    if (!customer) {
      throw new NotFoundError(`Customer with ID '${input.customerId}' not found`);
    }

    // 2. Verify plan
    const plan = await db.query.plans.findFirst({
      where: and(eq(plans.id, input.planId), eq(plans.businessId, businessId)),
    });
    if (!plan) {
      throw new NotFoundError(`Plan with ID '${input.planId}' not found`);
    }
    if (!plan.isActive) {
      throw new BadRequestError(`Plan '${plan.name}' is deactivated and cannot accept new subscriptions`);
    }

    // Check plan min quantity guard
    const totalInputQty = input.items.reduce((sum, item) => sum + Math.max(1, item.quantity), 0);
    if (plan.minQuantity && totalInputQty < plan.minQuantity) {
      throw new BadRequestError(
        `Plan '${plan.name}' requires a minimum quantity of ${plan.minQuantity} items (provided: ${totalInputQty})`
      );
    }

    // 3. Verify discount if provided
    let globalDiscountRule: GlobalDiscountRule | null = null;
    if (input.discountId) {
      const discountRecord = await db.query.discounts.findFirst({
        where: and(eq(discounts.id, input.discountId), eq(discounts.businessId, businessId)),
      });
      if (!discountRecord) {
        throw new NotFoundError(`Discount with ID '${input.discountId}' not found`);
      }
      globalDiscountRule = {
        id: discountRecord.id,
        code: discountRecord.code,
        type: discountRecord.type,
        value: discountRecord.value,
        validFrom: discountRecord.validFrom,
        validUntil: discountRecord.validUntil,
        isActive: discountRecord.isActive,
      };
    }

    // 4. Resolve catalog products and variants
    const productIds = input.items.map((i) => i.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.businessId, businessId), inArray(products.id, productIds)));

    const variantIds = input.items
      .map((i) => i.productVariantId)
      .filter((id): id is string => !!id);

    const dbVariants =
      variantIds.length > 0
        ? await db
            .select()
            .from(productVariants)
            .where(inArray(productVariants.id, variantIds))
        : [];

    const pricingLineInputs = input.items.map((item) => {
      const prod = dbProducts.find((p) => p.id === item.productId);
      if (!prod) {
        throw new NotFoundError(`Product '${item.productId}' not found in catalog`);
      }
      const variant = item.productVariantId
        ? dbVariants.find((v) => v.id === item.productVariantId)
        : null;

      const basePrice = item.unitPrice !== undefined ? item.unitPrice : prod.salesPrice;
      const variantSurcharge = variant?.priceExtra || 0;

      return {
        productId: item.productId,
        productVariantId: item.productVariantId || null,
        quantity: item.quantity,
        basePrice,
        variantSurcharge,
        lineDiscountAmount: item.lineDiscountAmount || 0,
      };
    });

    const startDate = input.startDate ? new Date(input.startDate) : new Date();
    const pricing = calculatePricing(pricingLineInputs, globalDiscountRule, startDate);

    // 5. Generate subscription number
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const subNumber = `SUB-${year}-${rand}`;

    const createdSub = await db.transaction(async (tx) => {
      const [sub] = await tx
        .insert(subscriptions)
        .values({
          businessId,
          subscriptionNumber: subNumber,
          customerId: input.customerId,
          planId: input.planId,
          discountId: input.discountId || null,
          status: 'DRAFT',
          startDate,
          expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
          paymentTerms: input.paymentTerms || 'Net 30 Days',
          totalAmount: toDecimalStr(pricing.amountTotal),
        })
        .returning();

      const itemsToInsert = pricing.lines.map((line) => ({
        subscriptionId: sub.id,
        productId: line.productId,
        productVariantId: line.productVariantId,
        quantity: line.quantity,
        unitPrice: toDecimalStr(line.effectiveUnitPrice),
        discountAmount: toDecimalStr(line.discountAmount),
        taxAmount: toDecimalStr(line.taxAmount),
        subtotal: toDecimalStr(line.subtotal),
      }));

      await tx.insert(subscriptionItems).values(itemsToInsert);

      return sub;
    });

    return this.getSubscriptionById(businessId, createdSub.id);
  }

  /**
   * Execute Subscription Finite State Machine (FSM) Transitions
   */
  async transitionSubscription(
    businessId: string,
    subscriptionId: string,
    input: SubscriptionTransitionInput
  ) {
    const sub = await this.getSubscriptionById(businessId, subscriptionId);
    const plan = sub.plan;
    if (!plan) {
      throw new BadRequestError('Subscription is missing associated Plan');
    }

    switch (input.action) {
      // 1. send_quote: DRAFT -> QUOTATION
      case 'send_quote': {
        if (sub.status !== 'DRAFT') {
          throw new BadRequestError(
            `Cannot send quote for subscription in status '${sub.status}'. Must be in 'DRAFT'.`
          );
        }
        if (sub.items.length === 0) {
          throw new BadRequestError('Subscription must have at least one line item to send quotation');
        }
        if (toNum(sub.totalAmount) <= 0) {
          throw new BadRequestError('Subscription total amount must be greater than zero');
        }

        const [updated] = await db
          .update(subscriptions)
          .set({ status: 'QUOTATION', updatedAt: new Date() })
          .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.businessId, businessId)))
          .returning();

        return {
          message: 'Subscription transitioned to QUOTATION',
          subscription: updated,
        };
      }

      // 2. confirm: DRAFT | QUOTATION -> CONFIRMED
      case 'confirm': {
        if (sub.status !== 'DRAFT' && sub.status !== 'QUOTATION') {
          throw new BadRequestError(
            `Cannot confirm subscription in status '${sub.status}'. Must be in 'DRAFT' or 'QUOTATION'.`
          );
        }

        const [updated] = await db
          .update(subscriptions)
          .set({ status: 'CONFIRMED', updatedAt: new Date() })
          .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.businessId, businessId)))
          .returning();

        return {
          message: 'Subscription confirmed and locked',
          subscription: updated,
        };
      }

      // 3. activate: CONFIRMED -> ACTIVE (Calculates next billing date & generates cycle #1 invoice)
      case 'activate': {
        if (sub.status !== 'CONFIRMED') {
          throw new BadRequestError(
            `Cannot activate subscription in status '${sub.status}'. Must be in 'CONFIRMED'.`
          );
        }

        const now = new Date();
        const nextBilling = computeNextBillingDate(
          now,
          plan.billingCycle,
          plan.intervalCount
        );

        // Generate cycle #1 invoice atomically
        const result = await db.transaction(async (tx) => {
          // Update subscription to ACTIVE
          const [activeSub] = await tx
            .update(subscriptions)
            .set({
              status: 'ACTIVE',
              startDate: now,
              nextBillingDate: nextBilling,
              updatedAt: now,
            })
            .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.businessId, businessId)))
            .returning();

          // Generate Invoice #1
          const year = now.getFullYear();
          const rand = Math.floor(1000 + Math.random() * 9000);
          const invoiceNumber = `INV-${year}-${rand}`;

          const dueDate = new Date(now);
          dueDate.setDate(dueDate.getDate() + 30); // 30-day term default

          const [invoice] = await tx
            .insert(invoices)
            .values({
              businessId,
              invoiceNumber,
              subscriptionId: sub.id,
              customerId: sub.customerId,
              status: 'CONFIRMED',
              invoiceDate: now,
              dueDate,
              subtotal: sub.totalAmount,
              discountTotal: '0.00',
              taxTotal: '0.00',
              amountTotal: sub.totalAmount,
              amountPaid: '0.00',
            })
            .returning();

          // Insert invoice line items
          const invItems = sub.items.map((item) => ({
            invoiceId: invoice.id,
            productId: item.productId,
            productVariantId: item.productVariantId,
            description: `${item.product?.name || 'Service'}${item.productVariant ? ` (${item.productVariant.name})` : ''}`,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxAmount: item.taxAmount,
            subtotal: item.subtotal,
          }));

          await tx.insert(invoiceItems).values(invItems);

          return { activeSub, invoice };
        });

        return {
          message: 'Subscription successfully activated and initial invoice generated',
          subscription: result.activeSub,
          initialInvoice: result.invoice,
        };
      }

      // 4. pause: ACTIVE -> PAUSED
      case 'pause': {
        if (sub.status !== 'ACTIVE') {
          throw new BadRequestError(`Cannot pause subscription in status '${sub.status}'. Must be 'ACTIVE'.`);
        }
        if (!plan.allowPausing) {
          throw new BadRequestError(`Plan '${plan.name}' does not permit pausing subscriptions`);
        }

        const [pausedSub] = await db
          .update(subscriptions)
          .set({ status: 'PAUSED', updatedAt: new Date() })
          .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.businessId, businessId)))
          .returning();

        return {
          message: 'Subscription paused. Recurring billing suspended.',
          subscription: pausedSub,
        };
      }

      // 5. resume: PAUSED -> ACTIVE
      case 'resume': {
        if (sub.status !== 'PAUSED') {
          throw new BadRequestError(`Cannot resume subscription in status '${sub.status}'. Must be 'PAUSED'.`);
        }

        const now = new Date();
        const nextBilling = computeNextBillingDate(
          now,
          plan.billingCycle,
          plan.intervalCount
        );

        const [resumedSub] = await db
          .update(subscriptions)
          .set({
            status: 'ACTIVE',
            nextBillingDate: nextBilling,
            updatedAt: now,
          })
          .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.businessId, businessId)))
          .returning();

        return {
          message: 'Subscription resumed to ACTIVE. Next billing date scheduled.',
          subscription: resumedSub,
        };
      }

      // 6. close: ACTIVE | PAUSED | CONFIRMED -> CLOSED
      case 'close': {
        if (sub.status === 'CLOSED') {
          throw new BadRequestError('Subscription is already closed');
        }

        // If closed prior to expiry, verify plan allows early closure
        if (sub.expiryDate && new Date() < new Date(sub.expiryDate)) {
          if (!plan.allowEarlyClosure) {
            throw new BadRequestError(
              `Plan '${plan.name}' does not allow early closure before term expiry`
            );
          }
        }

        const [closedSub] = await db
          .update(subscriptions)
          .set({
            status: 'CLOSED',
            nextBillingDate: null,
            updatedAt: new Date(),
          })
          .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.businessId, businessId)))
          .returning();

        return {
          message: 'Subscription closed. No future recurring invoices will be generated.',
          subscription: closedSub,
        };
      }

      default:
        throw new BadRequestError(`Unknown transition action '${input.action}'`);
    }
  }
}

export const subscriptionService = new SubscriptionService();
