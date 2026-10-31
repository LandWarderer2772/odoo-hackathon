'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, Payment } from '@/lib/api'

export function usePayments(tenantSlug = 'brightloop') {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getPayments(tenantSlug)
      setPayments(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }, [tenantSlug])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const recordPayment = useCallback(
    async (payload: {
      invoiceId: string
      amount: number
      method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH' | 'CHECK'
      notes?: string
    }) => {
      try {
        const res = await api.recordPayment(payload)
        await fetchPayments()
        return res
      } catch (err: any) {
        setError(err.message || 'Failed to record payment')
        throw err
      }
    },
    [fetchPayments]
  )

  return {
    payments,
    loading,
    error,
    refresh: fetchPayments,
    recordPayment,
  }
}
