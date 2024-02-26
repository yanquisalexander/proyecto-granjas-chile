import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class RolesTable extends Migration {
  static async up (): Promise<void> {
    // Write your migration logic here
    await Database.query(`
    CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
    )
  }

  static async down (): Promise<void> {
    // Write the logic to revert the migration here
    await Database.query('DROP TABLE roles')
  }
}

export default RolesTable
