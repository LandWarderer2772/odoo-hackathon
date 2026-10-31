import { FastifyPluginAsync } from 'fastify';
import { productController } from './product.controller.js';
import { requireBusinessAdmin, requireStaffOrAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // Products CRUD
  fastify.post('/', { preHandler: [requireStaffOrAdmin] }, productController.createProduct);
  fastify.get('/', productController.listProducts);
  fastify.get('/:id', productController.getProductById);
  fastify.patch('/:id', { preHandler: [requireStaffOrAdmin] }, productController.updateProduct);
  fastify.delete('/:id', { preHandler: [requireBusinessAdmin] }, productController.deleteProduct);

  // Variants CRUD
  fastify.post('/:id/variants', { preHandler: [requireStaffOrAdmin] }, productController.addVariant);
  fastify.patch(
    '/:id/variants/:variantId',
    { preHandler: [requireStaffOrAdmin] },
    productController.updateVariant
  );
  fastify.delete(
    '/:id/variants/:variantId',
    { preHandler: [requireBusinessAdmin] },
    productController.deleteVariant
  );
};
