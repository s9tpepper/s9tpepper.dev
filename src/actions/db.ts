import type { Nullable } from '@/types/utils'

import Dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
Dotenv.config()

const { MONGODB_URL = 'mongodb://localhost:27017' } = process.env
let client: Nullable<MongoClient>
let db: Nullable<Db>

const onConnectionError = () => {
  client = null
  db = null
}

export const getDB = (): Db => {
  if (!client || !db) {
    client = new MongoClient(MONGODB_URL)
    client.on('error', onConnectionError)
    client.on('close', onConnectionError)
    client.on('timeout', onConnectionError)
    client.on('serverClosed', onConnectionError)
    client.on('topologyClosed', onConnectionError)
    client.on('connectionPoolCleared', onConnectionError)

    db = client.db('s9tpepper')
  }

  return db
}
