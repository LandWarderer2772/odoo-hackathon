'use client'

import React, { useEffect, useState } from 'react'
import { api, Payment } from '@/lib/api'

export default function DashboardPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  async function loadPayments() {
    setLoading(true)
    try {
      const data = await api.getPayments()
      setPayments(data)
    } catch (err) {
      console.error('Failed to load payments:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Ledger & Reconciliation
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Payment Transactions</h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete audit trail of all settled client payments and invoice allocations.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#0c1220] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Reference</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Allocated Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 animate-pulse">
                    Loading payments ledger...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-300">
                      {pay.paymentReference}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {pay.customerName || 'Enterprise Client'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                        {pay.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      +${pay.amount}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      {pay.allocations && pay.allocations.length > 0 ? (
                        <span className="font-mono text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded">
                          {pay.allocations[0].invoice?.invoiceNumber || 'INV-ALLOCATED'}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unallocated</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
