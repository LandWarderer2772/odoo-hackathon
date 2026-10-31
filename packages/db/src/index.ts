import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

export * from './schema/index.js';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://brightloop:brightloop_secret@localhost:5432/brightloop_db';

// For migrations and query client
export const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;

// Dynamic Tenant Connection Pools (Supports Self-Hosted / Tailscale BYODB)
const tenantPools = new Map<string, { client: postgres.Sql; db: Database }>();

export function getTenantDb(customDbUrl?: string | null): Database {
  if (!customDbUrl) {
    return db;
  }

  const normalizedUrl = customDbUrl.trim();
  const cached = tenantPools.get(normalizedUrl);
  if (cached) {
    return cached.db;
  }

  const tenantClient = postgres(normalizedUrl, {
    max: 5,
    idle_timeout: 15,
    connect_timeout: 5,
  });

  const tenantDb = drizzle(tenantClient, { schema });
  tenantPools.set(normalizedUrl, { client: tenantClient, db: tenantDb });
  return tenantDb;
}

/**
 * Validates connection to a self-hosted / Tailscale database instance
 */
export async function testDbConnection(
  connectionUrl: string
): Promise<{ success: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  const testClient = postgres(connectionUrl, {
    max: 1,
    connect_timeout: 3,
  });

  try {
    await testClient`SELECT 1`;
    const latencyMs = Date.now() - start;
    await testClient.end();
    return { success: true, latencyMs };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection failed' };
  }
}

