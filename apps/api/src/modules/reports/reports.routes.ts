import { FastifyPluginAsync } from 'fastify';
import { reportController } from './report.controller.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const reportRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // Executive Dashboard Analytics
  fastify.get('/finance-summary', reportController.getFinanceSummary);
  fastify.get('/aged-receivables', reportController.getAgedReceivables);
  fastify.get('/subscriptions', reportController.getSubscriptionAnalytics);

  // Alias for backward compatibility
  fastify.get('/analytics', reportController.getFinanceSummary);
};
