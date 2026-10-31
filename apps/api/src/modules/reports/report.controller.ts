import { FastifyReply, FastifyRequest } from 'fastify';
import { reportService } from './report.service.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class ReportController {
  async getFinanceSummary(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const summary = await reportService.getFinanceSummary(businessId);
    return reply.send(successResponse(summary));
  }

  async getAgedReceivables(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const report = await reportService.getAgedReceivables(businessId);
    return reply.send(successResponse(report));
  }

  async getSubscriptionAnalytics(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const analytics = await reportService.getSubscriptionAnalytics(businessId);
    return reply.send(successResponse(analytics));
  }
}

export const reportController = new ReportController();
