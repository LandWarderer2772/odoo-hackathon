'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, Invoice } from '@/lib/api'

export function useInvoices(tenantSlug = 'brightloop') {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getInvoices(tenantSlug)
      setInvoices(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }, [tenantSlug])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const triggerMidnightBilling = useCallback(async () => {
    try {
      const res = await api.triggerMidnightBilling()
      await fetchInvoices()
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to run midnight billing')
      throw err
    }
  }, [fetchInvoices])

  return {
    invoices,
    loading,
    error,
    refresh: fetchInvoices,
    triggerMidnightBilling,
  }
}
