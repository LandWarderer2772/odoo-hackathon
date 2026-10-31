'use client'

import React from 'react'
import { Invoice } from '@/lib/api'
import Link from 'next/link'

interface UpcomingInvoiceCardProps {
  invoices: Invoice[]
}

export function UpcomingInvoiceCard({ invoices }: UpcomingInvoiceCardProps) {
  const unpaid = invoices.filter((i) => parseFloat(i.balanceDue) > 0)
  const totalBalanceDue = unpaid.reduce((sum, curr) => sum + parseFloat(curr.balanceDue), 0)
  const earliestDue = unpaid.length > 0 ? unpaid[0] : null

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/10 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Receivables & Due Billing
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
              totalBalanceDue > 0
                ? 'bg-amber-950/70 border-amber-400/30 text-amber-300'
                : 'bg-emerald-950/70 border-emerald-400/30 text-emerald-300'
            }`}
          >
            {totalBalanceDue > 0 ? `${unpaid.length} Unsettled` : 'All Settled'}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold tracking-tight text-white font-sans">
            ${totalBalanceDue.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400">
            Total outstanding balance awaiting invoice allocation
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="text-slate-400 block text-[10px] font-mono">NEXT DUE INVOICE</span>
          <span className="font-semibold text-xs font-mono text-slate-200">
            {earliestDue ? `${earliestDue.invoiceNumber} (${new Date(earliestDue.dueDate).toLocaleDateString()})` : 'None pending'}
          </span>
        </div>

        <Link
          href="/invoices"
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold border border-white/10 transition-all"
        >
          View Invoices →
        </Link>
      </div>
    </div>
  )
}
