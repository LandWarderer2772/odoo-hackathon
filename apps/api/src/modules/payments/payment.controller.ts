import { FastifyReply, FastifyRequest } from 'fastify';
import { paymentService } from './payment.service.js';
import { recordPaymentSchema, paymentQuerySchema } from './payment.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class PaymentController {
  async listPayments(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const query = paymentQuerySchema.parse(request.query);
    const result = await paymentService.listPayments(businessId, query);
    return reply.send(successResponse(result));
  }

  async getPaymentById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await paymentService.getPaymentById(businessId, id);
    return reply.send(successResponse(result));
  }

  async recordPayment(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const validated = recordPaymentSchema.parse(request.body);
    const result = await paymentService.recordPayment(businessId, validated);
    return reply.status(201).send(successResponse(result, result.message));
  }
}

export const paymentController = new PaymentController();
