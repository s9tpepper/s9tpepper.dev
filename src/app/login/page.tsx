'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useFormStatus, useFormState } from 'react-dom'

import { User, LoginData } from '@/types/users'
import { LoginResponse, submitLogin } from '@/actions/users'
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
          value={username}
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
