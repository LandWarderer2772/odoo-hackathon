'use client'

import React from 'react'
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge'

export interface SubscriptionTableProps {
  subscriptions?: any[]
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ subscriptions = [] }) => {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-slate-400">
        No active subscriptions found.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400 bg-slate-950/40">
            <th className="py-4 px-6">Subscription #</th>
            <th className="py-4 px-6">Plan</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Next Billing</th>
            <th className="py-4 px-6 text-right">Amount</th>
            <th className="py-4 px-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-normal text-slate-300">
          {subscriptions.map((sub: any) => {
            const amount = Number(sub.totalAmount || 0).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
            const nextDate = sub.nextBillingDate
              ? new Date(sub.nextBillingDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'

            return (
              <tr key={sub.id || sub.subscriptionNumber} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-white">
                  {sub.subscriptionNumber || sub.id}
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-200">
                    {sub.plan?.name || 'Standard Recurring Plan'}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {sub.plan?.billingInterval || 'MONTHLY'} (x{sub.plan?.intervalCount || 1})
                  </div>
                </td>
                <td className="py-4 px-6">
                  <SubscriptionStatusBadge status={sub.status} />
                </td>
                <td className="py-4 px-6 font-mono text-slate-400">{nextDate}</td>
                <td className="py-4 px-6 text-right font-mono font-bold text-white">{amount}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-white/10 transition-all"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
