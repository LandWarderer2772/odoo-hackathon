'use client'

import React from 'react'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { InvoicePDFDownloadButton } from './InvoicePDFDownloadButton'

export interface InvoiceTableProps {
  invoices?: any[]
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices = [] }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-slate-400">
        No invoice records found.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400 bg-slate-950/40">
            <th className="py-4 px-6">Invoice #</th>
            <th className="py-4 px-6">Date</th>
            <th className="py-4 px-6">Due Date</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6 text-right">Total</th>
            <th className="py-4 px-6 text-right">Paid</th>
            <th className="py-4 px-6 text-right">Balance</th>
            <th className="py-4 px-6 text-right">PDF</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-normal text-slate-300">
          {invoices.map((inv: any) => {
            const total = Number(inv.amountTotal || 0)
            const paid = Number(inv.amountPaid || 0)
            const balance = Math.max(0, total - paid)

            const invDate = inv.invoiceDate
              ? new Date(inv.invoiceDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'

            const dueDate = inv.dueDate
              ? new Date(inv.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'

            return (
              <tr key={inv.id || inv.invoiceNumber} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-white">
                  {inv.invoiceNumber || inv.id}
                </td>
                <td className="py-4 px-6 text-slate-400 font-mono text-xs">{invDate}</td>
                <td className="py-4 px-6 text-slate-400 font-mono text-xs">{dueDate}</td>
                <td className="py-4 px-6">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
                <td className="py-4 px-6 text-right font-mono font-semibold text-slate-200">
                  ${total.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right font-mono text-emerald-400 font-semibold">
                  ${paid.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-white">
                  ${balance.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right">
                  <InvoicePDFDownloadButton invoiceId={inv.id} invoiceNumber={inv.invoiceNumber} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
