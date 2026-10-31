import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import argon2 from 'argon2';
import { db, businesses, users, products, productVariants, plans, queryClient } from '../index.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting Aetheria Database Seeding...');

  async function hash(pwd: string) {
    return argon2.hash(pwd, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  // 1. Super Admin
  const superAdminEmail = 'admin@aetheria.com';
  let [superAdmin] = await db.select().from(users).where(eq(users.email, superAdminEmail));
  if (!superAdmin) {
    [superAdmin] = await db
      .insert(users)
      .values({
        email: superAdminEmail,
        passwordHash: await hash('SuperAdmin@12345!'),
        firstName: 'Aetheria',
        lastName: 'SuperAdmin',
        role: 'SUPER_ADMIN',
      })
      .returning();
    console.log(`✅ Created Super Admin: ${superAdminEmail}`);
  }

  // 2. Tenant 1: Brightloop
  let [brightloop] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.slug, 'brightloop'));

  if (!brightloop) {
    [brightloop] = await db
      .insert(businesses)
      .values({
        name: 'Brightloop Software',
        slug: 'brightloop',
        email: 'contact@brightloop.com',
        phone: '+1 555-0199',
        primaryColor: '#4F46E5',
        secondaryColor: '#1E293B',
        logoUrl: 'https://placehold.co/200x60?text=Brightloop',
      })
      .returning();
    console.log(`✅ Created Tenant: Brightloop (slug: brightloop)`);
  }

  // Brightloop Admin & Staff
  const brightloopAdminEmail = 'admin@brightloop.com';
  let [blAdmin] = await db.select().from(users).where(eq(users.email, brightloopAdminEmail));
  if (!blAdmin) {
    [blAdmin] = await db
      .insert(users)
      .values({
        businessId: brightloop.id,
        email: brightloopAdminEmail,
        passwordHash: await hash('Brightloop@12345!'),
        firstName: 'Sarah',
        lastName: 'Connor',
        role: 'BUSINESS_ADMIN',
      })
      .returning();
    console.log(`✅ Created Brightloop Admin: ${brightloopAdminEmail}`);
  }

  const brightloopStaffEmail = 'staff@brightloop.com';
  let [blStaff] = await db.select().from(users).where(eq(users.email, brightloopStaffEmail));
  if (!blStaff) {
    [blStaff] = await db
      .insert(users)
      .values({
        businessId: brightloop.id,
        email: brightloopStaffEmail,
        passwordHash: await hash('Brightloop@12345!'),
        firstName: 'John',
        lastName: 'Doe',
        role: 'STAFF',
      })
      .returning();
    console.log(`✅ Created Brightloop Staff: ${brightloopStaffEmail}`);
  }

  // Brightloop Products
  const [crmProduct] = await db
    .insert(products)
    .values({
      businessId: brightloop.id,
      name: 'Cloud CRM SaaS',
      type: 'SERVICE',
      salesPrice: '120.00',
      costPrice: '40.00',
      notes: 'Enterprise customer relationship management platform',
    })
    .returning();

  await db.insert(productVariants).values([
    {
      productId: crmProduct.id,
      name: 'Starter Edition',
      sku: 'CRM-START',
      priceExtra: '0.00',
    },
    {
      productId: crmProduct.id,
      name: 'Professional Edition',
      sku: 'CRM-PRO',
      priceExtra: '70.00',
    },
    {
      productId: crmProduct.id,
      name: 'Enterprise Edition',
      sku: 'CRM-ENT',
      priceExtra: '180.00',
    },
  ]);

  const [terminalProduct] = await db
    .insert(products)
    .values({
      businessId: brightloop.id,
      name: 'VoIP Hardware Gateway',
      type: 'GOODS',
      salesPrice: '450.00',
      costPrice: '210.00',
      notes: 'SIP / VoIP multi-channel desk station',
    })
    .returning();

  await db.insert(productVariants).values([
    {
      productId: terminalProduct.id,
      name: 'Standard Hardware',
      sku: 'VOIP-STD',
      priceExtra: '0.00',
    },
    {
      productId: terminalProduct.id,
      name: 'Dual Wireless Handset Bundle',
      sku: 'VOIP-DUAL',
      priceExtra: '95.00',
    },
  ]);
  console.log(`✅ Created Brightloop Products & Variants`);

  // Brightloop Plans
  await db.insert(plans).values([
    {
      businessId: brightloop.id,
      name: 'Monthly Pro Subscription',
      code: 'BL-MONTHLY-PRO',
      description: 'Monthly recurring billing for CRM Pro',
      billingCycle: 'MONTHLY',
      intervalCount: 1,
      price: '190.00',
      minQuantity: 1,
      allowEarlyClosure: true,
      allowPausing: true,
      allowRenewal: true,
    },
    {
      businessId: brightloop.id,
      name: 'Annual Enterprise Retainer',
      code: 'BL-ANNUAL-ENT',
      description: 'Annual corporate subscription with dedicated gateway',
      billingCycle: 'YEARLY',
      intervalCount: 1,
      price: '1800.00',
      minQuantity: 1,
      allowEarlyClosure: false,
      allowPausing: false,
      allowRenewal: true,
    },
  ]);
  console.log(`✅ Created Brightloop Subscription Plans`);

  // 3. Tenant 2: Technova
  let [technova] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.slug, 'technova'));

  if (!technova) {
    [technova] = await db
      .insert(businesses)
      .values({
        name: 'TechNova Cloud Solutions',
        slug: 'technova',
        email: 'info@technova.io',
        phone: '+1 555-0822',
        primaryColor: '#0EA5E9',
        secondaryColor: '#0F172A',
        logoUrl: 'https://placehold.co/200x60?text=TechNova',
      })
      .returning();
    console.log(`✅ Created Tenant: TechNova (slug: technova)`);
  }

  const technovaAdminEmail = 'admin@technova.com';
  let [tnAdmin] = await db.select().from(users).where(eq(users.email, technovaAdminEmail));
  if (!tnAdmin) {
    await db.insert(users).values({
      businessId: technova.id,
      email: technovaAdminEmail,
      passwordHash: await hash('Technova@12345!'),
      firstName: 'Alex',
      lastName: 'Mercer',
      role: 'BUSINESS_ADMIN',
    });
    console.log(`✅ Created TechNova Admin: ${technovaAdminEmail}`);
  }

  console.log('🎉 Seeding successfully completed!');
  await queryClient.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
