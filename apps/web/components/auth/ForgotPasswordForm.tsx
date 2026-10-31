'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export interface ForgotPasswordFormProps {
  onSubmit: (data: { email: string }) => Promise<any> | void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit({ email })
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="text-sm text-slate-400 mt-1">Enter your account email to receive a secure 1-hour reset token.</p>
      </div>

      {sent ? (
        <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-center flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center mx-auto text-lg">
            ✓
          </div>
          <h4 className="text-sm font-bold text-white">Reset Token Dispatched</h4>
          <p className="text-xs text-slate-300">
            If an account matches <span className="text-cyan-300 font-mono">{email}</span>, a reset token has been sent.
          </p>
          <Link
            href="/reset-password"
            className="mt-2 py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all border border-cyan-400/30"
          >
            Enter Reset Token →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Account Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 transition-all text-sm mt-2"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="text-center text-xs text-slate-400">
        Remembered your password?{' '}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
          Return to sign in
        </Link>
      </div>
    </div>
  )
}
