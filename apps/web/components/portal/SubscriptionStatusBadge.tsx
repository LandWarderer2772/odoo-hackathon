'use client'

import React from 'react'

interface SubscriptionStatusBadgeProps {
  status: 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | string
}

export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const normalized = status?.toUpperCase()

  let colorStyle = 'bg-slate-800 text-slate-300 border-slate-700'
  let dotColor = 'bg-slate-400'

  switch (normalized) {
    case 'ACTIVE':
      colorStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
      dotColor = 'bg-emerald-400 animate-pulse'
      break
    case 'CONFIRMED':
      colorStyle = 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
      dotColor = 'bg-cyan-400'
      break
    case 'QUOTATION':
    case 'DRAFT':
      colorStyle = 'bg-amber-950/80 text-amber-300 border-amber-500/40'
      dotColor = 'bg-amber-400'
      break
    case 'PAUSED':
      colorStyle = 'bg-purple-950/80 text-purple-300 border-purple-500/40'
      dotColor = 'bg-purple-400'
      break
    case 'CLOSED':
      colorStyle = 'bg-rose-950/80 text-rose-300 border-rose-500/40'
      dotColor = 'bg-rose-400'
      break
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${colorStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{normalized}</span>
    </span>
  )
}
