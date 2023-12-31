import Debug from 'debug'
import { notFound } from 'next/navigation'

import { getArticlesByCategory } from '@/actions/articles'

import { headerStyles } from '@/utils'

import ArticleCard from '@/components/ArticleCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type CategoryPageProps = {
  params: {
    slug: string[]
  }
}

const debug = Debug('s9tpepper:app:category:page')

export default async function Category({ params }: CategoryPageProps) {
  debug('-------------------------- Category Page component')
  const slug = params.slug.join('/')
  const articlesResponse = await getArticlesByCategory(slug)
  if (
    !articlesResponse.success ||
    (articlesResponse.success && !Array.isArray(articlesResponse.articles)) ||
    !articlesResponse.articles
  ) {
    return notFound()
  }

  debug(
    `articlesResponse.articles: ${JSON.stringify(articlesResponse.articles)}`
  )
  debug(`Array.isArray(slug): ${Array.isArray(slug)}`)

  const articleCards = articlesResponse.articles.map((article) => {
    return <ArticleCard key={article.slug} article={article} />
  })

  const noArticles = <p>No articles in this category yet.</p>

  return (
    <>
      <Header styles={headerStyles} />
      <main className='pl-20 pr-20 pb-20'>
        <h1 className='font-bold text-4xl text-green-400 pt-10 pb-10'>
          {slug}
        </h1>
        {articlesResponse.articles.length ? (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {articleCards}
          </ul>
        ) : (
          noArticles
        )}
      </main>
      <Footer />
    </>
  )
}
