import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateWorkGroupUsersTable extends Migration {
  static async up (): Promise<void> {
    await Database.query(`
      CREATE TABLE work_group_users (
        id UUID PRIMARY KEY,
        work_group_id UUID REFERENCES work_groups(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  static async down (): Promise<void> {
    await Database.query(`
      DROP TABLE work_group_users
    `)
  }
}

export default CreateWorkGroupUsersTable
