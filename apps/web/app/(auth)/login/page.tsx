'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { PasswordInput } from '@/components/auth/PasswordInput'

const LoginPage = () => {
  const { login } = useAuth()

  return <LoginForm onSubmit={login} />
}

export default LoginPage