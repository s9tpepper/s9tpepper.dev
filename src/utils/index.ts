export const aSync = (promise: Promise<any>): Promise<any> => {
  return promise
    .then((result) => {
      return [null, result]
    })
    .catch((error) => {
      return [error, null]
    })
}
