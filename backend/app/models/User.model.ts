import Database from '@/lib/DatabaseManager'
import { UserValidationError } from '@/lib/Error'
import { UUID } from 'crypto'
import { z } from 'zod'
import Role, { Roles } from './Role.model'
import { Constants } from '../consts'
import WorkGroup from './WorkGroup.model'
import Enterprise from './Enterprise.model'

export interface UserAttributes {
  id: UUID
  username: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
  roles?: Role[]
  workgroups?: WorkGroup[]
  enterprise?: Enterprise
}

export interface UserDTO {
  id: UUID
  username: string
  email: string
  created_at?: Date
  updated_at?: Date
}

export interface UserFilter {
  username?: string
  email?: string
}

export const UserSchema = z.object({
  id: z.string({
    invalid_type_error: 'ID must be a string',
    required_error: 'ID is required'
  }),
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required'
  }).min(3, {
    message: 'Username must be at least 3 characters long'
  }).max(64, {
    message: 'Username must be at most 64 characters long'
  }),
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required'
  }).email({
    message: 'Invalid email address'
  }),
  /*
    TODO: Add password complexity requirements
  */
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  }).min(8, {
    message: 'Password must be at least 8 characters long'
  }),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
})

class User {
  id: UUID
  username: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
  workgroups?: WorkGroup[]
  enterprise?: Enterprise

  constructor (attributes: UserAttributes) {
    this.id = attributes.id
    this.username = attributes.username
    this.email = attributes.email
    this.password = attributes.password
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.workgroups = attributes.workgroups
    this.enterprise = attributes.enterprise
  }

  async validate (): Promise<void> {
    const result = UserSchema.safeParse(this)
    if (!result.success) {
      throw new UserValidationError(result.error.errors[0].message)
    }
  }

  async save (): Promise<void> {
    await this.validate()

    if (this.username === Constants.SYSTEM_USERNAME) {
      throw new UserValidationError("System user can't be modified")
    }

    const user = await User.findByEmailOrUsername(this.email, this.username)
    if (user) {
      await this.update()
    } else {
      await this.create()
    }
  }

  async create (): Promise<void> {
    // Check if email or username is already in use
    const existingUser = await User.findByEmailOrUsername(this.email, this.username)
    if (existingUser) {
      if (existingUser.email === this.email) {
        throw new UserValidationError('Email is already in use')
      } else {
        throw new UserValidationError('Username is already in use')
      }
    }

    await Database.query('INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)', [this.id, this.username, this.email, this.password])
  }

  async hasRole (role: Roles[]): Promise<boolean> {
    return await Role.hasRole(this, role)
  }

  async getRoles (): Promise<Role[]> {
    return await Role.getRoles(this)
  }

  async isAdmin (): Promise<boolean> {
    return await this.hasRole([Roles.ADMIN])
  }

  async isSystemUser (): Promise<boolean> {
    return await this.hasRole([Roles.SYSTEM])
  }

  async addRole (role: Roles): Promise<void> {
    await Role.addRole(this, role)
  }

  async removeRole (role: Roles): Promise<void> {
    await Role.removeRole(this, role)
  }

  async getPasswordHash (): Promise<string> {
    const result = await Database.query('SELECT password FROM users WHERE id = $1', [this.id])
    return result.rows[0].password
  }

  static async findByEmailOrUsername (email: string, username: string): Promise<UserDTO | null> {
    const result = await Database.query('SELECT id, username, email, created_at, updated_at FROM users WHERE email = $1 OR username = $2', [email, username])
    if (result.rows.length === 0) {
      return null
    }
    return result.rows[0]
  }

  async update (): Promise<void> {
    await Database.query('UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4', [this.username, this.email, this.password, this.id])
  }

  async getWorkGroups (): Promise<WorkGroup[]> {
    return await WorkGroup.findByUserId(this)
  }

  async getEnterprise (): Promise<Enterprise | null> {
    const result = await Database.query(`
      SELECT e.id, e.name, e.description, e.company_logo, e.created_at, e.updated_at
      FROM enterprises e
      JOIN users u ON e.id = u.enterprise_id
      WHERE u.id = $1
    `, [this.id])

    if (result.rows.length === 0) {
      return null
    }

    return new Enterprise(result.rows[0])
  }

  static async find (id: UUID): Promise<User | null> {
    const result = await Database.query('SELECT * FROM users WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return null
    }
    return new User(result.rows[0])
  }

  static async getAll (): Promise<UserDTO[]> {
    const result = await Database.query('SELECT id, username, email, created_at, updated_at FROM users')
    return result.rows
  }

  static async findByEmail (email: string): Promise<User | null> {
    const result = await Database.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return null
    }
    return new User(result.rows[0])
  }

  static async findByUsername (username: string): Promise<UserDTO | null> {
    const result = await Database.query('SELECT id, username, email, created_at, updated_at FROM users WHERE username = $1', [username])
    if (result.rows.length === 0) {
      return null
    }
    return new User(result.rows[0])
  }

  static async search (filter: UserFilter): Promise<UserDTO[]> {
    const result = await Database.query('SELECT id, username, email, created_at, updated_at FROM users WHERE username LIKE $1 OR email LIKE $2', [`%${filter.username}%`, `%${filter.email}%`])
    return result.rows
  }

  static generateId (): UUID {
    return crypto.randomUUID()
  }

  static async count (): Promise<number> {
    const result = await Database.query('SELECT COUNT(*) FROM users')
    return parseInt(result.rows[0].count)
  }
}

export default User
