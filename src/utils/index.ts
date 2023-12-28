import Debug from 'debug'

const debug = Debug('s9tpepper:utils')

export const aSync = (promise: Promise<any>): Promise<any> => {
  const _d = debug.extend('aSync')
  return promise
    .then((result) => {
      _d(result)
      _d(`result: ${JSON.stringify(result)}`)
      return [null, result]
    })
    .catch((error) => {
      _d(`error: ${JSON.stringify(error)}`)
      return [error, null]
    })
}

export type FormValues = { [key: string]: string }
export function getInputData(formData: FormData) {
  const formKeys = Array.from(formData.keys())
  const inputData = formKeys.reduce((inputs: FormValues, key: string) => {
    if (!key) return inputs
    if (key.includes('$ACTION')) return inputs

    const value = formData.get(key)
    if (!value) return inputs

    inputs[key] = value.toString()

    return inputs
  }, {})

  return inputData
}
