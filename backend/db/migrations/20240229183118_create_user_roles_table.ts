import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateUserRolesTable extends Migration {
  static async up (): Promise<void> {
    // Write your migration logic here
    await Database.query(`CREATE TABLE user_roles (
      user_id UUID REFERENCES users(id),
      role_id INTEGER REFERENCES roles(id))`)
  }

  static async down (): Promise<void> {
    // Write the logic to revert the migration here
    await Database.query('DROP TABLE user_roles')
  }
}

export default CreateUserRolesTable
