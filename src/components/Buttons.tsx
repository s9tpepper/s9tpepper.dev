import { useFormStatus, useFormState } from 'react-dom'
import { MouseEventHandler } from 'react'

type ButtonClick = MouseEventHandler<HTMLButtonElement>

export function SubmitButton({ label = 'Submit' }: { label?: string }) {
  const { pending } = useFormStatus()

  return (
    <button type='submit' aria-disabled={pending}>
      {label}
    </button>
  )
}

export function CancelButton({ cancel }: { cancel: ButtonClick }) {
  return <button onClick={cancel}>Cancel</button>
}
