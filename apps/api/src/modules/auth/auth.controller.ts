import { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from './auth.service.js';
import {
  registerBusinessSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.schema.js';
import { successResponse } from '../../utils/response.js';

export class AuthController {
  async registerBusiness(request: FastifyRequest, reply: FastifyReply) {
    const validated = registerBusinessSchema.parse(request.body);
    const result = await authService.registerBusiness(validated);

    // Optionally set cookie
    const token = request.server.jwt.sign({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      businessId: result.user.businessId,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
    });

    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return reply.status(201).send(
      successResponse(
        {
          token,
          ...result,
        },
        'Business registered successfully'
      )
    );
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const validated = loginSchema.parse(request.body);
    const result = await authService.login(validated, request.server);

    reply.setCookie('token', result.token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send(successResponse(result, 'Login successful'));
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;
    return reply.send(
      successResponse(
        {
          user,
          tenant: request.tenant || null,
        },
        'Current authenticated session'
      )
    );
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const validated = forgotPasswordSchema.parse(request.body);
    const result = await authService.forgotPassword(validated);
    return reply.send(successResponse(result));
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const validated = resetPasswordSchema.parse(request.body);
    const result = await authService.resetPassword(validated);
    return reply.send(successResponse(result));
  }
}

export const authController = new AuthController();
