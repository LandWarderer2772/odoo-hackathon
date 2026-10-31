'use client'

import React from 'react'

interface InvoiceStatusBadgeProps {
  status: 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED' | string
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const normalized = status?.toUpperCase()

  let colorStyle = 'bg-slate-800 text-slate-300 border-slate-700'
  let dotColor = 'bg-slate-400'

  switch (normalized) {
    case 'PAID':
      colorStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
      dotColor = 'bg-emerald-400'
      break
    case 'PARTIALLY_PAID':
      colorStyle = 'bg-amber-950/80 text-amber-300 border-amber-500/40'
      dotColor = 'bg-amber-400 animate-pulse'
      break
    case 'CONFIRMED':
      colorStyle = 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
      dotColor = 'bg-cyan-400'
      break
    case 'DRAFT':
      colorStyle = 'bg-slate-900 text-slate-400 border-slate-700'
      dotColor = 'bg-slate-400'
      break
    case 'CANCELLED':
      colorStyle = 'bg-rose-950/80 text-rose-300 border-rose-500/40'
      dotColor = 'bg-rose-400'
      break
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${colorStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{normalized.replace('_', ' ')}</span>
    </span>
  )
}
