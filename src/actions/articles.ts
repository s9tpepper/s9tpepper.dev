'use server'

import Debug from 'debug'

import type { Response } from '@/types/utils'
import type { FormValues } from '@/utils'

import { getDB } from './db'
import { ARTICLE_ERRORS, getInputData } from '@/utils'
import { aSync } from '@/utils'

import { Db, MongoClient, Collection, WithId, ObjectId } from 'mongodb'
import { cookies } from 'next/headers'
import { validateJWT, checkAuthorization } from './users'
import { redirect } from 'next/navigation'

const debug = Debug('s9tpepper:actions:articles')
/*
 *{"name":"Screenshot 2023-09-28 at 2.29.27 PM.png","size":67833,"key":"32359c1f-6a24-4d5c-add5-e518e334a442-vxm066.png","serverData":{"firstName":"Omar","lastName":"Gonzalez","username":"s9tpepper","password":"","role":"admin"},"url":"https://utfs.io/f/32359c1f-6a24-4d5c-add5-e518e334a442-vxm066.png"}
 */
export type UploadThingImage = {
  name: string
  size: number
  key: string
  serverData: {
    firstName: string
    lastName: string
    username: string
    role: string
  }
  url: string
}

export type Article = {
  _id?: string | ObjectId
  slug: string
  title: string
  writer: string
  created: Date
  content: string
  category: string
  hero?: UploadThingImage
}

export type CheckSlugResponse = {
  available: boolean
  slug: string
} & Response

export type PostArticleResponse = {
  article?: Article
} & Response

export type GetArticleResponse = {
  article?: Article
} & Response

export type GetArticlesResponse = {
  articles?: Article[]
} & Response

const getArticle = (inputData: FormValues): Article => {
  const article: Article = {
    _id: new ObjectId(inputData?._id),
    title: inputData?.title,
    slug: inputData?.slug,
    writer: inputData?.writer,
    created: new Date(inputData?.created),
    content: inputData?.content,
    category: inputData?.category,
    hero: JSON.parse(inputData?.hero),
  }

  return article
}

export const getArticles = async (): Promise<GetArticlesResponse> => {
  const _d = debug.extend('getArticles')
  const db = getDB()
  const collection = db.collection<Article>('article')
  const cursor = collection.find<Article>({})

  const [error, articles] = await aSync(cursor.toArray())

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    articles,
  }
}

const createArticle = async (
  collection: Collection<Article>,
  articleData: Article
): Promise<PostArticleResponse> => {
  const authorized = await checkAuthorization()
  if (!authorized.success) {
    return authorized
  }

  const [error, articleResponse] = await aSync(
    collection.insertOne(articleData)
  )
  const { acknowledged, insertedId } = articleResponse

  if (error && !acknowledged) {
    return {
      success: false,
      error: error.message,
    }
  }

  articleData._id = insertedId

  return {
    success: true,
    article: articleData,
  }
}

export async function checkSlugAvailability(
  slug: string
): Promise<CheckSlugResponse> {
  const _d = debug.extend('checkSlugAvailability')
  const db = getDB()
  const collection = db.collection<Article>('article')
  const [error, checkResponse] = await aSync(
    collection.findOne({ slug }, { projection: { slug: 1 } })
  )

  _d(`checkResponse: ${JSON.stringify(checkResponse)}`)

  if (error) {
    return {
      success: false,
      error: error?.message,
      available: false,
      slug,
    }
  }

  const available = checkResponse === null
  _d(`available: ${available}`)

  return {
    success: true,
    available,
    slug,
  }
}

export async function getArticlesByCategory(
  category: string
): Promise<GetArticlesResponse> {
  const db = getDB()
  const collection = db.collection<Article>('article')
  const cursor = collection.find<Article>({ category })

  const [error, articles] = await aSync(cursor.toArray())
  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    articles,
  }
}

export async function getArticleBySlug(
  slug: string
): Promise<GetArticleResponse> {
  const _d = debug.extend('getArticleBySlug')
  _d(`retrieving article by slug: "${slug}"`)

  const db = getDB()
  const collection = db.collection<Article>('article')
  _d(`collection: ${collection.namespace}`)

  const [error, articleResponse] = await aSync(
    collection.findOne<Article>({ slug })
  )

  _d(`articleResponse: ${JSON.stringify(articleResponse)}`)
  _d(articleResponse)

  if (error) {
    return {
      success: false,
      error: error?.message,
    }
  }

  if (!articleResponse) {
    return {
      success: true,
    }
  }

  if (articleResponse._id) {
    _d('Converting _id to string...')
    articleResponse._id = articleResponse._id.toString()
    _d(typeof articleResponse._id)
  }

  articleResponse.created = new Date(articleResponse.created)

  return {
    success: true,
    article: articleResponse,
  }
}

export async function postArticle(
  state: any,
  formData: FormData
): Promise<PostArticleResponse> {
  const _d = debug.extend('postArticle')

  const authorized = await checkAuthorization()
  if (!authorized.success) {
    return authorized
  }

  const inputData = getInputData(formData)
  const articleData = getArticle(inputData)

  const db = getDB()
  const collection = db.collection<Article>('article')

  const $set = JSON.parse(JSON.stringify(articleData))
  delete $set._id

  if (!$set.created) {
    $set.created = new Date()
  } else {
    $set.created = new Date($set.created)
    $set.updated = new Date()
  }

  const filter = articleData?._id ? { _id: articleData._id } : articleData

  const [error, articleResponse] = await aSync(
    collection.updateOne(
      filter,
      { $set },
      {
        upsert: true,
      }
    )
  )

  _d(`error: ${error}`)
  _d(`error.message: ${error?.message}`)

  if (error) {
    _d('Returning an error message')
    return {
      success: false,
      error: error.message,
    }
  }

  const { acknowledged, insertedId } = articleResponse

  if (!articleData._id) {
    articleData._id = insertedId
  }

  if (articleData._id) {
    articleData._id = articleData._id.toString()
  }

  return {
    success: true,
    article: articleData,
  }
}
