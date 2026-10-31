'use client'

import React, { useEffect, useState } from 'react'
import { api, Invoice } from '@/lib/api'

export default function DashboardInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PAID'>('ALL')

  // Payment modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH' | 'CHECK'>('BANK_TRANSFER')
  const [notes, setNotes] = useState('')
  const [submittingPayment, setSubmittingPayment] = useState(false)

  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    setLoading(true)
    try {
      const data = await api.getInvoices()
      setInvoices(data)
    } catch (err) {
      console.error('Failed to load invoices:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedInvoice) return
    setSubmittingPayment(true)

    try {
      await api.recordPayment({
        invoiceId: selectedInvoice.id,
        amount: Number(amount),
        method,
        notes,
      })
      alert(`Payment of $${amount} recorded successfully!`)
      setSelectedInvoice(null)
      setAmount('')
      setNotes('')
      loadInvoices()
    } catch (err: any) {
      alert(err.message || 'Payment recording failed')
    } finally {
      setSubmittingPayment(false)
    }
  }

  const filtered = invoices.filter((inv) => filter === 'ALL' || inv.status === filter)

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Billing & Invoicing
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Invoice Ledger</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track generated invoices, outstanding balances, and record payments.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {['ALL', 'CONFIRMED', 'PARTIALLY_PAID', 'PAID'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === tab
                ? 'bg-cyan-400/20 border border-cyan-400/40 text-cyan-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c1220] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Total</th>
                <th className="px-6 py-3.5">Amount Paid</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 animate-pulse">
                    Loading invoices...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No invoices matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const balanceDue = Number(inv.amountTotal) - Number(inv.amountPaid || 0)
                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4 font-mono font-bold text-cyan-300">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">
                        {inv.customerName || 'Client Corp'}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        ${inv.amountTotal}
                      </td>
                      <td className="px-6 py-4 font-mono text-emerald-400 font-semibold">
                        ${inv.amountPaid || '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                              : inv.status === 'PARTIALLY_PAID'
                              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                              : 'bg-blue-400/10 text-blue-300 border border-blue-400/20'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status !== 'PAID' && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv)
                                setAmount(balanceDue.toFixed(2))
                              }}
                              className="px-3 py-1 rounded bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow"
                            >
                              Pay ${balanceDue.toFixed(2)}
                            </button>
                          )}
                          <a
                            href={`http://localhost:4000/api/invoices/${inv.id}/html`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded border border-white/10 text-slate-300 text-xs hover:text-white hover:border-white/30 transition"
                          >
                            Print HTML
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1220] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white">Record Invoice Payment</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
              <div className="text-slate-400">Invoice: <span className="font-mono text-cyan-300 font-bold">{selectedInvoice.invoiceNumber}</span></div>
              <div className="text-slate-400">Total: <span className="font-mono text-white font-bold">${selectedInvoice.amountTotal}</span></div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="BANK_TRANSFER">Bank Wire / Transfer</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Transaction Reference</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Wire Ref #882910"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 transition"
                >
                  {submittingPayment ? 'Allocating...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
