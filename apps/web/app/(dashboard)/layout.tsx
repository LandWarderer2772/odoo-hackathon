'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navGroups = [
  {
    label: 'WORKSPACE',
    items: [
      { icon: '⌂', name: 'Overview', href: '/dashboard' },
      { icon: '◉', name: 'Subscriptions', href: '/dashboard/subscriptions' },
      { icon: '▤', name: 'Invoices', href: '/dashboard/invoices' },
      { icon: '⇄', name: 'Payments', href: '/dashboard/payments' },
    ],
  },
  {
    label: 'CONFIGURATION',
    items: [
      { icon: '◇', name: 'Products', href: '/dashboard/products' },
      { icon: '▦', name: 'Plans', href: '/dashboard/plans' },
      { icon: '♧', name: 'Staff Management', href: '/dashboard/staff' },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 lg:flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-[250px] lg:flex-col lg:border-r lg:border-white/[0.07] lg:bg-[#090e19] lg:px-4 lg:py-6">
        <Link href="/" className="mb-8 flex items-center gap-3 px-2" aria-label="Aetheria home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-xl text-cyan-300">
            ∞
          </span>
          <div>
            <span className="block text-[17px] font-bold tracking-tight text-white">
              Aether<span className="text-cyan-300">ia</span>
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[.18em] text-slate-500">
              Admin console
            </span>
          </div>
        </Link>

        <nav aria-label="Admin navigation" className="flex-1 space-y-8">
          {navGroups.map((group) => (
            <section key={group.label}>
              <h2 className="px-3 text-[10px] font-bold tracking-[.17em] text-slate-600">
                {group.label}
              </h2>
              <div className="mt-3 space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                        isActive
                          ? 'border border-cyan-400/15 bg-cyan-400/[0.09] text-cyan-200 shadow-[inset_2px_0_0_#38bdf8]'
                          : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
                      }`}
                    >
                      <span className="w-5 text-center text-base opacity-80">{item.icon}</span>
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </nav>

        {/* Engine Status Card */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            Billing Engine Active
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Recurring midnight run <span className="text-slate-300">00:00 UTC</span>
          </p>
        </div>

        {/* User Card */}
        <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
            BA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-200">Sarah Connor</p>
            <p className="text-[10px] text-slate-500">Business Admin</p>
          </div>
          <Link
            href="/login"
            aria-label="Sign out"
            className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"
          >
            ↗
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-10 border-b border-white/[0.07] bg-[#070b14]/85 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Workspace</span>
              <span className="text-slate-700">/</span>
              <span className="text-sm font-semibold text-slate-100 capitalize">
                {pathname.split('/').pop() || 'Overview'}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-300 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                All Systems Operational
              </div>
              <Link
                href="/dashboard/staff"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-[#03101c] shadow-[0_0_22px_rgba(56,189,248,.18)] transition hover:brightness-110"
              >
                <span>+</span>
                <span>Invite Staff</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
