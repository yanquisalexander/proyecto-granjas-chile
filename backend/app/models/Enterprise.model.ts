import Database from '@/lib/DatabaseManager'
import { UUID } from 'crypto'
import WorkGroup from './WorkGroup.model'
import { Roles } from "./Role.model"
import User from "./User.model"
import { dbService } from "../services/Database"
import { UserRolesTable, UsersTable } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"
import Form from "./Form.model"

export interface EnterpriseAttributes {
  id: string
  name: string
  description?: string | null
  company_logo?: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

class Enterprise {
  id: string
  name: string
  description?: string | null
  company_logo?: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null

  constructor(attributes: EnterpriseAttributes) {
    this.id = attributes.id
    this.name = attributes.name
    this.description = attributes.description
    this.company_logo = attributes.company_logo
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.deleted_at = attributes.deleted_at
  }

  static async getAll(): Promise<Enterprise[]> {
    const enterprises = await Database.query('SELECT * FROM enterprises ORDER BY name')

    return enterprises.rows.map((enterprise) => new Enterprise(enterprise))
  }

  static async findById(id: UUID): Promise<Enterprise | null> {
    const enterprise = await Database.query('SELECT * FROM enterprises WHERE id = $1', [id])
    if (enterprise.rows.length === 0) {
      return null
    }
    return new Enterprise(enterprise.rows[0])
  }

  async create(): Promise<void> {
    await Database.query('INSERT INTO enterprises (id, name, description, company_logo) VALUES ($1, $2, $3, $4)', [this.id, this.name, this.description, this.company_logo])
  }

  async update(): Promise<void> {
    await Database.query('UPDATE enterprises SET name = $1, description = $2, company_logo = $3 WHERE id = $4', [this.name, this.description, this.company_logo, this.id])
  }



  async delete(): Promise<void> {
    await Database.query('UPDATE enterprises SET deleted_at = NOW() WHERE id = $1', [this.id])
  }

  async restore(): Promise<void> {
    await Database.query('UPDATE enterprises SET deleted_at = NULL WHERE id = $1', [this.id])
  }

  async getWorkGroups(): Promise<WorkGroup[]> {
    const workGroups = await WorkGroup.findByEnterprise(this)
    return workGroups
  }

  async addAdmin(user: User): Promise<void> {
    await user.addToEnterprise(this)
    try {
      await user.addRole(Roles.ADMIN)
    } catch (error) {
      console.error('error adding role to user', error)
      console.error('¿Maybe the user already has the role?')
    }
    console.log('user added to enterprise')
  }

  async removeAdmin(user: User): Promise<void> {
    await user.removeFromEnterprise()
    await user.removeRole(Roles.ADMIN)
  }

  async getAdmins(): Promise<any[]> {

    const admins = await Database.query(`
    SELECT users.id, users.username, users.email, users.enterprise_id 
FROM users 
JOIN user_roles ON users.id = user_roles.user_id 
WHERE user_roles.role_id = $1 AND users.enterprise_id = $2
    `, [3, this.id])

    return admins.rows

  }

  async getForms(): Promise<Form[]> {
    const workGroups = await this.getWorkGroups();
    const forms: Form[] = [];
    const enterpriseForms = await Form.findByEnterprise(this);

    for (const workGroup of workGroups) {
      const workGroupForms = await workGroup.getAssignedForms();
      // Ensure no duplicates
      for (const form of workGroupForms) {
        if (!forms.find(f => f.id === form.id)) {
          forms.push(form);
        }
      }
    }

    // Ensure no duplicates

    for (const form of enterpriseForms) {
      if (!forms.find(f => f.id === form.id)) {
        forms.push(form);
      }
    }

    return forms;
  }

}

export default Enterprise
