import { FastifyReply, FastifyRequest } from 'fastify';
import { planService } from './plan.service.js';
import { createPlanSchema, updatePlanSchema } from './plan.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class PlanController {
  async createPlan(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const validated = createPlanSchema.parse(request.body);
    const result = await planService.createPlan(businessId, validated);
    return reply.status(201).send(successResponse(result, 'Subscription plan created successfully'));
  }

  async listPlans(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const query = request.query as { activeOnly?: string; currentlyAvailable?: string };
    const result = await planService.listPlans(businessId, {
      activeOnly: query.activeOnly === 'true',
      currentlyAvailable: query.currentlyAvailable === 'true',
    });
    return reply.send(successResponse(result));
  }

  async getPlanById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const result = await planService.getPlanById(businessId, id);
    return reply.send(successResponse(result));
  }

  async updatePlan(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const validated = updatePlanSchema.parse(request.body);
    const result = await planService.updatePlan(businessId, id, validated);
    return reply.send(successResponse(result, 'Plan updated successfully'));
  }

  async deletePlan(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const result = await planService.deletePlan(businessId, id);
    return reply.send(successResponse(result, 'Plan deactivated successfully'));
  }
}

export const planController = new PlanController();
