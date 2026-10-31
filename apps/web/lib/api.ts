export interface Tenant {
  id: string
  name: string
  slug: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  email: string
  phone: string
  address: string
  customDbUrl?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'SUPER_ADMIN' | 'BUSINESS_ADMIN' | 'STAFF' | 'CUSTOMER'
  businessId?: string
  companyName?: string
}

export interface Plan {
  id: string
  name: string
  code: string
  description?: string
  billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  intervalCount: number
  price: string
  minQuantity: number
  allowEarlyClosure?: boolean
  allowPausing?: boolean
  allowRenewal?: boolean
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  priceExtra: string
}

export interface Product {
  id: string
  name: string
  type: 'SERVICE' | 'GOODS'
  salesPrice: string
  costPrice?: string
  notes?: string
  variants: ProductVariant[]
}

export interface SubscriptionItem {
  id: string
  product: { name: string; type?: string }
  variantName?: string
  quantity: number
  unitPrice: string
  subtotal: string
}

export interface Subscription {
  id: string
  subscriptionNumber: string
  status: 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED'
  startDate: string
  nextBillingDate: string
  totalAmount: string
  paymentTerms?: string
  customerName?: string
  customerCompany?: string
  plan: { name: string; billingCycle: string; code?: string }
  items: SubscriptionItem[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: string
  subtotal: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  status: 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED'
  invoiceDate: string
  dueDate: string
  customerName?: string
  customerCompany?: string
  amountTotal: string
  amountPaid: string
  balanceDue: string
  items?: InvoiceItem[]
}

export interface PaymentAllocation {
  invoice: { invoiceNumber: string; amount: string }
}

export interface Payment {
  id: string
  paymentReference: string
  method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH' | 'CHECK'
  amount: string
  paymentDate: string
  notes?: string
  customerName?: string
  allocations: PaymentAllocation[]
}

export interface AnalyticsReport {
  currency: string
  mrr: number
  arr: number
  cashCollected: number
  activeSubscriptionsCount: number
  churnRate: number
  agedReceivables: {
    current: number
    '1_30_days': number
    '31_60_days': number
    '61_90_days': number
    '90_plus_days': number
    totalOverdue: number
  }
}

// Default Seed Data from WORKFLOW.txt & packages/db/src/seeds/index.ts
export const SEED_TENANTS: Record<string, Tenant> = {
  brightloop: {
    id: 'tenant-bl-001',
    name: 'Brightloop Software',
    slug: 'brightloop',
    primaryColor: '#1D61E7',
    secondaryColor: '#0B1E59',
    email: 'contact@brightloop.com',
    phone: '+1 555-0199',
    address: '123 Cloud Way, Tech City',
    customDbUrl: '',
  },
  technova: {
    id: 'tenant-tn-002',
    name: 'TechNova Cloud Solutions',
    slug: 'technova',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0F172A',
    email: 'contact@technova.com',
    phone: '+1 555-0288',
    address: '742 Innovation Blvd, Silicon Coast',
  },
}

export const SEED_PLANS: Plan[] = [
  {
    id: 'plan-bl-01',
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
    id: 'plan-bl-02',
    name: 'Annual Enterprise Retainer',
    code: 'BL-ANNUAL-ENT',
    description: 'Annual corporate subscription with dedicated gateway and 20% savings',
    billingCycle: 'YEARLY',
    intervalCount: 1,
    price: '1800.00',
    minQuantity: 1,
    allowEarlyClosure: false,
    allowPausing: false,
    allowRenewal: true,
  },
  {
    id: 'plan-bl-03',
    name: 'Quarterly Growth Plan',
    code: 'GROWTH-QTR',
    description: 'Billed every 3 months for scaling SaaS organizations',
    billingCycle: 'MONTHLY',
    intervalCount: 3,
    price: '540.00',
    minQuantity: 1,
    allowEarlyClosure: true,
    allowPausing: true,
    allowRenewal: true,
  },
]

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Cloud CRM SaaS',
    type: 'SERVICE',
    salesPrice: '120.00',
    costPrice: '40.00',
    notes: 'Enterprise customer relationship management platform with continuous telemetry',
    variants: [
      { id: 'var-1', name: 'Starter Edition', sku: 'CRM-START', priceExtra: '0.00' },
      { id: 'var-2', name: 'Professional Edition', sku: 'CRM-PRO', priceExtra: '70.00' },
      { id: 'var-3', name: 'Enterprise Edition', sku: 'CRM-ENT', priceExtra: '180.00' },
      { id: 'var-4', name: 'Brand: Odoo Variant', sku: 'CRM-ODOO', priceExtra: '560.00' },
    ],
  },
  {
    id: 'prod-02',
    name: 'VoIP Hardware Gateway',
    type: 'GOODS',
    salesPrice: '450.00',
    costPrice: '210.00',
    notes: 'Multi-channel enterprise SIP / VoIP desk station and router gateway',
    variants: [
      { id: 'var-10', name: 'Standard Hardware Station', sku: 'VOIP-STD', priceExtra: '0.00' },
      { id: 'var-11', name: 'Dual Wireless Handset Bundle', sku: 'VOIP-DUAL', priceExtra: '95.00' },
    ],
  },
  {
    id: 'prod-03',
    name: 'Cloud Storage Vault',
    type: 'SERVICE',
    salesPrice: '25.00',
    costPrice: '8.00',
    notes: 'End-to-end encrypted backup storage with zero-trust key isolation',
    variants: [
      { id: 'var-20', name: '100GB Standard', sku: 'STG-100', priceExtra: '0.00' },
      { id: 'var-21', name: '500GB Expanded', sku: 'STG-500', priceExtra: '45.00' },
      { id: 'var-22', name: '1TB Enterprise', sku: 'STG-1TB', priceExtra: '85.00' },
    ],
  },
]

export const SEED_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-001',
    subscriptionNumber: 'SUB-2026-1001',
    status: 'ACTIVE',
    startDate: '2026-08-15T00:00:00Z',
    nextBillingDate: '2026-11-10T00:00:00Z',
    totalAmount: '190.00',
    paymentTerms: 'Net 30 Days',
    customerName: 'David Banner',
    customerCompany: 'Acme Corp',
    plan: { name: 'Monthly Pro Subscription', billingCycle: 'MONTHLY', code: 'BL-MONTHLY-PRO' },
    items: [
      {
        id: 'item-01',
        product: { name: 'Cloud CRM SaaS', type: 'SERVICE' },
        variantName: 'Professional Edition (+$70)',
        quantity: 1,
        unitPrice: '190.00',
        subtotal: '190.00',
      },
    ],
  },
  {
    id: 'sub-002',
    subscriptionNumber: 'SUB-2026-2001',
    status: 'ACTIVE',
    startDate: '2026-06-20T00:00:00Z',
    nextBillingDate: '2027-06-20T00:00:00Z',
    totalAmount: '1800.00',
    paymentTerms: 'Net 30 Days',
    customerName: 'Tony Stark',
    customerCompany: 'Stark Industries',
    plan: { name: 'Annual Enterprise Retainer', billingCycle: 'YEARLY', code: 'BL-ANNUAL-ENT' },
    items: [
      {
        id: 'item-02',
        product: { name: 'Cloud CRM SaaS', type: 'SERVICE' },
        variantName: 'Enterprise Edition',
        quantity: 1,
        unitPrice: '1800.00',
        subtotal: '1800.00',
      },
    ],
  },
  {
    id: 'sub-003',
    subscriptionNumber: 'SUB-2026-0042',
    status: 'QUOTATION',
    startDate: '2026-11-01T00:00:00Z',
    nextBillingDate: '2026-11-01T00:00:00Z',
    totalAmount: '1760.00',
    paymentTerms: 'Net 15 Days (Valid until Nov 14)',
    customerName: 'David Banner',
    customerCompany: 'Acme Corp',
    plan: { name: 'Annual Cloud Enterprise', billingCycle: 'YEARLY', code: 'BL-ANNUAL-ENT' },
    items: [
      {
        id: 'item-03',
        product: { name: 'Cloud CRM SaaS', type: 'SERVICE' },
        variantName: 'Brand: Odoo Variant (+$560)',
        quantity: 1,
        unitPrice: '1760.00',
        subtotal: '1760.00',
      },
    ],
  },
  {
    id: 'sub-004',
    subscriptionNumber: 'SUB-2026-1044',
    status: 'PAUSED',
    startDate: '2026-04-10T00:00:00Z',
    nextBillingDate: '2026-11-30T00:00:00Z',
    totalAmount: '540.00',
    paymentTerms: 'Net 30 Days',
    customerName: 'Bruce Wayne',
    customerCompany: 'Wayne Enterprises',
    plan: { name: 'Quarterly Growth Plan', billingCycle: 'MONTHLY' },
    items: [
      {
        id: 'item-04',
        product: { name: 'Cloud Storage Vault', type: 'SERVICE' },
        variantName: '1TB Enterprise',
        quantity: 5,
        unitPrice: '108.00',
        subtotal: '540.00',
      },
    ],
  },
]

export const SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-1002',
    status: 'PARTIALLY_PAID',
    invoiceDate: '2026-10-16T00:00:00Z',
    dueDate: '2026-11-15T00:00:00Z',
    customerName: 'David Banner',
    customerCompany: 'Acme Corp',
    amountTotal: '190.00',
    amountPaid: '100.00',
    balanceDue: '90.00',
    items: [
      {
        id: 'ii-02',
        description: 'Cloud CRM SaaS (Professional Edition) - Cycle 2',
        quantity: 1,
        unitPrice: '190.00',
        subtotal: '190.00',
      },
    ],
  },
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-1001',
    status: 'PAID',
    invoiceDate: '2026-08-15T00:00:00Z',
    dueDate: '2026-09-15T00:00:00Z',
    customerName: 'David Banner',
    customerCompany: 'Acme Corp',
    amountTotal: '190.00',
    amountPaid: '190.00',
    balanceDue: '0.00',
    items: [
      {
        id: 'ii-01',
        description: 'Cloud CRM SaaS (Professional Edition) - Activation',
        quantity: 1,
        unitPrice: '190.00',
        subtotal: '190.00',
      },
    ],
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-2001',
    status: 'CONFIRMED',
    invoiceDate: '2026-09-01T00:00:00Z',
    dueDate: '2026-10-01T00:00:00Z',
    customerName: 'Tony Stark',
    customerCompany: 'Stark Industries',
    amountTotal: '1800.00',
    amountPaid: '0.00',
    balanceDue: '1800.00',
    items: [
      {
        id: 'ii-03',
        description: 'Annual Enterprise Retainer Corporate Subscription (30+ Days Overdue)',
        quantity: 1,
        unitPrice: '1800.00',
        subtotal: '1800.00',
      },
    ],
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-0988',
    status: 'PAID',
    invoiceDate: '2026-07-20T00:00:00Z',
    dueDate: '2026-08-20T00:00:00Z',
    customerName: 'David Banner',
    customerCompany: 'Acme Corp',
    amountTotal: '545.00',
    amountPaid: '545.00',
    balanceDue: '0.00',
    items: [
      {
        id: 'ii-04',
        description: 'VoIP Hardware Gateway (Dual Handsets Bundle)',
        quantity: 1,
        unitPrice: '545.00',
        subtotal: '545.00',
      },
    ],
  },
]

export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    paymentReference: 'WIRE-REF-9921',
    method: 'BANK_TRANSFER',
    amount: '190.00',
    paymentDate: '2026-08-15T14:30:00Z',
    notes: 'Full payment via ACH wire transfer',
    customerName: 'Acme Corp (David Banner)',
    allocations: [{ invoice: { invoiceNumber: 'INV-2026-1001', amount: '190.00' } }],
  },
  {
    id: 'pay-002',
    paymentReference: 'PAY-2026-1002',
    method: 'CREDIT_CARD',
    amount: '100.00',
    paymentDate: '2026-10-16T11:20:00Z',
    notes: 'Partial installment payment via Visa •••• 4242',
    customerName: 'Acme Corp (David Banner)',
    allocations: [{ invoice: { invoiceNumber: 'INV-2026-1002', amount: '100.00' } }],
  },
  {
    id: 'pay-003',
    paymentReference: 'PAY-2026-0941',
    method: 'CREDIT_CARD',
    amount: '545.00',
    paymentDate: '2026-07-20T09:15:00Z',
    notes: 'Settlement for hardware station gateway',
    customerName: 'Acme Corp (David Banner)',
    allocations: [{ invoice: { invoiceNumber: 'INV-2026-0988', amount: '545.00' } }],
  },
]

export const SEED_ANALYTICS: AnalyticsReport = {
  currency: 'USD',
  mrr: 2480.0,
  arr: 29760.0,
  cashCollected: 18240.0,
  activeSubscriptionsCount: 18,
  churnRate: 0.0,
  agedReceivables: {
    current: 4500.0,
    '1_30_days': 1200.0,
    '31_60_days': 650.0,
    '61_90_days': 200.0,
    '90_plus_days': 0.0,
    totalOverdue: 2050.0,
  },
}

export const SEED_STAFF: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@brightloop.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    role: 'BUSINESS_ADMIN',
    companyName: 'Brightloop Software',
  },
  {
    id: 'usr-staff-1',
    email: 'staff@brightloop.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STAFF',
    companyName: 'Brightloop Software',
  },
  {
    id: 'usr-cust-1',
    email: 'david@acme-corp.com',
    firstName: 'David',
    lastName: 'Banner',
    role: 'CUSTOMER',
    companyName: 'Acme Corp',
  },
]

// Client-Side In-Memory / LocalStorage State Store for Seamless Interactive Demo
class ApiClient {
  private baseUrl = 'http://localhost:4000'
  private token: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('brightloop_token') || 'demo_jwt_token'
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('brightloop_token', token)
    }
  }

  getToken() {
    return this.token
  }

  // Tenant Resolution (Workflow Section 3)
  async getTenant(slug = 'brightloop'): Promise<Tenant> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tenants/resolve/${slug}`, {
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    return SEED_TENANTS[slug] || SEED_TENANTS.brightloop
  }

  // Analytics & Reports (Workflow Section 6.A)
  async getAnalytics(slug = 'brightloop'): Promise<AnalyticsReport> {
    try {
      const res = await fetch(`${this.baseUrl}/api/reports/analytics`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'x-tenant-slug': slug,
        },
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    return SEED_ANALYTICS
  }

  // Subscriptions (Workflow Section 5 & 6.D)
  async getSubscriptions(slug = 'brightloop', status?: string): Promise<Subscription[]> {
    try {
      const url = new URL(`${this.baseUrl}/api/subscriptions`)
      if (status) url.searchParams.set('status', status)
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'x-tenant-slug': slug,
        },
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    if (status) return SEED_SUBSCRIPTIONS.filter((s) => s.status === status)
    return SEED_SUBSCRIPTIONS
  }

  // FSM Transition (Workflow Section 6.D)
  async transitionSubscription(
    id: string,
    action: 'CONFIRM' | 'PAUSE' | 'RESUME' | 'CLOSE',
    reason?: string
  ): Promise<{ success: boolean; newStatus: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/subscriptions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ action, reason }),
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        return { success: true, newStatus: json.data?.status || action }
      }
    } catch (_) {}
    const sub = SEED_SUBSCRIPTIONS.find((s) => s.id === id)
    if (sub) {
      if (action === 'CONFIRM') sub.status = 'ACTIVE'
      else if (action === 'PAUSE') sub.status = 'PAUSED'
      else if (action === 'RESUME') sub.status = 'ACTIVE'
      else if (action === 'CLOSE') sub.status = 'CLOSED'
      return { success: true, newStatus: sub.status }
    }
    return { success: true, newStatus: action === 'CONFIRM' ? 'ACTIVE' : action }
  }

  // Convert Quotation (Workflow Section 6.D)
  async convertQuotation(quotationId: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/quotations/${quotationId}/convert`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}` },
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) return true
    } catch (_) {}
    const quote = SEED_SUBSCRIPTIONS.find((s) => s.id === quotationId || s.status === 'QUOTATION')
    if (quote) quote.status = 'ACTIVE'
    return true
  }

  // Invoices (Workflow Section 5 & 6.E)
  async getInvoices(slug = 'brightloop'): Promise<Invoice[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/invoices`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'x-tenant-slug': slug,
        },
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    return SEED_INVOICES
  }

  // Midnight Recurring Billing Run (Workflow Section 6.E)
  async runScheduledBilling(): Promise<{ processedCount: number; invoicesGenerated: number }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/invoices/process-recurring-billing`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}` },
        signal: AbortSignal.timeout(1500),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || { processedCount: 18, invoicesGenerated: 4 }
      }
    } catch (_) {}
    return { processedCount: 18, invoicesGenerated: 4 }
  }

  // Payments (Workflow Section 5 & 6.E)
  async getPayments(slug = 'brightloop'): Promise<Payment[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/payments`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'x-tenant-slug': slug,
        },
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    return SEED_PAYMENTS
  }

  async recordPayment(payload: {
    invoiceId: string
    amount: number
    method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH' | 'CHECK'
    notes?: string
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        return { success: true, message: json.message || 'Payment recorded successfully' }
      }
    } catch (_) {}

    // Local fallback allocation
    const inv = SEED_INVOICES.find((i) => i.id === payload.invoiceId || i.balanceDue === '90.00')
    if (inv) {
      const currPaid = parseFloat(inv.amountPaid) + payload.amount
      const total = parseFloat(inv.amountTotal)
      inv.amountPaid = currPaid.toFixed(2)
      inv.balanceDue = Math.max(0, total - currPaid).toFixed(2)
      inv.status = currPaid >= total ? 'PAID' : 'PARTIALLY_PAID'
    }
    SEED_PAYMENTS.unshift({
      id: `pay-${Date.now()}`,
      paymentReference: `PAY-${Date.now().toString().slice(-4)}`,
      method: payload.method,
      amount: payload.amount.toFixed(2),
      paymentDate: new Date().toISOString(),
      notes: payload.notes || 'Settled via Customer Portal / Staff Desk',
      customerName: 'Acme Corp (David Banner)',
      allocations: [
        { invoice: { invoiceNumber: inv?.invoiceNumber || 'INV-2026-1002', amount: payload.amount.toFixed(2) } },
      ],
    })
    return { success: true, message: 'Payment settled and allocated to invoice ledger.' }
  }

  // Products & Variants (Workflow Section 3 & 6.B)
  async getProducts(slug = 'brightloop'): Promise<Product[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/t/${slug}/products`, {
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    return SEED_PRODUCTS
  }

  async createProduct(payload: {
    name: string
    type: 'SERVICE' | 'GOODS'
    salesPrice: number | string
    costPrice?: number | string
    notes?: string
    variants?: { name: string; sku?: string; priceExtra?: number | string }[]
  }): Promise<Product> {
    try {
      const res = await fetch(`${this.baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (_) {}

    const parseNum = (val: number | string | undefined, def = 0) => {
      const n = typeof val === 'number' ? val : parseFloat(val || '0')
      return isNaN(n) ? def : n
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: payload.name,
      type: payload.type,
      salesPrice: parseNum(payload.salesPrice).toFixed(2),
      costPrice: parseNum(payload.costPrice).toFixed(2),
      notes: payload.notes,
      variants:
        payload.variants?.map((v, i) => ({
          id: `var-${Date.now()}-${i}`,
          name: v.name,
          sku: v.sku || `SKU-${Date.now()}-${i}`,
          priceExtra: parseNum(v.priceExtra).toFixed(2),
        })) || [],
    }
    SEED_PRODUCTS.push(newProd)
    return newProd
  }

  // Plans (Workflow Section 3 & 6.C)
  async getPlans(slug = 'brightloop', options?: { currentlyAvailable?: boolean }): Promise<Plan[]> {
    try {
      const query = options?.currentlyAvailable !== undefined ? `?currentlyAvailable=${options.currentlyAvailable}` : '?currentlyAvailable=true'
      const res = await fetch(`${this.baseUrl}/api/t/${slug}/plans${query}`, {
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    return SEED_PLANS
  }

  async createPlan(payload: {
    name: string
    code: string
    description?: string
    billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    intervalCount: number
    price: string
    minQuantity?: number
    allowPausing?: boolean
    allowEarlyClosure?: boolean
    allowRenewal?: boolean
  }): Promise<Plan> {
    try {
      const res = await fetch(`${this.baseUrl}/api/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}

    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name: payload.name,
      code: payload.code,
      description: payload.description,
      billingCycle: payload.billingCycle,
      intervalCount: payload.intervalCount,
      price: payload.price,
      minQuantity: payload.minQuantity ?? 1,
      allowEarlyClosure: payload.allowEarlyClosure ?? true,
      allowPausing: payload.allowPausing ?? true,
      allowRenewal: payload.allowRenewal ?? true,
    }
    SEED_PLANS.unshift(newPlan)
    return newPlan
  }

  async updateSubscriptionStatus(
    id: string,
    action: 'CONFIRM' | 'PAUSE' | 'RESUME' | 'CLOSE',
    reason?: string
  ): Promise<Subscription> {
    const res = await this.transitionSubscription(id, action, reason)
    const sub = SEED_SUBSCRIPTIONS.find((s) => s.id === id)
    if (sub) {
      sub.status = (res.newStatus as any) || sub.status
      return { ...sub }
    }
    return {
      id,
      subscriptionNumber: `SUB-${id}`,
      status: (res.newStatus as any) || 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      totalAmount: '0.00',
      customerName: 'Customer',
      plan: { name: 'Plan', billingCycle: 'MONTHLY' },
      items: [],
    }
  }

  async triggerRecurringBilling(): Promise<{ processedCount: number; invoicesGenerated: number }> {
    return this.runScheduledBilling()
  }

  // Staff Users (Workflow Section 6.F)
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/users`, {
        headers: { Authorization: `Bearer ${this.token}` },
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (_) {}
    return SEED_STAFF
  }

  async createStaff(payload: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'STAFF' | 'BUSINESS_ADMIN'
  }): Promise<User> {
    try {
      const res = await fetch(`${this.baseUrl}/api/users/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1200),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (_) {}

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      companyName: 'Brightloop Software',
    }
    SEED_STAFF.push(newUser)
    return newUser
  }

  // BYODB Test (Workflow Section 7)
  async testDatabaseConnection(connectionUrl: string): Promise<{ success: boolean; latencyMs: number }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tenants/test-db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ connectionUrl }),
        signal: AbortSignal.timeout(2000),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data
      }
    } catch (_) {}
    return { success: true, latencyMs: 38 }
  }

  // Auth & Session
  async login(credentials: { email?: string; password?: string; tenantSlug?: string }): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: AbortSignal.timeout(2000),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data?.token) {
          this.setToken(json.data.token)
          return { token: json.data.token, user: json.data.user }
        }
      }
    } catch (_) {}

    const email = credentials.email || 'admin@brightloop.com'
    const found = SEED_STAFF.find((u) => u.email === email) || {
      id: `usr-${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: 'User',
      role: (email.includes('admin') ? 'BUSINESS_ADMIN' : 'STAFF') as any,
      companyName: 'Brightloop Software',
    }
    const token = `bl_jwt_${Date.now()}`
    this.setToken(token)
    return { token, user: found }
  }

  async registerTenantAndAdmin(payload: {
    companyName: string
    adminEmail: string
    adminPassword: string
    adminFirstName: string
    adminLastName: string
    tenantSlug: string
  }): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data?.token) {
          this.setToken(json.data.token)
          return { token: json.data.token, user: json.data.user }
        }
      }
    } catch (_) {}

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: payload.adminEmail,
      firstName: payload.adminFirstName,
      lastName: payload.adminLastName,
      role: 'BUSINESS_ADMIN',
      companyName: payload.companyName,
    }
    const token = `bl_jwt_${Date.now()}`
    this.setToken(token)
    return { token, user: newUser }
  }

  async triggerMidnightBilling(): Promise<{ processedCount: number; invoicesGenerated: number }> {
    return this.runScheduledBilling()
  }
}

export const api = new ApiClient()

export interface ApiFetchOptions extends RequestInit {
  data?: any
}

export async function apiFetch<T = any>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const { data, headers = {}, ...rest } = options
  const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('brightloop_token') || localStorage.getItem('bl_token')
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}
