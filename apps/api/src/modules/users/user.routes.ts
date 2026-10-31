import { FastifyPluginAsync } from 'fastify';
import { userController } from './user.controller.js';
import { requireBusinessAdmin, requireStaffOrAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  // All user routes require authentication and tenant resolution
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // Business Admin only: create staff
  fastify.post('/staff', { preHandler: [requireBusinessAdmin] }, userController.createStaff);

  // Staff and Admins: list and read
  fastify.get('/', { preHandler: [requireStaffOrAdmin] }, userController.listUsers);
  fastify.get('/:id', { preHandler: [requireStaffOrAdmin] }, userController.getUserById);

  // Business Admin only: update and delete
  fastify.patch('/:id', { preHandler: [requireBusinessAdmin] }, userController.updateUser);
  fastify.delete('/:id', { preHandler: [requireBusinessAdmin] }, userController.deleteUser);
};
