import { eq, and, gt } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { db, businesses, users, User, Business } from '@brightloop/db';
import {
  RegisterBusinessInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.schema.js';
import { hashPassword, verifyPassword, generateResetToken, hashToken } from '../../utils/password.js';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../utils/errors.js';

export class AuthService {
  /**
   * Register a new Tenant Business and its initial Business Admin
   */
  async registerBusiness(input: RegisterBusinessInput) {
    const slug = input.slug.toLowerCase().trim();

    // Check slug uniqueness
    const existingSlug = await db.query.businesses.findFirst({
      where: eq(businesses.slug, slug),
    });
    if (existingSlug) {
      throw new ConflictError(`The business identifier/slug '${slug}' is already taken`);
    }

    // Check email uniqueness
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email.toLowerCase().trim()),
    });
    if (existingUser) {
      throw new ConflictError(`An account with email '${input.email}' already exists`);
    }

    const passwordHash = await hashPassword(input.password);

    // Create Business and Admin User
    const [business] = await db
      .insert(businesses)
      .values({
        name: input.businessName.trim(),
        slug,
        email: input.email.toLowerCase().trim(),
        phone: input.phone,
        logoUrl: input.logoUrl,
        primaryColor: input.primaryColor || '#4F46E5',
        secondaryColor: input.secondaryColor || '#1E293B',
      })
      .returning();

    const [adminUser] = await db
      .insert(users)
      .values({
        businessId: business.id,
        email: input.email.toLowerCase().trim(),
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        role: 'BUSINESS_ADMIN',
      })
      .returning();

    const { passwordHash: _, ...safeUser } = adminUser;
    return {
      business,
      user: safeUser,
    };
  }

  /**
   * Authenticate user with Argon2 and sign JWT
   */
  async login(input: LoginInput, fastify: FastifyInstance) {
    const email = input.email.toLowerCase().trim();

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        business: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }

    const isValidPassword = await verifyPassword(user.passwordHash, input.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify tenant if business user
    if (user.business && !user.business.isActive) {
      throw new UnauthorizedError('Tenant business account is deactivated');
    }

    // If specific tenant slug was requested, ensure user belongs to it
    if (input.tenantSlug && user.role !== 'SUPER_ADMIN') {
      if (!user.business || user.business.slug !== input.tenantSlug.toLowerCase()) {
        throw new UnauthorizedError('User does not belong to the requested tenant');
      }
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const { passwordHash: _, ...safeUser } = user;
    return {
      token,
      user: safeUser,
      business: user.business,
    };
  }

  /**
   * Request password reset token
   */
  async forgotPassword(input: ForgotPasswordInput) {
    const email = input.email.toLowerCase().trim();
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Don't leak user existence for public endpoints
      return { message: 'If the email exists, a password reset instruction has been generated.' };
    }

    const { token, hashedToken, expiresAt } = generateResetToken();

    await db
      .update(users)
      .set({
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return {
      message: 'Password reset token generated successfully',
      resetToken: token, // Returned for testing / email delivery
      expiresAt,
    };
  }

  /**
   * Reset password with valid token and Argon2
   */
  async resetPassword(input: ResetPasswordInput) {
    const hashed = hashToken(input.token);

    const user = await db.query.users.findFirst({
      where: and(
        eq(users.passwordResetToken, hashed),
        gt(users.passwordResetExpires, new Date())
      ),
    });

    if (!user) {
      throw new BadRequestError('Password reset token is invalid or has expired');
    }

    const newHash = await hashPassword(input.newPassword);

    await db
      .update(users)
      .set({
        passwordHash: newHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { message: 'Password has been successfully reset. You may now log in.' };
  }
}

export const authService = new AuthService();
