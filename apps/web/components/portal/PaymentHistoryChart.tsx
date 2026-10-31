'use client'

import React from 'react'

export const PaymentHistoryChart: React.FC = () => {
  const monthlyData = [
    { month: 'Jun', amount: 1250, pct: 60 },
    { month: 'Jul', amount: 1480, pct: 72 },
    { month: 'Aug', amount: 1760, pct: 85 },
    { month: 'Sep', amount: 1905, pct: 92 },
    { month: 'Oct', amount: 2060, pct: 100 },
  ]

  return (
    <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Settlement Telemetry
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Payment History Trend</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Settled Cash</span>
        </div>
      </div>

      <div className="h-44 flex items-end justify-between gap-4 pt-6 pb-2 px-4 bg-slate-950/50 rounded-2xl border border-white/5">
        {monthlyData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <span className="text-[11px] font-mono font-bold text-cyan-300 opacity-80 group-hover:opacity-100 transition-opacity">
              ${d.amount}
            </span>
            <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
              <div
                className="w-full bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                style={{ height: `${d.pct}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 mt-1">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
