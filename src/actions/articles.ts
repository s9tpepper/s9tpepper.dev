'use server'

import Debug from 'debug'

import type { Response } from '@/types/utils'
import type { FormValues } from '@/utils'

import { getDB } from './db'
import { getInputData } from '@/utils'
import { aSync } from '@/utils'
// import { Collection, ObjectId, WithId } from 'mongodb'
import { Db, MongoClient, Collection, WithId } from 'mongodb'

const debug = Debug('s9tpepper:actions:articles')

export type Article = {
  _id?: string
  slug: string
  title: string
  writer?: string
  created: Date
  content?: string
}

export type PostArticleResponse = {
  article?: Article
} & Response

export type GetArticleResponse = {
  article?: Article
} & Response

const getArticle = (inputData: FormValues): Article => {
  const article: Article = {
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

export async function getArticleBySlug(
  slug: string
): Promise<GetArticleResponse> {
  const _d = debug.extend('getArticleBySlug')
  _d(`retrieving article by slug: "${slug}"`)

  const db = getDB()
  const collection = db.collection<Article>('article')
  _d(`collection: ${collection.namespace}`)

  const [error, articleResponse] = await aSync(
    collection.findOne<Article>({ _id: slug })
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
  if (!articleData._id) {
    articleData._id = articleData.slug
  }

  const db = getDB()
  const collection = db.collection<Article>('article')

  const filter = { slug: articleData.slug }
  _d(`filter: ${JSON.stringify(filter)}`)
  const [error, articleResponse] = await aSync(
    collection.updateOne(
      filter,
      { $set: articleData },
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

  return {
    success: true,
    article: articleData,
  }
}
