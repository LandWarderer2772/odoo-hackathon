'use client'

import { useSubscriptions } from '@/hooks/useSubscriptions'
import { SubscriptionTable } from '@/components/portal/SubscriptionTable'
import { SubscriptionStatusBadge } from '@/components/portal/SubscriptionStatusBadge'

const SubscriptionsPage = () => {
  const { subscriptions } = useSubscriptions()

  return <SubscriptionTable subscriptions={subscriptions} />
}

export default SubscriptionsPage