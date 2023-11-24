'use server'

import bcrypt from 'bcrypt'
import crypto from 'crypto'
import util from 'util'

import { User, LoginData } from '@/types/users'
import { getDB } from './db'
import { aSync } from '@/utils'

const SALT_ROUNDS = 13

export type LoginResponse = {
  success: boolean
  error?: string | undefined | null
  user?: User | undefined | null
}

const getPasswordHash = async (username: string) => {
  const db = getDB()
  const users = db.collection<User>('users')
  const user = await users.findOne<User>(
    { username },
    { projection: { hash: 1 } }
  )

  return user?.hash
}

const getLoginError = (error: string) => {
  return {
    success: false,
    error,
  }
}

export async function submitLogin(
  state: any,
  formData: FormData
): Promise<LoginResponse> {
  const username = formData.get('username')?.toString()
  if (!username) {
    return getLoginError('Username is required')
  }

  const db = getDB()
  const passwordInput = formData.get('password')?.toString()
  if (!passwordInput) {
    return getLoginError('Password is required')
  }
  const password = await getPasswordHash(passwordInput)
  if (!password) {
    return getLoginError('Username was not found')
  }

  const users = db.collection<User>('users')
  const [error, user] = await aSync(users.findOne<User>({ username, password }))

  if (error) {
    return getLoginError('Your username or password is not valid')
  }

  const response = {
    success: true,
    user,
  }

  return response
}
