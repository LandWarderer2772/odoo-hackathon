import { and, eq } from 'drizzle-orm';
import { db, users, User } from '@brightloop/db';
import { CreateStaffInput, UpdateUserInput } from './user.schema.js';
import { hashPassword } from '../../utils/password.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';

export class UserService {
  /**
   * Create staff member strictly bound to the business tenant
   */
  async createStaff(businessId: string, input: CreateStaffInput) {
    const email = input.email.toLowerCase().trim();

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new ConflictError(`User with email '${email}' already exists`);
    }

    const passwordHash = await hashPassword(input.password);

    const [staff] = await db
      .insert(users)
      .values({
        businessId,
        email,
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        role: input.role,
      })
      .returning();

    const { passwordHash: _, ...safeStaff } = staff;
    return safeStaff;
  }

  /**
   * List staff strictly within business tenant
   */
  async listUsers(businessId: string) {
    const list = await db.query.users.findMany({
      where: eq(users.businessId, businessId),
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return list.map(({ passwordHash: _, ...safe }) => safe);
  }

  /**
   * Get single user strictly within tenant
   */
  async getUserById(businessId: string, userId: string) {
    const user = await db.query.users.findFirst({
      where: and(eq(users.id, userId), eq(users.businessId, businessId)),
    });

    if (!user) {
      throw new NotFoundError(`User not found in this business`);
    }

    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  /**
   * Update staff member within business
   */
  async updateUser(businessId: string, userId: string, input: UpdateUserInput) {
    await this.getUserById(businessId, userId);

    const [updated] = await db
      .update(users)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, userId), eq(users.businessId, businessId)))
      .returning();

    const { passwordHash: _, ...safe } = updated;
    return safe;
  }

  /**
   * Deactivate staff member
   */
  async deleteUser(businessId: string, userId: string) {
    await this.getUserById(businessId, userId);

    const [deactivated] = await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, userId), eq(users.businessId, businessId)))
      .returning();

    const { passwordHash: _, ...safe } = deactivated;
    return safe;
  }
}

export const userService = new UserService();
