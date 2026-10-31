'use client'

import React, { useState } from 'react'

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const [show, setShow] = useState(false)

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-300">{label}</label>}
      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border ${
            error ? 'border-rose-500' : 'border-white/15 focus:border-cyan-400'
          } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-mono"
        >
          {show ? 'HIDE' : 'SHOW'}
        </button>
      </div>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </div>
  )
}
