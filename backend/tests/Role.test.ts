import Role, { Roles } from '@/app/models/Role.model'
import Database from '@/lib/DatabaseManager'
import { describe, expect, test } from 'vitest'

describe('Role', () => {
  const testRole = new Role({
    id: '4',
    name: 'test'
  })

  test('Role should have a name', () => {
    expect(testRole.name).toBeDefined()
  })

  test('Role should have an id', () => {
    expect(testRole.id).toBeDefined()
  })

  test('Role can have blank scopes', () => {
    expect(testRole.scopes).toBeUndefined()
  })

  test('Default roles should be system, super_admin, and admin', () => {
    const defaultRoles = [Roles.SYSTEM, Roles.SUPER_ADMIN, Roles.ADMIN]
    expect(defaultRoles).toEqual(['system', 'super_admin', 'admin'])
  })

  test('Role should be able to be created', async () => {
    await Database.connect()
    const roleWithNameTest = await Role.find('test')
    if (roleWithNameTest) {
      await roleWithNameTest.delete() // Clean up
    }
    await testRole.create()
    const role = await Role.find('test')
    expect(role).toBeInstanceOf(Role)
    Database.close()
  })
})
