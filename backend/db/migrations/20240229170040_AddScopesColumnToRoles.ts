import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class AddScopesColumnToRoles extends Migration {
  static async up (): Promise<void> {
    await Database.query('ALTER TABLE roles ADD COLUMN scopes text[]')
  }

  static async down (): Promise<void> {
    await Database.query('ALTER TABLE roles DROP COLUMN scopes')
  }
}

export default AddScopesColumnToRoles
