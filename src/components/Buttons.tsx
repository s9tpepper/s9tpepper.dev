import Debug from 'debug'

import { useFormStatus, useFormState } from 'react-dom'
import { MouseEventHandler } from 'react'

const debug = Debug('s9tpepper:components:Buttons')

type ButtonClick = MouseEventHandler<HTMLButtonElement>

export function SubmitButton({ label = 'Submit' }: { label?: string }) {
  const _d = debug.extend('SubmitButton')
  _d('Rendering SubmitButton...')

  const { pending } = useFormStatus()
  _d(`pending: ${pending}`)

  return (
    <button type='submit' aria-disabled={pending}>
      {label}
    </button>
  )
}

export function CancelButton({ cancel }: { cancel: ButtonClick }) {
  return <button onClick={cancel}>Cancel</button>
}
