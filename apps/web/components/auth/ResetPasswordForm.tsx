'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PasswordInput } from './PasswordInput'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

export interface ResetPasswordFormProps {
  onSubmit: (data: { token: string; newPassword: string }) => Promise<any> | void
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length <= 8) {
      setError('Password must be strictly greater than 8 characters')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ token, newPassword })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Set New Password</h2>
        <p className="text-sm text-slate-400 mt-1">Provide your reset verification token and choose a strong password.</p>
      </div>

      {success ? (
        <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-center flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center mx-auto text-lg">
            ✓
          </div>
          <h4 className="text-sm font-bold text-white">Password Updated</h4>
          <p className="text-xs text-slate-300">Your credentials have been securely updated.</p>
          <Link
            href="/login"
            className="mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
          >
            Sign in with new password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Reset Token</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste reset token here"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 focus:border-cyan-400 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <PasswordInput
            label="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 9 chars, upper, lower, special"
          />

          <PasswordStrengthMeter password={newPassword} />

          <PasswordInput
            label="Confirm New Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 transition-all text-sm mt-3"
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="text-center text-xs text-slate-400">
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
