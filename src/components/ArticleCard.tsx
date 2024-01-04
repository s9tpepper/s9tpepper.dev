import Debug from 'debug'
import { stripHtml } from 'string-strip-html'

import { Article } from '@/actions/articles'

const debug = Debug('s9tpepper:components:ArticleCard')

const EXCERPT_LENGTH = 100

type ArticleCardProps = {
  article: Article
}

export default function ArticleCard(props: ArticleCardProps) {
  const { article } = props
  const excerpt = stripHtml(article.content).result.slice(0, EXCERPT_LENGTH)
  debug(`excerpt: "${excerpt}"`)

  return (
    <article className='bg-gray-900 p-8 w-full shadow-2xl rounded-md'>
      <a className='group' href={`/${article.slug}`}>
        <h2 className='font-bold text-green-400 leading-[8px] group-hover:link-hover'>
          {article.title}
        </h2>
        <span className='text-[8px] leading-[10px]'>
          {new Date(article.created).toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <img
          className='mt-4 mb-4 w-[320px] h-[160px] object-cover rounded-md border border-0'
          src={article?.hero?.url || '/fpo.png'}
          alt=''
        />
        <p className='text-xs'>{excerpt}...</p>
      </a>
    </article>
  )
}
