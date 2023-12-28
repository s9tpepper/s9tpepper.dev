'use server'

import Debug from 'debug'

import type { Response } from '@/types/utils'
import type { FormValues } from '@/utils'

import { getDB } from './db'
import { getInputData } from '@/utils'
import { aSync } from '@/utils'
// import { Collection, ObjectId, WithId } from 'mongodb'
import { Db, MongoClient, Collection, WithId, ObjectId } from 'mongodb'

const debug = Debug('s9tpepper:actions:articles')

export type Article = {
  _id?: string | ObjectId
  slug: string
  title: string
  writer?: string
  created: Date
  content?: string
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

const getArticle = (inputData: FormValues): Article => {
  const article: Article = {
    _id: new ObjectId(inputData?._id),
    title: inputData?.title,
    slug: inputData?.slug,
    writer: inputData?.writer,
    created: new Date(inputData?.created),
    content: inputData?.content,
  }

  return article
}

export async function getArticles() {}

const createArticle = async (
  collection: Collection<Article>,
  articleData: Article
): Promise<PostArticleResponse> => {
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

  return {
    success: true,
    available: checkResponse === null,
    slug,
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
  const inputData = getInputData(formData)
  const articleData = getArticle(inputData)

  const db = getDB()
  const collection = db.collection<Article>('article')

  const $set = JSON.parse(JSON.stringify(articleData))
  delete $set._id

  const filter = articleData?._id ? { _id: articleData._id } : articleData

  _d(`$set: ${JSON.stringify($set)}`)
  _d(`filter: ${JSON.stringify(filter)}`)

  const [error, articleResponse] = await aSync(
    collection.updateOne(
      filter,
      { $set },
      {
        upsert: true,
      }
    )
  )
  _d(`error.message: ${error?.message}`)

  if (error) {
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
