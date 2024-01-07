import { ChangeEvent } from 'react'

type EditorInputProps = {
  fieldName: string
  fieldValue: string
  fieldLabel?: string
  fieldHidden?: boolean
  fieldRequired?: boolean
  fieldType?: string
  className?: string
  showLabel?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function EditorInput(props: EditorInputProps) {
  const {
    fieldName,
    fieldValue,
    fieldLabel = '',
    fieldHidden = false,
    fieldRequired = false,
    fieldType = 'text',
    className = 'p-2',
    showLabel = true,
    onChange,
  } = props

  return (
    <>
      {showLabel && <label htmlFor={fieldName}>{fieldLabel}</label>}
      <input
        id={fieldName}
        name={fieldName}
        type={fieldType}
        value={fieldValue}
        onChange={onChange}
        hidden={fieldHidden}
        className={className}
        required={fieldRequired}
      />
    </>
  )
}
