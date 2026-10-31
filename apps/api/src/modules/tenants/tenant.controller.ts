import { FastifyReply, FastifyRequest } from 'fastify';
import { tenantService } from './tenant.service.js';
import { checkSlugSchema, updateTenantSchema, testDbConnectionSchema } from './tenant.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class TenantController {
  async checkSlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = checkSlugSchema.parse(request.params);
    const result = await tenantService.checkSlugAvailability(slug);
    return reply.send(successResponse(result));
  }

  async getTenantBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = checkSlugSchema.parse(request.params);
    const result = await tenantService.getTenantBySlug(slug);
    return reply.send(successResponse(result, 'Tenant branding resolved successfully'));
  }

  async updateTenant(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const validated = updateTenantSchema.parse(request.body);

    // Ensure user cannot update another tenant's branding
    if (request.user?.role !== 'SUPER_ADMIN' && request.user?.businessId !== id) {
      throw new ForbiddenError('You can only update your own business profile');
    }

    const updated = await tenantService.updateTenant(id, validated);
    return reply.send(successResponse(updated, 'Tenant profile updated successfully'));
  }

  async testDbConnection(request: FastifyRequest, reply: FastifyReply) {
    const validated = testDbConnectionSchema.parse(request.body);
    const result = await tenantService.testTenantDb(validated.connectionUrl);
    return reply.send(
      successResponse(
        result,
        result.success ? 'Self-hosted database reachable' : 'Database connection failed'
      )
    );
  }

  async listAllTenants(request: FastifyRequest, reply: FastifyReply) {
    const tenants = await tenantService.listAllTenants();
    return reply.send(successResponse(tenants, 'Registered businesses overview'));
  }
}

export const tenantController = new TenantController();
