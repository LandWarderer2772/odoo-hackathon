import { and, eq, desc, sql, or, ilike } from 'drizzle-orm';
import {
  db,
  payments,
  paymentAllocations,
  invoices,
  customers,
  Payment,
} from '@brightloop/db';
import { RecordPaymentInput, PaymentQueryInput } from './payment.schema.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import { round2, toDecimalStr, toNum } from '../../utils/pricing.js';

export class PaymentService {
  /**
   * List payments with filtering, allocations, and customer details
   */
  async listPayments(businessId: string, query: PaymentQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(payments.businessId, businessId)];

    if (query.customerId) {
      conditions.push(eq(payments.customerId, query.customerId));
    }

    if (query.search && query.search.trim() !== '') {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(payments.paymentReference, term),
          ilike(customers.name, term),
          ilike(customers.email, term)
        )!
      );
    }

    const whereClause = and(...conditions);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(payments)
      .leftJoin(customers, eq(payments.customerId, customers.id))
      .where(whereClause);

    const total = countResult?.count || 0;

    const items = await db.query.payments.findMany({
      where: and(
        eq(payments.businessId, businessId),
        query.customerId ? eq(payments.customerId, query.customerId) : undefined
      ),
      orderBy: [desc(payments.paymentDate), desc(payments.createdAt)],
      limit,
      offset,
      with: {
        customer: true,
        allocations: {
          with: {
            invoice: true,
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
   * Get payment details with customer and invoice allocations
   */
  async getPaymentById(businessId: string, paymentId: string) {
    const payment = await db.query.payments.findFirst({
      where: and(eq(payments.id, paymentId), eq(payments.businessId, businessId)),
      with: {
        customer: true,
        allocations: {
          with: {
            invoice: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError(`Payment with ID '${paymentId}' not found`);
    }

    return payment;
  }

  /**
   * Record payment and allocate against an invoice atomically
   */
  async recordPayment(businessId: string, input: RecordPaymentInput) {
    // 1. Verify invoice belongs to business
    const inv = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, input.invoiceId), eq(invoices.businessId, businessId)),
      with: {
        customer: true,
      },
    });

    if (!inv) {
      throw new NotFoundError(`Invoice with ID '${input.invoiceId}' not found`);
    }

    // 2. Validate invoice status
    if (inv.status === 'CANCELLED') {
      throw new BadRequestError('Cannot record payment for a cancelled invoice');
    }
    if (inv.status === 'DRAFT') {
      throw new BadRequestError('Cannot record payment for a draft invoice. Please confirm invoice first.');
    }

    const amountTotal = toNum(inv.amountTotal);
    const currentPaid = toNum(inv.amountPaid);
    const balanceDue = round2(amountTotal - currentPaid);

    if (balanceDue <= 0 && inv.status === 'PAID') {
      throw new BadRequestError('Invoice is already fully paid');
    }

    // 3. Check for overpayment
    const payAmount = round2(input.amount);
    if (payAmount > balanceDue) {
      throw new BadRequestError(
        `Payment amount ($${payAmount.toFixed(2)}) exceeds remaining invoice balance due ($${balanceDue.toFixed(2)})`
      );
    }

    // 4. Generate payment reference
    const now = input.paymentDate ? new Date(input.paymentDate) : new Date();
    const year = now.getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const reference = input.paymentReference || `PAY-${year}-${rand}`;

    // 5. Execute payment record and allocation in atomic transaction
    const result = await db.transaction(async (tx) => {
      // Insert payment
      const [payment] = await tx
        .insert(payments)
        .values({
          businessId,
          paymentReference: reference,
          customerId: inv.customerId,
          method: input.method,
          amount: toDecimalStr(payAmount),
          paymentDate: now,
          notes: input.notes || null,
        })
        .returning();

      // Insert allocation
      const [allocation] = await tx
        .insert(paymentAllocations)
        .values({
          paymentId: payment.id,
          invoiceId: inv.id,
          amount: toDecimalStr(payAmount),
          allocatedAt: now,
        })
        .returning();

      // Compute new invoice paid total and status
      const newPaidTotal = round2(currentPaid + payAmount);
      const newStatus =
        newPaidTotal >= amountTotal ? 'PAID' : newPaidTotal > 0 ? 'PARTIALLY_PAID' : inv.status;

      const [updatedInvoice] = await tx
        .update(invoices)
        .set({
          amountPaid: toDecimalStr(newPaidTotal),
          status: newStatus,
          updatedAt: now,
        })
        .where(eq(invoices.id, inv.id))
        .returning();

      return {
        payment,
        allocation,
        updatedInvoice,
      };
    });

    return {
      message: `Payment of $${payAmount.toFixed(2)} recorded and allocated to ${inv.invoiceNumber}`,
      payment: result.payment,
      allocation: result.allocation,
      invoice: {
        id: result.updatedInvoice.id,
        invoiceNumber: result.updatedInvoice.invoiceNumber,
        status: result.updatedInvoice.status,
        amountTotal: result.updatedInvoice.amountTotal,
        amountPaid: result.updatedInvoice.amountPaid,
        remainingBalance: round2(amountTotal - toNum(result.updatedInvoice.amountPaid)),
      },
    };
  }
}

export const paymentService = new PaymentService();
