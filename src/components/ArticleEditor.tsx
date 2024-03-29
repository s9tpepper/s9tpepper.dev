'use client'

import type {
  GetArticleResponse,
  PostArticleResponse,
  UploadThingImage,
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
import EditorInput from './EditorInput'

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
  const [dirty, setDirty] = useState(false)
  const [slugValid, setSlugValid] = useState(initialSlugState)
  const [formInputs, setFormInputs] = useState({ ...initialFormState.article })

  const { article: { hero } = {} } = initialFormState

  const [formState, formAction] = useFormState(async function (
    state: any,
    formData: FormData
  ) {
    const _d = debug.extend('formAction')
    _d(`Running save code...`)
    const result = await postArticle(state, formData)
    _d(`result: ${JSON.stringify(result)}`)
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
      // setPost(editorRef.current.getContent())
      const newState = { ...formInputs }
      const newValue = editorRef.current.getContent()
      // TODO: figure out why TS is complaining about _id
      // @ts-ignore
      newState.content = newValue

      setFormInputs(newState)
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
      setSlugValid(available)

      const newState = { ...formInputs }
      // TODO: figure out why TS is complaining about _id
      // @ts-ignore
      newState.slug = newValue

      setFormInputs(newState)
    }
  }

  const onFormUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    const newState = { ...formInputs }
    const newValue = event.target.value
    const propName = event.target.name
    // TODO: figure out why TS is complaining about _id
    // @ts-ignore
    newState[propName] = newValue

    setFormInputs(newState)
    setDirty(true)
  }

  const tinyMceUrl = '/tinymce/tinymce.min.js'

  return (
    <>
      {submissionError && <div>{submissionError}</div>}
      <form action={formAction} className='max-w-[90%] ml-auto mr-auto pb-32'>
        <div className='grid grid-cols-4 gap-6 max-w-[90%] ml-auto mr-auto pb-6 pt-6'>
          <SubmitButton
            className={buttonStyles}
            label={submitButtonLabel}
            enabled={slugValid || dirty}
          />
          <a
            target='_blank'
            className={viewArticleClasses}
            href={`/${formInputs.slug}`}
          >
            View Article
          </a>
        </div>
        <div className='grid grid-cols-[auto_1fr] grid-rows-auto gap-2 max-w-[90%] ml-auto mr-auto pb-6'>
          <EditorInput
            fieldLabel='Title:'
            fieldName='title'
            fieldValue={formInputs?.title || ''}
            onChange={onFormUpdate}
          />
          <EditorInput
            fieldLabel='Category:'
            fieldName='category'
            fieldValue={formInputs?.category || ''}
            onChange={onFormUpdate}
          />
          <EditorInput
            fieldLabel='Slug:'
            fieldName='slug'
            fieldValue={formInputs?.slug || ''}
            onChange={onSlugChange}
          />
          <label>Upload Hero Image:</label>
          <UploadButton
            appearance={{
              button: 'flex flex-col gap-1 self-start',
            }}
            endpoint='imageUploader'
            onClientUploadComplete={(res) => {
              debug(`Files: ${JSON.stringify(res)}`)
              const file = res[0]
              debug('setting file...')
              const newState = { ...formInputs }
              // TODO: figure out why TS is complaining about _id
              // @ts-ignore
              newState.hero = file as UploadThingImage

              setFormInputs(newState)
              setDirty(true)

              debug('file set.')
            }}
            onUploadError={(error: Error) => {
              debug(`error: error.message`)
              debug(error.stack)
            }}
          />

          <div className='w-full col-start-2 col-end-3'>
            <img
              className='mt-4 mb-4 w-[320px] h-[160px] object-cover border border-0 rounded-md col-start-2 col-end-3'
              alt=''
              src={formInputs?.hero?.url || ''}
            />
          </div>
          <div className='w-full row-start-6 row-end-7'>
            <label>Upload Article Image:</label>
            <UploadButton
              endpoint='imageUploader'
              onClientUploadComplete={(res) => {
                const file = res[0]
                alert(file.url)
              }}
              onUploadError={(error: Error) => {
                debug(`error: error.message`)
                debug(error.stack)
              }}
            />
          </div>
        </div>
        <EditorInput
          fieldName='hero'
          fieldValue={formInputs?.hero ? JSON.stringify(formInputs.hero) : ''}
          fieldHidden={true}
          onChange={noop}
        />
        <EditorInput
          fieldName='created'
          fieldValue={formInputs?.created?.toString() || ''}
          fieldHidden={true}
          onChange={onFormUpdate}
        />
        <EditorInput
          fieldName='content'
          fieldValue={formInputs?.content || ''}
          fieldHidden={true}
          onChange={onFormUpdate}
        />
        <EditorInput
          fieldName='_id'
          fieldValue={(formInputs?._id as string) || ''}
          fieldHidden={true}
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
        <SubmitButton
          className={`${buttonStyles} mt-4`}
          label={submitButtonLabel}
          enabled={slugValid || dirty}
        />
      </form>
    </>
  )
}
