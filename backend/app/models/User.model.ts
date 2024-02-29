import Database from '@/lib/DatabaseManager'
import { UUID } from 'crypto'

interface UserAttributes {
  id: UUID
  username: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
}

class User {
  id: UUID
  username: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date

  constructor (attributes: UserAttributes) {
    this.id = attributes.id
    this.username = attributes.username
    this.email = attributes.email
    this.password = attributes.password
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
  }

  async save (): Promise<void> {
    const user = await Database.query('SELECT * FROM users WHERE id = $1', [this.id])
    if (user) {
      await Database.query('UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4', [this.username, this.email, this.password, this.id])
    } else {
      await Database.query('INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)', [this.id, this.username, this.email, this.password])
    }
  }

  static async find (id: UUID): Promise<User | null> {
    const result = await Database.query('SELECT * FROM users WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return null
    }
    return new User(result.rows[0])
  }
}

export default User
