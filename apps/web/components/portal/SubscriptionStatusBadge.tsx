'use client'

import React from 'react'

export interface SubscriptionStatusBadgeProps {
  status: string
}

export const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({ status }) => {
  const normalized = (status || 'DRAFT').toUpperCase()

  const config: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    ACTIVE: {
      label: 'Active',
      bg: 'bg-emerald-950/70',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    CONFIRMED: {
      label: 'Confirmed',
      bg: 'bg-cyan-950/70',
      text: 'text-cyan-300',
      border: 'border-cyan-500/30',
      dot: 'bg-cyan-400',
    },
    QUOTATION: {
      label: 'Quotation',
      bg: 'bg-blue-950/70',
      text: 'text-blue-300',
      border: 'border-blue-500/30',
      dot: 'bg-blue-400',
    },
    PAUSED: {
      label: 'Paused',
      bg: 'bg-amber-950/70',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
    },
    CLOSED: {
      label: 'Closed',
      bg: 'bg-slate-900',
      text: 'text-slate-400',
      border: 'border-slate-700',
      dot: 'bg-slate-500',
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
