import { FastifyPluginAsync } from 'fastify';
import { planController } from './plan.controller.js';
import { requireBusinessAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const planRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  fastify.post('/', { preHandler: [requireBusinessAdmin] }, planController.createPlan);
  fastify.get('/', planController.listPlans);
  fastify.get('/:id', planController.getPlanById);
  fastify.patch('/:id', { preHandler: [requireBusinessAdmin] }, planController.updatePlan);
  fastify.delete('/:id', { preHandler: [requireBusinessAdmin] }, planController.deletePlan);
};
