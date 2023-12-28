export type Nullable<T> = null | T

export type Response = {
  success: boolean
  error?: string | undefined | null
}
