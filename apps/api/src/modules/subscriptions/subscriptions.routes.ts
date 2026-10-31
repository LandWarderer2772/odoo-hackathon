import { FastifyPluginAsync } from 'fastify';
import { subscriptionController } from './subscription.controller.js';
import { requireStaffOrAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const subscriptionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // List and details
  fastify.get('/', subscriptionController.listSubscriptions);
  fastify.get('/:id', subscriptionController.getSubscriptionById);

  // Creation (Staff / Admin)
  fastify.post('/', { preHandler: [requireStaffOrAdmin] }, subscriptionController.createSubscription);

  // FSM State transitions
  fastify.post(
    '/:id/transition',
    { preHandler: [requireStaffOrAdmin] },
    subscriptionController.transitionSubscription
  );

  // Direct transition shortcuts for frontend convenience
  fastify.post('/:id/confirm', { preHandler: [requireStaffOrAdmin] }, async (req, reply) => {
    req.body = { action: 'confirm' };
    return subscriptionController.transitionSubscription(req, reply);
  });

  fastify.post('/:id/activate', { preHandler: [requireStaffOrAdmin] }, async (req, reply) => {
    req.body = { action: 'activate' };
    return subscriptionController.transitionSubscription(req, reply);
  });

  fastify.post('/:id/pause', { preHandler: [requireStaffOrAdmin] }, async (req, reply) => {
    req.body = { action: 'pause' };
    return subscriptionController.transitionSubscription(req, reply);
  });

  fastify.post('/:id/resume', { preHandler: [requireStaffOrAdmin] }, async (req, reply) => {
    req.body = { action: 'resume' };
    return subscriptionController.transitionSubscription(req, reply);
  });

  fastify.post('/:id/close', { preHandler: [requireStaffOrAdmin] }, async (req, reply) => {
    const body = (req.body as any) || {};
    req.body = { action: 'close', reason: body.reason };
    return subscriptionController.transitionSubscription(req, reply);
  });
};
