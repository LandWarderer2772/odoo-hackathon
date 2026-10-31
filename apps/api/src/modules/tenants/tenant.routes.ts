import { FastifyPluginAsync } from 'fastify';
import { tenantController } from './tenant.controller.js';
import { requireBusinessAdmin, requireSuperAdmin } from '../../middleware/rbac.middleware.js';

export const tenantRoutes: FastifyPluginAsync = async (fastify) => {
  // Public routes
  fastify.get('/check-slug/:slug', tenantController.checkSlug);
  fastify.get('/resolve/:slug', tenantController.getTenantBySlug);

  // Protected routes
  fastify.patch(
    '/:id',
    {
      preHandler: [fastify.authenticate, requireBusinessAdmin],
    },
    tenantController.updateTenant
  );

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate, requireSuperAdmin],
    },
    tenantController.listAllTenants
  );
};
