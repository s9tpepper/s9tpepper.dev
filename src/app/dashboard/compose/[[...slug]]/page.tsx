import type {
  GetArticleResponse,
  PostArticleResponse,
} from '@/actions/articles'

import Debug from 'debug'

import { getArticleBySlug, postArticle } from '@/actions/articles'

import { SubmitButton } from '@/components/Buttons'

import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import ArticleEditor from '@/components/ArticleEditor'

const debug = Debug('s9tpepper:app:dashboard:compose:page')

type CompositionData = {
  title: string
  slug: string
  content: string
}

const DEFAULT_STATE: PostArticleResponse = {
  success: false,
  article: {
    title: '',
    slug: '',
    writer: '',
    created: new Date(),
    content: 'Start your new post here...',
  },
}

type ComposeParams = {
  params: { slug?: string }
}

export default async function Compose({ params }: ComposeParams) {
  debug('Rendering Compose...')
  const { slug = [] } = params
  debug(`slug: ${slug}`)
  debug(`type of slug: ${Array.isArray(slug)}`)

  let articleToEdit: PostArticleResponse = DEFAULT_STATE
  if (slug && Array.isArray(slug)) {
    articleToEdit = await getArticleBySlug(slug.join('/'))
    debug(`Got article by slug: ${JSON.stringify(articleToEdit)}`)
  }

  return (
    <main>
      <ArticleEditor initialFormState={articleToEdit} />
    </main>
  )
}

// {process.env.DEBUG ? (
//   <button onClick={debugEditor}>Debug Editor</button>
// ) : null}
//
