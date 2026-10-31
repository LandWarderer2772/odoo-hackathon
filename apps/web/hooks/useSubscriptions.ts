'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, Subscription } from '@/lib/api'

export function useSubscriptions(tenantSlug = 'brightloop') {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getSubscriptions(tenantSlug)
      setSubscriptions(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscriptions')
    } finally {
      setLoading(false)
    }
  }, [tenantSlug])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const transitionSubscription = useCallback(
    async (
      id: string,
      action: 'CONFIRM' | 'PAUSE' | 'RESUME' | 'CLOSE',
      reason?: string
    ) => {
      try {
        const updated = await api.transitionSubscription(id, action, reason)
        setSubscriptions((prev) =>
          prev.map((sub) => (sub.id === id ? updated : sub))
        )
        return updated
      } catch (err: any) {
        setError(err.message || `Failed to transition subscription to ${action}`)
        throw err
      }
    },
    []
  )

  const convertQuotation = useCallback(async (id: string) => {
    try {
      const updated = await api.convertQuotation(id)
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === id ? updated : sub))
      )
      return updated
    } catch (err: any) {
      setError(err.message || 'Failed to convert quotation')
      throw err
    }
  }, [])

  return {
    subscriptions,
    loading,
    error,
    refresh: fetchSubscriptions,
    transitionSubscription,
    convertQuotation,
  }
}
