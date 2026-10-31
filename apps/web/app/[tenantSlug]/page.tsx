'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, Tenant, Plan, Product } from '@/lib/api'

export default function TenantLandingPage() {
  const params = useParams()
  const router = useRouter()
  const tenantSlug = (params?.tenantSlug as string) || 'brightloop'

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTenantData() {
      setLoading(true)
      try {
        const tenantData = await api.getTenant(tenantSlug)
        setTenant(tenantData)

        const [availablePlans, catalogProducts] = await Promise.all([
          api.getPlans(tenantSlug, { currentlyAvailable: true }),
          api.getProducts(tenantSlug),
        ])
        setPlans(availablePlans)
        setProducts(catalogProducts)
      } catch (err) {
        console.error('Failed to load tenant:', err)
      } finally {
        setLoading(false)
      }
    }

    if (tenantSlug) {
      loadTenantData()
    }
  }, [tenantSlug])

  const primaryColor = tenant?.primaryColor || '#0ea5e9'

  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 flex flex-col">
      {/* Top Ambient Aura with Tenant Primary Color */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${primaryColor}40 0%, transparent 60%)`,
        }}
      />

      {/* Branded Header */}
      <header className="sticky top-0 z-50 bg-[#070d18]/85 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant?.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="h-10 max-w-[180px] object-contain rounded"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {tenant?.name ? tenant.name.charAt(0).toUpperCase() : 'B'}
              </div>
            )}
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                {tenant?.name || 'Tenant Portal'}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                Verified Business Tenant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`/login?tenant=${tenantSlug}`}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={`/login?tenant=${tenantSlug}`}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              Customer Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono uppercase tracking-wider text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Live Client Portal · Path: /{tenantSlug}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {tenant?.name || 'Aetheria Business'}
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your subscriptions, view invoices, download payment receipts, and explore available service plans.
          </p>
        </div>

        {/* Subscription Plans Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Available Subscription Plans</h2>
              <p className="text-sm text-slate-400">Select a recurring tier to power your business workflow</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-800 text-slate-300">
              {plans.length} Active Plans
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/10" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl">
              No active subscription plans currently listed for this business.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-white/10 bg-[#070e1c] p-6 flex flex-col justify-between hover:border-cyan-400/40 transition-all shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-cyan-400/10 text-cyan-300 font-semibold">
                        {plan.billingCycle} {plan.intervalCount > 1 ? `(${plan.intervalCount}x)` : ''}
                      </span>
                      {plan.allowRenewal && (
                        <span className="text-[11px] text-emerald-400 font-medium">Auto-renew</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {plan.description || 'Enterprise subscription plan with automatic invoice dispatch.'}
                    </p>
                    <div className="pt-2">
                      <span className="text-3xl font-extrabold text-white">${plan.price}</span>
                      <span className="text-slate-400 text-sm ml-1.5 font-medium">
                        / {plan.billingCycle.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-6">
                    <Link
                      href={`/login?tenant=${tenantSlug}`}
                      className="block text-center w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Subscribe / Sign In
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Product Catalog & Addons */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Catalog Goods & Services</h2>
              <p className="text-sm text-slate-400">Available products and modular variant add-ons</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-800 text-slate-300">
              {products.length} Products
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-white/10 bg-[#070e1c] p-6 space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {prod.type}
                  </span>
                  <span className="text-lg font-bold text-white">${prod.salesPrice}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{prod.name}</h3>
                {prod.notes && <p className="text-xs text-slate-400">{prod.notes}</p>}

                {prod.variants && prod.variants.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Available Variants:
                    </span>
                    <div className="space-y-1">
                      {prod.variants.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60"
                        >
                          <span className="text-slate-300">{v.name}</span>
                          <span className="font-mono text-cyan-300 font-bold">
                            {Number(v.priceExtra) > 0 ? `+$${v.priceExtra}` : 'Included'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Branded Footer */}
      <footer className="border-t border-white/10 bg-[#070d18] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {tenant?.name || 'Aetheria'}. Powered by Aetheria Multi-Tenant SaaS Engine.</p>
          {tenant?.email && (
            <p>
              Contact Support:{' '}
              <a href={`mailto:${tenant.email}`} className="text-cyan-400 hover:underline">
                {tenant.email}
              </a>
              {tenant?.phone ? ` · ${tenant.phone}` : ''}
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}
