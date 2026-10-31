'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface StaffMember {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'BUSINESS_ADMIN' | 'STAFF'
  isActive: boolean
}

export default function DashboardStaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: 'stf-1',
      email: 'admin@brightloop.com',
      firstName: 'Sarah',
      lastName: 'Connor',
      role: 'BUSINESS_ADMIN',
      isActive: true,
    },
    {
      id: 'stf-2',
      email: 'staff@brightloop.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STAFF',
      isActive: true,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('Brightloop@12345!')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<'STAFF' | 'BUSINESS_ADMIN'>('STAFF')
  const [submitting, setSubmitting] = useState(false)

  async function handleAddStaff(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // In real scenario, calls api.createStaff if available
      const newStaff: StaffMember = {
        id: `stf-${Date.now()}`,
        email,
        firstName,
        lastName,
        role,
        isActive: true,
      }
      setStaffList([newStaff, ...staffList])
      setShowModal(false)
      setEmail('')
      setFirstName('')
      setLastName('')
      alert(`Staff member ${firstName} ${lastName} created successfully!`)
    } catch (err: any) {
      alert(err.message || 'Failed to add staff')
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
            Team & Permissions
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Staff Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your internal business administrators and staff operators with role-based access control.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:brightness-110 transition"
        >
          <span>+</span>
          <span>Invite Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#0c1220] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {staffList.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-slate-950">
                        {member.firstName.charAt(0)}
                        {member.lastName.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">{member.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                        member.role === 'BUSINESS_ADMIN'
                          ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20'
                          : 'bg-blue-400/10 text-blue-300 border border-blue-400/20'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-emerald-400 font-medium">● Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs text-slate-400 hover:text-white transition">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1220] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white">Add Business Staff Member</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vance"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Staff Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@brightloop.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Temporary Password</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="STAFF">STAFF (Operations & Catalog access)</option>
                  <option value="BUSINESS_ADMIN">BUSINESS_ADMIN (Full Tenant Admin)</option>
                </select>
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
                  {submitting ? 'Creating...' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
