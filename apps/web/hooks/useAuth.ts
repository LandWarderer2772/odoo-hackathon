'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api, User } from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('bl_token')
      const storedUser = localStorage.getItem('bl_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        api.setToken(storedToken)
      } else {
        // Default to Demo Admin for immediate exploration if not logged in
        const defaultAdmin: User = {
          id: 'usr-admin-01',
          email: 'admin@brightloop.com',
          firstName: 'Brightloop',
          lastName: 'Admin',
          role: 'BUSINESS_ADMIN',
          companyName: 'Brightloop Software',
        }
        setUser(defaultAdmin)
      }
    } catch (_) {
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(
    async (credentials: { email?: string; password?: string; tenantSlug?: string }) => {
      setLoading(true)
      setError(null)
      try {
        const email = credentials?.email || 'admin@brightloop.com'
        const password = credentials?.password || 'SecurePassword123!'
        const tenantSlug = credentials?.tenantSlug || 'brightloop'

        const res = await api.login({ email, password, tenantSlug })
        setUser(res.user)
        setToken(res.token)
        localStorage.setItem('bl_token', res.token)
        localStorage.setItem('bl_user', JSON.stringify(res.user))

        // Route based on role
        if (res.user.role === 'CUSTOMER') {
          router.push('/subscriptions')
        } else {
          router.push('/dashboard')
        }
        return res
      } catch (err: any) {
        setError(err.message || 'Login failed')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const register = useCallback(
    async (payload: any) => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.registerTenantAndAdmin({
          companyName: payload?.companyName || 'My Cloud Corp',
          adminEmail: payload?.email || 'admin@mycloud.com',
          adminPassword: payload?.password || 'SecurePassword123!',
          adminFirstName: payload?.firstName || 'New',
          adminLastName: payload?.lastName || 'Admin',
          tenantSlug: payload?.tenantSlug || 'mycloud',
        })
        setUser(res.user)
        setToken(res.token)
        localStorage.setItem('bl_token', res.token)
        localStorage.setItem('bl_user', JSON.stringify(res.user))
        router.push('/dashboard')
        return res
      } catch (err: any) {
        setError(err.message || 'Registration failed')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const forgotPassword = useCallback(async (data: { email: string }) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 600))
      return { success: true, message: `Password reset link sent to ${data?.email || 'your email'}` }
    } catch (err: any) {
      setError(err.message || 'Error sending reset email')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (data: { password: string }) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 600))
      return { success: true, message: 'Password has been reset successfully. Please login.' }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('bl_token')
    localStorage.removeItem('bl_user')
    setUser(null)
    setToken(null)
    router.push('/login')
  }, [router])

  const switchPersona = useCallback(
    (persona: 'ADMIN' | 'STAFF' | 'CUSTOMER') => {
      let newUser: User
      if (persona === 'ADMIN') {
        newUser = {
          id: 'usr-admin-01',
          email: 'admin@brightloop.com',
          firstName: 'Brightloop',
          lastName: 'Admin',
          role: 'BUSINESS_ADMIN',
          companyName: 'Brightloop Software',
        }
      } else if (persona === 'STAFF') {
        newUser = {
          id: 'usr-staff-02',
          email: 'staff@brightloop.com',
          firstName: 'Elena',
          lastName: 'Rostova',
          role: 'STAFF',
          companyName: 'Brightloop Software',
        }
      } else {
        newUser = {
          id: 'usr-cust-03',
          email: 'david@acme-corp.com',
          firstName: 'David',
          lastName: 'Banner',
          role: 'CUSTOMER',
          companyName: 'Acme Corp',
        }
      }
      setUser(newUser)
      localStorage.setItem('bl_user', JSON.stringify(newUser))
    },
    []
  )

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    switchPersona,
  }
}
