import { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from './user.service.js';
import { createStaffSchema, updateUserSchema } from './user.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class UserController {
  async createStaff(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const validated = createStaffSchema.parse(request.body);
    const result = await userService.createStaff(businessId, validated);
    return reply.status(201).send(successResponse(result, 'Staff member created successfully'));
  }

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const result = await userService.listUsers(businessId);
    return reply.send(successResponse(result));
  }

  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const result = await userService.getUserById(businessId, id);
    return reply.send(successResponse(result));
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const validated = updateUserSchema.parse(request.body);
    const result = await userService.updateUser(businessId, id, validated);
    return reply.send(successResponse(result, 'User updated successfully'));
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const result = await userService.deleteUser(businessId, id);
    return reply.send(successResponse(result, 'User deactivated successfully'));
  }
}

export const userController = new UserController();
