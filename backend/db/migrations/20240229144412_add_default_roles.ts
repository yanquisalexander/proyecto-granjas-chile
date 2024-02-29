import { Roles } from '@/app/models/Role.model'
import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class AddDefaultRoles extends Migration {
  static async up (): Promise<void> {
    for (const role of [Roles.SYSTEM, Roles.SUPER_ADMIN, Roles.ADMIN]) {
      await Database.query('INSERT INTO roles (name) VALUES ($1)', [role])
    }
  }

  static async down (): Promise<void> {
    await Database.query('DELETE FROM roles WHERE name IN ($1, $2, $3)', [Roles.SYSTEM, Roles.SUPER_ADMIN, Roles.ADMIN])
  }
}

export default AddDefaultRoles
