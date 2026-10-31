'use client'

import React, { useEffect, useState } from 'react'
import { api, Plan } from '@/lib/api'

export default function DashboardPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [billingCycle, setBillingCycle] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY')
  const [intervalCount, setIntervalCount] = useState(1)
  const [price, setPrice] = useState('')
  const [minQuantity, setMinQuantity] = useState(1)
  const [allowPausing, setAllowPausing] = useState(true)
  const [allowEarlyClosure, setAllowEarlyClosure] = useState(true)
  const [allowRenewal, setAllowRenewal] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    setLoading(true)
    try {
      const data = await api.getPlans('brightloop')
      setPlans(data)
    } catch (err) {
      console.error('Failed to load plans:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newPlan = await api.createPlan({
        name,
        code,
        description,
        billingCycle,
        intervalCount,
        price,
        minQuantity,
        allowPausing,
        allowEarlyClosure,
        allowRenewal,
      })
      setPlans([newPlan, ...plans])
      setShowModal(false)
      setName('')
      setCode('')
      setDescription('')
      setPrice('')
    } catch (err: any) {
      alert(err.message || 'Failed to create plan')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Recurring Tier Engine
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Subscription Plans</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure recurring billing cadences, interval counts, and lifecycle policies.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:brightness-110 transition"
        >
          <span>+</span>
          <span>Create Subscription Plan</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-white/5 border border-white/10" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 text-slate-500 border border-dashed border-white/10 rounded-2xl">
            No plans found. Click &quot;Create Subscription Plan&quot; to configure your first plan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-white/10 bg-[#0c1220] p-6 space-y-4 hover:border-cyan-400/30 transition shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300">
                      {plan.billingCycle} {plan.intervalCount > 1 ? `(${plan.intervalCount}x)` : ''}
                    </span>
                    <span className="text-2xl font-bold text-white">${plan.price}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-3">{plan.name}</h3>
                  {plan.code && <p className="text-xs font-mono text-slate-500">Code: {plan.code}</p>}
                  {plan.description && <p className="text-xs text-slate-400 mt-2">{plan.description}</p>}

                  {/* Rules Pill Grid */}
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${plan.allowRenewal ? 'bg-emerald-400/10 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                      {plan.allowRenewal ? '✓ Auto-Renew' : '✕ No Renew'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${plan.allowPausing ? 'bg-cyan-400/10 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                      {plan.allowPausing ? '✓ Pausable' : '✕ No Pause'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${plan.allowEarlyClosure ? 'bg-blue-400/10 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>
                      {plan.allowEarlyClosure ? '✓ Early Close' : '✕ Lock-in'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <span>Min Quantity: {plan.minQuantity || 1}</span>
                  <span className="text-emerald-400 font-medium">● Available to customers</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1220] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white">Create Subscription Plan</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quarterly Scale Tier"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Interval</label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="YEARLY">YEARLY</option>
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="DAILY">DAILY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="190.00"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interval Multiplier</label>
                  <input
                    type="number"
                    min={1}
                    value={intervalCount}
                    onChange={(e) => setIntervalCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SCALE-QTR"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Switches */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lifecycle Policies</span>
                <div className="flex items-center gap-6 text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowRenewal}
                      onChange={(e) => setAllowRenewal(e.target.checked)}
                      className="rounded accent-cyan-400"
                    />
                    <span>Allow Auto-Renewal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPausing}
                      onChange={(e) => setAllowPausing(e.target.checked)}
                      className="rounded accent-cyan-400"
                    />
                    <span>Allow Pausing</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
                >
                  {submitting ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
