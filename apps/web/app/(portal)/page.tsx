'use client'

import React, { useState } from 'react'

export default function CustomerDashboard() {
  const [seats, setSeats] = useState(5)

  // Calculations for interactive surcharge engine
  const monthlyTotal = seats * 190
  const annualTotal = seats * 1760

  return (
    <div className="bg-surface text-on-surface antialiased relative min-h-screen overflow-x-hidden selection:bg-tertiary-fixed selection:text-primary">
      {/* Ambient Background Orbs */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[650px] bg-secondary-fixed/40 rounded-full blur-[140px] pointer-events-none -z-10 transform -translate-y-1/2"></div>
      <div className="fixed bottom-1/3 right-10 w-[550px] h-[550px] bg-tertiary-fixed/40 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      {/* Sticky Floating Pill Top Navigation */}
      <header className="sticky top-5 mx-auto rounded-full w-[calc(100%-2.5rem)] max-w-7xl z-50 bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_16px_40px_-10px_rgba(29,97,231,0.12),0_1px_2px_rgba(0,0,0,0.04)] transition-all">
        <div className="h-16 px-5 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Tenant Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <a className="flex items-center gap-2.5 group select-none" href="#">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center p-1.5 text-white shadow-sm shadow-primary/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <span className="material-symbols-outlined text-white text-[20px]">bolt</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="tracking-tight font-extrabold text-on-surface font-sans text-[17px] leading-tight">
                  Bright<span className="text-primary-container">Loop</span>
                </span>
                <span className="text-[9px] font-mono text-outline tracking-[0.14em] uppercase font-bold leading-tight">
                  Customer Portal
                </span>
              </div>
            </a>

            <div className="hidden sm:block h-6 w-px bg-slate-300/70 mx-0.5"></div>

            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/60 border border-slate-200/80 text-on-surface text-xs font-semibold select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="font-bold tracking-tight">Acme Corp</span>
              <span className="text-[10px] text-outline font-mono font-bold uppercase tracking-wider">#CUST-1005</span>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm transition-all" href="#subscriptions-fsm">
              <span className="material-symbols-outlined text-[17px]">autorenew</span>
              <span>Subscriptions</span>
            </a>
            <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container/70 transition-all" href="#invoices-ledger">
              <span className="material-symbols-outlined text-[17px]">receipt_long</span>
              <span>Invoices</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 text-[10px] font-mono font-bold leading-none">
                1 Due
              </span>
            </a>
            <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container/70 transition-all" href="#payments-stream">
              <span className="material-symbols-outlined text-[17px]">account_balance_wallet</span>
              <span>Payments</span>
            </a>
            <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container/70 transition-all" href="#quotes-section">
              <span className="material-symbols-outlined text-[17px]">request_quote</span>
              <span>Quotes</span>
            </a>
            <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container/70 transition-all" href="#pricing-calculator">
              <span className="material-symbols-outlined text-[17px]">calculate</span>
              <span>Surcharge Calc</span>
            </a>
          </nav>

          {/* Right: Trailing Actions & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <a className="bg-gradient-to-br from-sky-400 to-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5 hover:brightness-105 active:scale-[0.98] transition-all shadow-sm shadow-blue-500/25 shrink-0" href="#invoices-ledger">
              <span className="material-symbols-outlined text-[16px]">credit_card</span>
              <span>Pay $90.00 Balance</span>
            </a>
            <div className="hidden md:block h-6 w-px bg-slate-300/70"></div>
            <div className="flex items-center gap-2.5 py-1 pl-1 pr-2 rounded-full hover:bg-surface-container/60 transition-colors select-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                DA
              </div>
              <div className="hidden md:flex flex-col text-left justify-center">
                <span className="text-xs font-bold text-on-surface leading-tight">David A.</span>
                <span className="text-[10px] text-outline font-mono font-medium leading-tight">david@acme-corp.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas Wrapper */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16 space-y-20 md:space-y-28">

        {/* User Specific Welcome & Status Hero */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 border border-white/90 shadow-sm text-primary backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px] font-semibold tracking-wide text-on-surface uppercase">
              Customer Self-Service Portal • RBAC Role: CUSTOMER
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-xs text-primary font-bold">Acme Corp Enterprise Account</span>
          </div>

          <h1 className="text-4xl md:text-6xl text-on-surface tracking-tight font-extrabold max-w-3xl mx-auto leading-[1.12]">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">David</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage your active subscriptions, review automated tax- and discount-calculated invoices, track multi-method payment reconciliations, and accept new quotation offers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-full bg-white border border-white/80 text-xs font-mono text-on-surface flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-blue-600">schedule</span>
              <span>Next Billing Run: <strong>Nov 10, 2026</strong></span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white border border-white/80 text-xs font-mono text-on-surface flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
              <span>Zero-Duplicate Idempotent Billing Engine Active</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white border border-white/80 text-xs font-mono text-on-surface flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-indigo-600">lock</span>
              <span>Payment Terms: <strong>Net 30 Days</strong></span>
            </div>
          </div>
        </section>

        {/* User Financial Command Slate */}
        <section className="relative" id="subscriptions-fsm">
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden border border-white/90 shadow-[0_24px_50px_-12px_rgba(29,97,231,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)]">
            
            {/* Slate Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200/60 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                <div>
                  <h3 className="text-xl text-on-surface font-bold tracking-tight">Active Plan & Subscription Finite State Machine (FSM)</h3>
                  <p className="text-sm text-slate-500">Subscription #SUB-2026-1001 • Cloud CRM SaaS (Professional Edition)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>FSM STATE: ACTIVE</span>
                </span>
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600" title="Refresh Live State" onClick={() => alert('Refreshing live state...')}>
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>

            {/* FSM Lifecycle Pipeline Visualizer */}
            <div className="my-6 p-5 rounded-2xl bg-slate-50/70 border border-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400">Subscription Lifecycle Pipeline</span>
                <span className="text-xs font-mono text-blue-600 font-bold">Rule Guard: Auto-Close = Off, Allow-Pause = True</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono font-bold">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400 flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  <span>1. DRAFT</span>
                  <span className="text-[9px] text-slate-400 font-normal">Created</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400 flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>2. QUOTATION</span>
                  <span className="text-[9px] text-slate-400 font-normal">Sent to Acme</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400 flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                  <span>3. CONFIRMED</span>
                  <span className="text-[9px] text-slate-400 font-normal">Signed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-600 text-white flex flex-col items-center gap-1 shadow-md shadow-blue-500/20 ring-2 ring-blue-600/30">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>4. ACTIVE</span>
                  <span className="text-[9px] text-white/90 font-normal">Billing Hourly</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400 flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">pause_circle</span>
                  <span>5. PAUSED / CLOSE</span>
                  <span className="text-[9px] text-slate-400 font-normal">Available</span>
                </div>
              </div>
            </div>

            {/* Top Metric Highlights Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Monthly Active Subscription</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-on-surface tabular-nums">$190.00</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-blue-600 text-xs font-mono font-medium">
                  <span className="material-symbols-outlined text-[15px]">event_repeat</span>
                  <span>Next Billing: Nov 10, 2026</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-xs font-semibold text-rose-600">Outstanding Balance</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-rose-600 tabular-nums">$90.00</span>
                  <span className="text-xs text-rose-500 font-medium">Due in 15 days</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-rose-600 text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>INV-2026-1002 Partially Paid ($100 settled)</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-xs font-semibold text-emerald-600">Total Revenue Settled YTD</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-on-surface tabular-nums">$2,090.00</span>
                  <span className="text-xs text-emerald-600 font-bold">100% On-Time</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-mono">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Multi-Method Ledger Reconciled</span>
                </div>
              </div>
            </div>

            {/* Trend Card */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">ssid_chart</span>
                  <span className="text-base font-bold text-on-surface">Acme Corp 12-Month Scheduled Recurrence & Invoicing Telemetry</span>
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-mono font-bold">Zero-Duplicate Worker Verified</span>
              </div>
              <div className="h-28 w-full relative">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 120">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#1D61E7" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#38B6FF" stopOpacity="0.0"></stop>
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#005881"></stop>
                      <stop offset="50%" stopColor="#1D61E7"></stop>
                      <stop offset="100%" stopColor="#10B981"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M 0,90 Q 200,85 400,60 T 800,20 L 800,120 L 0,120 Z" fill="url(#curveGradient)"></path>
                  <path d="M 0,90 Q 200,85 400,60 T 800,20" fill="none" stroke="url(#lineGrad)" strokeLinecap="round" strokeWidth="3.5"></path>
                  <circle className="animate-ping" cx="800" cy="20" fill="#10B981" r="5"></circle>
                  <circle cx="800" cy="20" fill="#10B981" r="4"></circle>
                </svg>
                <div className="absolute bottom-1 right-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  Next Scheduled Midnight Auto-Invoice: Nov 10, 2026
                </div>
              </div>
            </div>

            {/* Subscribed Services & Contract Lines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h4 className="text-base font-bold text-on-surface">Your Subscribed Services & Hardware</h4>
                <span className="text-xs text-slate-400 font-mono">Showing 3 Products for Acme Corp</span>
              </div>

              {/* Item 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/60 hover:bg-slate-50 transition-all shadow-sm gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-inner">
                    <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base text-on-surface font-bold">Cloud CRM SaaS</h4>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-mono font-bold">Variant: Professional Edition (+$70.00)</span>
                    </div>
                    <p className="text-sm text-slate-500">Plan: Monthly Pro Subscription • Base $120.00 + Surcharge $70.00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <span className="text-xl font-bold text-on-surface tabular-nums">$190.00</span>
                    <span className="text-sm text-slate-500">/mo</span>
                    <p className="text-xs text-emerald-600 font-semibold font-mono">Promo WELCOME20 applied</p>
                  </div>
                  <button className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-on-surface font-mono text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5" onClick={() => alert('Pause request sent to staff per Plan allow_pause rules.')}>
                    <span className="material-symbols-outlined text-[16px]">pause</span>
                    <span>Pause Plan</span>
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/60 hover:bg-slate-50 transition-all shadow-sm gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner">
                    <span className="material-symbols-outlined text-[24px]">router</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base text-on-surface font-bold">VoIP Hardware Gateway</h4>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-mono font-bold">Variant: Dual Wireless Handsets (+$95.00)</span>
                    </div>
                    <p className="text-sm text-slate-500">Type: GOODS • Hardware Gateway Station (1 Unit Active)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <span className="text-xl font-bold text-on-surface tabular-nums">$545.00</span>
                    <span className="text-sm text-slate-500">one-time</span>
                    <p className="text-xs text-blue-600 font-semibold font-mono">Net 30 Settled</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">inventory_2</span> Active
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-blue-200 hover:bg-slate-50 transition-all shadow-sm gap-4" id="quotes-section">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center text-blue-600 font-bold shadow-inner">
                    <span className="material-symbols-outlined text-[24px]">description</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base text-on-surface font-bold">New Offer: Quote #QUO-2026-0042</h4>
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-mono font-bold">Template: Annual Cloud Enterprise</span>
                    </div>
                    <p className="text-sm text-slate-500">Includes Brand: Odoo Variant Surcharge (+$560.00) • Valid until Nov 14, 2026</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <span className="text-xl font-bold text-on-surface tabular-nums">$1,760.00</span>
                    <span className="text-sm text-slate-500">/yr</span>
                    <p className="text-xs text-blue-600 font-semibold font-mono">15-Day Lock Window</p>
                  </div>
                  <button className="px-4 py-2 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white font-mono text-xs font-bold shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5" onClick={() => alert('Quotation accepted! Transitioning to CONFIRMED and activating billing schedule.')}>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Accept & Sign</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Invoices & Billing Section */}
        <section className="space-y-6" id="invoices-ledger">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider">
                Automated Billing Engine
              </span>
              <h2 className="text-3xl font-bold text-on-surface mt-2">
                Invoices & Tax Deductions
              </h2>
              <p className="text-base text-slate-600">
                Zero-duplicate idempotent invoices generated on schedule with itemized tax and discount breakdowns.
              </p>
            </div>
            <button className="bg-gradient-to-br from-sky-400 to-blue-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-md shadow-blue-500/30 active:scale-95 transition-all self-start sm:self-auto font-mono text-xs font-bold" onClick={() => alert('Opening secure payment gateway to settle $90.00 remaining balance via Card or Wire.')}>
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Pay Outstanding Balance ($90.00)</span>
            </button>
          </div>

          <div className="bg-white/72 backdrop-blur-2xl rounded-3xl p-6 overflow-x-auto border border-white/85 shadow-[0_20px_48px_-12px_rgba(11,30,89,0.06)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 text-xs font-mono uppercase text-slate-400">
                  <th className="pb-3 px-3">Invoice #</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Due Date</th>
                  <th className="pb-3 px-3">Description / Line Items</th>
                  <th className="pb-3 px-3">Total Amount</th>
                  <th className="pb-3 px-3">Amount Paid</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-sm">
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-blue-600">INV-2026-1002</td>
                  <td className="py-4 px-3 text-slate-500 font-mono">Oct 16, 2026</td>
                  <td className="py-4 px-3 text-rose-600 font-mono font-bold">Nov 15, 2026</td>
                  <td className="py-4 px-3 text-on-surface">
                    <div className="font-bold">Cloud CRM SaaS (Professional Edition)</div>
                    <div className="text-xs text-slate-400">1 Seat • Month 2 Recurrence</div>
                  </td>
                  <td className="py-4 px-3 font-bold tabular-nums">$190.00</td>
                  <td className="py-4 px-3 font-bold tabular-nums text-emerald-600">$100.00</td>
                  <td className="py-4 px-3">
                    <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 font-mono text-xs font-bold flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      PARTIALLY PAID
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-mono font-bold hover:brightness-105 shadow-sm" onClick={() => alert('Settling $90.00 balance on INV-2026-1002 via Credit Card...')}>
                        Pay $90
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-slate-100 text-blue-600" title="Download PDF" onClick={() => alert('Downloading invoice PDF for INV-2026-1002...')}>
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-blue-600">INV-2026-1001</td>
                  <td className="py-4 px-3 text-slate-500 font-mono">Aug 15, 2026</td>
                  <td className="py-4 px-3 text-slate-500 font-mono">Sep 15, 2026</td>
                  <td className="py-4 px-3 text-on-surface">
                    <div className="font-bold">Cloud CRM SaaS (Professional Edition)</div>
                    <div className="text-xs text-slate-400">Month 1 Activation • Idempotent Cycle</div>
                  </td>
                  <td className="py-4 px-3 font-bold tabular-nums">$190.00</td>
                  <td className="py-4 px-3 font-bold tabular-nums text-emerald-600">$190.00</td>
                  <td className="py-4 px-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-xs font-bold flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      PAID
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-slate-400 font-mono">Settled (Wire)</span>
                      <button className="p-1.5 rounded-full hover:bg-slate-100 text-blue-600" title="Download PDF" onClick={() => alert('Downloading invoice PDF for INV-2026-1001...')}>
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-blue-600">INV-2026-0988</td>
                  <td className="py-4 px-3 text-slate-500 font-mono">Jul 20, 2026</td>
                  <td className="py-4 px-3 text-slate-500 font-mono">Aug 20, 2026</td>
                  <td className="py-4 px-3 text-on-surface">
                    <div className="font-bold">VoIP Hardware Gateway (Dual Handsets)</div>
                    <div className="text-xs text-slate-400">Base $450.00 + Surcharge $95.00</div>
                  </td>
                  <td className="py-4 px-3 font-bold tabular-nums">$545.00</td>
                  <td className="py-4 px-3 font-bold tabular-nums text-emerald-600">$545.00</td>
                  <td className="py-4 px-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-xs font-bold flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      PAID
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-slate-400 font-mono">Settled (Card)</span>
                      <button className="p-1.5 rounded-full hover:bg-slate-100 text-blue-600" title="Download PDF" onClick={() => alert('Downloading invoice PDF for INV-2026-0988...')}>
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Payment Ledger & Receipts */}
        <section className="space-y-6" id="payments-stream">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-mono text-xs font-bold uppercase tracking-wider">
                Multi-Method Payment Ledger
              </span>
              <h2 className="text-3xl font-bold text-on-surface mt-2">
                Payment Receipts & Bank Reconciliations
              </h2>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-slate-400">Total Balance Outstanding:</div>
              <div className="text-xl text-rose-600 font-bold">$90.00</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/72 backdrop-blur-2xl rounded-3xl p-6 flex flex-col justify-between border border-white/85 shadow-[0_20px_48px_-12px_rgba(11,30,89,0.06)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-blue-600">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                    <span>Ref: WIRE-REF-9921</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-xs font-bold">Allocated in Full</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-2xl font-bold font-mono text-on-surface tabular-nums">$190.00</span>
                  <span className="text-xs text-slate-400 font-mono">Method: ACH Bank Wire</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">Allocated to Invoice: <strong>INV-2026-1001</strong> • Cleared Aug 15, 2026</p>
              </div>
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200/60 text-xs text-slate-400 font-mono">
                <span>Verified by Fastify Gateway</span>
                <button className="text-blue-600 hover:underline font-bold" onClick={() => alert('Viewing Bank Settlement Receipt WIRE-REF-9921')}>View Receipt →</button>
              </div>
            </div>

            <div className="bg-white/72 backdrop-blur-2xl rounded-3xl p-6 flex flex-col justify-between border border-white/85 shadow-[0_20px_48px_-12px_rgba(11,30,89,0.06)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-blue-600">
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                    <span>Ref: PAY-2026-1002</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 font-mono text-xs font-bold">Partial Installment</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-2xl font-bold font-mono text-on-surface tabular-nums">$100.00</span>
                  <span className="text-xs text-slate-400 font-mono">Method: Visa •••• 4242</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">Allocated to Invoice: <strong>INV-2026-1002</strong> • Cleared Oct 16, 2026</p>
              </div>
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200/60 text-xs text-slate-400 font-mono">
                <span>Remaining Balance on Invoice: $90.00</span>
                <button className="text-blue-600 hover:underline font-bold" onClick={() => alert('Viewing Card Transaction PAY-2026-1002')}>View Receipt →</button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Product Variant Surcharge Calculator */}
        <section className="max-w-4xl mx-auto" id="pricing-calculator">
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden border border-white/95 shadow-[0_24px_50px_-12px_rgba(29,97,231,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider">
                Pricing Engine Formula
              </span>
              <h2 className="text-3xl font-bold text-on-surface mt-3">
                Interactive Variant Surcharge Engine
              </h2>
              <p className="text-sm text-slate-600 mt-2 font-mono">
                {"$$\\text{Effective Unit Price} = \\text{Base Sales Price} + \\sum \\text{Variant Surcharges}$$"}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-base font-bold text-on-surface" htmlFor="seat-slider">Select Number of User Seats</label>
                  <span className="text-xl text-blue-600 font-bold tabular-nums">{seats} Seat{seats > 1 ? 's' : ''}</span>
                </div>
                <input 
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none" 
                  id="seat-slider" 
                  max="50" 
                  min="1" 
                  step="1" 
                  type="range" 
                  value={seats}
                  onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                />
                <div className="flex justify-between text-sm font-mono text-slate-500 mt-2">
                  <span>1 Seat (Starter)</span>
                  <span>10 Seats (Team)</span>
                  <span>50 Seats (Enterprise)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/60">
                  <span className="text-sm font-medium text-slate-600">Monthly CRM Pro + Brand Variant</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold text-blue-600 tabular-nums">${monthlyTotal.toLocaleString()}.00</span>
                    <span className="text-base text-slate-500 font-mono">/mo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono">Computed at ($120 Base + $70 Professional Variant) × Seats</p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/60">
                  <span className="text-sm font-medium text-slate-600">Annual Enterprise + Odoo Brand Surcharge</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold text-indigo-700 tabular-nums">${annualTotal.toLocaleString()}.00</span>
                    <span className="text-base text-indigo-700 font-bold font-mono">/yr</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono">Base $1,200 + Odoo Brand Surcharge $560 = $1,760/seat/yr</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button className="bg-gradient-to-br from-sky-400 to-blue-600 text-white font-mono text-sm font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2 hover:shadow-lg transition-all" onClick={() => alert('Quotation requested for selected seat tier! Staff notified.')}>
                  <span>Request Custom Plan Quotation</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Automated Billing Guarantee Banner */}
        <section className="rounded-3xl bg-[#0B1E59] text-white p-8 md:p-14 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/30 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-300/15 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-sky-200 font-mono text-xs font-semibold tracking-wide border border-white/15">
              Midnight Billing Worker Active • 00:00:00 UTC Daily
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Zero-Duplicate Autonomous Billing Guarantees.
            </h2>
            <p className="text-lg text-sky-200/90 max-w-2xl leading-relaxed">
              BrightLoop executes all subscription cycles through cryptographic idempotency keys and row-level database locks (`SELECT ... FOR UPDATE`), preventing missed renewals or duplicate charges.
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-6 text-sky-200/70 text-sm border-t border-white/10">
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="material-symbols-outlined text-[18px] text-white">verified_user</span>
                <span>Idempotency Key: hash(sub_id + cycle_date)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="material-symbols-outlined text-[18px] text-white">shield</span>
                <span>Redis Distributed Queue (BullMQ)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="material-symbols-outlined text-[18px] text-white">lock</span>
                <span>Argon2id & HttpOnly RBAC Guard</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-28 w-full rounded-t-3xl bg-white border-t border-slate-200/60 shadow-none relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-10 max-w-7xl mx-auto gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center p-1.5 text-white">
                <span className="material-symbols-outlined text-white text-[16px]">bolt</span>
              </div>
              <span className="text-lg font-bold text-on-surface">BrightLoop</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              © 2026 BrightLoop Technologies Inc. Autonomous Subscription Management System • Customer Portal
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
            <a className="text-slate-600 hover:text-blue-600 transition-all" href="#">Security Policy</a>
            <a className="text-slate-600 hover:text-blue-600 transition-all" href="#">Billing Terms</a>
            <a className="text-slate-600 hover:text-blue-600 transition-all" href="#">API SLA</a>
            <a className="text-slate-600 hover:text-blue-600 transition-all" href="#">Download Receipts</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
