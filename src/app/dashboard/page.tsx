import { cookies } from 'next/headers'
import { redirect, useRouter } from 'next/navigation'

import { AddNewPost } from '@/components/AddNewPost'
import { validateJWT } from '@/actions/users'
import { getArticles } from '@/actions/articles'

export default async function Dashboard() {
  const axe = cookies().get('axe')
  if (!axe) {
    return redirect('/')
  }

  const valid = validateJWT(axe.value)
  if (!valid) {
    return redirect('/')
  }

  const articleList = getArticles()
  // <ul>{articles}</ul>

  return (
    <main>
      <div>
        <AddNewPost />
      </div>
    </main>
  )
}
