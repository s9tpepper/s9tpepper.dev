export function ErrorMessage({ error }: { error: string }) {
  return <div className='text-sm text-red-600'>{error}</div>
}
