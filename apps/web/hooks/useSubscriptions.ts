'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api'

export interface SubscriptionItem {
  id: string
  subscriptionNumber: string
  status: 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED'
  startDate?: string
  expiryDate?: string
  nextBillingDate?: string
  totalAmount: string | number
  plan?: {
    id: string
    name: string
    billingInterval: string
    intervalCount: number
  }
  customer?: {
    name: string
    companyName?: string
    email: string
  }
}

// Fallback demo data matching db seeds
const MOCK_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'sub-001',
    subscriptionNumber: 'SUB-2026-0001',
    status: 'ACTIVE',
    startDate: '2026-01-01T00:00:00Z',
    nextBillingDate: '2026-11-01T00:00:00Z',
    totalAmount: '1760.00',
    plan: {
      id: 'plan-1',
      name: 'Enterprise Cloud Annual',
      billingInterval: 'YEARLY',
      intervalCount: 1,
    },
    customer: {
      name: 'Bruce Wayne',
      companyName: 'Wayne Enterprises',
      email: 'bruce@wayne-ent.com',
    },
  },
  {
    id: 'sub-002',
    subscriptionNumber: 'SUB-2026-0002',
    status: 'ACTIVE',
    startDate: '2026-03-15T00:00:00Z',
    nextBillingDate: '2026-11-15T00:00:00Z',
    totalAmount: '299.00',
    plan: {
      id: 'plan-2',
      name: 'Growth SaaS Monthly',
      billingInterval: 'MONTHLY',
      intervalCount: 1,
    },
    customer: {
      name: 'Tony Stark',
      companyName: 'Stark Industries',
      email: 'tony@stark.com',
    },
  },
  {
    id: 'sub-003',
    subscriptionNumber: 'SUB-2026-0003',
    status: 'CONFIRMED',
    startDate: '2026-10-20T00:00:00Z',
    nextBillingDate: '2026-11-20T00:00:00Z',
    totalAmount: '559.00',
    plan: {
      id: 'plan-3',
      name: 'Scale Optimization Plan',
      billingInterval: 'MONTHLY',
      intervalCount: 1,
    },
    customer: {
      name: 'Miles Dyson',
      companyName: 'Cyberdyne Systems',
      email: 'miles@cyberdyne.io',
    },
  },
]

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(MOCK_SUBSCRIPTIONS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/subscriptions')
      if (Array.isArray(res)) {
        setSubscriptions(res)
      } else if (res && Array.isArray(res.items)) {
        setSubscriptions(res.items)
      }
    } catch {
      // Keep mock fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  return {
    subscriptions,
    loading,
    error,
    refresh: fetchSubscriptions,
  }
}
