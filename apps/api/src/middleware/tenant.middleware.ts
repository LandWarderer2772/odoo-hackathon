import { FastifyReply, FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';
import { businesses, Business, getTenantDb, Database } from '@brightloop/db';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/errors.js';

declare module 'fastify' {
  interface FastifyRequest {
    tenant?: Business;
    businessId?: string;
    tenantDb?: Database;
  }
}

/**
 * Middleware that resolves tenant context from URL path param, header, or authenticated user session.
 * Enforces strict isolation: non-superadmins can NEVER access another tenant's data.
 */
export async function resolveTenant(request: FastifyRequest, reply: FastifyReply) {
  const db = request.server.db;
  const params = (request.params as Record<string, string>) || {};
  const headers = request.headers;

  const slugCandidate = params.tenantSlug || (headers['x-tenant-slug'] as string) || undefined;
  const tenantIdCandidate = (headers['x-tenant-id'] as string) || undefined;

  let tenant: Business | undefined;

  if (slugCandidate) {
    tenant = await db.query.businesses.findFirst({
      where: eq(businesses.slug, slugCandidate.toLowerCase()),
    });
    if (!tenant) {
      throw new NotFoundError(`Tenant business with slug '${slugCandidate}' not found`);
    }
  } else if (tenantIdCandidate) {
    tenant = await db.query.businesses.findFirst({
      where: eq(businesses.id, tenantIdCandidate),
    });
    if (!tenant) {
      throw new NotFoundError(`Tenant business with ID '${tenantIdCandidate}' not found`);
    }
  } else if (request.user?.businessId) {
    tenant = await db.query.businesses.findFirst({
      where: eq(businesses.id, request.user.businessId),
    });
    if (!tenant) {
      throw new NotFoundError(`Tenant business for current user not found`);
    }
  }

  // Cross-tenant verification for authenticated users
  if (tenant && request.user && request.user.role !== 'SUPER_ADMIN') {
    if (request.user.businessId && request.user.businessId !== tenant.id) {
      throw new ForbiddenError(
        'Cross-tenant access prohibited. You are not authorized to access this tenant.'
      );
    }
  }

  if (tenant) {
    if (!tenant.isActive) {
      throw new ForbiddenError(`Tenant '${tenant.name}' account is deactivated`);
    }
    request.tenant = tenant;
    request.businessId = tenant.id;
    request.tenantDb = getTenantDb(tenant.customDbUrl);
  }
}

/**
 * Guard requiring a valid resolved tenant on the request
 */
export async function requireTenant(request: FastifyRequest, reply: FastifyReply) {
  if (!request.businessId || !request.tenant) {
    // Attempt resolution first if not yet run
    await resolveTenant(request, reply);
  }

  if (!request.businessId || !request.tenant) {
    throw new ForbiddenError(
      'Tenant context missing. Provide a valid tenant slug in the route or header x-tenant-slug.'
    );
  }
}
