'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PasswordInput } from './PasswordInput'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

interface RegistrationFormProps {
  onSubmit: (data: any) => Promise<any>
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [companyName, setCompanyName] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleCompanyNameChange = (val: string) => {
    setCompanyName(val)
    if (!tenantSlug || tenantSlug === companyName.toLowerCase().replace(/[^a-z0-9]/g, '')) {
      setTenantSlug(val.toLowerCase().replace(/[^a-z0-9]/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.')
      return
    }
    setLoading(true)
    try {
      await onSubmit({
        companyName,
        tenantSlug: tenantSlug || 'mycloud',
        firstName,
        lastName,
        email,
        password,
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'Tenant registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
          Deploy Your Tenant
        </h2>
        <p className="text-xs text-slate-400">
          Create a new isolated multi-tenant subscription cockpit
        </p>
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
            Company Name
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => handleCompanyNameChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm transition-all"
            placeholder="e.g. Nexus Software Solutions"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300 mb-1.5">
            Tenant Subdomain Slug
          </label>
          <div className="flex items-center">
            <span className="px-3 py-2.5 bg-slate-900 border border-r-0 border-slate-800 rounded-l-xl text-xs font-mono text-slate-400">
              brightloop.io/
            </span>
            <input
              type="text"
              required
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-r-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-mono transition-all"
              placeholder="nexus"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm transition-all"
              placeholder="Alex"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm transition-all"
              placeholder="Vance"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300 mb-1.5">
            Admin Work Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm transition-all"
            placeholder="admin@nexus.io"
          />
        </div>

        <div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Minimum 8 characters"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-white font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(6,182,212,0.6)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
        >
          {loading ? 'Creating Tenant...' : 'Provision Enterprise Tenant'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        Already have a business account?{' '}
        <Link
          href="/login"
          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          Sign In here →
        </Link>
      </div>
    </div>
  )
}
