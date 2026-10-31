'use client'

import React from 'react'

export interface PaymentMethodIconProps {
  method: string
  className?: string
}

export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ method, className = '' }) => {
  const normalized = (method || '').toUpperCase()

  const labels: Record<string, { icon: string; text: string }> = {
    BANK_TRANSFER: { icon: '🏦', text: 'Bank Transfer' },
    CREDIT_CARD: { icon: '💳', text: 'Credit Card' },
    CASH: { icon: '💵', text: 'Cash' },
    CHECK: { icon: '📝', text: 'Check' },
  }

  const current = labels[normalized] || { icon: '💰', text: method || 'Payment' }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 ${className}`}>
      <span>{current.icon}</span>
      <span>{current.text}</span>
    </span>
  )
}
