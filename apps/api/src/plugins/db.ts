import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { db, Database, queryClient } from '@brightloop/db';

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('db', db);

  fastify.addHook('onClose', async (server) => {
    server.log.info('Closing Postgres connection pool...');
    await queryClient.end();
  });
};

export default fp(dbPlugin, {
  name: 'db',
});
