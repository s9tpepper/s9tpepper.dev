'use client'
import type { SignUpResponse } from '@/actions/users'

import { useFormStatus, useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'

import { SubmitButton, CancelButton } from '@/components/Buttons'
import { submitSignUp } from '@/actions/users'
import { ErrorMessage } from '@/components/Errors'

const initialState: SignUpResponse = {
  success: false,
}

export default function SignUp() {
  const router = useRouter()
  const [formState, formAction] = useFormState(submitSignUp, initialState)
  console.log(`formState: ${formState}`)

  if (formState.success) {
    router.push(`/login?username=${formState?.user?.username}`)
  }

  const submitSignUpError: boolean = !!(!formState.success && formState.error)

  function onClickHandler() {
    router.back()
  }

  return (
    <main>
      <form action={formAction}>
        <label htmlFor='firstName'>First Name</label>
        <input id='firstName' name='firstName' type='text' required />
        <label htmlFor='lastName'>Last Name</label>
        <input id='lastName' name='lastName' type='text' required />
        <label htmlFor='username'>Username</label>
        <input id='username' name='username' type='text' required />
        <label htmlFor='password'>Password</label>
        <input id='password' name='password' type='password' required />
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          required
        />
        <div>
          <SubmitButton label='Sign Up' />
          <CancelButton cancel={onClickHandler} />
        </div>
        {submitSignUpError && (
          <ErrorMessage error={formState.error as string} />
        )}
      </form>
    </main>
  )
}
