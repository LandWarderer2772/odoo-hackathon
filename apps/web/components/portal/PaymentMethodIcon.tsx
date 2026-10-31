'use client'

import React from 'react'

interface PaymentMethodIconProps {
  method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH' | 'CHECK' | string
}

export function PaymentMethodIcon({ method }: PaymentMethodIconProps) {
  const normalized = method?.toUpperCase()

  switch (normalized) {
    case 'CREDIT_CARD':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-400/30 text-blue-300 text-[11px] font-mono">
          <span>💳</span>
          <span>Card</span>
        </span>
      )
    case 'BANK_TRANSFER':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono">
          <span>🏦</span>
          <span>Wire / ACH</span>
        </span>
      )
    case 'CASH':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-400/30 text-amber-300 text-[11px] font-mono">
          <span>💵</span>
          <span>Cash</span>
        </span>
      )
    case 'CHECK':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-950/70 border border-purple-400/30 text-purple-300 text-[11px] font-mono">
          <span>📝</span>
          <span>Check</span>
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
          <span>💰</span>
          <span>{normalized}</span>
        </span>
      )
  }
}
