import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class AddUniqueRoleIdUserId extends Migration {
  static async up (): Promise<void> {
    await Database.query(`
      CREATE UNIQUE INDEX user_roles_unique_idx ON user_roles (role_id, user_id)
    `)
  }

  static async down (): Promise<void> {
    await Database.query(`
      DROP INDEX user_roles_unique_idx
    `)
  }
}

export default AddUniqueRoleIdUserId
