import { FastifyPluginAsync } from 'fastify';
import { customerController } from './customer.controller.js';
import { requireBusinessAdmin, requireStaffOrAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const customerRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // Customers Management (Staff / Admin)
  fastify.get('/', { preHandler: [requireStaffOrAdmin] }, customerController.listCustomers);
  fastify.get('/:id', { preHandler: [requireStaffOrAdmin] }, customerController.getCustomerById);
  fastify.post('/', { preHandler: [requireStaffOrAdmin] }, customerController.createCustomer);
  fastify.patch('/:id', { preHandler: [requireStaffOrAdmin] }, customerController.updateCustomer);
  fastify.delete('/:id', { preHandler: [requireBusinessAdmin] }, customerController.deleteCustomer);
};
