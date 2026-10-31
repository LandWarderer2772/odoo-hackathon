import { and, eq, desc, sql, inArray, or, ilike, lt, notInArray } from 'drizzle-orm';
import {
  db,
  invoices,
  invoiceItems,
  customers,
  subscriptions,
  businesses,
  plans,
  payments,
  paymentAllocations,
  Invoice,
} from '@brightloop/db';
import {
  CreateInvoiceInput,
  InvoiceQueryInput,
  UpdateInvoiceStatusInput,
} from './invoice.schema.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import { round2, toDecimalStr, toNum } from '../../utils/pricing.js';
import { computeNextBillingDate } from '../subscriptions/subscription.service.js';

export class InvoiceService {
  /**
   * List invoices with filtering, overdue detection, and pagination
   */
  async listInvoices(businessId: string, query: InvoiceQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;
    const now = new Date();

    const conditions = [eq(invoices.businessId, businessId)];

    if (query.customerId) {
      conditions.push(eq(invoices.customerId, query.customerId));
    }
    if (query.subscriptionId) {
      conditions.push(eq(invoices.subscriptionId, query.subscriptionId));
    }
    if (query.status) {
      conditions.push(eq(invoices.status, query.status));
    }

    if (query.overdueOnly) {
      conditions.push(
        lt(invoices.dueDate, now),
        notInArray(invoices.status, ['PAID', 'CANCELLED'])
      );
    }

    if (query.search && query.search.trim() !== '') {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(invoices.invoiceNumber, term),
          ilike(customers.name, term),
          ilike(customers.email, term)
        )!
      );
    }

    const whereClause = and(...conditions);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .where(whereClause);

    const total = countResult?.count || 0;

    const rawList = await db.query.invoices.findMany({
      where: and(
        eq(invoices.businessId, businessId),
        query.customerId ? eq(invoices.customerId, query.customerId) : undefined,
        query.subscriptionId ? eq(invoices.subscriptionId, query.subscriptionId) : undefined,
        query.status ? eq(invoices.status, query.status) : undefined,
        query.overdueOnly
          ? and(lt(invoices.dueDate, now), notInArray(invoices.status, ['PAID', 'CANCELLED']))
          : undefined
      ),
      orderBy: [desc(invoices.invoiceDate), desc(invoices.createdAt)],
      limit,
      offset,
      with: {
        customer: true,
        subscription: {
          with: {
            plan: true,
          },
        },
        items: true,
        allocations: {
          with: {
            payment: true,
          },
        },
      },
    });

    // Decorate with financial calculations
    const items = rawList.map((inv) => {
      const totalAmount = toNum(inv.amountTotal);
      const paidAmount = toNum(inv.amountPaid);
      const balanceDue = round2(totalAmount - paidAmount);
      const isOverdue =
        inv.status !== 'PAID' && inv.status !== 'CANCELLED' && new Date(inv.dueDate) < now;

      return {
        ...inv,
        balanceDue,
        isOverdue,
      };
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
   * Get single invoice by ID with full itemization and payment ledger
   */
  async getInvoiceById(businessId: string, invoiceId: string) {
    const inv = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, invoiceId), eq(invoices.businessId, businessId)),
      with: {
        customer: true,
        subscription: {
          with: {
            plan: true,
          },
        },
        items: {
          with: {
            product: true,
            productVariant: true,
          },
        },
        allocations: {
          with: {
            payment: true,
          },
        },
      },
    });

    if (!inv) {
      throw new NotFoundError(`Invoice with ID '${invoiceId}' not found`);
    }

    const now = new Date();
    const totalAmount = toNum(inv.amountTotal);
    const paidAmount = toNum(inv.amountPaid);
    const balanceDue = round2(totalAmount - paidAmount);
    const isOverdue =
      inv.status !== 'PAID' && inv.status !== 'CANCELLED' && new Date(inv.dueDate) < now;

    return {
      ...inv,
      balanceDue,
      isOverdue,
    };
  }

  /**
   * Create an ad-hoc or custom invoice
   */
  async createInvoice(businessId: string, input: CreateInvoiceInput) {
    // 1. Verify customer
    const customer = await db.query.customers.findFirst({
      where: and(eq(customers.id, input.customerId), eq(customers.businessId, businessId)),
    });
    if (!customer) {
      throw new NotFoundError(`Customer with ID '${input.customerId}' not found`);
    }

    // 2. Verify subscription if provided
    if (input.subscriptionId) {
      const sub = await db.query.subscriptions.findFirst({
        where: and(eq(subscriptions.id, input.subscriptionId), eq(subscriptions.businessId, businessId)),
      });
      if (!sub) {
        throw new NotFoundError(`Subscription with ID '${input.subscriptionId}' not found`);
      }
    }

    // 3. Compute line items
    let subtotal = 0;
    let taxTotal = 0;

    const processedLines = input.items.map((line) => {
      const qty = Math.max(1, line.quantity);
      const unitPrice = round2(line.unitPrice);
      const lineSubtotal = round2(qty * unitPrice);
      const taxRate = line.taxRate || 0;
      const lineTax = taxRate > 0 ? round2((lineSubtotal * taxRate) / 100) : 0;

      subtotal = round2(subtotal + lineSubtotal);
      taxTotal = round2(taxTotal + lineTax);

      return {
        productId: line.productId || null,
        productVariantId: line.productVariantId || null,
        description: line.description,
        quantity: qty,
        unitPrice: toDecimalStr(unitPrice),
        taxAmount: toDecimalStr(lineTax),
        subtotal: toDecimalStr(lineSubtotal),
      };
    });

    const amountTotal = round2(subtotal + taxTotal);

    // 4. Set invoice dates
    const invoiceDate = new Date();
    const dueDate = input.dueDate
      ? new Date(input.dueDate)
      : new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    // 5. Generate unique invoice number
    const year = invoiceDate.getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${year}-${rand}`;

    const created = await db.transaction(async (tx) => {
      const [inv] = await tx
        .insert(invoices)
        .values({
          businessId,
          invoiceNumber,
          subscriptionId: input.subscriptionId || null,
          customerId: input.customerId,
          status: 'CONFIRMED',
          invoiceDate,
          dueDate,
          subtotal: toDecimalStr(subtotal),
          discountTotal: '0.00',
          taxTotal: toDecimalStr(taxTotal),
          amountTotal: toDecimalStr(amountTotal),
          amountPaid: '0.00',
        })
        .returning();

      const itemsWithId = processedLines.map((l) => ({
        ...l,
        invoiceId: inv.id,
      }));

      await tx.insert(invoiceItems).values(itemsWithId);

      return inv;
    });

    return this.getInvoiceById(businessId, created.id);
  }

  /**
   * Confirm a draft invoice
   */
  async confirmInvoice(businessId: string, invoiceId: string) {
    const inv = await this.getInvoiceById(businessId, invoiceId);
    if (inv.status !== 'DRAFT') {
      throw new BadRequestError(`Invoice is already in '${inv.status}' status`);
    }

    const [updated] = await db
      .update(invoices)
      .set({ status: 'CONFIRMED', updatedAt: new Date() })
      .where(and(eq(invoices.id, invoiceId), eq(invoices.businessId, businessId)))
      .returning();

    return updated;
  }

  /**
   * Cancel an invoice
   */
  async cancelInvoice(businessId: string, invoiceId: string, reason?: string) {
    const inv = await this.getInvoiceById(businessId, invoiceId);
    if (inv.status === 'PAID') {
      throw new BadRequestError('Cannot cancel a fully paid invoice. Process a refund first.');
    }
    if (toNum(inv.amountPaid) > 0) {
      throw new BadRequestError(
        'Cannot cancel an invoice with allocated payments. Deallocate payments first.'
      );
    }

    const [updated] = await db
      .update(invoices)
      .set({ status: 'CANCELLED', updatedAt: new Date() })
      .where(and(eq(invoices.id, invoiceId), eq(invoices.businessId, businessId)))
      .returning();

    return updated;
  }

  /**
   * Recurring Billing Engine: Generate Invoices Due for Active Subscriptions
   * Idempotent automated billing run
   */
  async generateDueInvoices(businessId: string, cutoffDate: Date = new Date()) {
    // 1. Find all active subscriptions whose nextBillingDate is on or before cutoffDate
    const dueSubscriptions = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.businessId, businessId),
        eq(subscriptions.status, 'ACTIVE'),
        sql`${subscriptions.nextBillingDate} IS NOT NULL AND ${subscriptions.nextBillingDate} <= ${cutoffDate}`
      ),
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

    if (dueSubscriptions.length === 0) {
      return {
        message: 'No subscriptions currently due for recurring billing',
        processedCount: 0,
        invoicesGenerated: [],
        totalBilled: 0,
      };
    }

    const generatedInvoices: Array<{
      invoiceId: string;
      invoiceNumber: string;
      subscriptionId: string;
      amount: number;
    }> = [];
    let totalBilled = 0;

    for (const sub of dueSubscriptions) {
      const plan = sub.plan;
      if (!plan) continue;

      const now = new Date();
      const currentBillingDate = sub.nextBillingDate || now;

      // Advance next billing date
      const nextBilling = computeNextBillingDate(
        currentBillingDate,
        plan.billingCycle,
        plan.intervalCount
      );

      // Generate invoice number
      const year = now.getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      const invoiceNumber = `INV-${year}-${rand}`;

      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 30);

      const invAmount = toNum(sub.totalAmount);

      await db.transaction(async (tx) => {
        // Create confirmed invoice
        const [inv] = await tx
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

        // Copy subscription line items to invoice items
        const invLines = sub.items.map((item) => ({
          invoiceId: inv.id,
          productId: item.productId,
          productVariantId: item.productVariantId,
          description: `${item.product?.name || 'Service'}${item.productVariant ? ` (${item.productVariant.name})` : ''}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxAmount: item.taxAmount,
          subtotal: item.subtotal,
        }));

        await tx.insert(invoiceItems).values(invLines);

        // Advance subscription nextBillingDate
        await tx
          .update(subscriptions)
          .set({
            nextBillingDate: nextBilling,
            updatedAt: now,
          })
          .where(eq(subscriptions.id, sub.id));

        generatedInvoices.push({
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          subscriptionId: sub.id,
          amount: invAmount,
        });

        totalBilled = round2(totalBilled + invAmount);
      });
    }

    return {
      message: `Successfully processed ${dueSubscriptions.length} subscriptions and generated ${generatedInvoices.length} invoices`,
      processedCount: dueSubscriptions.length,
      invoicesGenerated: generatedInvoices,
      totalBilled,
    };
  }

  /**
   * Render HTML Printable Invoice Document
   */
  async renderInvoiceHtml(businessId: string, invoiceId: string): Promise<string> {
    const inv = await this.getInvoiceById(businessId, invoiceId);
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.id, businessId),
    });

    const businessName = business?.name || 'Aetheria Subscription Management';
    const invoiceDateStr = new Date(inv.invoiceDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const dueDateStr = new Date(inv.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const rowsHtml = inv.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 600; color: #111827;">${item.description}</div>
        </td>
        <td style="padding: 12px 16px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #374151;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151;">
          $${toNum(item.unitPrice).toFixed(2)}
        </td>
        <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">
          $${toNum(item.subtotal).toFixed(2)}
        </td>
      </tr>`
      )
      .join('');

    const statusBadgeColor =
      inv.status === 'PAID'
        ? 'background-color: #d1fae5; color: #065f46;'
        : inv.isOverdue
          ? 'background-color: #fee2e2; color: #991b1b;'
          : 'background-color: #fef3c7; color: #92400e;';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${inv.invoiceNumber} - ${businessName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #1f2937; background: #f9fafb; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 48px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice-card { box-shadow: none; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 800px; margin: 0 auto 20px auto; display: flex; justify-content: flex-end;">
    <button onclick="window.print()" style="background: #2563eb; color: #fff; padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
  </div>
  <div class="invoice-card">
    <div class="header">
      <div>
        <h1 style="margin: 0 0 8px 0; font-size: 26px; color: #111827;">${businessName}</h1>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Billed from: ${business?.slug || 'brightloop'}.aetheria.io</p>
      </div>
      <div style="text-align: right;">
        <span class="badge" style="${statusBadgeColor}">${inv.status}${inv.isOverdue ? ' (OVERDUE)' : ''}</span>
        <h2 style="margin: 12px 0 4px 0; font-size: 22px; color: #111827;">${inv.invoiceNumber}</h2>
        <div style="color: #6b7280; font-size: 13px;">Date: ${invoiceDateStr}</div>
        <div style="color: #6b7280; font-size: 13px;">Due Date: <strong>${dueDateStr}</strong></div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <div>
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px;">Billed To</div>
        <div style="font-weight: 700; color: #111827; font-size: 16px;">${inv.customer.name}</div>
        ${inv.customer.companyName ? `<div style="color: #4b5563; font-size: 14px;">${inv.customer.companyName}</div>` : ''}
        <div style="color: #4b5563; font-size: 14px;">${inv.customer.email}</div>
        ${inv.customer.phone ? `<div style="color: #4b5563; font-size: 14px;">${inv.customer.phone}</div>` : ''}
        ${inv.customer.address ? `<div style="color: #6b7280; font-size: 14px; margin-top: 4px;">${inv.customer.address}</div>` : ''}
      </div>
      ${
        inv.subscription
          ? `<div>
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px;">Subscription Details</div>
        <div style="color: #111827; font-size: 14px; font-weight: 600;">#${inv.subscription.subscriptionNumber}</div>
        <div style="color: #4b5563; font-size: 14px;">Plan: ${inv.subscription.plan.name}</div>
      </div>`
          : ''
      }
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
      <thead>
        <tr style="background: #f9fafb; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">
          <th style="padding: 12px 16px; border-bottom: 2px solid #e5e7eb;">Description</th>
          <th style="padding: 12px 16px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
          <th style="padding: 12px 16px; text-align: right; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
          <th style="padding: 12px 16px; text-align: right; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div style="display: flex; justify-content: flex-end;">
      <div style="width: 280px;">
        <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #4b5563; font-size: 14px;">
          <span>Subtotal:</span>
          <span>$${toNum(inv.subtotal).toFixed(2)}</span>
        </div>
        ${
          toNum(inv.taxTotal) > 0
            ? `<div style="display: flex; justify-content: space-between; padding: 6px 0; color: #4b5563; font-size: 14px;">
          <span>Tax:</span>
          <span>$${toNum(inv.taxTotal).toFixed(2)}</span>
        </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #e5e7eb; font-size: 18px; font-weight: 700; color: #111827;">
          <span>Total:</span>
          <span>$${toNum(inv.amountTotal).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #059669; font-size: 14px;">
          <span>Amount Paid:</span>
          <span>-$${toNum(inv.amountPaid).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px dashed #e5e7eb; font-size: 16px; font-weight: 700; color: ${inv.balanceDue > 0 ? '#dc2626' : '#059669'};">
          <span>Balance Due:</span>
          <span>$${inv.balanceDue.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; text-align: center;">
      Thank you for your business. For questions, contact support@${business?.slug || 'brightloop'}.com.
    </div>
  </div>
</body>
</html>`;
  }
}

export const invoiceService = new InvoiceService();
