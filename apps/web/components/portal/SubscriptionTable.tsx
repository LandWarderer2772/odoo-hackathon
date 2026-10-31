'use client'

import React, { useState } from 'react'
import { Subscription } from '@/lib/api'
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge'
import { useSubscriptions } from '@/hooks/useSubscriptions'

interface SubscriptionTableProps {
  subscriptions: Subscription[]
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'QUOTATION' | 'PAUSED' | 'CLOSED'>('ALL')
  const [search, setSearch] = useState('')
  const { transitionSubscription, convertQuotation } = useSubscriptions()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = subscriptions.filter((sub) => {
    const matchesFilter = filter === 'ALL' || sub.status === filter
    const matchesSearch =
      sub.subscriptionNumber.toLowerCase().includes(search.toLowerCase()) ||
      (sub.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      sub.plan.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleAction = async (id: string, action: 'CONFIRM' | 'PAUSE' | 'RESUME' | 'CLOSE') => {
    setActionLoading(id)
    try {
      await transitionSubscription(id, action)
    } finally {
      setActionLoading(null)
    }
  }

  const handleConvert = async (id: string) => {
    setActionLoading(id)
    try {
      await convertQuotation(id)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {(['ALL', 'ACTIVE', 'QUOTATION', 'PAUSED', 'CLOSED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full px-3.5 py-1.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Subscription</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Plan & Cycle</th>
              <th className="py-3 px-4">Items / Surcharge</th>
              <th className="py-3 px-4">Next Billing</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs text-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No subscriptions match current criteria.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => {
                const isActing = actionLoading === sub.id
                return (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-cyan-300">
                      {sub.subscriptionNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{sub.customerName || 'Direct Subscriber'}</div>
                      {sub.customerCompany && (
                        <div className="text-[11px] text-slate-400">{sub.customerCompany}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{sub.plan.name}</div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase">
                        {sub.plan.billingCycle}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {sub.items && sub.items.length > 0 ? (
                        <div className="space-y-0.5">
                          {sub.items.map((item, i) => (
                            <div key={i} className="text-[11px] truncate text-slate-300">
                              • {item.product.name} {item.variantName ? `(${item.variantName})` : ''} ×{item.quantity}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No line items</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      ${sub.totalAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <SubscriptionStatusBadge status={sub.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {sub.status === 'QUOTATION' && (
                          <button
                            onClick={() => handleConvert(sub.id)}
                            disabled={isActing}
                            className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg font-medium text-[11px] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                            title="Convert quotation to active subscription"
                          >
                            Convert
                          </button>
                        )}
                        {sub.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => handleAction(sub.id, 'PAUSE')}
                              disabled={isActing}
                              className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-200 rounded-lg font-medium text-[11px] transition-all cursor-pointer disabled:opacity-50"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => handleAction(sub.id, 'CLOSE')}
                              disabled={isActing}
                              className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-200 rounded-lg font-medium text-[11px] transition-all cursor-pointer disabled:opacity-50"
                            >
                              Close
                            </button>
                          </>
                        )}
                        {sub.status === 'PAUSED' && (
                          <button
                            onClick={() => handleAction(sub.id, 'RESUME')}
                            disabled={isActing}
                            className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-200 rounded-lg font-medium text-[11px] transition-all cursor-pointer disabled:opacity-50"
                          >
                            Resume
                          </button>
                        )}
                        {sub.status === 'DRAFT' && (
                          <button
                            onClick={() => handleAction(sub.id, 'CONFIRM')}
                            disabled={isActing}
                            className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-200 rounded-lg font-medium text-[11px] transition-all cursor-pointer disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
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
  )
}
