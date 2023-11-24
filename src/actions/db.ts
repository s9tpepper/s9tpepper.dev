import { Db, MongoClient } from 'mongodb'
import Dotenv from 'dotenv'

Dotenv.config()

const { MONGODB_URL = 'mongodb://localhost:27017' } = process.env

export const getDB = (): Db => {
  const client = new MongoClient(MONGODB_URL)

  return client.db('s9tpepper')
}
