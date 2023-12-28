'use client'

import type {
  GetArticleResponse,
  PostArticleResponse,
} from '@/actions/articles'

import Debug from 'debug'

import { checkSlugAvailability, postArticle } from '@/actions/articles'

import { SubmitButton } from '@/components/Buttons'

import { ChangeEvent, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import { useParams, useRouter } from 'next/navigation'

const debug = Debug('s9tpepper:components:ArticleEditor')

type ArticleEditorProps = {
  initialFormState: PostArticleResponse
}

const noop = () => {}

export default function ArticleEditor(props: ArticleEditorProps) {
  debug('Rendering ArticleEditor...')
  const { initialFormState } = props
  const initialSlugState = !initialFormState?.article?.slug || false

  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState('')
  const [slugValid, setSlugValid] = useState(initialSlugState)

  const [formState, formAction] = useFormState(async function (
    state: any,
    formData: FormData
  ) {
    const result = await postArticle(state, formData)
    const { article: { slug: newSlug } = {} } = result
    if (params.slug !== newSlug) {
      router.replace(`/dashboard/compose/${newSlug}`)
    }

    return result
  }, initialFormState)

  const editorRef = useRef<TinyMCEEditor | null>(null)
  const slugRef = useRef<HTMLInputElement | null>(null)

  const onEditorChange = (value: string, editor: TinyMCEEditor) => {
    if (editorRef.current) {
      // formState.article.content = editorRef?.current?.getContent()
      setPost(editorRef.current.getContent())
    }
  }

  const debugEditor = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  const onInitHandler = (_: any, editor: TinyMCEEditor) => {
    editorRef.current = editor

    if (!slugRef.current) return

    slugRef.current.value = formState?.article?.slug || ''
  }

  const onSlugChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    const isNewSlug =
      (params.slug && params.slug !== newValue) || (!params.slug && !slugValid)

    if (isNewSlug) {
      const slugCheckResponse = await checkSlugAvailability(newValue)
      const { available } = slugCheckResponse

      setSlugValid(available)
      if (newValue && slugRef && slugRef.current) {
        const input = slugRef.current as HTMLInputElement
        input.value = newValue
      }
    }
  }

  const tinyMceUrl = '/tinymce/tinymce.min.js'

  return (
    <form action={formAction}>
      <input
        id='content'
        name='content'
        type='text'
        value={post}
        hidden
        onChange={noop}
      />
      <input
        id='_id'
        name='_id'
        type='text'
        value={formState?.article?._id as string}
        hidden
        onChange={noop}
      />
      <label htmlFor='title'>Title:</label>
      <input
        id='title'
        name='title'
        type='text'
        value={formState?.article?.title}
        onChange={noop}
        required
      />
      <label htmlFor='slug'>Slug:</label>
      <input
        id='slug'
        name='slug'
        type='text'
        ref={slugRef}
        onChange={onSlugChange}
        required
      />
      <SubmitButton label='Submit New Post' enabled={slugValid} />
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
  )
}
