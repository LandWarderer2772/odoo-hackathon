'use client'

import React, { useEffect, useState } from 'react'
import { api, Subscription } from '@/lib/api'

export default function DashboardSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [processingBilling, setProcessingBilling] = useState(false)
  const [billingResult, setBillingResult] = useState<string | null>(null)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  async function loadSubscriptions() {
    setLoading(true)
    try {
      const data = await api.getSubscriptions()
      setSubscriptions(data)
    } catch (err) {
      console.error('Failed to load subscriptions:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStateTransition(subId: string, action: 'CONFIRM' | 'PAUSE' | 'RESUME' | 'CLOSE') {
    try {
      const updated = await api.updateSubscriptionStatus(subId, action)
      setSubscriptions(subscriptions.map((s) => (s.id === subId ? updated : s)))
    } catch (err: any) {
      alert(err.message || 'Action failed')
    }
  }

  async function handleTriggerBillingRun() {
    setProcessingBilling(true)
    setBillingResult(null)
    try {
      const result = await api.triggerRecurringBilling()
      setBillingResult(
        `✓ Billing cycle processed: ${result.invoicesGenerated || 0} invoices generated successfully.`
      )
      loadSubscriptions()
    } catch (err: any) {
      setBillingResult(`✕ Error running billing: ${err.message}`)
    } finally {
      setProcessingBilling(false)
    }
  }

  const filtered = subscriptions.filter((s) => filter === 'ALL' || s.status === filter)

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Lifecycle FSM Engine
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Subscriptions Pipeline</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage contract states from Quotation to Active, process pause/resume, and advance billing cycles.
          </p>
        </div>

        <button
          onClick={handleTriggerBillingRun}
          disabled={processingBilling}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:brightness-110 transition disabled:opacity-50"
        >
          <span>⚡</span>
          <span>{processingBilling ? 'Running Engine...' : 'Run Recurring Billing Now'}</span>
        </button>
      </div>

      {billingResult && (
        <div className="mt-4 p-4 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-xs font-mono text-cyan-200">
          {billingResult}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {['ALL', 'ACTIVE', 'QUOTATION', 'PAUSED', 'CLOSED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
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

      {/* Subscriptions Table */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c1220] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Subscription #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Plan</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Next Billing</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">FSM Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 animate-pulse">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No subscriptions matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-300">
                      {sub.subscriptionNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{sub.customerName || 'Acme Client'}</div>
                      <div className="text-xs text-slate-400">{sub.customerCompany || 'Enterprise'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {sub.plan?.name || 'Pro Tier'}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      ${sub.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'ACTIVE'
                            ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                            : sub.status === 'PAUSED'
                            ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                            : sub.status === 'QUOTATION'
                            ? 'bg-blue-400/10 text-blue-300 border border-blue-400/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === 'QUOTATION' && (
                          <button
                            onClick={() => handleStateTransition(sub.id, 'CONFIRM')}
                            className="px-2.5 py-1 rounded bg-blue-500 text-slate-950 font-bold text-xs hover:bg-blue-400 transition"
                          >
                            Confirm
                          </button>
                        )}
                        {sub.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => handleStateTransition(sub.id, 'PAUSE')}
                              className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 font-bold text-xs hover:bg-amber-400/30 transition"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => handleStateTransition(sub.id, 'CLOSE')}
                              className="px-2.5 py-1 rounded bg-rose-400/20 text-rose-300 font-bold text-xs hover:bg-rose-400/30 transition"
                            >
                              Close
                            </button>
                          </>
                        )}
                        {sub.status === 'PAUSED' && (
                          <button
                            onClick={() => handleStateTransition(sub.id, 'RESUME')}
                            className="px-2.5 py-1 rounded bg-emerald-400/20 text-emerald-300 font-bold text-xs hover:bg-emerald-400/30 transition"
                          >
                            Resume
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
      </div>
    </div>
  )
}
