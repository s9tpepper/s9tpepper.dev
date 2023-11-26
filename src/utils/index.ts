export const aSync = (promise: Promise<any>): Promise<any> => {
  return promise
    .then((result) => {
      return [null, result]
    })
    .catch((error) => {
      return [error, null]
    })
}

type InputValue = string | null
export function getInputData(formData: FormData) {
  const formKeys = Array.from(formData.keys())
  const inputData = formKeys.reduce(
    (inputs: { [key: string]: string }, key: string) => {
      if (!key) return inputs
      if (key.includes('$ACTION')) return inputs

      const value = formData.get(key)
      if (!value) return inputs

      inputs[key] = value.toString()

      return inputs
    },
    {}
  )

  return inputData
}
