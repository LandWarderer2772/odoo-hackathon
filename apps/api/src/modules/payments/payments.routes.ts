import { FastifyPluginAsync } from 'fastify';
import { successResponse } from '../../utils/response.js';

export const paymentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (req, reply) => {
    return reply.send(
      successResponse([], 'Payment module ready - Developer 2 integration target')
    );
  });
};
