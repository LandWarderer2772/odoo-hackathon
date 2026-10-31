import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import dbPlugin from './plugins/db.js';
import jwtPlugin from './plugins/jwt.js';
import { globalErrorHandler } from './utils/errors.js';

// Developer 1 Modules
import { authRoutes } from './modules/auth/auth.routes.js';
import { tenantRoutes } from './modules/tenants/tenant.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { productRoutes } from './modules/products/product.routes.js';
import { planRoutes } from './modules/plans/plan.routes.js';

// Developer 2 Modules (Placeholders for integration)
import { customerRoutes } from './modules/customers/customers.routes.js';
import { quotationRoutes } from './modules/quotations/quotations.routes.js';
import { subscriptionRoutes } from './modules/subscriptions/subscriptions.routes.js';
import { invoiceRoutes } from './modules/invoices/invoices.routes.js';
import { paymentRoutes } from './modules/payments/payments.routes.js';
import { reportRoutes } from './modules/reports/reports.routes.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  }).withTypeProvider<ZodTypeProvider>();

  // Set up Zod validation compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Error Handler
  app.setErrorHandler(globalErrorHandler);

  // Core Plugins
  await app.register(cors, {
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  await app.register(dbPlugin);
  await app.register(jwtPlugin);

  // Healthcheck
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Aetheria Subscription Management Backend',
  }));

  // Standard API Routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(tenantRoutes, { prefix: '/api/tenants' });
  await app.register(userRoutes, { prefix: '/api/users' });
  await app.register(productRoutes, { prefix: '/api/products' });
  await app.register(planRoutes, { prefix: '/api/plans' });

  // Developer 2 Routes
  await app.register(customerRoutes, { prefix: '/api/customers' });
  await app.register(quotationRoutes, { prefix: '/api/quotations' });
  await app.register(subscriptionRoutes, { prefix: '/api/subscriptions' });
  await app.register(invoiceRoutes, { prefix: '/api/invoices' });
  await app.register(paymentRoutes, { prefix: '/api/payments' });
  await app.register(reportRoutes, { prefix: '/api/reports' });

  // Path-based Tenant Demo Routing: /api/t/:tenantSlug/...
  await app.register(
    async (tenantScope) => {
      await tenantScope.register(productRoutes, { prefix: '/products' });
      await tenantScope.register(planRoutes, { prefix: '/plans' });
      await tenantScope.register(customerRoutes, { prefix: '/customers' });
      await tenantScope.register(quotationRoutes, { prefix: '/quotations' });
      await tenantScope.register(subscriptionRoutes, { prefix: '/subscriptions' });
      await tenantScope.register(invoiceRoutes, { prefix: '/invoices' });
      await tenantScope.register(paymentRoutes, { prefix: '/payments' });
      await tenantScope.register(reportRoutes, { prefix: '/reports' });
    },
    { prefix: '/api/t/:tenantSlug' }
  );

  return app;
}
