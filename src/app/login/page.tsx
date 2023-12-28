'use client'
import type { LoginResponse } from '@/actions/users'
import type { User, LoginData } from '@/types/users'

import { useRouter, useSearchParams } from 'next/navigation'
import { useFormState } from 'react-dom'

import { submitLogin } from '@/actions/users'
import { SubmitButton, CancelButton } from '@/components/Buttons'
import { ErrorMessage } from '@/components/Errors'

const initialFormState: LoginResponse = {
  success: false,
}

export default function Login() {
  const [formState, formAction] = useFormState(submitLogin, initialFormState)
  const router = useRouter()

  if (formState.success) {
    router.push('/dashboard')
  }

  const loginError: boolean = !!(!formState.success && formState.error)

  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''

  const onClickHandler = () => {
    router.back()
  }

  return (
    <main>
      <form action={formAction}>
        <label htmlFor='username'>Username:</label>
        <input
          id='username'
          name='username'
          type='text'
          defaultValue={username}
          required
        />

        <label htmlFor='password'>Password:</label>
        <input id='password' name='password' type='password' required />
        <div>
          <SubmitButton label='Log In' />
          <CancelButton cancel={onClickHandler} />
          <a href='/forgot-password'>Forgot password?</a>
          <a href='/reset-password'>Reset password</a>
        </div>
        {loginError && <ErrorMessage error={formState.error as string} />}
      </form>
    </main>
  )
}
