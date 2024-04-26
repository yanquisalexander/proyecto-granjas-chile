import Database from '@/lib/DatabaseManager'
import User from './User.model'
import { dbService } from "../services/Database"
import { and, eq, inArray } from "drizzle-orm"
import { UserRolesTable } from "@/db/schema"

export enum Roles {
  SYSTEM = 'system',
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export interface RoleAttributes {
  id: number
  name: string
  scopes?: string[] | null
  created_at?: Date
}

class Role {
  id: number
  name: string
  scopes?: string[] | null
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

  static async hasRole(user: User, roles: Role[]): Promise<boolean> {    
    try {
      const result = await dbService.query.UserRolesTable.findMany({
        where: and(
          eq(UserRolesTable.user_id, user.id),
          inArray(UserRolesTable.role_id, roles.map(role => role.id))
        )
      });

      return result.length > 0;
    } catch (error) {
      console.error("Error in hasRole method:", error);
      return false; // Return false in case of error
    }
  }

  static async getRoles(user: User): Promise<Role[]> {
    try {
      const roles = await dbService.query.UserRolesTable.findMany({
        where: eq(UserRolesTable.user_id, user.id),
        with: {
          role: true
        }
      });

      return roles.map(userRole => {
        return new Role({
          id: userRole.role.id,
          name: userRole.role.name,
          scopes: userRole.role.scopes,
          created_at: userRole.role.created_at
        });
      
      });
    } catch (error) {
      console.error("Error in getRoles method:", error);
      return []; // Return empty array in case of error
    }
  }

  static async addRole (user: User, role: Roles): Promise<void> {
    await Database.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, (SELECT id FROM roles WHERE name = $2))', [user.id, role])
  }

  static async removeRole (user: User, role: Roles): Promise<void> {
    await Database.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = (SELECT id FROM roles WHERE name = $2)', [user.id, role])
  }

  static async createInitialRoles (): Promise<void> {
    const roles = Object.values(Roles)
    for (const role of roles) {
      await Database.query('INSERT INTO roles (name) VALUES ($1)', [role])
    }
  }
}

export default Role
