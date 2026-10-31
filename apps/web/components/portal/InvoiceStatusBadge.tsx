'use client'

import React from 'react'

export interface InvoiceStatusBadgeProps {
  status: string
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status }) => {
  const normalized = (status || 'DRAFT').toUpperCase()

  const config: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    PAID: {
      label: 'Paid in Full',
      bg: 'bg-emerald-950/70',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    PARTIALLY_PAID: {
      label: 'Partially Paid',
      bg: 'bg-cyan-950/70',
      text: 'text-cyan-300',
      border: 'border-cyan-500/30',
      dot: 'bg-cyan-400',
    },
    CONFIRMED: {
      label: 'Confirmed / Due',
      bg: 'bg-sky-950/70',
      text: 'text-sky-300',
      border: 'border-sky-500/30',
      dot: 'bg-sky-400',
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-rose-950/70',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400',
    },
    DRAFT: {
      label: 'Draft',
      bg: 'bg-slate-900',
      text: 'text-slate-400',
      border: 'border-white/10',
      dot: 'bg-slate-500',
    },
  }

  const current = config[normalized] || config.DRAFT

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${current.bg} ${current.text} ${current.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  )
}
