import { getDB } from './actions/db'

export function register() {
  const db = getDB()

  const users = db.collection('users')
  users.createIndex({ username: 1 }, { unique: true })
  users.createIndex({ username: 1, password: 1 })
}
