import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { UnauthorizedError } from '../utils/errors.js';

export interface JwtUserPayload {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'BUSINESS_ADMIN' | 'STAFF' | 'CUSTOMER';
  businessId: string | null;
  firstName: string;
  lastName: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtUserPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  const secret = process.env.JWT_SECRET || 'super-secure-brightloop-jwt-secret-key-32chars';

  await fastify.register(fastifyCookie, {
    secret,
    parseOptions: {},
  });

  await fastify.register(fastifyJwt, {
    secret,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        await request.jwtVerify();
      } catch (err) {
        throw new UnauthorizedError('Invalid or expired authentication token');
      }
    }
  );
};

export default fp(jwtPlugin, {
  name: 'jwt',
});
