'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface ForgotPasswordFormProps {
  onSubmit: (data: { email: string }) => Promise<any>
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setMessage('')
    setLoading(true)
    try {
      const res = await onSubmit({ email })
      setMessage(res?.message || 'Password reset link sent to your email.')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
          Reset Password
        </h2>
        <p className="text-xs text-slate-400">
          We will send a secure one-time reset link to your verified email
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <span className="font-bold">✓</span>
          <span>{message}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300 mb-1.5">
            Registered Email Address
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-white font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Sending Recovery Link...' : 'Send Recovery Link'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        Remembered your password?{' '}
        <Link
          href="/login"
          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          Return to Sign In →
        </Link>
      </div>
    </div>
  )
}
