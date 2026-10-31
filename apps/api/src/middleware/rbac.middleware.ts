import { FastifyReply, FastifyRequest } from 'fastify';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

export type UserRole = 'SUPER_ADMIN' | 'BUSINESS_ADMIN' | 'STAFF' | 'CUSTOMER';

export function requireRoles(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new ForbiddenError(
        `Access denied. Role '${request.user.role}' is not authorized for this action. Required: ${allowedRoles.join(', ')}`
      );
    }
  };
}

export const requireSuperAdmin = requireRoles('SUPER_ADMIN');
export const requireBusinessAdmin = requireRoles('SUPER_ADMIN', 'BUSINESS_ADMIN');
export const requireStaffOrAdmin = requireRoles('SUPER_ADMIN', 'BUSINESS_ADMIN', 'STAFF');
export const requireCustomer = requireRoles('CUSTOMER');
