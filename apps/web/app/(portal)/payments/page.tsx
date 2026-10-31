'use client'

import { usePayments } from '@/hooks/usePayments'
import { PaymentTable } from '@/components/portal/PaymentTable'
import { PaymentMethodIcon } from '@/components/portal/PaymentMethodIcon'

const PaymentsPage = () => {
  const { payments } = usePayments()

  return <PaymentTable payments={payments} />
}

export default PaymentsPage