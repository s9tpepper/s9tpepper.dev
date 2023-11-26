'use server'

import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import Dotenv from 'dotenv'

import { cookies } from 'next/headers'

import { User, LoginData } from '@/types/users'
import { getDB } from './db'
import { aSync, getInputData } from '@/utils'

Dotenv.config()

const SALT_ROUNDS = 13

const { JWT_SECRET = 'santaisreal' } = process.env

export type SignUpResponse = {
  success: boolean
  error?: string | undefined | null
  user?: User | undefined | null
}

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
    { projection: { password: 1 } }
  )

  return user?.password
}

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

const getErrorResponse = (error: string) => {
  return {
    success: false,
    error,
  }
}

export async function submitLogin(
  state: any,
  formData: FormData
): Promise<LoginResponse> {
  const db = getDB()

  const username = formData.get('username')?.toString()
  if (!username) return getErrorResponse('Please enter a username')

  const passwordInput = formData.get('password')?.toString()
  if (!passwordInput) return getErrorResponse('Please enter a password')

  const passwordHash = await getPasswordHash(username)
  if (!passwordHash) {
    return getErrorResponse('Username was not found')
  }

  const passwordMatch = await new Promise((resolve) => {
    bcrypt.compare(passwordInput, passwordHash, (compareError, result) => {
      resolve(result)
    })
  })

  if (!passwordMatch) {
    return getErrorResponse('Password is invalid')
  }

  const users = db.collection<User>('users')
  const [error, userResponse] = await aSync(
    users.findOne<User>({ username }, { projection: { password: 0 } })
  )

  if (error) {
    return getErrorResponse('Your username or password is not valid')
  }

  const user = getUserFromInputs(userResponse)

  const token = jwt.sign(
    {
      user,
    },
    JWT_SECRET,
    { expiresIn: '14d' }
  )

  cookies().set({
    name: 'axe',
    value: token,
    httpOnly: true,
  })

  const response = {
    success: true,
    user,
  }

  return response
}

function getUserFromInputs(inputs: any): User {
  const user: User = {
    firstName: inputs.firstName || '',
    lastName: inputs.lastName || '',
    username: inputs.username || '',
    password: inputs.password || '',
    role: inputs.role || '',
  }

  return user
}

export async function submitSignUp(
  state: any,
  formData: FormData
): Promise<SignUpResponse> {
  const inputData = getInputData(formData)

  if (inputData.password !== inputData.confirmPassword) {
    return getErrorResponse('Your passwords do not match')
  }

  inputData.password = await hashPassword(inputData.password)
  inputData.role = 'user'

  const db = getDB()
  const users = db.collection<User>('users')
  const user = getUserFromInputs(inputData)
  const [error, result] = await aSync(users.insertOne(user))

  if (error) {
    return getErrorResponse(error.message)
  }

  delete inputData.password
  delete inputData.role

  return { success: true, user }
}
