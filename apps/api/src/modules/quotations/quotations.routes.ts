import { FastifyPluginAsync } from 'fastify';
import { quotationController } from './quotation.controller.js';
import { requireBusinessAdmin, requireStaffOrAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const quotationRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // Quotations List & Detail
  fastify.get('/', quotationController.listQuotations);
  fastify.get('/:id', quotationController.getQuotationById);

  // Operations (Staff / Admin)
  fastify.post('/', { preHandler: [requireStaffOrAdmin] }, quotationController.createQuotation);
  fastify.post('/:id/send', { preHandler: [requireStaffOrAdmin] }, quotationController.sendQuotation);

  // Customer or Staff acceptance / rejection
  fastify.post('/:id/accept', quotationController.acceptQuotation);
  fastify.post('/:id/reject', quotationController.rejectQuotation);
};
