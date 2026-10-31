import { FastifyReply, FastifyRequest } from 'fastify';
import { quotationService } from './quotation.service.js';
import { createQuotationSchema, quotationQuerySchema } from './quotation.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class QuotationController {
  async listQuotations(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const query = quotationQuerySchema.parse(request.query);
    const result = await quotationService.listQuotations(businessId, query);
    return reply.send(successResponse(result));
  }

  async getQuotationById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await quotationService.getQuotationById(businessId, id);
    return reply.send(successResponse(result));
  }

  async createQuotation(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const validated = createQuotationSchema.parse(request.body);
    const result = await quotationService.createQuotation(businessId, validated);
    return reply.status(201).send(successResponse(result, 'Quotation generated successfully'));
  }

  async sendQuotation(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await quotationService.sendQuotation(businessId, id);
    return reply.send(successResponse(result, 'Quotation marked as sent to customer'));
  }

  async acceptQuotation(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await quotationService.acceptQuotation(businessId, id);
    return reply.send(successResponse(result, 'Quotation accepted and converted to confirmed subscription'));
  }

  async rejectQuotation(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const body = (request.body as { reason?: string }) || {};
    const result = await quotationService.rejectQuotation(businessId, id, body.reason);
    return reply.send(successResponse(result, 'Quotation marked as rejected'));
  }
}

export const quotationController = new QuotationController();
