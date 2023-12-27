'use client'

import { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'

export default function Compose() {
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const [post, setPost] = useState('')

  // const onEditorChange = (value: string, editor: TinyMCEEditor) => {
  //   setPost(value)
  // }

  const debug = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  const onInitHandler = (_: any, editor: TinyMCEEditor) => {
    editorRef.current = editor
  }

  console.log(`process.env.PUBLIC_URL: ${process.env.PUBLIC_URL}`)
  // const tinyMceUrl = process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
  const tinyMceUrl = '/tinymce/tinymce.min.js'

  return (
    <main>
      <form>
        <label htmlFor='title'>Title:</label>
        <input id='title' name='title' type='text' required />
        <label htmlFor='slug'>Slug:</label>
        <input id='slug' name='slug' type='text' required />
        <Editor
          tinymceScriptSrc={tinyMceUrl}
          // onEditorChange={onEditorChange}
          onInit={onInitHandler}
          initialValue='<p>Start your new post here...</p>'
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
      <button onClick={debug}>Debug Editor</button>
    </main>
  )
}
