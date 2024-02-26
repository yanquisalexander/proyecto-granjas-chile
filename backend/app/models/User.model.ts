import Model from '@/lib/Model'
import { UUID } from 'crypto'

interface UserAttributes {
  id: UUID
  username: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
}

class User extends Model {
  constructor (attributes: UserAttributes) {
    super('users', 'id', attributes)
  }

  get id (): UUID {
    return this.attributes.id
  }

  get username (): string {
    return this.attributes.username
  }

  set username (value: string) {
    this.attributes.username = value
  }

  get email (): string {
    return this.attributes.email
  }

  set email (value: string) {
    this.attributes.email = value
  }

  get password (): string {
    return this.attributes.password
  }

  set password (value: string) {
    this.attributes.password = value
  }

  get created_at (): Date {
    return this.attributes.created_at
  }

  set created_at (value: Date) {
    this.attributes.created_at = value
  }

  get updatedAt (): Date {
    return this.attributes.updated_at
  }

  set updatedAt (value: Date) {
    this.attributes.updated_at = value
  }

  async save (): Promise<void> {
    if (this.attributes.id) {
      await this.update()
    } else {
      const result = await super.create(this.attributes)
      Object.assign(this.attributes, result.attributes)
    }
  }
}

export default User
