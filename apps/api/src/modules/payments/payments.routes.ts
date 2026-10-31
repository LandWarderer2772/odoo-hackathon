import { FastifyPluginAsync } from 'fastify';
import { paymentController } from './payment.controller.js';
import { requireStaffOrAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const paymentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // Payment Query & Detail
  fastify.get('/', paymentController.listPayments);
  fastify.get('/:id', paymentController.getPaymentById);

  // Record payment & allocation (Staff / Admin)
  fastify.post('/', { preHandler: [requireStaffOrAdmin] }, paymentController.recordPayment);
};
