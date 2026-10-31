'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PasswordInput } from './PasswordInput'

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; tenantSlug?: string }) => Promise<any>
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('admin@brightloop.com')
  const [password, setPassword] = useState('SecurePassword123!')
  const [tenantSlug, setTenantSlug] = useState('brightloop')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      await onSubmit({ email, password, tenantSlug })
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials or tenant mismatch')
    } finally {
      setLoading(false)
    }
  }

  const setDemoPersona = (role: 'admin' | 'staff' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@brightloop.com')
      setPassword('SecurePassword123!')
      setTenantSlug('brightloop')
    } else if (role === 'staff') {
      setEmail('staff@brightloop.com')
      setPassword('SecurePassword123!')
      setTenantSlug('brightloop')
    } else {
      setEmail('david@acme-corp.com')
      setPassword('SecurePassword123!')
      setTenantSlug('brightloop')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
          Sign In
        </h2>
        <p className="text-xs text-slate-400">
          Enter your credentials to access your tenant cockpit
        </p>
      </div>

      {/* Demo Persona Quick Fill Pills */}
      <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Quick Demo Accounts:
          </span>
          <span className="text-slate-500 text-[10px]">1-click fill</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setDemoPersona('admin')}
            className={`py-1.5 px-2 rounded-lg font-medium border transition-all text-center ${
              email.includes('admin')
                ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            👑 Admin
          </button>
          <button
            type="button"
            onClick={() => setDemoPersona('staff')}
            className={`py-1.5 px-2 rounded-lg font-medium border transition-all text-center ${
              email.includes('staff')
                ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            🛡️ Staff
          </button>
          <button
            type="button"
            onClick={() => setDemoPersona('customer')}
            className={`py-1.5 px-2 rounded-lg font-medium border transition-all text-center ${
              email.includes('david')
                ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            👤 Customer
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <span className="text-rose-400 font-bold">Error:</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm transition-all"
            placeholder="admin@brightloop.com"
          />
        </div>

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300 mb-1.5">
            Tenant Domain / Slug
          </label>
          <select
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm transition-all"
          >
            <option value="brightloop">brightloop (Brightloop Software)</option>
            <option value="technova">technova (TechNova Cloud Solutions)</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
            />
            <span>Remember session</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-white font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(6,182,212,0.6)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {loading ? 'Authenticating...' : 'Sign In to Cockpit'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        New SaaS Business?{' '}
        <Link
          href="/register"
          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          Deploy your tenant now →
        </Link>
      </div>
    </div>
  )
}
