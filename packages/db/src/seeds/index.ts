import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import argon2 from 'argon2';
import {
  db,
  businesses,
  users,
  products,
  productVariants,
  plans,
  customers,
  quotations,
  quotationItems,
  subscriptions,
  subscriptionItems,
  invoices,
  invoiceItems,
  payments,
  paymentAllocations,
  discounts,
  queryClient,
} from '../index.js';
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
  let [crmProduct] = await db
    .select()
    .from(products)
    .where(eq(products.name, 'Cloud CRM SaaS'));

  if (!crmProduct) {
    [crmProduct] = await db
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
  }

  let [terminalProduct] = await db
    .select()
    .from(products)
    .where(eq(products.name, 'VoIP Hardware Gateway'));

  if (!terminalProduct) {
    [terminalProduct] = await db
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
  }
  console.log(`✅ Verified Brightloop Products & Variants`);

  // Brightloop Plans
  let [monthlyPlan] = await db
    .select()
    .from(plans)
    .where(eq(plans.code, 'BL-MONTHLY-PRO'));

  if (!monthlyPlan) {
    [monthlyPlan] = await db
      .insert(plans)
      .values({
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
      })
      .returning();
  }

  let [annualPlan] = await db
    .select()
    .from(plans)
    .where(eq(plans.code, 'BL-ANNUAL-ENT'));

  if (!annualPlan) {
    [annualPlan] = await db
      .insert(plans)
      .values({
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
      })
      .returning();
  }
  console.log(`✅ Verified Brightloop Subscription Plans`);

  // Brightloop Discounts
  let [promo20] = await db
    .select()
    .from(discounts)
    .where(eq(discounts.code, 'WELCOME20'));

  if (!promo20) {
    [promo20] = await db
      .insert(discounts)
      .values({
        businessId: brightloop.id,
        code: 'WELCOME20',
        type: 'PERCENTAGE',
        value: '20.00',
        isActive: true,
      })
      .returning();
  }

  // 3. Brightloop Customers
  const customerList = [
    {
      name: 'Bruce Wayne',
      companyName: 'Wayne Enterprises',
      email: 'bruce@wayne-ent.com',
      phone: '+1 555-0101',
      address: '1007 Mountain Drive, Gotham City, NY',
    },
    {
      name: 'Tony Stark',
      companyName: 'Stark Industries',
      email: 'tony@stark.com',
      phone: '+1 555-0102',
      address: '10880 Malibu Point, Malibu, CA',
    },
    {
      name: 'Miles Dyson',
      companyName: 'Cyberdyne Systems',
      email: 'miles@cyberdyne.io',
      phone: '+1 555-0103',
      address: '18144 El Camino Real, Sunnyvale, CA',
    },
    {
      name: 'Hank Scorpio',
      companyName: 'Globex Corporation',
      email: 'hank@globex.com',
      phone: '+1 555-0104',
      address: '742 Evergreen Terrace, Cypress Creek, OR',
    },
    {
      name: 'Bruce Banner',
      companyName: 'Acme Research Labs',
      email: 'banner@acme.com',
      phone: '+1 555-0105',
      address: '400 Science Parkway, Cambridge, MA',
    },
  ];

  const dbCustomers: any[] = [];
  for (const c of customerList) {
    let [existing] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, c.email));
    if (!existing) {
      [existing] = await db
        .insert(customers)
        .values({
          businessId: brightloop.id,
          ...c,
        })
        .returning();
    }
    dbCustomers.push(existing);
  }
  console.log(`✅ Verified ${dbCustomers.length} Brightloop Customers`);

  const [cWayne, cStark, cCyberdyne, cGlobex, cAcme] = dbCustomers;

  // 4. Quotations
  let [qAcme] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.customerId, cAcme.id));

  if (!qAcme) {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 14);

    [qAcme] = await db
      .insert(quotations)
      .values({
        businessId: brightloop.id,
        customerId: cAcme.id,
        planId: monthlyPlan.id,
        status: 'SENT',
        totalAmount: '190.00',
        validUntil,
      })
      .returning();

    await db.insert(quotationItems).values({
      quotationId: qAcme.id,
      productId: crmProduct.id,
      quantity: 1,
      unitPrice: '190.00',
      subtotal: '190.00',
    });
    console.log(`✅ Created Sent Quotation for ${cAcme.companyName}`);
  }

  // 5. Subscriptions & Lifecycle States
  // Sub 1: Wayne Enterprises (ACTIVE, Pro Plan, Monthly)
  let [subWayne] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.customerId, cWayne.id));

  if (!subWayne) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);

    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 10);

    [subWayne] = await db
      .insert(subscriptions)
      .values({
        businessId: brightloop.id,
        subscriptionNumber: 'SUB-2026-1001',
        customerId: cWayne.id,
        planId: monthlyPlan.id,
        status: 'ACTIVE',
        startDate,
        nextBillingDate: nextBilling,
        totalAmount: '190.00',
        paymentTerms: 'Net 30 Days',
      })
      .returning();

    await db.insert(subscriptionItems).values({
      subscriptionId: subWayne.id,
      productId: crmProduct.id,
      quantity: 1,
      unitPrice: '190.00',
      discountAmount: '0.00',
      taxAmount: '0.00',
      subtotal: '190.00',
    });

    // Invoices for Wayne: Month 1 Paid, Month 2 Partially Paid
    const inv1Date = new Date(startDate);
    const inv1Due = new Date(inv1Date);
    inv1Due.setDate(inv1Due.getDate() + 30);

    const [inv1] = await db
      .insert(invoices)
      .values({
        businessId: brightloop.id,
        invoiceNumber: 'INV-2026-1001',
        subscriptionId: subWayne.id,
        customerId: cWayne.id,
        status: 'PAID',
        invoiceDate: inv1Date,
        dueDate: inv1Due,
        subtotal: '190.00',
        amountTotal: '190.00',
        amountPaid: '190.00',
      })
      .returning();

    await db.insert(invoiceItems).values({
      invoiceId: inv1.id,
      productId: crmProduct.id,
      description: 'Cloud CRM SaaS (Professional Edition)',
      quantity: 1,
      unitPrice: '190.00',
      subtotal: '190.00',
    });

    // Payment for inv1
    const [pay1] = await db
      .insert(payments)
      .values({
        businessId: brightloop.id,
        paymentReference: 'PAY-2026-1001',
        customerId: cWayne.id,
        method: 'BANK_TRANSFER',
        amount: '190.00',
        paymentDate: inv1Date,
        notes: 'Full payment via ACH wire transfer',
      })
      .returning();

    await db.insert(paymentAllocations).values({
      paymentId: pay1.id,
      invoiceId: inv1.id,
      amount: '190.00',
    });

    // Invoice 2: Partially Paid
    const inv2Date = new Date();
    inv2Date.setDate(inv2Date.getDate() - 15);
    const inv2Due = new Date();
    inv2Due.setDate(inv2Due.getDate() + 15);

    const [inv2] = await db
      .insert(invoices)
      .values({
        businessId: brightloop.id,
        invoiceNumber: 'INV-2026-1002',
        subscriptionId: subWayne.id,
        customerId: cWayne.id,
        status: 'PARTIALLY_PAID',
        invoiceDate: inv2Date,
        dueDate: inv2Due,
        subtotal: '190.00',
        amountTotal: '190.00',
        amountPaid: '100.00',
      })
      .returning();

    await db.insert(invoiceItems).values({
      invoiceId: inv2.id,
      productId: crmProduct.id,
      description: 'Cloud CRM SaaS (Professional Edition)',
      quantity: 1,
      unitPrice: '190.00',
      subtotal: '190.00',
    });

    const [pay2] = await db
      .insert(payments)
      .values({
        businessId: brightloop.id,
        paymentReference: 'PAY-2026-1002',
        customerId: cWayne.id,
        method: 'CREDIT_CARD',
        amount: '100.00',
        paymentDate: inv2Date,
        notes: 'Partial installment payment',
      })
      .returning();

    await db.insert(paymentAllocations).values({
      paymentId: pay2.id,
      invoiceId: inv2.id,
      amount: '100.00',
    });
  }

  // Sub 2: Stark Industries (ACTIVE, Annual Enterprise Retainer + Overdue Invoice)
  let [subStark] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.customerId, cStark.id));

  if (!subStark) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 4);

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 8);

    [subStark] = await db
      .insert(subscriptions)
      .values({
        businessId: brightloop.id,
        subscriptionNumber: 'SUB-2026-2001',
        customerId: cStark.id,
        planId: annualPlan.id,
        status: 'ACTIVE',
        startDate,
        nextBillingDate: nextBilling,
        totalAmount: '1800.00',
        paymentTerms: 'Net 30 Days',
      })
      .returning();

    await db.insert(subscriptionItems).values({
      subscriptionId: subStark.id,
      productId: crmProduct.id,
      quantity: 1,
      unitPrice: '1800.00',
      discountAmount: '0.00',
      taxAmount: '0.00',
      subtotal: '1800.00',
    });

    // Overdue Invoice for Stark
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 45); // Due 45 days ago!

    const [invOverdue] = await db
      .insert(invoices)
      .values({
        businessId: brightloop.id,
        invoiceNumber: 'INV-2026-2001',
        subscriptionId: subStark.id,
        customerId: cStark.id,
        status: 'CONFIRMED',
        invoiceDate: new Date(overdueDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        dueDate: overdueDate,
        subtotal: '1800.00',
        amountTotal: '1800.00',
        amountPaid: '0.00',
      })
      .returning();

    await db.insert(invoiceItems).values({
      invoiceId: invOverdue.id,
      productId: crmProduct.id,
      description: 'Annual Enterprise Retainer Corporate Subscription',
      quantity: 1,
      unitPrice: '1800.00',
      subtotal: '1800.00',
    });
  }

  // Sub 3: Cyberdyne Systems (PAUSED)
  let [subCyberdyne] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.customerId, cCyberdyne.id));

  if (!subCyberdyne) {
    [subCyberdyne] = await db
      .insert(subscriptions)
      .values({
        businessId: brightloop.id,
        subscriptionNumber: 'SUB-2026-3001',
        customerId: cCyberdyne.id,
        planId: monthlyPlan.id,
        status: 'PAUSED',
        startDate: new Date(),
        nextBillingDate: null,
        totalAmount: '190.00',
      })
      .returning();

    await db.insert(subscriptionItems).values({
      subscriptionId: subCyberdyne.id,
      productId: crmProduct.id,
      quantity: 1,
      unitPrice: '190.00',
      discountAmount: '0.00',
      taxAmount: '0.00',
      subtotal: '190.00',
    });
  }

  // Sub 4: Globex Corp (CONFIRMED - ready for demo activation)
  let [subGlobex] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.customerId, cGlobex.id));

  if (!subGlobex) {
    [subGlobex] = await db
      .insert(subscriptions)
      .values({
        businessId: brightloop.id,
        subscriptionNumber: 'SUB-2026-4001',
        customerId: cGlobex.id,
        planId: monthlyPlan.id,
        status: 'CONFIRMED',
        startDate: new Date(),
        totalAmount: '190.00',
      })
      .returning();

    await db.insert(subscriptionItems).values({
      subscriptionId: subGlobex.id,
      productId: crmProduct.id,
      quantity: 1,
      unitPrice: '190.00',
      discountAmount: '0.00',
      taxAmount: '0.00',
      subtotal: '190.00',
    });
  }

  console.log(`✅ Seeded Subscriptions, Invoices, Overdue Balances, and Payments`);

  // 6. Tenant 2: Technova
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
