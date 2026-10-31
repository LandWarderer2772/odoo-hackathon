import { FastifyReply, FastifyRequest } from 'fastify';
import { customerService } from './customer.service.js';
import {
  createCustomerSchema,
  customerQuerySchema,
  updateCustomerSchema,
} from './customer.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class CustomerController {
  async listCustomers(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const query = customerQuerySchema.parse(request.query);
    const result = await customerService.listCustomers(businessId, query);
    return reply.send(successResponse(result));
  }

  async getCustomerById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await customerService.getCustomerById(businessId, id);
    return reply.send(successResponse(result));
  }

  async createCustomer(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const validated = createCustomerSchema.parse(request.body);
    const result = await customerService.createCustomer(businessId, validated);
    return reply.status(201).send(successResponse(result, 'Customer created successfully'));
  }

  async updateCustomer(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const validated = updateCustomerSchema.parse(request.body);
    const result = await customerService.updateCustomer(businessId, id, validated);
    return reply.send(successResponse(result, 'Customer updated successfully'));
  }

  async deleteCustomer(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await customerService.deleteCustomer(businessId, id);
    return reply.send(successResponse(result, 'Customer removed successfully'));
  }
}

export const customerController = new CustomerController();
