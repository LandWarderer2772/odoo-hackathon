'use client'

import React from 'react'
import { PaymentMethodIcon } from './PaymentMethodIcon'

export interface PaymentTableProps {
  payments?: any[]
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ payments = [] }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-slate-400">
        No payment transactions recorded.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400 bg-slate-950/40">
            <th className="py-4 px-6">Payment Reference</th>
            <th className="py-4 px-6">Invoice #</th>
            <th className="py-4 px-6">Date</th>
            <th className="py-4 px-6">Method</th>
            <th className="py-4 px-6 text-right">Amount Settled</th>
            <th className="py-4 px-6 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-normal text-slate-300">
          {payments.map((pay: any) => {
            const amount = Number(pay.amount || 0).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
            const payDate = pay.paymentDate
              ? new Date(pay.paymentDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—'

            return (
              <tr key={pay.id || pay.paymentReference} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-cyan-300">
                  {pay.paymentReference || pay.id}
                </td>
                <td className="py-4 px-6 font-mono text-slate-300">
                  {pay.invoiceNumber || pay.invoiceId || '—'}
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-400">{payDate}</td>
                <td className="py-4 px-6">
                  <PaymentMethodIcon method={pay.method} />
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-emerald-400">
                  {amount}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Settled
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
