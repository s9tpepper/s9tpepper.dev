import Debug from 'debug'

import { useFormStatus, useFormState } from 'react-dom'
import { MouseEventHandler } from 'react'

const debug = Debug('s9tpepper:components:Buttons')

type ButtonClick = MouseEventHandler<HTMLButtonElement>

type SubmitButtonProps = {
  className?: string
  label?: string
  enabled?: boolean
}

export function SubmitButton({
  className = '',
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
      className={className}
      disabled={enabled === false || pending}
      aria-disabled={enabled === false || pending}
    >
      {label}
    </button>
  )
}

type CancelButtonProps = { cancel: ButtonClick; className?: string }
export function CancelButton({ cancel, className }: CancelButtonProps) {
  return (
    <button className={className} onClick={cancel}>
      Cancel
    </button>
  )
}
