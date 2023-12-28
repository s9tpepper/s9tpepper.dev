import type { Nullable } from '@/types/utils'

import Debug from 'debug'

import Dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
Dotenv.config()

const debug = Debug('s9tpepper:actions:db')

const { MONGODB_URL = 'mongodb://localhost:27017' } = process.env
let client: Nullable<MongoClient>
let db: Nullable<Db>

const onConnectionError = () => {
  debug('got connection error!!!')
  client = null
  db = null
}

export const getDB = (): Db => {
  if (!client || !db) {
    debug('creating mongo client and db...')
    debug(`db url: ${MONGODB_URL}`)
    client = new MongoClient(MONGODB_URL)
    // client.on('error', onConnectionError)
    // client.on('close', onConnectionError)
    // client.on('timeout', onConnectionError)
    // client.on('serverClosed', onConnectionError)
    // client.on('topologyClosed', onConnectionError)
    // client.on('connectionPoolCleared', onConnectionError)
    //
    db = client.db('s9tpepper')
    debug('finished creating db')
  }

  debug(`returning db object: ${db}`)
  return db
}
