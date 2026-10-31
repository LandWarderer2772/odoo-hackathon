'use client'

import React, { useState } from 'react'
import { Invoice } from '@/lib/api'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import { InvoicePDFDownloadButton } from './InvoicePDFDownloadButton'
import { usePayments } from '@/hooks/usePayments'
import { useInvoices } from '@/hooks/useInvoices'

interface InvoiceTableProps {
  invoices: Invoice[]
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PAID'>('ALL')
  const [search, setSearch] = useState('')
  const { recordPayment } = usePayments()
  const { refresh } = useInvoices()

  // Payment modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState<'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH'>('CREDIT_CARD')
  const [submittingPayment, setSubmittingPayment] = useState(false)
  const [payFeedback, setPayFeedback] = useState('')

  const filtered = invoices.filter((inv) => {
    const matchesFilter = filter === 'ALL' || inv.status === filter
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerCompany || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const openPaymentModal = (inv: Invoice) => {
    setSelectedInvoice(inv)
    setPayAmount(inv.balanceDue)
    setPayFeedback('')
  }

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return
    const amountNum = parseFloat(payAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setPayFeedback('Please enter a valid positive amount.')
      return
    }
    if (amountNum > parseFloat(selectedInvoice.balanceDue)) {
      setPayFeedback(`Amount cannot exceed balance due ($${selectedInvoice.balanceDue}). Overpayment not allowed.`)
      return
    }

    setSubmittingPayment(true)
    try {
      await recordPayment({
        invoiceId: selectedInvoice.id,
        amount: amountNum,
        method: payMethod,
        notes: `Settled via Invoice Desk for ${selectedInvoice.invoiceNumber}`,
      })
      await refresh()
      setSelectedInvoice(null)
    } catch (err: any) {
      setPayFeedback(err.message || 'Payment allocation failed')
    } finally {
      setSubmittingPayment(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {(['ALL', 'CONFIRMED', 'PARTIALLY_PAID', 'PAID'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab === 'PARTIALLY_PAID' ? 'Partial' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice or customer..."
            className="w-full px-3.5 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs"
          />
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Invoice Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Paid</th>
              <th className="py-3 px-4">Balance Due</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs text-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No invoices found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-4 font-mono font-medium text-cyan-300">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{inv.customerCompany || inv.customerName || 'Direct'}</div>
                    <div className="text-[11px] text-slate-400">{inv.customerName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {new Date(inv.invoiceDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    ${inv.amountTotal}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">
                    ${inv.amountPaid}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={parseFloat(inv.balanceDue) > 0 ? 'text-amber-300' : 'text-slate-400'}>
                      ${inv.balanceDue}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <InvoicePDFDownloadButton invoice={inv} />
                      {parseFloat(inv.balanceDue) > 0 && (
                        <button
                          onClick={() => openPaymentModal(inv)}
                          className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg font-medium text-[11px] transition-all cursor-pointer shadow-sm"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Settle Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-400/30 p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  Settle Invoice {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Balance Due: <span className="text-amber-300 font-mono font-bold">${selectedInvoice.balanceDue}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-white text-lg font-mono px-2"
              >
                ✕
              </button>
            </div>

            {payFeedback && (
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
                {payFeedback}
              </div>
            )}

            <form onSubmit={handleSettle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="CREDIT_CARD">Credit Card (Stripe Gateway)</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer / Wire</option>
                  <option value="CASH">Cash / Counter Settlement</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submittingPayment ? 'Processing...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
