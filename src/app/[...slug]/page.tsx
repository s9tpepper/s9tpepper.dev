import Debug from 'debug'

import { getArticleBySlug } from '@/actions/articles'

import { aSync, headerStyles } from '@/utils'
import { notFound, useRouter } from 'next/navigation'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

import Footer from '@/components/Footer'
import Header from '@/components/Header'

const debug = Debug('s9tpepper:catchAll')

type ArticleParams = {
  params: {
    slug: string[]
  }
}

export default async function Article({ params }: ArticleParams) {
  const slug = params.slug.join('/')
  const [error, articleResponse] = await aSync(getArticleBySlug(slug))

  debug(`error: ${JSON.stringify(error)}`)
  debug(`articleResponse: ${JSON.stringify(articleResponse)}`)
  debug(
    `typeof articleResponse.article._id: ${typeof articleResponse?.article
      ?._id}`
  )

  if (error || !articleResponse.article) {
    console.log('throwing error')
    return notFound()
  }

  const {
    article: { title, created: date, content: __html },
  } = articleResponse

  debug(`----- articleResponse: ${JSON.stringify(articleResponse)}`)
  debug(`title: ${title}`)
  debug(`date: ${date}`)

  const styles = {
    header:
      'h-[80px] mt-6 pl-20 pr-20 col-span-1 row-span-1 grid grid-cols-2 grid-rows-2',
    h1: 'md:col-start-1 md:col-end-1 row-start-1 row-end-1 text-3xl lg:text-5xl tracking-tighter text-green-400 font-bold text-left',
    p: 'col-start-1 col-end-1 md:col-start-1 md:col-end-1 md:row-start-2 md:row-end-2',
    nav: 'w-full col-start-1 col-end-3 row-start-3 row-end-3 md:inline-block md:col-start-2 md:col-end-2 md:row-start-1 md:row-end-3 md:h-full',
    ul: 'w-full col-start-1 col-end-2 flex flex-wrap gap-3 text-sm justify-start h-[20px] md:h-[80px] md:leading-[80px] md:justify-end',
  }

  return (
    <>
      <Header styles={styles} />
      <main className='article-main p-20'>
        <h1 className='font-bold text-2xl'>{title}</h1>
        <p className='publish-date'>
          {date.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <article className='article' dangerouslySetInnerHTML={{ __html }} />
      </main>
      <Footer />
    </>
  )
}
