import { FastifyPluginAsync } from 'fastify';
import { successResponse } from '../../utils/response.js';

export const invoiceRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (req, reply) => {
    return reply.send(
      successResponse([], 'Invoice module ready - Developer 2 integration target')
    );
  });
};
