import { and, eq, ilike, or, desc, asc, sql } from 'drizzle-orm';
import { db, customers, subscriptions, invoices, payments, users, Customer } from '@brightloop/db';
import { CreateCustomerInput, CustomerQueryInput, UpdateCustomerInput } from './customer.schema.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../utils/errors.js';

export class CustomerService {
  /**
   * List customers for a specific business with search, pagination, and financial aggregates
   */
  async listCustomers(businessId: string, query: CustomerQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(customers.businessId, businessId)];

    if (query.search && query.search.trim() !== '') {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(customers.name, term),
          ilike(customers.email, term),
          ilike(customers.companyName, term),
          ilike(customers.phone, term)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(customers)
      .where(whereClause);

    const total = countResult?.count || 0;

    // Sorting
    const sortField =
      query.sortBy === 'name'
        ? customers.name
        : query.sortBy === 'email'
        ? customers.email
        : query.sortBy === 'companyName'
        ? customers.companyName
        : customers.createdAt;

    const orderFn = query.sortOrder === 'asc' ? asc : desc;

    // Fetch customers
    const customerList = await db
      .select()
      .from(customers)
      .where(whereClause)
      .orderBy(orderFn(sortField))
      .limit(limit)
      .offset(offset);

    // Fetch aggregate financial metrics for the fetched customers
    const customerIds = customerList.map((c) => c.id);

    let metricsMap: Record<
      string,
      {
        activeSubscriptionsCount: number;
        totalInvoicesCount: number;
        unpaidBalance: number;
        totalPaid: number;
      }
    > = {};

    if (customerIds.length > 0) {
      // Aggregate active subscriptions
      const subAggregates = await db
        .select({
          customerId: subscriptions.customerId,
          activeCount: sql<number>`count(case when ${subscriptions.status} = 'ACTIVE' then 1 end)::int`,
        })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.businessId, businessId),
            sql`${subscriptions.customerId} IN ${customerIds}`
          )
        )
        .groupBy(subscriptions.customerId);

      // Aggregate invoices balance and payments
      const invAggregates = await db
        .select({
          customerId: invoices.customerId,
          invoicesCount: sql<number>`count(*)::int`,
          unpaidBalance: sql<number>`coalesce(sum(case when ${invoices.status} not in ('PAID', 'CANCELLED') then (${invoices.amountTotal} - ${invoices.amountPaid}) else 0 end), 0)::float`,
          totalPaid: sql<number>`coalesce(sum(${invoices.amountPaid}), 0)::float`,
        })
        .from(invoices)
        .where(
          and(
            eq(invoices.businessId, businessId),
            sql`${invoices.customerId} IN ${customerIds}`
          )
        )
        .groupBy(invoices.customerId);

      for (const id of customerIds) {
        const sub = subAggregates.find((s) => s.customerId === id);
        const inv = invAggregates.find((i) => i.customerId === id);
        metricsMap[id] = {
          activeSubscriptionsCount: sub?.activeCount || 0,
          totalInvoicesCount: inv?.invoicesCount || 0,
          unpaidBalance: Math.round(((inv?.unpaidBalance || 0) + Number.EPSILON) * 100) / 100,
          totalPaid: Math.round(((inv?.totalPaid || 0) + Number.EPSILON) * 100) / 100,
        };
      }
    }

    const items = customerList.map((cust) => ({
      ...cust,
      metrics: metricsMap[cust.id] || {
        activeSubscriptionsCount: 0,
        totalInvoicesCount: 0,
        unpaidBalance: 0,
        totalPaid: 0,
      },
    }));

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
   * Get customer by ID with full financial relationships and profile
   */
  async getCustomerById(businessId: string, customerId: string) {
    const customer = await db.query.customers.findFirst({
      where: and(eq(customers.id, customerId), eq(customers.businessId, businessId)),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        subscriptions: {
          orderBy: (sub, { desc }) => [desc(sub.createdAt)],
          limit: 10,
          with: {
            plan: true,
          },
        },
        invoices: {
          orderBy: (inv, { desc }) => [desc(inv.createdAt)],
          limit: 10,
        },
        payments: {
          orderBy: (p, { desc }) => [desc(p.createdAt)],
          limit: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundError(`Customer with ID '${customerId}' not found`);
    }

    // Compute customer overall financial status
    const allInvoices = await db
      .select({
        totalBilled: sql<number>`coalesce(sum(${invoices.amountTotal}), 0)::float`,
        totalPaid: sql<number>`coalesce(sum(${invoices.amountPaid}), 0)::float`,
        unpaidBalance: sql<number>`coalesce(sum(case when ${invoices.status} not in ('PAID', 'CANCELLED') then (${invoices.amountTotal} - ${invoices.amountPaid}) else 0 end), 0)::float`,
        overdueCount: sql<number>`count(case when ${invoices.status} in ('CONFIRMED', 'PARTIALLY_PAID') and ${invoices.dueDate} < now() then 1 end)::int`,
      })
      .from(invoices)
      .where(and(eq(invoices.businessId, businessId), eq(invoices.customerId, customerId)));

    const summary = allInvoices[0] || {
      totalBilled: 0,
      totalPaid: 0,
      unpaidBalance: 0,
      overdueCount: 0,
    };

    return {
      ...customer,
      financialSummary: {
        totalBilled: Math.round((summary.totalBilled + Number.EPSILON) * 100) / 100,
        totalPaid: Math.round((summary.totalPaid + Number.EPSILON) * 100) / 100,
        unpaidBalance: Math.round((summary.unpaidBalance + Number.EPSILON) * 100) / 100,
        overdueInvoicesCount: summary.overdueCount,
      },
    };
  }

  /**
   * Create a new customer for a business
   */
  async createCustomer(businessId: string, input: CreateCustomerInput) {
    const email = input.email.toLowerCase().trim();

    // Check duplicate customer email within the business
    const existing = await db.query.customers.findFirst({
      where: and(eq(customers.businessId, businessId), eq(customers.email, email)),
    });

    if (existing) {
      throw new ConflictError(
        `A customer with email '${email}' already exists in this business.`
      );
    }

    // If userId provided, check if valid user
    if (input.userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, input.userId),
      });
      if (!user) {
        throw new NotFoundError(`User account with ID '${input.userId}' not found.`);
      }
    }

    const [created] = await db
      .insert(customers)
      .values({
        businessId,
        name: input.name.trim(),
        email,
        phone: input.phone?.trim() || null,
        companyName: input.companyName?.trim() || null,
        address: input.address?.trim() || null,
        userId: input.userId || null,
      })
      .returning();

    return created;
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(businessId: string, customerId: string, input: UpdateCustomerInput) {
    const existing = await db.query.customers.findFirst({
      where: and(eq(customers.id, customerId), eq(customers.businessId, businessId)),
    });

    if (!existing) {
      throw new NotFoundError(`Customer with ID '${customerId}' not found`);
    }

    // If email is changing, check uniqueness within business
    if (input.email && input.email.toLowerCase().trim() !== existing.email) {
      const email = input.email.toLowerCase().trim();
      const duplicate = await db.query.customers.findFirst({
        where: and(eq(customers.businessId, businessId), eq(customers.email, email)),
      });
      if (duplicate) {
        throw new ConflictError(
          `Another customer with email '${email}' already exists in this business.`
        );
      }
    }

    const [updated] = await db
      .update(customers)
      .set({
        name: input.name ? input.name.trim() : undefined,
        email: input.email ? input.email.toLowerCase().trim() : undefined,
        phone: input.phone !== undefined ? (input.phone ? input.phone.trim() : null) : undefined,
        companyName:
          input.companyName !== undefined
            ? input.companyName
              ? input.companyName.trim()
              : null
            : undefined,
        address:
          input.address !== undefined
            ? input.address
              ? input.address.trim()
              : null
            : undefined,
        userId: input.userId !== undefined ? input.userId : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, customerId), eq(customers.businessId, businessId)))
      .returning();

    return updated;
  }

  /**
   * Delete customer if safe (no active subscriptions)
   */
  async deleteCustomer(businessId: string, customerId: string) {
    const existing = await db.query.customers.findFirst({
      where: and(eq(customers.id, customerId), eq(customers.businessId, businessId)),
    });

    if (!existing) {
      throw new NotFoundError(`Customer with ID '${customerId}' not found`);
    }

    // Check if customer has active subscriptions
    const activeSub = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.customerId, customerId),
        eq(subscriptions.status, 'ACTIVE')
      ),
    });

    if (activeSub) {
      throw new BadRequestError(
        'Cannot delete customer with active subscriptions. Please cancel or close subscriptions first.'
      );
    }

    await db
      .delete(customers)
      .where(and(eq(customers.id, customerId), eq(customers.businessId, businessId)));

    return { id: customerId, deleted: true };
  }
}

export const customerService = new CustomerService();
