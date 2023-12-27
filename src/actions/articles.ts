'use server'

type Article = {
  writer: string
  created: Date
  content: string
}

export async function getArticles() {}

export async function postArticle(article: Article) {}
