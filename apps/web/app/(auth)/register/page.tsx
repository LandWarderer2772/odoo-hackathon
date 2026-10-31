'use client'

import { useAuth } from '@/hooks/useAuth'
import { RegistrationForm } from '@/components/auth/RegistrationForm'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'

const RegisterPage = () => {
  const { register } = useAuth()

  return <RegistrationForm onSubmit={register} />
}

export default RegisterPage