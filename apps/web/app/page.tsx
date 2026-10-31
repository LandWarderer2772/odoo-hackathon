import React from 'react'
import Link from 'next/link'
import { BrightLoopLogo } from '@/components/common/BrightLoopLogo'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#050912] text-slate-100 overflow-hidden">
      {/* Background Orbs & Radial Aura */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/4 w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-[#2563eb]/25 via-[#06b6d4]/20 to-[#38bdf8]/15 blur-[150px]" />
        <div className="absolute top-[350px] -right-24 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-[#8b5cf6]/20 via-[#6366f1]/20 to-[#0ea5e9]/20 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,9,18,0.85)_100%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#070d18]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <BrightLoopLogo variant="full" size="md" showSubtitle={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <Link href="/subscriptions" className="hover:text-cyan-400 transition-colors">
              Subscriptions
            </Link>
            <Link href="/invoices" className="hover:text-cyan-400 transition-colors">
              Invoices
            </Link>
            <Link href="/payments" className="hover:text-cyan-400 transition-colors">
              Payments
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all ring-1 ring-cyan-300/30"
            >
              Launch Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-400/40 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,1)]" />
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                Enterprise Recurring Billing OS
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-semibold text-slate-400">v3.2 Release</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]" style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
              Continuous Invoicing. <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                Autonomous Recurrence.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              BrightLoop powers mission-critical subscription lifecycles, tax and discount engines, multi-currency invoicing, and sub-100ms financial intelligence for global software enterprises.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:shadow-[0_0_45px_rgba(56,189,248,0.7)] transition-all ring-1 ring-cyan-300/40"
              >
                Access Customer Portal →
              </Link>
              <Link
                href="/invoices"
                className="px-6 py-3.5 rounded-full font-bold text-slate-200 bg-slate-900/80 border border-white/15 hover:border-cyan-400/50 hover:bg-slate-800 transition-all"
              >
                View Live Ledger
              </Link>
            </div>

            {/* Typography & Brand Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-lg">
              <div>
                <div className="text-2xl font-extrabold text-white font-mono">&lt;2s</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">SLA Latency</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-cyan-400 font-mono">0-Dup</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Idempotency</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white font-mono">99.999%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Availability</div>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase: 3D Emblem & Glassmorphic Brand Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-cyan-400/35 p-6 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.9),0_0_45px_rgba(56,189,248,0.25)] flex flex-col gap-6">
              {/* 3D Glassmorphic Emblem Banner */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                <img
                  src="/brightloop-logo-3d.png"
                  alt="BrightLoop Brand Emblem"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 text-xs font-mono text-cyan-300 font-bold shadow-md">
                    ∞ CONTINUOUS RECURRING LOOP
                  </div>
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]" />
                </div>
              </div>

              {/* Brand Typography Details */}
              <div className="flex flex-col gap-2">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Official Typography System
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white font-display">Outfit &amp; Plus Jakarta Sans</span>
                    <span className="text-xs text-slate-400">Display Hero &amp; High-Readability Body</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-cyan-950/60 text-cyan-400 text-xs font-mono border border-cyan-400/30">
                    Geometric
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#050912]/90 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrightLoopLogo variant="full" size="sm" showSubtitle={true} />
          <p className="text-xs font-mono text-slate-500">
            © 2026 BrightLoop Technologies Inc. Autonomous Subscription Management System.
          </p>
        </div>
      </footer>
    </div>
  )
}
