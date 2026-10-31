'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api'

export interface PaymentItem {
  id: string
  paymentReference: string
  invoiceId: string
  invoiceNumber?: string
  method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH' | 'CHECK'
  amount: string | number
  paymentDate: string
  notes?: string
}

const MOCK_PAYMENTS: PaymentItem[] = [
  {
    id: 'pay-001',
    paymentReference: 'WIRE-REF-9921',
    invoiceId: 'inv-002',
    invoiceNumber: 'INV-2026-0002',
    method: 'BANK_TRANSFER',
    amount: '1000.00',
    paymentDate: '2026-10-05T14:30:00Z',
    notes: 'Initial partial payment wire',
  },
  {
    id: 'pay-002',
    paymentReference: 'CC-AUTH-84321',
    invoiceId: 'inv-001',
    invoiceNumber: 'INV-2026-0001',
    method: 'CREDIT_CARD',
    amount: '1905.20',
    paymentDate: '2026-09-02T10:15:00Z',
    notes: 'Auto-charge Corporate Card',
  },
]

export function usePayments() {
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/payments')
      if (Array.isArray(res)) {
        setPayments(res)
      } else if (res && Array.isArray(res.items)) {
        setPayments(res.items)
      }
    } catch {
      // Keep mock fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return {
    payments,
    loading,
    error,
    refresh: fetchPayments,
  }
}
