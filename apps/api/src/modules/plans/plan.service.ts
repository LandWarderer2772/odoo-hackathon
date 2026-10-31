import { and, eq, lte, or, isNull, gte } from 'drizzle-orm';
import { db, plans, Plan, Database } from '@brightloop/db';
import { CreatePlanInput, UpdatePlanInput } from './plan.schema.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export class PlanService {
  /**
   * Create a new subscription plan with lifecycle & billing cycle configurations
   */
  async createPlan(businessId: string, input: CreatePlanInput, targetDb: Database = db) {
    if (input.endDate && input.startDate && input.endDate < input.startDate) {
      throw new BadRequestError('Plan end date cannot be earlier than start date');
    }

    const [plan] = await targetDb
      .insert(plans)
      .values({
        businessId,
        name: input.name.trim(),
        code: input.code?.trim(),
        description: input.description,
        billingCycle: input.billingCycle,
        intervalCount: input.intervalCount,
        price: input.price,
        minQuantity: input.minQuantity,
        startDate: input.startDate,
        endDate: input.endDate,
        autoCloseAtEnd: input.autoCloseAtEnd,
        allowEarlyClosure: input.allowEarlyClosure,
        allowPausing: input.allowPausing,
        allowRenewal: input.allowRenewal,
      })
      .returning();

    return plan;
  }

  /**
   * List plans strictly within tenant
   */
  async listPlans(
    businessId: string,
    options?: { activeOnly?: boolean; currentlyAvailable?: boolean },
    targetDb: Database = db
  ) {
    const whereConditions = [eq(plans.businessId, businessId)];

    if (options?.activeOnly) {
      whereConditions.push(eq(plans.isActive, true));
    }

    if (options?.currentlyAvailable) {
      const now = new Date();
      whereConditions.push(
        and(
          eq(plans.isActive, true),
          lte(plans.startDate, now),
          or(isNull(plans.endDate), gte(plans.endDate, now))
        )!
      );
    }

    return targetDb.query.plans.findMany({
      where: and(...whereConditions),
      orderBy: (plans, { desc }) => [desc(plans.createdAt)],
    });
  }

  /**
   * Get single plan with tenant isolation
   */
  async getPlanById(businessId: string, planId: string, targetDb: Database = db) {
    const plan = await targetDb.query.plans.findFirst({
      where: and(eq(plans.id, planId), eq(plans.businessId, businessId)),
    });

    if (!plan) {
      throw new NotFoundError('Plan not found in this business');
    }

    return plan;
  }

  /**
   * Update plan
   */
  async updatePlan(
    businessId: string,
    planId: string,
    input: UpdatePlanInput,
    targetDb: Database = db
  ) {
    await this.getPlanById(businessId, planId, targetDb);

    if (input.endDate && input.startDate && input.endDate < input.startDate) {
      throw new BadRequestError('Plan end date cannot be earlier than start date');
    }

    const [updated] = await targetDb
      .update(plans)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(and(eq(plans.id, planId), eq(plans.businessId, businessId)))
      .returning();

    return updated;
  }

  /**
   * Soft-delete / deactivate plan
   */
  async deletePlan(businessId: string, planId: string, targetDb: Database = db) {
    await this.getPlanById(businessId, planId, targetDb);

    const [deactivated] = await targetDb
      .update(plans)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(and(eq(plans.id, planId), eq(plans.businessId, businessId)))
      .returning();

    return deactivated;
  }
}

export const planService = new PlanService();
