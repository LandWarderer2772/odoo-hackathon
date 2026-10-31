'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api'

export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER'
  businessId?: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('brightloop_user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (data: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        data,
      })
      if (res.token) {
        localStorage.setItem('brightloop_token', res.token)
      }
      if (res.user) {
        localStorage.setItem('brightloop_user', JSON.stringify(res.user))
        setUser(res.user)
      }
      window.location.href = res.user?.role === 'CUSTOMER' ? '/subscriptions' : '/'
      return res
    } catch (err: any) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: { name: string; email: string; password: string; companyName?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        data,
      })
      if (res.token) {
        localStorage.setItem('brightloop_token', res.token)
      }
      if (res.user) {
        localStorage.setItem('brightloop_user', JSON.stringify(res.user))
        setUser(res.user)
      }
      window.location.href = '/subscriptions'
      return res
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const forgotPassword = useCallback(async (data: { email: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        data,
      })
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (data: { token: string; newPassword: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/auth/reset-password', {
        method: 'POST',
        data,
      })
      window.location.href = '/login'
      return res
    } catch (err: any) {
      setError(err.message || 'Password reset failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('brightloop_token')
    localStorage.removeItem('brightloop_user')
    setUser(null)
    window.location.href = '/login'
  }, [])

  return {
    user,
    loading,
    error,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  }
}
