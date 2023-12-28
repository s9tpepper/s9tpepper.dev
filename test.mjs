import { Db, MongoClient } from 'mongodb'
const url = 'mongodb://localhost:27017'

const mongoClient = new MongoClient(url)
const db = mongoClient.db('s9tpepper')
const collection = db.collection('article')
console.log(await collection.findOne({ slug: 'slug' }))
