import Debug from 'debug'

import type { Article } from '@/actions/articles'

import { cookies } from 'next/headers'
import { redirect, useRouter } from 'next/navigation'

import { AddNewPost } from '@/components/AddNewPost'
import { validateJWT } from '@/actions/users'
import { getArticles } from '@/actions/articles'

const debug = Debug('s9tpepper:dashboard')

export default async function Dashboard() {
  const axe = cookies().get('axe')
  if (!axe) {
    return redirect('/')
  }

  const valid = await validateJWT(axe.value)
  if (!valid) {
    return redirect('/')
  }

  const getArticlesResponse = await getArticles()
  const { articles: articleList = [] } = getArticlesResponse
  const articles = articleList.map((article: Article) => {
    return (
      <li
        key={article.slug}
        className='p-2 border border-b-solid border-green-400 hover:bg-green-600'
      >
        <a
          href={`/dashboard/compose/${article.slug}`}
          className='grid grid-flow-col grid-cols-[1fr_auto] justify-stretch'
        >
          <span className='w-full'>{article.title}</span>
          <span className='text-sm w-[100px] pl-4 pr-4'>
            {article.category}
          </span>
          <span className='text-xs text-right align-items-end w-[175px]'>
            {new Date(article.created).toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </a>
      </li>
    )
  })

  return (
    <main className='p-14'>
      <AddNewPost />
      <h2 className='text-xl font-bold w-full'>Articles List</h2>
      <ul className='border border-solid border-green-400 border-b-0'>
        {articles}
      </ul>
    </main>
  )
}
