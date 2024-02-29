import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class WorkGroupsTable extends Migration {
  static async up (): Promise<void> {
    // Write your migration logic here
    await Database.query(`CREATE TABLE work_groups (
      id UUID PRIMARY KEY,
      enterprise_id UUID REFERENCES enterprises(id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
  }

  static async down (): Promise<void> {
    // Write the logic to revert the migration here
    await Database.query('DROP TABLE work_groups')
  }
}

export default WorkGroupsTable
