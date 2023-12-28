import Debug from 'debug'

import { useFormStatus, useFormState } from 'react-dom'
import { MouseEventHandler } from 'react'

const debug = Debug('s9tpepper:components:Buttons')

type ButtonClick = MouseEventHandler<HTMLButtonElement>

type SubmitButtonProps = {
  label?: string
  enabled?: boolean
}

export function SubmitButton({
  label = 'Submit',
  enabled = true,
}: SubmitButtonProps) {
  const _d = debug.extend('SubmitButton')
  _d('Rendering SubmitButton...')
  _d(`enabled: ${enabled}`)

  const { pending } = useFormStatus()
  _d(`pending: ${pending}`)

  return (
    <button
      type='submit'
      disabled={enabled === false || pending}
      aria-disabled={enabled === false || pending}
    >
      {label}
    </button>
  )
}

export function CancelButton({ cancel }: { cancel: ButtonClick }) {
  return <button onClick={cancel}>Cancel</button>
}
