'use client'

import type {
  GetArticleResponse,
  PostArticleResponse,
} from '@/actions/articles'

import Debug from 'debug'

import { postArticle } from '@/actions/articles'

import { useFormState } from 'react-dom'

import { SubmitButton } from '@/components/Buttons'

import { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
// import { useSearchParams } from 'next/navigation'

const debug = Debug('s9tpepper:app:dashboard:compose:page')

type CompositionData = {
  title: string
  slug: string
  content: string
}

type Action = () => unknown

type ArticleEditorProps = {
  initialFormState: PostArticleResponse
}

export default function ArticleEditor(props: ArticleEditorProps) {
  debug('Rendering Compose...')
  const { initialFormState } = props

  const [post, setPost] = useState('')
  const editorRef = useRef<TinyMCEEditor | null>(null)

  const onEditorChange = (value: string, editor: TinyMCEEditor) => {
    setPost(value)
  }

  const debugEditor = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  const onInitHandler = (_: any, editor: TinyMCEEditor) => {
    editorRef.current = editor
  }

  // console.log(`process.env.PUBLIC_URL: ${process.env.PUBLIC_URL}`)
  // const tinyMceUrl = process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
  const tinyMceUrl = '/tinymce/tinymce.min.js'

  const [formState, formAction] = useFormState(postArticle, initialFormState)

  return (
    <form action={formAction}>
      <label htmlFor='title'>Title:</label>
      <input
        id='title'
        name='title'
        type='text'
        value={formState?.article?.title}
        required
      />
      <label htmlFor='slug'>Slug:</label>
      <input
        id='slug'
        name='slug'
        type='text'
        value={formState?.article?.slug}
        required
      />
      <SubmitButton label='Submit New Post' />
      <Editor
        id='editor'
        tinymceScriptSrc={tinyMceUrl}
        // onEditorChange={onEditorChange}
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

// {process.env.DEBUG ? (
//   <button onClick={debugEditor}>Debug Editor</button>
// ) : null}
//
