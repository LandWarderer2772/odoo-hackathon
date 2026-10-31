import { FastifyPluginAsync } from 'fastify';
import { successResponse } from '../../utils/response.js';

export const subscriptionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (req, reply) => {
    return reply.send(
      successResponse([], 'Subscription module ready - Developer 2 integration target')
    );
  });
};
