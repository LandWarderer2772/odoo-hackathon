'use client'

import { useSubscriptions } from '@/hooks/useSubscriptions'
import { useInvoices } from '@/hooks/useInvoices'
import { SubscriptionSummaryCard } from '@/components/portal/SubscriptionSummaryCard'
import { UpcomingInvoiceCard } from '@/components/portal/UpcomingInvoiceCard'
import { PaymentHistoryChart } from '@/components/portal/PaymentHistoryChart'

const PortalDashboard = () => {
  const { subscriptions } = useSubscriptions()
  const { invoices } = useInvoices()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SubscriptionSummaryCard subscriptions={subscriptions} />
      <UpcomingInvoiceCard invoices={invoices} />
      <PaymentHistoryChart />
    </div>
  )
}

export default PortalDashboard