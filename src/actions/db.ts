import Dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
Dotenv.config()

const { MONGODB_URL = 'mongodb://localhost:27017' } = process.env
let client: MongoClient, db: Db

export const getDB = (): Db => {
  if (!client || !db) {
    client = new MongoClient(MONGODB_URL)
    db = client.db('s9tpepper')
  }

  return db
}
