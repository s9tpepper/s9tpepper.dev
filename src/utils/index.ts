import Debug from 'debug'

const debug = Debug('s9tpepper:utils')

export const ARTICLE_ERRORS = {
  NOT_AUTHORIZED: 'Not authorized',
}

export const aSync = (promise: Promise<any>): Promise<any> => {
  return promise
    .then((result) => {
      return [null, result]
    })
    .catch((error) => {
      return [error, null]
    })
}

export type FormValues = { [key: string]: string }
export function getInputData(formData: FormData) {
  const _d = debug.extend('getInputData')
  const formKeys = Array.from(formData.keys())
  const inputData = formKeys.reduce((inputs: FormValues, key: string) => {
    if (!key) return inputs
    if (key.includes('$ACTION')) return inputs

    const value = formData.get(key)
    if (!value) return inputs

    inputs[key] = value.toString()

    return inputs
  }, {})

  _d(`inputData: ${JSON.stringify(inputData)}`)

  return inputData
}

export const headerStyles = {
  header:
    'h-[80px] mt-6 pl-20 pr-20 col-span-1 row-span-1 grid grid-cols-2 grid-rows-2',
  h1: 'md:col-start-1 md:col-end-1 row-start-1 row-end-1 text-3xl lg:text-5xl tracking-tighter text-green-400 font-bold text-left',
  p: 'col-start-1 col-end-1 md:col-start-1 md:col-end-1 md:row-start-2 md:row-end-2',
  nav: 'w-full col-start-1 col-end-3 row-start-3 row-end-3 md:inline-block md:col-start-2 md:col-end-2 md:row-start-1 md:row-end-3 md:h-full',
  ul: 'w-full col-start-1 col-end-2 flex flex-wrap gap-3 text-sm justify-start h-[20px] md:h-[80px] md:leading-[80px] md:justify-end',
}
