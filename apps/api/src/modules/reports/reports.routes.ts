import { FastifyPluginAsync } from 'fastify';
import { successResponse } from '../../utils/response.js';

export const reportRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/analytics', async (req, reply) => {
    return reply.send(
      successResponse({}, 'Revenue analytics & reporting ready - Developer 2 integration target')
    );
  });
};
