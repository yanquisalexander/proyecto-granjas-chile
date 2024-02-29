import Database from '@/lib/DatabaseManager'
import User from '@/app/models/User.model'
import { UUID } from 'crypto'
import Enterprise from '@/app/models/Enterprise.model'

interface WorkGroupAttributes {
  id: UUID
  name: string
  description?: string
  users?: User[]
  enterprise: Enterprise
  created_at?: Date
  updated_at?: Date
}

class WorkGroup {
  id: string
  name: string
  description?: string
  users?: User[]
  enterprise: Enterprise
  created_at?: Date
  updated_at?: Date

  constructor (attributes: WorkGroupAttributes) {
    this.id = attributes.id
    this.name = attributes.name
    this.description = attributes.description
    this.users = attributes.users
    this.enterprise = attributes.enterprise
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
  }

  static async getAll (): Promise<WorkGroup[]> {
    const workGroups = await Database.query('SELECT * FROM work_groups')
    return workGroups.rows
  }

  static async findById (id: UUID): Promise<WorkGroup | null> {
    const workGroup = await Database.query('SELECT * FROM work_groups WHERE id = $1', [id])
    if (workGroup.rows.length === 0) {
      return null
    }
    return new WorkGroup(workGroup.rows[0])
  }

  async create (): Promise<void> {
    await Database.query('INSERT INTO work_groups (id, name, description, enterprise_id) VALUES ($1, $2, $3, $4)', [this.id, this.name, this.description, this.enterprise.id])
  }

  async update (): Promise<void> {
    await Database.query('UPDATE work_groups SET name = $1, description = $2 WHERE id = $3', [this.name, this.description, this.id])
  }

  async delete (): Promise<void> {
    await Database.query('DELETE FROM work_groups WHERE id = $1', [this.id])
  }

  async addUser (user: User): Promise<void> {
    await Database.query('INSERT INTO work_group_users (work_group_id, user_id) VALUES ($1, $2)', [this.id, user.id])
  }

  async removeUser (user: User): Promise<void> {
    await Database.query('DELETE FROM work_group_users WHERE work_group_id = $1 AND user_id = $2', [this.id, user.id])
  }

  async getUsers (): Promise<User[]> {
    const users = await Database.query('SELECT * FROM users WHERE id IN (SELECT user_id FROM work_group_users WHERE work_group_id = $1)', [this.id])
    return users.rows
  }

  static async search (name: string, enterprise: Enterprise): Promise<WorkGroup[] | null> {
    const workGroups = await Database.query('SELECT * FROM work_groups WHERE name LIKE $1 AND enterprise_id = $2', [`%${name}%`, enterprise.id])
    if (workGroups.rows.length === 0) {
      return null
    }
    return workGroups.rows
  }

  static async findByEnterprise (enterprise: Enterprise): Promise<WorkGroup[]> {
    const workGroups = await Database.query('SELECT * FROM work_groups WHERE enterprise_id = $1', [enterprise.id])
    return workGroups.rows
  }
}

export default WorkGroup
