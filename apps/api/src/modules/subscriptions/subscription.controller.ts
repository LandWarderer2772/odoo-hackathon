import { FastifyReply, FastifyRequest } from 'fastify';
import { subscriptionService } from './subscription.service.js';
import {
  createSubscriptionSchema,
  subscriptionQuerySchema,
  subscriptionTransitionSchema,
} from './subscription.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class SubscriptionController {
  async listSubscriptions(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const query = subscriptionQuerySchema.parse(request.query);
    const result = await subscriptionService.listSubscriptions(businessId, query);
    return reply.send(successResponse(result));
  }

  async getSubscriptionById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await subscriptionService.getSubscriptionById(businessId, id);
    return reply.send(successResponse(result));
  }

  async createSubscription(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const validated = createSubscriptionSchema.parse(request.body);
    const result = await subscriptionService.createSubscription(businessId, validated);
    return reply.status(201).send(successResponse(result, 'Subscription created successfully'));
  }

  async transitionSubscription(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const validated = subscriptionTransitionSchema.parse(request.body);
    const result = await subscriptionService.transitionSubscription(businessId, id, validated);
    return reply.send(successResponse(result, result.message));
  }
}

export const subscriptionController = new SubscriptionController();
