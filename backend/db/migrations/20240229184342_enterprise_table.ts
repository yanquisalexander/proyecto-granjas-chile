import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class EnterpriseTable extends Migration {
  static async up (): Promise<void> {
    // Write your migration logic here
    await Database.query(`CREATE TABLE enterprises (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      company_logo TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
  }

  static async down (): Promise<void> {
    // Write the logic to revert the migration here
    await Database.query('DROP TABLE enterprises')
  }
}

export default EnterpriseTable
