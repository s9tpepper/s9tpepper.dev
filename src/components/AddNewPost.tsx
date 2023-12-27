'use client'
import { useRouter } from 'next/navigation'

export function AddNewPost() {
  const router = useRouter()

  const onNewPostClick = () => {
    router.push('/dashboard/compose')
  }

  return <button onClick={onNewPostClick}>New Post</button>
}
