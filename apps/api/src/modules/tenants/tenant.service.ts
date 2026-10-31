import { eq } from 'drizzle-orm';
import { db, businesses, testDbConnection } from '@brightloop/db';
import { UpdateTenantInput } from './tenant.schema.js';
import { NotFoundError } from '../../utils/errors.js';

export class TenantService {
  /**
   * Check if a business slug is available
   */
  async checkSlugAvailability(slug: string): Promise<{ slug: string; isAvailable: boolean }> {
    const normalized = slug.toLowerCase().trim();
    const existing = await db.query.businesses.findFirst({
      where: eq(businesses.slug, normalized),
    });

    return {
      slug: normalized,
      isAvailable: !existing,
    };
  }

  /**
   * Public tenant branding resolver for path-based demo routing (e.g. /brightloop)
   */
  async getTenantBySlug(slug: string) {
    const normalized = slug.toLowerCase().trim();
    const tenant = await db.query.businesses.findFirst({
      where: eq(businesses.slug, normalized),
    });

    if (!tenant || !tenant.isActive) {
      throw new NotFoundError(`Tenant with slug '${slug}' not found or is inactive`);
    }

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      logoUrl: tenant.logoUrl,
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      createdAt: tenant.createdAt,
    };
  }

  /**
   * Update tenant branding & contact information
   */
  async updateTenant(businessId: string, input: UpdateTenantInput) {
    const existing = await db.query.businesses.findFirst({
      where: eq(businesses.id, businessId),
    });

    if (!existing) {
      throw new NotFoundError(`Tenant not found`);
    }

    const [updated] = await db
      .update(businesses)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, businessId))
      .returning();

    return updated;
  }

  /**
   * Super Admin platform overview of all registered businesses
   */
  async listAllTenants() {
    return db.query.businesses.findMany({
      orderBy: (businesses, { desc }) => [desc(businesses.createdAt)],
    });
  }

  /**
   * Test connectivity to a self-hosted / Tailscale database instance
   */
  async testTenantDb(connectionUrl: string) {
    return testDbConnection(connectionUrl);
  }
}

export const tenantService = new TenantService();
