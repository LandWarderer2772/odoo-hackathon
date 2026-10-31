import { FastifyPluginAsync } from 'fastify';
import { authController } from './auth.controller.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', authController.registerBusiness);
  fastify.post('/login', authController.login);
  fastify.post('/forgot-password', authController.forgotPassword);
  fastify.post('/reset-password', authController.resetPassword);

  fastify.get(
    '/me',
    {
      preHandler: [fastify.authenticate, resolveTenant],
    },
    authController.getMe
  );
};
