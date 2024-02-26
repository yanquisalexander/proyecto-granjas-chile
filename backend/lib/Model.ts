import { Loggers } from '@/app/services/loggers'
import Database from '@/lib/DatabaseManager'

class Model {
  private readonly tableName: string
  private readonly primaryKey: string
  public attributes: Record<string, any>

  constructor (tableName: string, primaryKey: string = 'id', attributes: Record<string, any>) {
    this.tableName = tableName
    this.primaryKey = primaryKey
    this.attributes = attributes
  }

  async find (id: string): Promise<Model | null> {
    const result = await Database.query(
      `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return new Model(this.tableName, this.primaryKey, result.rows[0])
  }

  async create (attributes: Record<string, any>): Promise<Model> {
    const keys = Object.keys(attributes)
    const values = Object.values(attributes)
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')

    const result = await Database.query(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    )

    return new (this.constructor as typeof Model)(this.tableName, this.primaryKey, result.rows[0])
  }

  async update (): Promise<void> {
    const keys = Object.keys(this.attributes)
    const values = Object.values(this.attributes)
    const placeholders = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')

    const existingRecord = await this.find(this.attributes[this.primaryKey])

    if (!existingRecord) {
      Loggers.Default.writeLog(`Record with ${this.primaryKey} ${this.attributes[this.primaryKey]} not found in ${this.tableName} table`)
      await this.create(this.attributes)
      return
    }

    await Database.query(
      `UPDATE ${this.tableName} SET ${placeholders} WHERE ${this.primaryKey} = $${keys.length + 1}`,
      [...values, this.attributes[this.primaryKey]]
    )
  }

  async delete (): Promise<void> {
    await Database.query(
      `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`,
      [this.attributes[this.primaryKey]]
    )
  }

  async save (): Promise<void> {
    if (this.attributes[this.primaryKey]) {
      await this.update()
    } else {
      const result = await this.create(this.attributes)
      Object.assign(this.attributes, result.attributes)
    }
  }

  async hasOne (foreignKey: string): Promise<Model | null> {
    const result = await Database.query(
      `SELECT * FROM ${this.tableName} WHERE ${foreignKey} = $1`,
      [this.attributes[this.primaryKey]]
    )

    if (result.rows.length === 0) {
      return null
    }

    return new Model(this.tableName, this.primaryKey, result.rows[0])
  }
}

export default Model
