import Database from '@/lib/DatabaseManager'
import { UUID } from 'crypto'
import WorkGroup from './WorkGroup.model'

export interface EnterpriseAttributes {
  id: UUID
  name: string
  description?: string
  company_logo?: string
  created_at?: Date
}

class Enterprise {
  id: UUID
  name: string
  description?: string
  company_logo?: string
  created_at?: Date

  constructor (attributes: EnterpriseAttributes) {
    this.id = attributes.id
    this.name = attributes.name
    this.description = attributes.description
    this.company_logo = attributes.company_logo
    this.created_at = attributes.created_at
  }

  static async getAll (): Promise<Enterprise[]> {
    const enterprises = await Database.query('SELECT * FROM enterprises')
    return enterprises.rows
  }

  static async findById (id: UUID): Promise<Enterprise | null> {
    const enterprise = await Database.query('SELECT * FROM enterprises WHERE id = $1', [id])
    if (enterprise.rows.length === 0) {
      return null
    }
    return new Enterprise(enterprise.rows[0])
  }

  async create (): Promise<void> {
    await Database.query('INSERT INTO enterprises (id, name, description, company_logo) VALUES ($1, $2, $3, $4)', [this.id, this.name, this.description, this.company_logo])
  }

  async update (): Promise<void> {
    await Database.query('UPDATE enterprises SET name = $1, description = $2, company_logo = $3 WHERE id = $4', [this.name, this.description, this.company_logo, this.id])
  }

  async delete (): Promise<void> {
    await Database.query('DELETE FROM enterprises WHERE id = $1', [this.id])
  }

  async getWorkGroups (): Promise<WorkGroup[]> {
    const workGroups = await WorkGroup.findByEnterprise(this)
    return workGroups
  }
}

export default Enterprise
