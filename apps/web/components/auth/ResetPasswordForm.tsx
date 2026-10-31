'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PasswordInput } from './PasswordInput'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

interface ResetPasswordFormProps {
  onSubmit: (data: { password: string }) => Promise<any>
}

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setMessage('')
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await onSubmit({ password })
      setMessage(res?.message || 'Password updated! You can now log in.')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
          Set New Password
        </h2>
        <p className="text-xs text-slate-400">
          Enter a secure replacement password for your account
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span>{message}</span>
          <Link href="/login" className="font-bold underline text-emerald-200">
            Login Now
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PasswordInput
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="At least 8 characters"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <div>
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-white font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        Back to{' '}
        <Link
          href="/login"
          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          Sign In →
        </Link>
      </div>
    </div>
  )
}
