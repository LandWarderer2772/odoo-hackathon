'use client'

import React, { useState } from 'react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function PasswordInput({
  label = 'Password',
  error,
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full px-4 py-3 bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all pr-12 text-sm ${
            error ? 'border-rose-500/80 ring-rose-500/20 ring-2' : 'border-slate-800 focus:border-cyan-400'
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 focus:outline-none transition-colors text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800/40"
          tabIndex={-1}
        >
          {showPassword ? 'HIDE' : 'SHOW'}
        </button>
      </div>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  )
}
