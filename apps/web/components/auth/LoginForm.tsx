'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PasswordInput } from './PasswordInput'

export interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<any> | void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit({ email, password })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to BrightLoop</h2>
        <p className="text-sm text-slate-400 mt-1">Access autonomous billing telemetry &amp; self-serve portal.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Work Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@brightloop.com"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>

        <PasswordInput
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
        />

        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0" />
            <span>Remember session</span>
          </label>
          <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 transition-all text-sm mt-2"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {/* Demo Credentials for Hackathon Evaluator */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          Quick Demo Credentials (Click to fill)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => fillDemo('admin@brightloop.com', 'Admin@Secure2026!')}
            className="p-2 rounded-lg bg-slate-950/70 border border-white/10 hover:border-cyan-400/40 text-left text-slate-300 hover:text-white transition-all"
          >
            <div className="text-cyan-300 font-bold">System Admin</div>
            <div className="text-[10px] text-slate-500 truncate">admin@brightloop.com</div>
          </button>
          <button
            type="button"
            onClick={() => fillDemo('david@acme-corp.com', 'Customer@Secure2026!')}
            className="p-2 rounded-lg bg-slate-950/70 border border-white/10 hover:border-cyan-400/40 text-left text-slate-300 hover:text-white transition-all"
          >
            <div className="text-sky-300 font-bold">Acme Customer</div>
            <div className="text-[10px] text-slate-500 truncate">david@acme-corp.com</div>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
          Create customer account
        </Link>
      </div>
    </div>
  )
}
