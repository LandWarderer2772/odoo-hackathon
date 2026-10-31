'use client'

import React from 'react'
import Link from 'next/link'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'

export interface UpcomingInvoiceCardProps {
  invoices?: any[]
}

export const UpcomingInvoiceCard: React.FC<UpcomingInvoiceCardProps> = ({ invoices = [] }) => {
  const unpaidInvoices = invoices.filter(
    (i) => i.status === 'CONFIRMED' || i.status === 'PARTIALLY_PAID'
  )
  const totalOutstanding = unpaidInvoices.reduce((acc, curr) => {
    const total = Number(curr.amountTotal || 0)
    const paid = Number(curr.amountPaid || 0)
    return acc + Math.max(0, total - paid)
  }, 0)

  const nextDue = unpaidInvoices[0]

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-sky-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between gap-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
            Settlement Status
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Outstanding Balance</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/40 text-xs font-mono font-bold text-sky-300">
          {unpaidInvoices.length} Pending
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 font-mono">Total Open Balance</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => alert('Launching Payment Intent Gateway...')}
          className="px-4 py-2.5 rounded-xl font-bold text-white text-xs bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
        >
          Pay Open Balance
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Next Due Invoice
        </span>
        {nextDue ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-white/10">
            <div>
              <div className="font-semibold text-sm text-slate-200">{nextDue.invoiceNumber}</div>
              <div className="text-xs text-slate-400 font-mono">
                Due:{' '}
                {new Date(nextDue.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-white text-sm">
                ${(Number(nextDue.amountTotal || 0) - Number(nextDue.amountPaid || 0)).toFixed(2)}
              </span>
              <InvoiceStatusBadge status={nextDue.status} />
            </div>
          </div>
        ) : (
          <div className="text-xs text-emerald-400 font-mono">All invoices are settled in full!</div>
        )}
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <Link
          href="/invoices"
          className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors"
        >
          View all invoice history →
        </Link>
      </div>
    </div>
  )
}
