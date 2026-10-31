'use client'

import React from 'react'
import Link from 'next/link'
import { BrightLoopLogo } from '@/components/common/BrightLoopLogo'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 antialiased relative">
      {/* Subtle top ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Portal Top Bar */}
      <header className="sticky top-0 z-50 bg-[#070d18]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrightLoopLogo variant="full" size="md" showSubtitle={true} />
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/subscriptions"
                className="px-3.5 py-1.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                Subscriptions
              </Link>
              <Link
                href="/invoices"
                className="px-3.5 py-1.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                Invoices
              </Link>
              <Link
                href="/payments"
                className="px-3.5 py-1.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                Payments
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Customer Portal Live</span>
            </div>
            <Link
              href="/login"
              className="text-xs font-mono font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Portal View */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
