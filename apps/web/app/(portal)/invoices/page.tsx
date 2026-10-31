'use client'

import { useInvoices } from '@/hooks/useInvoices'
import { InvoiceTable } from '@/components/portal/InvoiceTable'
import { InvoiceStatusBadge } from '@/components/portal/InvoiceStatusBadge'
import { InvoicePDFDownloadButton } from '@/components/portal/InvoicePDFDownloadButton'

const InvoicesPage = () => {
  const { invoices } = useInvoices()

  return <InvoiceTable invoices={invoices} />
}

export default InvoicesPage