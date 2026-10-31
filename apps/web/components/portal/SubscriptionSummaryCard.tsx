'use client'

import React from 'react'
import { Subscription } from '@/lib/api'

interface SubscriptionSummaryCardProps {
  subscriptions: Subscription[]
}

export function SubscriptionSummaryCard({ subscriptions }: SubscriptionSummaryCardProps) {
  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE')
  const totalMonthlyRunRate = activeSubs.reduce((acc, curr) => acc + parseFloat(curr.totalAmount || '0'), 0)
  const nextRenewal = activeSubs.length > 0 ? activeSubs[0].nextBillingDate : null

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Subscription Overview
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-[11px] font-mono text-cyan-300">
            {activeSubs.length} Active / {subscriptions.length} Total
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold tracking-tight text-white font-sans">
            ${totalMonthlyRunRate.toFixed(2)}
            <span className="text-sm font-normal text-slate-400"> /mo</span>
          </div>
          <p className="text-xs text-slate-400">
            Active recurring run-rate committed across subscriptions
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[10px]">NEXT RENEWAL CYCLE</span>
          <span className="font-semibold text-cyan-300">
            {nextRenewal ? new Date(nextRenewal).toLocaleDateString() : 'No active cycle'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">AUTOPAY CADENCE</span>
          <span className="font-semibold text-emerald-400">Real-Time Continuous</span>
        </div>
      </div>
    </div>
  )
}
