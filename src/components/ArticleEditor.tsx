'use client'

import type {
  GetArticleResponse,
  PostArticleResponse,
} from '@/actions/articles'

import Debug from 'debug'

import { checkSlugAvailability, postArticle } from '@/actions/articles'
import { ARTICLE_ERRORS } from '@/utils'

import { SubmitButton } from '@/components/Buttons'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import { redirect, useParams, useRouter } from 'next/navigation'

import { UploadButton } from '@/utils/uploadthing'

const debug = Debug('s9tpepper:components:ArticleEditor')

type ArticleEditorProps = {
  initialFormState: PostArticleResponse
}

const noop = () => {}
const buttonStyles = 'text-center bg-gray-900 hover:bg-gray-700 p-2 rounded'

export default function ArticleEditor(props: ArticleEditorProps) {
  debug('Rendering ArticleEditor...')
  const { initialFormState } = props
  const initialSlugState = !initialFormState?.article?.slug || false

  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState('')
  const [dirty, setDirty] = useState(false)
  const [articleSlug, setArticleSlug] = useState(
    initialFormState?.article?.slug
  )
  const [slugValid, setSlugValid] = useState(initialSlugState)
  const [formState, formAction] = useFormState(async function (
    state: any,
    formData: FormData
  ) {
    const result = await postArticle(state, formData)
    const { success, article: { slug: newSlug } = {} } = result

    // Only update the browser's slug if the postArticle was successful
    if (success && params.slug !== newSlug) {
      router.replace(`/dashboard/compose/${newSlug}`)
    }

    return result
  }, initialFormState)

  const submissionError =
    !formState.success && formState?.error ? formState.error : false

  // If there was a Not authorized error, send to home page
  if (submissionError && submissionError === ARTICLE_ERRORS.NOT_AUTHORIZED) {
    setTimeout(() => {
      router.replace('/')
    }, 3000)
  }

  const hasBeenPosted =
    initialFormState?.article?.slug && initialFormState?.article?._id
  const viewArticleClasses = hasBeenPosted ? buttonStyles : 'hidden'

  const editorRef = useRef<TinyMCEEditor | null>(null)
  const submitButtonLabel = formState.article?.slug
    ? 'Update Article'
    : 'Create Article'

  const onEditorChange = (value: string, editor: TinyMCEEditor) => {
    if (editorRef.current) {
      setPost(editorRef.current.getContent())
      setDirty(true)
    }
  }

  const onInitHandler = (_: any, editor: TinyMCEEditor) => {
    editorRef.current = editor
  }

  const onSlugChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const _d = debug.extend('onSlugChange')
    const newValue = event.target.value
    const isNewSlug =
      (params.slug && params.slug !== newValue) || (!params.slug && !slugValid)

    if (isNewSlug) {
      const slugCheckResponse = await checkSlugAvailability(newValue)
      const { available } = slugCheckResponse
      _d(`available: ${available}`)

      setSlugValid(available)
      setArticleSlug(newValue)
    }
  }

  const onFormUpdate = () => {
    setDirty(true)
  }

  const tinyMceUrl = '/tinymce/tinymce.min.js'

  return (
    <>
      {submissionError && <div>{submissionError}</div>}
      <div className='grid grid-cols-6 gap-6 max-w-[90%] ml-auto mr-auto pb-6 pt-6'>
        <SubmitButton
          className={buttonStyles}
          label={submitButtonLabel}
          enabled={slugValid || dirty}
        />
        <a
          target='_blank'
          className={viewArticleClasses}
          href={`/${articleSlug}`}
        >
          View Article
        </a>
      </div>
      <div className='grid grid-cols-[auto_1fr] grid-rows-3 gap-2 max-w-[90%] ml-auto mr-auto pb-6'>
        <label htmlFor='title'>Title:</label>
        <input
          id='title'
          name='title'
          type='text'
          value={formState?.article?.title}
          onChange={onFormUpdate}
          className='p-2'
          required
        />
        <label htmlFor='category'>Category:</label>
        <input
          id='category'
          name='category'
          type='text'
          value={formState?.article?.category}
          onChange={onFormUpdate}
          className='p-2'
          required
        />
        <label htmlFor='slug'>Slug:</label>
        <input
          id='slug'
          name='slug'
          type='text'
          value={articleSlug}
          onChange={onSlugChange}
          className='p-2'
          required
        />
        <label>Upload Hero Image:</label>
        <UploadButton
          endpoint='imageUploader'
          onClientUploadComplete={(res) => {
            debug(`Files: ${JSON.stringify(res)}`)
          }}
          onUploadError={(error: Error) => {
            debug(`error: error.message`)
            debug(error.stack)
          }}
        />
      </div>
      <form action={formAction} className='max-w-[90%] ml-auto mr-auto pb-32'>
        <input
          id='created'
          name='created'
          type='text'
          value={formState?.article?.created?.toISOString()}
          hidden
          onChange={onFormUpdate}
        />
        <input
          id='content'
          name='content'
          type='text'
          value={post}
          hidden
          onChange={onFormUpdate}
        />
        <input
          id='_id'
          name='_id'
          type='text'
          value={formState?.article?._id as string}
          hidden
          onChange={onFormUpdate}
        />
        <Editor
          id='editor'
          tinymceScriptSrc={tinyMceUrl}
          onEditorChange={onEditorChange}
          onInit={onInitHandler}
          initialValue={formState.article?.content}
          init={{
            skin: 'oxide-dark',
            content_css: 'tinymce-5-dark',
            height: 500,
            menubar: true,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'preview',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
      </form>
    </>
  )
}
