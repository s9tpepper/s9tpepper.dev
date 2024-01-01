'use client'
import { useRouter } from 'next/navigation'

export function AddNewPost() {
  const router = useRouter()

  const onNewPostClick = () => {
    router.push('/dashboard/compose')
  }

  return (
    <button className='bg-gray-900 hover:bg-gray-700 p-2 rounded' onClick={onNewPostClick}>
      New Post
    </button>
  )
}
