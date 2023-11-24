'use client'

import { useFormStatus, useFormState } from "react-dom"
import { User, LoginData } from "@/types/users"
import { submitLogin } from "@/actions/users"
import { LoginResponse } from "@/actions/users"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>Log In</button>
  )
}

function CancelButton() {
  return (
    <button>Cancel</button>
  )
}

function LoginError({ error }: { error: string }) {
  return (
    <div className="text-sm text-red-600">{error}</div>
  )
}


const initialFormState:LoginResponse = {
  success: false,
}


export default function Login({}) {
  const [formState, formAction] = useFormState(submitLogin, initialFormState)
  console.log(`formState: ${JSON.stringify(formState)}`)

  const loginError:boolean = !!(!formState.success && formState.error)
  console.log(`loginError: ${loginError}`)

  return (
    <main>
      <form action={formAction}>
        <label htmlFor="username">
          Username:
        </label>
        <input id="username" name="username" type="text" />
        <label htmlFor="password">
          Password:
        </label>
        <input id="password" name="password" type="password" />
        <div>
          <SubmitButton />
          <CancelButton />
          <a href="/forgot-password">Forgot password?</a>
          <a href="/reset-password">Reset password</a>
        </div>
        { loginError && <LoginError error={formState.error as string} /> }
      </form>
    </main>
  )
}
