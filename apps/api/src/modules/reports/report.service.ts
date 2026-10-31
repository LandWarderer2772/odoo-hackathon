import { and, eq, sql, lt, notInArray, gte } from 'drizzle-orm';
import {
  db,
  subscriptions,
  invoices,
  payments,
  plans,
  customers,
} from '@brightloop/db';
import {
  FinanceSummaryResponse,
  AgedReceivablesResponse,
  AgedReceivablesBucket,
  MonthlyRevenueDataPoint,
} from '@brightloop/types';
import { round2, toNum } from '../../utils/pricing.js';

export class ReportService {
  /**
   * Executive Finance Summary: MRR, ARR, Cash Collected, Overdue metrics, and 6-Month Trend
   */
  async getFinanceSummary(businessId: string): Promise<FinanceSummaryResponse> {
    const now = new Date();

    // 1. Fetch active subscriptions with plan billing details to calculate exact MRR
    const activeSubs = await db.query.subscriptions.findMany({
      where: and(eq(subscriptions.businessId, businessId), eq(subscriptions.status, 'ACTIVE')),
      with: {
        plan: true,
      },
    });

    let totalMrr = 0;
    for (const sub of activeSubs) {
      const plan = sub.plan;
      const amount = toNum(sub.totalAmount);
      const intervalCount = Math.max(1, plan?.intervalCount || 1);

      let subMrr = 0;
      switch (plan?.billingCycle) {
        case 'DAILY':
          subMrr = (amount / intervalCount) * (365 / 12);
          break;
        case 'WEEKLY':
          subMrr = ((amount / intervalCount) * 52) / 12;
          break;
        case 'MONTHLY':
          subMrr = amount / intervalCount;
          break;
        case 'YEARLY':
          subMrr = (amount / intervalCount) / 12;
          break;
        default:
          subMrr = amount;
          break;
      }
      totalMrr = round2(totalMrr + subMrr);
    }

    const arr = round2(totalMrr * 12);

    // 2. Fetch total cash collected from payments
    const [cashResult] = await db
      .select({
        totalCollected: sql<string>`COALESCE(SUM(amount), '0.00')`,
      })
      .from(payments)
      .where(eq(payments.businessId, businessId));

    const totalRevenueCollected = round2(toNum(cashResult?.totalCollected || 0));

    // 3. Fetch overdue invoices summary
    const overdueInvoices = await db.query.invoices.findMany({
      where: and(
        eq(invoices.businessId, businessId),
        lt(invoices.dueDate, now),
        notInArray(invoices.status, ['PAID', 'CANCELLED'])
      ),
    });

    let overdueAmountTotal = 0;
    for (const inv of overdueInvoices) {
      const balance = toNum(inv.amountTotal) - toNum(inv.amountPaid);
      if (balance > 0) {
        overdueAmountTotal = round2(overdueAmountTotal + balance);
      }
    }

    // 4. Generate 6-month historical/trend revenue data points
    const monthlyRevenueTrend: MonthlyRevenueDataPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      // Cash collected in this month
      const [mPayment] = await db
        .select({
          collected: sql<string>`COALESCE(SUM(amount), '0.00')`,
        })
        .from(payments)
        .where(
          and(
            eq(payments.businessId, businessId),
            gte(payments.paymentDate, startOfMonth),
            lt(payments.paymentDate, endOfMonth)
          )
        );

      monthlyRevenueTrend.push({
        month: monthStr,
        mrr: totalMrr, // Baseline or normalized MRR
        collected: round2(toNum(mPayment?.collected || 0)),
      });
    }

    return {
      activeSubscriptionsCount: activeSubs.length,
      mrr: totalMrr,
      arr,
      totalRevenueCollected,
      overdueInvoicesCount: overdueInvoices.length,
      overdueAmountTotal,
      monthlyRevenueTrend,
    };
  }

  /**
   * Aged Receivables Ledger Breakdown (Current, 1-30, 31-60, 61-90, 90+ days)
   */
  async getAgedReceivables(businessId: string): Promise<AgedReceivablesResponse> {
    const now = new Date();

    // Query all outstanding unpaid invoices
    const unpaidInvoices = await db.query.invoices.findMany({
      where: and(
        eq(invoices.businessId, businessId),
        notInArray(invoices.status, ['PAID', 'CANCELLED']),
        sql`${invoices.amountTotal} > ${invoices.amountPaid}`
      ),
      with: {
        customer: true,
      },
    });

    const buckets: Record<
      'CURRENT' | '1_30_DAYS' | '31_60_DAYS' | '61_90_DAYS' | '90_PLUS_DAYS',
      { invoiceCount: number; amount: number; label: string }
    > = {
      CURRENT: { label: 'Current (Not Due)', invoiceCount: 0, amount: 0 },
      '1_30_DAYS': { label: '1 - 30 Days Overdue', invoiceCount: 0, amount: 0 },
      '31_60_DAYS': { label: '31 - 60 Days Overdue', invoiceCount: 0, amount: 0 },
      '61_90_DAYS': { label: '61 - 90 Days Overdue', invoiceCount: 0, amount: 0 },
      '90_PLUS_DAYS': { label: '90+ Days Overdue', invoiceCount: 0, amount: 0 },
    };

    let totalOverdueAmount = 0;

    for (const inv of unpaidInvoices) {
      const balance = round2(toNum(inv.amountTotal) - toNum(inv.amountPaid));
      if (balance <= 0) continue;

      const dueDate = new Date(inv.dueDate);
      const diffMs = now.getTime() - dueDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        buckets.CURRENT.invoiceCount += 1;
        buckets.CURRENT.amount = round2(buckets.CURRENT.amount + balance);
      } else if (diffDays <= 30) {
        buckets['1_30_DAYS'].invoiceCount += 1;
        buckets['1_30_DAYS'].amount = round2(buckets['1_30_DAYS'].amount + balance);
        totalOverdueAmount = round2(totalOverdueAmount + balance);
      } else if (diffDays <= 60) {
        buckets['31_60_DAYS'].invoiceCount += 1;
        buckets['31_60_DAYS'].amount = round2(buckets['31_60_DAYS'].amount + balance);
        totalOverdueAmount = round2(totalOverdueAmount + balance);
      } else if (diffDays <= 90) {
        buckets['61_90_DAYS'].invoiceCount += 1;
        buckets['61_90_DAYS'].amount = round2(buckets['61_90_DAYS'].amount + balance);
        totalOverdueAmount = round2(totalOverdueAmount + balance);
      } else {
        buckets['90_PLUS_DAYS'].invoiceCount += 1;
        buckets['90_PLUS_DAYS'].amount = round2(buckets['90_PLUS_DAYS'].amount + balance);
        totalOverdueAmount = round2(totalOverdueAmount + balance);
      }
    }

    const bucketArray: AgedReceivablesBucket[] = [
      { bucket: 'CURRENT', label: buckets.CURRENT.label, invoiceCount: buckets.CURRENT.invoiceCount, amount: buckets.CURRENT.amount },
      { bucket: '1_30_DAYS', label: buckets['1_30_DAYS'].label, invoiceCount: buckets['1_30_DAYS'].invoiceCount, amount: buckets['1_30_DAYS'].amount },
      { bucket: '31_60_DAYS', label: buckets['31_60_DAYS'].label, invoiceCount: buckets['31_60_DAYS'].invoiceCount, amount: buckets['31_60_DAYS'].amount },
      { bucket: '61_90_DAYS', label: buckets['61_90_DAYS'].label, invoiceCount: buckets['61_90_DAYS'].invoiceCount, amount: buckets['61_90_DAYS'].amount },
      { bucket: '90_PLUS_DAYS', label: buckets['90_PLUS_DAYS'].label, invoiceCount: buckets['90_PLUS_DAYS'].invoiceCount, amount: buckets['90_PLUS_DAYS'].amount },
    ];

    return {
      buckets: bucketArray,
      totalOverdueAmount,
      asOfDate: now.toISOString(),
    };
  }

  /**
   * Subscription Lifecycle & Plan Distribution Analytics
   */
  async getSubscriptionAnalytics(businessId: string) {
    const subs = await db.query.subscriptions.findMany({
      where: eq(subscriptions.businessId, businessId),
      with: {
        plan: true,
      },
    });

    const statusCounts: Record<string, number> = {
      DRAFT: 0,
      QUOTATION: 0,
      CONFIRMED: 0,
      ACTIVE: 0,
      PAUSED: 0,
      CLOSED: 0,
    };

    const planCounts: Record<string, { planName: string; activeCount: number; totalCount: number }> = {};

    for (const sub of subs) {
      if (statusCounts[sub.status] !== undefined) {
        statusCounts[sub.status] += 1;
      }

      if (sub.plan) {
        if (!planCounts[sub.plan.id]) {
          planCounts[sub.plan.id] = {
            planName: sub.plan.name,
            activeCount: 0,
            totalCount: 0,
          };
        }
        planCounts[sub.plan.id].totalCount += 1;
        if (sub.status === 'ACTIVE') {
          planCounts[sub.plan.id].activeCount += 1;
        }
      }
    }

    return {
      totalSubscriptions: subs.length,
      statusDistribution: statusCounts,
      planDistribution: Object.values(planCounts),
    };
  }
}

export const reportService = new ReportService();
