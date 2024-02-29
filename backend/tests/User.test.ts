import { UserValidationError } from '@/lib/Error'
import User from '@/app/models/User.model'
import { describe, expect, test } from 'vitest'

describe('User', () => {
  const testUser = new User({
    id: crypto.randomUUID(),
    username: 'test',
    email: 'test@localhost',
    password: 'password'
  })

  test('User should have an id', () => {
    expect(testUser.id).toBeDefined()
  })

  test('User should have a username', () => {
    expect(testUser.username).toBeDefined()
  })

  test('User should have an email', () => {
    expect(testUser.email).toBeDefined()
  })

  test('User should have a password', () => {
    expect(testUser.password).toBeDefined()
  })

  test('VALIDATE: Email should be valid', async () => {
    const invalidEmail = 'test'
    const user = new User({
      id: crypto.randomUUID(),
      username: 'test',
      email: invalidEmail,
      password: 'password'
    })

    await expect(user.validate()).rejects.toThrow(UserValidationError)
  })

  test('VALIDATE: Username with less than 3 characters should throw an error', async () => {
    const invalidUsername = 'te'
    const user = new User({
      id: crypto.randomUUID(),
      username: invalidUsername,
      email: 'test@localhost',
      password: 'password'
    })

    await expect(user.validate()).rejects.toThrow(UserValidationError)
  })

  test('VALIDATE: Password with less than 8 characters should throw an error', async () => {
    const invalidPassword = 'pass'
    const user = new User({
      id: crypto.randomUUID(),
      username: 'test',
      email: 'test@localhost',
      password: invalidPassword
    })

    await expect(user.validate()).rejects.toThrow(UserValidationError)
  })

  test('VALIDATE: System user should not be modified', async () => {
    const user = new User({
      id: crypto.randomUUID(),
      username: 'system',
      email: 'system@localhost',
      password: 'password'
    })

    await expect(user.save()).rejects.toThrow(UserValidationError)
  })

  test('User with invalid data should throw an error', async () => {
    const invalidEmail = 'test'
    const user = new User({
      id: crypto.randomUUID(),
      username: 'te',
      email: invalidEmail,
      password: 'pass'
    })

    await expect(user.save()).rejects.toThrow(UserValidationError)
  })
})
