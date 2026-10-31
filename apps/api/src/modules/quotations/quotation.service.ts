import { and, eq, desc, sql, inArray } from 'drizzle-orm';
import {
  db,
  quotations,
  quotationItems,
  customers,
  products,
  productVariants,
  subscriptions,
  subscriptionItems,
  plans,
  Quotation,
} from '@brightloop/db';
import { CreateQuotationInput, QuotationQueryInput } from './quotation.schema.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import { calculatePricing, round2, toDecimalStr, toNum } from '../../utils/pricing.js';

export class QuotationService {
  /**
   * List quotations for a business with customer & plan details
   */
  async listQuotations(businessId: string, query: QuotationQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(quotations.businessId, businessId)];

    if (query.customerId) {
      conditions.push(eq(quotations.customerId, query.customerId));
    }
    if (query.status) {
      conditions.push(eq(quotations.status, query.status));
    }

    const whereClause = and(...conditions);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(quotations)
      .where(whereClause);

    const total = countResult?.count || 0;

    const list = await db.query.quotations.findMany({
      where: whereClause,
      orderBy: [desc(quotations.createdAt)],
      limit,
      offset,
      with: {
        customer: true,
        plan: true,
        items: {
          with: {
            product: true,
            productVariant: true,
          },
        },
      },
    });

    return {
      items: list,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single quotation with full item breakdown
   */
  async getQuotationById(businessId: string, quotationId: string) {
    const quote = await db.query.quotations.findFirst({
      where: and(eq(quotations.id, quotationId), eq(quotations.businessId, businessId)),
      with: {
        customer: true,
        plan: true,
        items: {
          with: {
            product: true,
            productVariant: true,
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundError(`Quotation with ID '${quotationId}' not found`);
    }

    return quote;
  }

  /**
   * Create a new sales quotation from template or scratch
   */
  async createQuotation(businessId: string, input: CreateQuotationInput) {
    // Verify customer exists within business
    const customer = await db.query.customers.findFirst({
      where: and(eq(customers.id, input.customerId), eq(customers.businessId, businessId)),
    });
    if (!customer) {
      throw new NotFoundError(`Customer with ID '${input.customerId}' not found`);
    }

    // Verify plan if provided
    if (input.planId) {
      const plan = await db.query.plans.findFirst({
        where: and(eq(plans.id, input.planId), eq(plans.businessId, businessId)),
      });
      if (!plan) {
        throw new NotFoundError(`Plan with ID '${input.planId}' not found`);
      }
    }

    // Resolve products and variant surcharges
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

    const pricing = calculatePricing(pricingLineInputs);

    // Calculate expiration date
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (input.validityDays || 15));

    // Save quotation and items atomically
    const newQuote = await db.transaction(async (tx) => {
      const [quote] = await tx
        .insert(quotations)
        .values({
          businessId,
          customerId: input.customerId,
          planId: input.planId || null,
          status: 'DRAFT',
          totalAmount: toDecimalStr(pricing.amountTotal),
          validUntil,
        })
        .returning();

      const itemsToInsert = pricing.lines.map((line) => ({
        quotationId: quote.id,
        productId: line.productId,
        productVariantId: line.productVariantId,
        quantity: line.quantity,
        unitPrice: toDecimalStr(line.effectiveUnitPrice),
        subtotal: toDecimalStr(line.subtotal),
      }));

      await tx.insert(quotationItems).values(itemsToInsert);

      return quote;
    });

    return this.getQuotationById(businessId, newQuote.id);
  }

  /**
   * Send quotation to customer (marks as SENT)
   */
  async sendQuotation(businessId: string, quotationId: string) {
    const quote = await this.getQuotationById(businessId, quotationId);

    if (quote.status !== 'DRAFT') {
      throw new BadRequestError(`Cannot send quotation in '${quote.status}' status`);
    }

    const [updated] = await db
      .update(quotations)
      .set({
        status: 'SENT',
        updatedAt: new Date(),
      })
      .where(and(eq(quotations.id, quotationId), eq(quotations.businessId, businessId)))
      .returning();

    return updated;
  }

  /**
   * Accept quotation and automatically promote to a CONFIRMED subscription
   */
  async acceptQuotation(businessId: string, quotationId: string) {
    const quote = await this.getQuotationById(businessId, quotationId);

    if (quote.status === 'ACCEPTED') {
      throw new BadRequestError('Quotation is already accepted');
    }

    if (quote.status === 'REJECTED' || quote.status === 'EXPIRED') {
      throw new BadRequestError(`Cannot accept a ${quote.status.toLowerCase()} quotation`);
    }

    if (!quote.planId) {
      throw new BadRequestError('Cannot convert quote to subscription without a linked Plan');
    }

    // Check expiration
    if (quote.validUntil && new Date() > new Date(quote.validUntil)) {
      await db
        .update(quotations)
        .set({ status: 'EXPIRED', updatedAt: new Date() })
        .where(eq(quotations.id, quotationId));
      throw new BadRequestError('Quotation has expired and cannot be accepted');
    }

    // Convert into a CONFIRMED subscription
    const result = await db.transaction(async (tx) => {
      // 1. Mark quote accepted
      await tx
        .update(quotations)
        .set({ status: 'ACCEPTED', updatedAt: new Date() })
        .where(eq(quotations.id, quotationId));

      // 2. Generate unique subscription number: SUB-YYYY-RANDOM
      const year = new Date().getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      const subNumber = `SUB-${year}-${rand}`;

      // 3. Create confirmed subscription
      const [sub] = await tx
        .insert(subscriptions)
        .values({
          businessId,
          subscriptionNumber: subNumber,
          customerId: quote.customerId,
          planId: quote.planId!,
          status: 'CONFIRMED',
          startDate: new Date(),
          totalAmount: quote.totalAmount,
        })
        .returning();

      // 4. Copy line items
      const subItems = quote.items.map((item) => ({
        subscriptionId: sub.id,
        productId: item.productId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      }));

      await tx.insert(subscriptionItems).values(subItems);

      return sub;
    });

    return {
      message: 'Quotation accepted and subscription created',
      quotationId,
      subscription: result,
    };
  }

  /**
   * Reject quotation
   */
  async rejectQuotation(businessId: string, quotationId: string, reason?: string) {
    const quote = await this.getQuotationById(businessId, quotationId);

    if (quote.status === 'ACCEPTED') {
      throw new BadRequestError('Cannot reject an already accepted quotation');
    }

    const [updated] = await db
      .update(quotations)
      .set({
        status: 'REJECTED',
        updatedAt: new Date(),
      })
      .where(and(eq(quotations.id, quotationId), eq(quotations.businessId, businessId)))
      .returning();

    return updated;
  }
}

export const quotationService = new QuotationService();
