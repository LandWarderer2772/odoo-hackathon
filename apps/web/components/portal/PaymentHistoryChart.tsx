'use client'

import React from 'react'

export function PaymentHistoryChart() {
  const months = [
    { name: 'May', amount: 120, height: '40%' },
    { name: 'Jun', amount: 190, height: '60%' },
    { name: 'Jul', amount: 190, height: '60%' },
    { name: 'Aug', amount: 380, height: '80%' },
    { name: 'Sep', amount: 380, height: '80%' },
    { name: 'Oct', amount: 570, height: '100%' },
  ]

  return (
    <div className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Settlement & Inflow History</h3>
          <p className="text-xs text-slate-400">Monthly subscription collections (last 6 months)</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-blue-600 to-cyan-400" />
            Settled Cash Inflow
          </span>
        </div>
      </div>

      <div className="h-44 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-white/10">
        {months.map((m) => (
          <div key={m.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
              ${m.amount}
            </span>
            <div
              style={{ height: m.height }}
              className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-blue-600/80 via-cyan-500/80 to-teal-400/90 group-hover:brightness-125 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            />
            <span className="text-xs font-mono text-slate-400">{m.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>Lifetime Customer Value Trend: <strong className="text-emerald-400">+18.4% MoM</strong></span>
        <span className="font-mono text-[11px] text-slate-500">Autonomous Ledger Engine Active</span>
      </div>
    </div>
  )
}
