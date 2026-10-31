'use client'

import React from 'react'

export interface PasswordStrengthMeterProps {
  password?: string
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const hasMinLength = password.length > 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const score = [hasMinLength, hasUpper, hasLower, hasSpecial].filter(Boolean).length

  const getScoreColor = () => {
    if (score <= 1) return 'bg-rose-500'
    if (score === 2) return 'bg-amber-500'
    if (score === 3) return 'bg-sky-400'
    return 'bg-emerald-400'
  }

  const getLabel = () => {
    if (!password) return 'Password strength'
    if (score <= 1) return 'Weak (Must meet complexity requirements)'
    if (score === 2) return 'Moderate'
    if (score === 3) return 'Strong'
    return 'Enterprise Compliant (SOC2 Ready)'
  }

  return (
    <div className="w-full flex flex-col gap-1.5 mt-1">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>{getLabel()}</span>
        <span className="font-bold">{password ? `${score}/4` : ''}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
        <div className={`h-full flex-1 transition-all ${score >= 1 ? getScoreColor() : 'bg-transparent'}`} />
        <div className={`h-full flex-1 transition-all ${score >= 2 ? getScoreColor() : 'bg-transparent'}`} />
        <div className={`h-full flex-1 transition-all ${score >= 3 ? getScoreColor() : 'bg-transparent'}`} />
        <div className={`h-full flex-1 transition-all ${score >= 4 ? getScoreColor() : 'bg-transparent'}`} />
      </div>
      <ul className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400 mt-1">
        <li className={hasMinLength ? 'text-emerald-400' : 'text-slate-500'}>
          {hasMinLength ? '✓' : '○'} &gt; 8 characters
        </li>
        <li className={hasUpper ? 'text-emerald-400' : 'text-slate-500'}>
          {hasUpper ? '✓' : '○'} 1 Uppercase (A-Z)
        </li>
        <li className={hasLower ? 'text-emerald-400' : 'text-slate-500'}>
          {hasLower ? '✓' : '○'} 1 Lowercase (a-z)
        </li>
        <li className={hasSpecial ? 'text-emerald-400' : 'text-slate-500'}>
          {hasSpecial ? '✓' : '○'} 1 Special (!@#$...)
        </li>
      </ul>
    </div>
  )
}
