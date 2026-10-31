import { FastifyPluginAsync } from 'fastify';
import { successResponse } from '../../utils/response.js';

export const customerRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (req, reply) => {
    return reply.send(
      successResponse([], 'Customer module ready - Developer 2 integration target')
    );
  });
};
