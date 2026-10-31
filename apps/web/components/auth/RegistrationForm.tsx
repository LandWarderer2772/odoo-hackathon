'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PasswordInput } from './PasswordInput'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

export interface RegistrationFormProps {
  onSubmit: (data: { name: string; email: string; password: string; companyName?: string }) => Promise<any> | void
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length <= 8) {
      setError('Password must be strictly greater than 8 characters')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ name, email, password, companyName })
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Customer Account</h2>
        <p className="text-sm text-slate-400 mt-1">Get instant access to your enterprise subscription portal.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Work Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>

        <PasswordInput
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 9 chars, upper, lower, special"
        />

        <PasswordStrengthMeter password={password} />

        <PasswordInput
          label="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 transition-all text-sm mt-3"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  )
}
