'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api'

export interface InvoiceItem {
  id: string
  invoiceNumber: string
  status: 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED'
  invoiceDate: string
  dueDate: string
  subtotal: string | number
  taxTotal: string | number
  amountTotal: string | number
  amountPaid: string | number
  subscriptionId?: string
  customer?: {
    name: string
    companyName?: string
  }
}

const MOCK_INVOICES: InvoiceItem[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0001',
    status: 'PAID',
    invoiceDate: '2026-09-01T00:00:00Z',
    dueDate: '2026-09-15T00:00:00Z',
    subtotal: '1760.00',
    taxTotal: '145.20',
    amountTotal: '1905.20',
    amountPaid: '1905.20',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-0002',
    status: 'PARTIALLY_PAID',
    invoiceDate: '2026-10-01T00:00:00Z',
    dueDate: '2026-10-15T00:00:00Z',
    subtotal: '1760.00',
    taxTotal: '145.20',
    amountTotal: '1905.20',
    amountPaid: '1000.00',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-0003',
    status: 'CONFIRMED',
    invoiceDate: '2026-10-15T00:00:00Z',
    dueDate: '2026-11-01T00:00:00Z',
    subtotal: '299.00',
    taxTotal: '24.67',
    amountTotal: '323.67',
    amountPaid: '0.00',
  },
]

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(MOCK_INVOICES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/invoices')
      if (Array.isArray(res)) {
        setInvoices(res)
      } else if (res && Array.isArray(res.items)) {
        setInvoices(res.items)
      }
    } catch {
      // Keep mock fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return {
    invoices,
    loading,
    error,
    refresh: fetchInvoices,
  }
}
