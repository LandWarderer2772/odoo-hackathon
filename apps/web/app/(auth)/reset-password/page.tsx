'use client'

import { useAuth } from '@/hooks/useAuth'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth()

  return <ResetPasswordForm onSubmit={resetPassword} />
}

export default ResetPasswordPage