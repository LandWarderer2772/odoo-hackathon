'use client'

import React from 'react'
import Link from 'next/link'
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge'

export interface SubscriptionSummaryCardProps {
  subscriptions?: any[]
}

export const SubscriptionSummaryCard: React.FC<SubscriptionSummaryCardProps> = ({
  subscriptions = [],
}) => {
  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE')
  const totalMonthlyCommitment = activeSubs.reduce(
    (acc, curr) => acc + Number(curr.totalAmount || 0),
    0
  )

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between gap-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Active Contracts
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Subscription Overview</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300">
          {activeSubs.length} Active Plan{activeSubs.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
        <div>
          <div className="text-xs text-slate-400 font-mono">Monthly Run-rate</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
            ${totalMonthlyCommitment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-mono">Total Subscriptions</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-0.5">
            {subscriptions.length}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Latest Active Contract
        </span>
        {activeSubs[0] ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-white/10">
            <div>
              <div className="font-semibold text-sm text-slate-200">
                {activeSubs[0].subscriptionNumber}
              </div>
              <div className="text-xs text-slate-400">{activeSubs[0].plan?.name || 'Custom Plan'}</div>
            </div>
            <SubscriptionStatusBadge status={activeSubs[0].status} />
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">No active contracts found.</div>
        )}
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <Link
          href="/subscriptions"
          className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View all subscriptions →
        </Link>
      </div>
    </div>
  )
}
