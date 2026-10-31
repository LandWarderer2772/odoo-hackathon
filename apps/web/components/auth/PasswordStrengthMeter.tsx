'use client'

import React from 'react'

interface PasswordStrengthMeterProps {
  password?: string
}

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const calculateStrength = (pass: string) => {
    let score = 0
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' }
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' }
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' }
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' }
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' }
  }

  const { score, label, color } = calculateStrength(password)

  return (
    <div className="w-full space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Security Strength</span>
        <span
          className={`font-semibold ${
            score === 4
              ? 'text-emerald-400'
              : score === 3
              ? 'text-blue-400'
              : score === 2
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}
        >
          {password ? label : 'None'}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step ? color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
