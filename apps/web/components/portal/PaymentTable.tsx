'use client'

import React, { useState } from 'react'
import { Payment } from '@/lib/api'
import { PaymentMethodIcon } from './PaymentMethodIcon'

interface PaymentTableProps {
  payments: Payment[]
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const [search, setSearch] = useState('')

  const filtered = payments.filter((p) => {
    return (
      p.paymentReference.toLowerCase().includes(search.toLowerCase()) ||
      (p.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.notes || '').toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Payment Transaction Ledger</h3>
        <div className="w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment reference..."
            className="w-full px-3.5 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Payment Ref</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Allocated Invoice(s)</th>
              <th className="py-3 px-4">Memo / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs text-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No payment records found.
                </td>
              </tr>
            ) : (
              filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-cyan-300">
                    {pay.paymentReference}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {new Date(pay.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    {pay.customerName || 'Direct Subscriber'}
                  </td>
                  <td className="py-3.5 px-4">
                    <PaymentMethodIcon method={pay.method} />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    ${pay.amount}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    {pay.allocations && pay.allocations.length > 0 ? (
                      <div className="space-y-0.5">
                        {pay.allocations.map((alloc, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 mr-1"
                          >
                            {alloc.invoice.invoiceNumber} (${alloc.invoice.amount})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Unallocated</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {pay.notes || 'Automated reconciliation'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
