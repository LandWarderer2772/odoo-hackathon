'use client'

import { useAuth } from '@/hooks/useAuth'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()

  return <ForgotPasswordForm onSubmit={forgotPassword} />
}

export default ForgotPasswordPage