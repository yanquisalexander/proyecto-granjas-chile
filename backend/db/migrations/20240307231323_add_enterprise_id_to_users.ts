import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class AddEnterpriseIdToUsers extends Migration {
  static async up (): Promise<void> {
    await Database.query(`
      ALTER TABLE users
      ADD COLUMN enterprise_id UUID REFERENCES enterprises(id)
    `)
  }

  static async down (): Promise<void> {
    await Database.query(`
      ALTER TABLE users
      DROP COLUMN enterprise_id
    `)
  }
}

export default AddEnterpriseIdToUsers
