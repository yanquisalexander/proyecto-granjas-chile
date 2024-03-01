import Database from '@/lib/DatabaseManager'
import User from './User.model'

export enum Roles {
  SYSTEM = 'system',
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export interface RoleAttributes {
  id: string
  name: string
  scopes?: string[]
  created_at?: Date
}

class Role {
  id: string
  name: string
  scopes?: string[]
  created_at?: Date

  constructor ({ id, name, scopes, created_at }: RoleAttributes) {
    this.id = id
    this.name = name
    this.scopes = scopes
    this.created_at = created_at
  }

  static async getAll (): Promise<Role[]> {
    const roles = await Database.query('SELECT * FROM roles')
    return roles.rows
  }

  static async find (name: string): Promise<Role | null> {
    const role = await Database.query('SELECT * FROM roles WHERE name = $1', [name])
    if (role.rows.length === 0) {
      return null
    }
    return new Role(role.rows[0])
  }

  async create (): Promise<void> {
    await Database.query('INSERT INTO roles (id, name, scopes) VALUES ($1, $2, $3)', [this.id, this.name, this.scopes])
  }

  async update (): Promise<void> {
    await Database.query('UPDATE roles SET name = $1, scopes = $2 WHERE id = $3', [this.name, this.scopes, this.id])
  }

  async delete (): Promise<void> {
    await Database.query('DELETE FROM roles WHERE id = $1', [this.id])
  }

  static async findById (id: string): Promise<Role | null> {
    const role = await Database.query('SELECT * FROM roles WHERE id = $1', [id])
    if (role.rows.length === 0) {
      return null
    }
    return new Role(role.rows[0])
  }

  static async findByName (name: string): Promise<Role | null> {
    const role = await Database.query('SELECT * FROM roles WHERE name = $1', [name])
    if (role.rows.length === 0) {
      return null
    }
    return new Role(role.rows[0])
  }

  static async hasRole (user: User, roles: Roles[]): Promise<boolean> {
    const result = await Database.query('SELECT * FROM user_roles WHERE user_id = $1 AND role_id = ANY($2)', [user.id, roles])
    return result.rows.length > 0
  }

  static async getRoles (user: User): Promise<Role[]> {
    const result = await Database.query('SELECT role_id FROM user_roles WHERE user_id = $1', [user.id])
    return result.rows.map(row => row.role_id)
  }

  static async addRole (user: User, role: Roles | number): Promise<void> {
    if (typeof role === 'number') {
      await Database.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, role])
    } else {
      const roleInstance = await Role.find(role)
      if (roleInstance) {
        await Database.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, roleInstance.id])
      }
    }
  }

  static async removeRole (user: User, role: Roles): Promise<void> {
    await Database.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [user.id, role])
  }
}

export default Role
